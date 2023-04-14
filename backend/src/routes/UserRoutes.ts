import {Express} from "express";
import AccountController from "../controllers/user/account/AccountController";
import OtpController from "../controllers/user/otp/OtpController";

const USER = '/api/v1/user'

class UserRoutes {
    private app;
    private auth;
    constructor(_app: Express,_auth: any) {
        this.app = _app;
        this.auth = _auth;

    }

    initRoutes(){
        this.app.use(USER,this.auth.permission)
        this.app.use(USER,this.auth.decode)
        this.app.use(USER,this.auth.user)
        this.app.use(USER,this.auth.session)
        this.app.use(USER + '/account',AccountController);
        this.app.use(USER + '/otp',OtpController)
    }

}

export default UserRoutes;
