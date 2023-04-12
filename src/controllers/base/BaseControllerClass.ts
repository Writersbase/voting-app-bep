import {Router} from 'express';
import AppError from "../../utils/app/AppError";
import {METHOD} from "../../constants/AppConstants";
import BaseResponseHandler from "../../utils/app/base-response/BaseResponseHandler";
import RequestService from "../../services/base/RequestService";
import OtpService from "../../services/OtpService";
import UserService from "../../services/UserService";
import Utils from "../../config/Utils";
import EmailBuilder from "../../utils/app/Email";

// response handlers: success and errors

abstract class BaseControllerClass extends BaseResponseHandler {
    router;
    protected AppError;
    protected requestService: RequestService;
    protected otpService: OtpService;
    protected userService: UserService;
    protected util: Utils;
    protected emailService: EmailBuilder;
    constructor() {
        super()
        this.router = Router();
        this.AppError = AppError;
        this.requestService = new RequestService(this.router);
        this.otpService = new OtpService();
        this.userService = new UserService();
        this.emailService = new EmailBuilder();
        this.util = new Utils();
        this.initMiddleware();
        this.initRoutes();
        this.initServices();

    }



    protected abstract initRoutes(): void;
    protected abstract initServices(): void;
    protected abstract initMiddleware(): void;



}


export default BaseControllerClass;
