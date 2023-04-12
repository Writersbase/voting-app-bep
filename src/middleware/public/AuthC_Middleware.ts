import {EMAIL_VALIDATION, METHOD, PASSWORD_VALIDATION} from "../../constants/AppConstants";
import BaseResponseHandler from "../../utils/app/base-response/BaseResponseHandler";
import BaseMiddleware from "../base/BaseMiddleware";
import HashBuilder, {IHash} from "../../utils/app/Hash";
import UserService from "../../services/UserService";
import RequestService from "../../services/base/RequestService";
import EmailBuilder from "../../utils/app/Email";
import otpgen from 'otp-generator';


class AuthCMiddleware extends BaseMiddleware{
    private router;
    private hashService: HashBuilder;
    private userService: UserService;
    private requestService: RequestService;

    constructor(router: any) {
        super();
        this.router = router;
        this.hashService = new HashBuilder();
        this.userService = new UserService();
        this.requestService = new RequestService(this.router);
    }


    sendOtpVerification = async (req,res,next) => {
        const {email,first_name,last_name} = req.body;
        let otp = this.util.genOtp();

        let emailOTP: any = await this.emailService.setOTP({to: email,name: first_name + " " + last_name ,otp:otp,subject:"Account Activation Pin"}).build().sendOtp();

        if(emailOTP?.state == true){
            this.requestService.addToDataBag("otp",otp);
            next();
        }else{
            const error = new this.AppError({path:'/auth/signup',method:METHOD.POST,message:"otp not sent",collection:"user"})
            return this.sendErrorResponse(res,error,this.errorResponseMessage.OTP_NOT_SENT,400)
        }
    }


    verifyCompletePayload = (req,res,next) => {
        const {
            first_name,
            last_name,
            password,
            email,
            gender,
        } = req.body;

        if( !first_name || !last_name || !password || !email || !gender){
            //    return error message
            const error = new this.AppError({path:'/auth/signup',method:METHOD.POST,message:"Payload incomplete",collection:"user"})
            return this.sendErrorResponse(res,error,this.errorResponseMessage.INCOMPLETE_PAYLOAD,400)
        }else{
            next();
        }
    }

    verifyEmailFormat= (req,res,next) => {
        const {email} = req.body;
        if (EMAIL_VALIDATION.test(email)) {
            next();
        }else{
            const error = new this.AppError({path:'/auth/signup',method:METHOD.POST,message:"Email format incorrect.",collection:"user"})
            return this.sendErrorResponse(res,error,this.errorResponseMessage.INCORRECT_EMAIL_FORMAT,400)
        }
    }

    verifyEmailExist =  async (req,res,next)  => {
        const {email} = req.body;
       try {
           const userExist = await this.userService.findOne({email:email},null);
           if(userExist && userExist.id){
               const error = new this.AppError({path:'/auth/signup',method:METHOD.POST,message:"User already exist.",collection:"user"})
               return this.sendErrorResponse(res,error,this.errorResponseMessage.USER_EXIST,400)
           }else{
               next();
           }
       }catch (e) {

           return this.sendErrorResponse(res,e,this.errorResponseMessage.USER_EXIST,400)
       }
    }

    verifyEmailExistLogin =  async (req,res,next)  => {
        const {email} = req.body;
        try {
            const userExist = await this.userService.findOne({email:email},null);
            if(userExist && userExist.id){
               next();
            }else{
                const error = new this.AppError({path:'/auth/signin',method:METHOD.POST,message:"User already exist.",collection:"user"})
                return this.sendErrorResponse(res,error,this.errorResponseMessage.USER_NOT_EXIST,400)
            }
        }catch (e) {

            return this.sendErrorResponse(res,e,this.errorResponseMessage.USER_EXIST,400)
        }
    }

    verifyPasswordFormat = (req,res,next) => {
        const {password} = req.body;
        /*
            Password validation rule
            Length: at least 8 and max 15 characters
            1 - Numeric
            1 - Capital letter
            1 - Small letter
            1 - Symbol
         */

        if (password.toString().match(PASSWORD_VALIDATION)) {
            next();
        }else {
            const error = new this.AppError({path:'/auth/signup',method:METHOD.POST,message:"Passeord format incorrect.",collection:"user"})
            return this.sendErrorResponse(res,error,this.errorResponseMessage.INCORRECT_PASSWORD_FORMAT,400)
        }
    }

    hashPassword = async (req,res,next) => {
        const {password} = req.body;
        try {
            let hash:IHash = await this.hashService
                .setPassword(password)
                .build()
                .hashPassword()

            if(hash){
                req.body.password = hash.password;
                req.body.salt = hash.salt;

                next();
            }else{
                const error = new this.AppError({path:'/auth/signup',method:METHOD.POST,message:"Password not hashed.",collection:"user"})
                return this.sendErrorResponse(res,error,this.errorResponseMessage.PASSWORD_NOT_HASHED,400)
            }
        }catch (e: any) {

            return this.sendErrorResponse(res,e,this.errorResponseMessage.PASSWORD_NOT_HASHED,400)
        }
    }

    verifyPassword =async (req,res,next) => {
        const {password,email} = req.body;

       try{
           let requestedUser = await this.userService.findOne({email:email},null);
           if(requestedUser){
               let compare = await this.hashService
                   .setPassword(password)
                   .build()
                   .verifyPassword(requestedUser?.password)

               if(compare == true){
                   next()
               }else {
                   const error = new this.AppError({path:'/auth/login',method:METHOD.POST,message:"password incorrect.",collection:"user"})
                   return this.sendErrorResponse(res,error,this.errorResponseMessage.PASSWORD_NOT_CORRECT,400)
               }

           }
       }catch (e) {
           return this.sendErrorResponse(res,e,this.errorResponseMessage.PASSWORD_NOT_CORRECT,400)
       }

    }
}
export default AuthCMiddleware;
