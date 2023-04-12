import BaseResponseHandler from "../../utils/app/base-response/BaseResponseHandler";
import AppError from "../../utils/app/AppError";
import OtpService from "../../services/OtpService";
import Utils from "../../config/Utils";
import EmailBuilder from "../../utils/app/Email";



class BaseMiddleware extends BaseResponseHandler{
    public otpService: OtpService;
    protected util: Utils;
    protected emailService: EmailBuilder;
    public AppError;
    constructor() {
        super();
        this.AppError = AppError;
        this.otpService = new OtpService();
        this.util = new Utils()
        this.emailService = new EmailBuilder();

    }



}

export default BaseMiddleware;
