import {Express} from "express";
import AuthC from "../controllers/public/authentication/AuthC";
import swaggerUI from 'swagger-ui-express';
let swaggerDocument = require('../../auth.json');
const ENDPOINT = "/api/v1/doc"


class DocRoutes {
    private app;
    constructor(_app: Express) {
        this.app = _app;

    }

    initRoutes(){
        this.app.use(ENDPOINT + '/user',swaggerUI.serve,swaggerUI.setup(swaggerDocument));
    }

}

export default DocRoutes;
