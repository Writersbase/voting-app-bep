import BaseControllerClass from "../../base/BaseControllerClass";
import {BIT, METHOD} from "../../../constants/AppConstants";
import HashBuilder, {IHash} from "../../../utils/app/Hash";
import AuthCMiddleware from "../../../middleware/public/AuthC_Middleware";
import SessionService from "../../../services/SessionService";
import { v4 as uuidV4} from 'uuid';
import TokenBuilder from "../../../utils/app/Token";
import TokenService from "../../../services/TokenService";
import BlacklistService from "../../../services/BlacklistService";
import requestIp from 'request-ip';
import mongoose from "mongoose";

class AuthC extends BaseControllerClass {
    private hashService: HashBuilder;
    private authCMiddlware: AuthCMiddleware;
    private sessionService: SessionService;
    private token: TokenBuilder;
    private tokenService: TokenService;
    private blacklistService: BlacklistService;
    constructor() {
        super();
        this.hashService = new HashBuilder();
        this.token = new TokenBuilder();
    }

    protected initRoutes(): void {
        // this.register();
        // this.login();
        this.generateCredentials();
        this.loginAdmin()
    }

    protected initServices(): void {
        this.sessionService = new SessionService();
        this.tokenService = new TokenService()
        this.blacklistService = new BlacklistService()
    }

    protected initMiddleware(): void {
        this.authCMiddlware = new AuthCMiddleware(this.router);
    }




    generateCredentials(){
        this.router.post('/generate-token', async (req,res,next) => {
            try{
                const ip_address = requestIp.getClientIp(req);


                //     check if existing token is active for a particular ip
                const token = await this.tokenService.findOne({ip_address: ip_address,status:"active"});

                const tokenTime = new Date(token?.expiring).getTime();
                if(token && tokenTime > Date.now()){
                    const err = new Error('existing token available for ip');
                    return this.sendErrorResponse(res,err,this.errorResponseMessage.TOKEN_ACTIVE,400);
                }

                if(!token || tokenTime <= Date.now()){
                    if(token && tokenTime <= Date.now()){
                        token.expired = true;
                        token.status = "deleted";
                        token.save();
                    }
                    next();
                }
            }catch (e) {
                return this.sendErrorResponse(res,e,this.errorResponseMessage.TOKEN_ACTIVE,400);
            }
        })
        this.router.post('/generate-token', async (req,res,next) => {
            try{
                const ip_address = requestIp.getClientIp(req);
                const session = await mongoose.startSession();
                session.startTransaction();
                const checkBlacklist = await this.blacklistService.findOne({ip_address:ip_address,status:"active"},session)
                const blacklistTime = new Date(checkBlacklist?.blacklist_end).getTime();
                if(blacklistTime > Date.now()){
                    session.abortTransaction();
                    const err = new Error(`you are currently blacklisted, try again on ${new Date(checkBlacklist.blacklist_end)}`);
                    return this.sendErrorResponse(res,err,this.errorResponseMessage.BLACKLISTED(new Date(checkBlacklist.blacklist_end).toDateString()),400);
                }

                if(!checkBlacklist || blacklistTime < Date.now()) {

                    if(checkBlacklist && blacklistTime < Date.now()){
                        checkBlacklist.status = "deleted";
                        checkBlacklist.save();
                    }
                    next();
                }
            }catch (e) {
                return this.sendErrorResponse(res,e,this.errorResponseMessage.SERVER_ERROR,400);
            }
        })

        this.router.post('/generate-token', async (req,res) => {
            try{
                const ip_address = requestIp.getClientIp(req);
                const session = await mongoose.startSession();
                session.startTransaction();

                const newToken = await this.tokenService.save({ip_address:ip_address,token: uuidV4(),isAdmin: true},session);
                const newBlacklist = await this.blacklistService.save({ip_address:ip_address},session)
                if(newToken && newBlacklist){
                    console.log(newToken);
                    session.commitTransaction();
                    return this.sendSuccessResponse(res,{token: newToken?.token})
                }else{
                    //     error
                    session.abortTransaction();
                    const err = new Error('new token not generated');
                    return this.sendErrorResponse(res,err,this.errorResponseMessage.GENERATOR_FAILED,400)
                }

            }catch (e) {
                return this.sendErrorResponse(res,e,this.errorResponseMessage.GENERATOR_FAILED,400)
            }


        })
    }

