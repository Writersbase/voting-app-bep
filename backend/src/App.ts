import express,{Express} from "express";
import SystemError from "./utils/system/SystemError";
import {ERROR_TYPE, SERVICES} from "./constants/SystemConstants";

interface IMiddleware{
    type: string;
    middleware: any
}

class App{
    public app: Express;
    constructor(_app:Express) {
        this.app = _app;
    }

    run(port: any){
        this.app.listen(port,() => {
            console.log(`Server running on port ${port}`)
        })
    }

}

export class AppBuilder {
    public app: Express;
    private authMiddleware: any;
    constructor() {
        this.app = express();
    }

    setAppMiddleware(middleware:IMiddleware){
        switch(middleware.type){
            case "auth":
                this.authMiddleware = new middleware.middleware(this.app);
                break;
            case "system":
                this.app.use(middleware.middleware);
                break;
            default:
                throw new SystemError({type:ERROR_TYPE.SYSTEM_MIDDLEWARE,message:"Middleware type is not correct",service:SERVICES.APP_MIDDLEWARE_SETUP})
        }

        return this
    }

    setRoutes(auth: any,is_protected: boolean){
        if(!is_protected){
            new auth(this.app).initRoutes();
        }else{
            new auth(this.app,this.authMiddleware).initRoutes();
        }
        return this;
    }

    build(){
        return new App(this.app);
    }

}

