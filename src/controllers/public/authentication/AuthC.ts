import BaseControllerClass from "../../base/BaseControllerClass";
import {BIT, EMAIL_VALIDATION, METHOD, OTP_TYPE, PASSWORD_VALIDATION} from "../../../constants/AppConstants";
import HashBuilder, {IHash} from "../../../utils/app/Hash";
import UserService from "../../../services/UserService";
import AuthCMiddleware from "../../../middleware/public/AuthC_Middleware";
import authC_Middleware from "../../../middleware/public/AuthC_Middleware";
import SessionService from "../../../services/SessionService";
import { v4 as uuidV4} from 'uuid';
import TokenBuilder from "../../../utils/app/Token";
import OtpService from "../../../services/OtpService";


class AuthC extends BaseControllerClass {
    private hashService: HashBuilder;
    private authCMiddlware: AuthCMiddleware;
    private sessionService: SessionService;
    private token: TokenBuilder;
    constructor() {
        super();
        this.hashService = new HashBuilder();
        this.token = new TokenBuilder();
    }

    protected initRoutes(): void {
        this.register();
        this.login();
    }

    protected initServices(): void {
        this.sessionService = new SessionService();
    }

    protected initMiddleware(): void {
        this.authCMiddlware = new AuthCMiddleware(this.router);
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
