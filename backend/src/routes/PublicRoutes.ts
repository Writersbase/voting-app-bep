import {Express} from "express";
import AuthC from "../controllers/public/authentication/AuthC";
const ENDPOINT = "/api/v1"


class PublicRoutes {
    private app;
    constructor(_app: Express) {
        this.app = _app;

    }

    initRoutes(){
        this.app.get('/',(req,res) => {
            res.send('Hello Blog CMS Server')
        })
        this.app.use(ENDPOINT + '/auth',AuthC);
    }

}

export default PublicRoutes;
