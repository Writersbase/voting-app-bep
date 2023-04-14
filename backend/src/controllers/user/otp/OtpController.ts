import BaseControllerClass from "../../base/BaseControllerClass";
import {METHOD, STATUS} from "../../../constants/AppConstants";


class OtpController extends BaseControllerClass {
    constructor() {
        super();
    }

    protected initMiddleware(): void {
    }

    protected initRoutes(): void {
        this.activationAccount();
        this.resendOtp();
    }

    protected initServices(): void {
    }

    activationAccount(){
        this.router.patch('/verify/activation',async (req,res) => {
            const {otp} = req.body;
            const user = this.requestService.getUser();

            if(!otp){
                const error = new this.AppError({path:'/otp/verify/activation',method:METHOD.PATCH,message:"no otp in body req",collection:"otp"})
                return this.sendErrorResponse(res,error,this.errorResponseMessage.INCOMPLETE_PAYLOAD,400)
            }

            try{
                let otps = await this.otpService.findOne({otp: otp,user:user?.id});

                if(otps){
                    if(otps.expiring < new Date()){
                        otps.expired = true;
                        otps.save();
                        const error = new this.AppError({path:'/otp/verify/activation',method:METHOD.PATCH,message:"otp expired",collection:"otp"})
                        return this.sendErrorResponse(res,error,this.errorResponseMessage.OTP_EXPIRED,400)
                    }else{
                        let activate = await this.userService.updateOne({_id: user?._id},{is_activated: true},null);
                        if(activate){
                            return this.sendSuccessResponse(res,{
                                message:"Account activated"
                            })
                        }else{
                            const error = new this.AppError({path:'/otp/verify/activation',method:METHOD.PATCH,message:"account not activated",collection:"otp"})
                            return this.sendErrorResponse(res,error,this.errorResponseMessage.ACCOUNT_NOT_ACTIVATED,400)
                        }
                    }
                }else{
                    const error = new this.AppError({path:'/otp/verify/activation',method:METHOD.PATCH,message:"account not activated",collection:"otp"})
                    return this.sendErrorResponse(res,error,this.errorResponseMessage.OTP_NOT_FOUND,400)
                }
            }catch (e) {
                return this.sendErrorResponse(res,e,this.errorResponseMessage.ACCOUNT_NOT_ACTIVATED,400)
            }

        })
    }


    resendOtp(){
        this.router.post('/send',async (req,res) => {
            const user = this.requestService.getUser();
            const newOtp = this.util.genOtp();

            try{
                const otpData = {
                    user: user?.id,
                    otp: newOtp,
                }

                let otp = await this.otpService.save(otpData,null);
                if(otp){
                    let emailOtp:any = await this.emailService.setOTP({to:user?.email,name: user?.first_name+" "+ user?.last_name,otp: otp?.otp, subject:"Otp Resent request"}).build().sendOtp();
                    if( emailOtp && emailOtp?.state == true) {
                        return this.sendSuccessResponse(res, {
                            message: "Otp Sent"
                        })
                    }else{
                        const error = new this.AppError({path:'/otp/verify/resend',method:METHOD.PATCH,message:"otp not sent",collection:"otp"})
                        return this.sendErrorResponse(res,error,this.errorResponseMessage.OTP_NOT_SENT,400)
                    }
                }else{
                    const error = new this.AppError({path:'/otp/verify/resend',method:METHOD.PATCH,message:"otp not created",collection:"otp"})
                    return this.sendErrorResponse(res,error,this.errorResponseMessage.OTP_NOT_SENT,400)
                }
            }catch (e) {
                return this.sendErrorResponse(res,e,this.errorResponseMessage.OTP_NOT_SENT,400)
            }


        })
    }

}

export default new OtpController().router;
