import BaseRouterMiddleware from "./base/BaseRouterMiddleware";
import {BIT, METHOD} from "../constants/AppConstants";
import TokenBuilder from "../utils/app/Token";
import SessionService from "../services/SessionService";
import UserService from "../services/UserService";


class AuthorizationMiddleware extends BaseRouterMiddleware{
    private token:TokenBuilder;
    private sessionService: SessionService;
    private userService: UserService;
    constructor(appRouter) {
        super(appRouter);
    }

    protected initServices(): void {
        this.token = new TokenBuilder();
        this.userService = new UserService();
        this.sessionService = new SessionService();
    }

//    verify payload
    public permission = (req,res,next: any) => {
        const payload: string = req.headers["authorization"];
        try{
            if(!payload){
                const error = new this.AppError({path:'_',method:METHOD.POST,message:"No authorization payload",collection:"authorization"})
                return this.sendErrorResponse(res,error,this.errorResponseMessage.NOT_AUTHORIZED_TOKEN,401)
            }

            let payloadSplit = payload.split(" ");
            if(payloadSplit.length > 1){
                this.requestService.setJWT(payloadSplit[1]);
            } else {
                this.requestService.setJWT(payloadSplit[0]);
            }

            next();
        }catch (e) {
            return this.sendErrorResponse(res,e,this.errorResponseMessage.UNABLE_TO_VERIFY_PERMISSION,401)
        }

    }

    public decode = async (req,res,next) => {
        const jwt = this.requestService.getJWT();

        try{
            let data = await this.token
                .setToken(jwt)
                .build()
                .verifyLoginToken()

            if(data){
                this.requestService.setTokenData(data.data);
                next();
            }else{

                const error = new this.AppError({path:'_',method:METHOD.POST,message:"Invalid token",collection:"authorization"})
                return this.sendErrorResponse(res,error,this.errorResponseMessage.INVALID_TOKEN,401)
            }
        }catch (e) {
            if(e.state == 1){
                return this.sendErrorResponse(res,e,this.errorResponseMessage.EXPIRED_TOKEN,401)
            }else{
                return this.sendErrorResponse(res,e,this.errorResponseMessage.INVALID_TOKEN,401)
            }

        }

    }

    public user = async (req,res,next) => {
        const data = this.requestService.getTokenData();
        let user = await this.userService.findOne({_id: data?.user})

        if(user && user?.id){
            this.requestService.setUser(this.userService.getSafeUserData(user));
            next();
        }else{
            const error = new this.AppError({path:'_',method:METHOD.POST,message:"User not found",collection:"authorization"})
            return this.sendErrorResponse(res,error,this.errorResponseMessage.USER_NOT_FOUND,401)
        }
    }

    public session = async (req,res,next) => {
        const data = this.requestService.getTokenData();

        try{
            const loggingSession = await this.sessionService.findOne({_id:data?.id,uuid: data?.uuid,status:BIT.ON,user: data?.user},null);
            if(loggingSession && loggingSession.id){
                if(loggingSession.validity_end_date < new Date()){
                    loggingSession.expired = true;
                    loggingSession.status = BIT.OFF;
                    loggingSession.validity_end_date = new Date();
                    await loggingSession.save()

                    const error = new this.AppError({path:'_',method:METHOD.POST,message:"Expired token",collection:"authorization"})
                    return this.sendErrorResponse(res,error,this.errorResponseMessage.EXPIRED_TOKEN,401)

                }else{
                    this.requestService.setLoggingSession(loggingSession)
                    next();
                }
            }else {
                const error = new this.AppError({path:'_',method:METHOD.POST,message:"Expired token",collection:"authorization"})
                return this.sendErrorResponse(res,error,this.errorResponseMessage.EXPIRED_TOKEN,401)
            }
        }catch (e) {
            return this.sendErrorResponse(res,e,this.errorResponseMessage.EXPIRED_TOKEN,401)
        }
    }



}

export default AuthorizationMiddleware;
