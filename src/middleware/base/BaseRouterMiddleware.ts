import BaseResponseHandler from "../../utils/app/base-response/BaseResponseHandler";
import {Router} from "express";
import ErrorResponseMessage from "../../constants/ErrorResponseMessage";
import SuccessResponseMessage from "../../constants/SuccessResponseMessage";
import RequestService from "../../services/base/RequestService";
import AppError from "../../utils/app/AppError";
import TokenBuilder from "../../utils/app/Token";


abstract class BaseRouterMiddleware extends BaseResponseHandler {

    public router;
    protected errorResponseMessage: ErrorResponseMessage;
    protected successResponseMessage: SuccessResponseMessage;
    protected requestService: RequestService;
    protected AppError;
    constructor(appRouter: Router) {
        super();
        this.router = appRouter;
        this.AppError = AppError;
        this.requestService = new RequestService(this.router);
        this.initServices();
    }

    protected abstract initServices():void;
}

export default BaseRouterMiddleware;