    loginAdmin(){
        this.router.post('/login',async (req,res) => {
            try{
                const {token} = req.body;
                console.log(token)
                const ip_address = requestIp.getClientIp(req);
                console.log(ip_address)
                const findToken = await this.tokenService.findOne({token:token,ip_address:ip_address});
                console.log(findToken)
                const tokenTime = new Date(findToken?.expiring).getTime();
                if(findToken && tokenTime > Date.now()){
                //     authenticate user
                    let newLoggingSession = await this.sessionService.save({uuid: uuidV4(),token: findToken?.token,status: BIT.ON});
                    console.log(newLoggingSession)
                    if(newLoggingSession){
                        let genToken = this.token.build().createLoginToken(newLoggingSession);
                        console.log(genToken)
                        if(genToken){
                            return this.sendSuccessResponse(res,{
                                client: findToken,
                                token: genToken,
                            })
                        }else{
                            const err = new Error('unable to login1');
                            return this.sendErrorResponse(res,err,this.errorResponseMessage.UNABLE_TO_LOGIN,400)
                        }
                    }else{
                        const err = new Error('unable to login2');
                        return this.sendErrorResponse(res,err,this.errorResponseMessage.UNABLE_TO_LOGIN,400)
                    }
                }else{
                    const err = new Error('unable to login3');
                    return this.sendErrorResponse(res,err,this.errorResponseMessage.UNABLE_TO_LOGIN,400)
                //     error message
                }
            }catch (e) {
                return this.sendErrorResponse(res,e,this.errorResponseMessage.UNABLE_TO_LOGIN,400)
            }
        })
    }


    register(){
        this.router.post('/signup',this.authCMiddlware.verifyCompletePayload);
        this.router.post('/signup',this.authCMiddlware.verifyEmailFormat);
        this.router.post('/signup',this.authCMiddlware.verifyEmailExist);
        this.router.post('/signup',this.authCMiddlware.verifyPasswordFormat);
        this.router.post('/signup',this.authCMiddlware.hashPassword);
        this.router.post('/signup',this.authCMiddlware.sendOtpVerification);
        this.router.post('/signup',async (req,res) => {
            const otp = this.requestService.getFromDataBag("otp");
            const {first_name, last_name, password, email, gender, salt} = req.body;

            const query = {first_name, last_name, password, email, gender, salt};

            try{
                let user = await this.userService.save(query, null)

                if (user && user?._id) {
                    // login
                    let saveOtp = await this.otpService.save({otp: otp,user: user?.id})
                    if(saveOtp && saveOtp?._id){
                        this.loginUser(this.userService.getSafeUserData(user),res,true);
                    }else{
                        const error = new this.AppError({path:'/auth/signup',method:METHOD.POST,message:"otp not successful, redirect to login page",collection:"user"})
                        return this.sendErrorResponse(res,error,this.errorResponseMessage.LOGIN_REDIRECT,400)
                    }

                } else {

                    throw new this.AppError({
                        path: '/auth/signup',
                        method: METHOD.POST,
                        message: "User not created.",
                        collection: "user"
                    })
                }
            }catch (e) {
                return this.sendErrorResponse(res,e,this.errorResponseMessage.USER_NOT_CREATED,400)
            }

        })
    }


    login(){
        this.router.post('/signin',this.authCMiddlware.verifyEmailFormat);
        this.router.post('/signin',this.authCMiddlware.verifyEmailExistLogin);
        this.router.post('/signin',this.authCMiddlware.verifyPasswordFormat);
        this.router.post('/signin',this.authCMiddlware.verifyPassword);
        this.router.post('/signin',async (req,res) => {
            const {email} = req.body;
            try{
                let user = await this.userService.findOne({email:email},null);
                if(user && user?.id){
                    this.loginUser(user,res,false);
                }
            }catch (e) {
                return this.sendErrorResponse(res,e,this.errorResponseMessage.UNABLE_TO_LOGIN,400)
            }

        })
    //    find the user
    //    call the loginuser function
    }


    private async loginUser(user: any,res: any,isNew: boolean){
        try{
            let existingLoggingSession = await this.sessionService.findOne({user: user?.id,status: BIT.ON},null);
            if(existingLoggingSession){
                existingLoggingSession.status = BIT.OFF;
                existingLoggingSession.expired = true;
                existingLoggingSession.validity_end_date = new Date();
                existingLoggingSession.logged_out = true;
                existingLoggingSession.save();
            }
            let newLoggingSession = await this.sessionService.save({uuid: uuidV4(),user: user.id,status: BIT.ON});
            if(newLoggingSession){
                let token = this.token.build().createLoginToken(newLoggingSession);
                if(token){
                    return this.sendSuccessResponse(res,{
                        user: user,
                        token: token,
                        reverify: isNew
                    })
                }
            }
        }catch (e) {

        }

    }


}


export default new AuthC().router;
