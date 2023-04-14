import {AppBuilder} from "./App";
import express from "express";
import cors from 'cors'
import compression from 'compression';
import helmet from 'helmet';
import PublicRoutes from "./routes/PublicRoutes";
import {ERROR_TYPE, MIDDLEWARE_LEVEL, SERVICES} from "./constants/SystemConstants";
import DatabaseBuilder from "./config/Database";
import dotenv from 'dotenv';
import SystemError from "./utils/system/SystemError";
import AuthorizationMiddleware from "./middleware/AuthorizationMiddleware";
import ConfigValidatorBuilder from "./utils/system/ConfigValidator";
import UserRoutes from "./routes/UserRoutes";
import DocRoutes from "./routes/DocRoutes";

dotenv.config();

new ConfigValidatorBuilder()
    .build()
    .validate('MONGO_URI')
    .validate('DB_NAME')
    .validate('DB_ERROR_LOGS')
    .validate('TOKEN_SECRET')
    .validate('ND_EMAIL')
    .validate('ND_PASS')

const jsonParam = {limit:'100mb'};
const urlExtendedParam = {limit: '100mb',extended: true};
const port: any = process.env.PORT || 3000;

const mongooseOptions:any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName:process.env.DB_NAME
}

new DatabaseBuilder()
    .config(mongooseOptions)
    .build();

let App: any = new AppBuilder()
    .setAppMiddleware({type:MIDDLEWARE_LEVEL.SYSTEM,middleware:express.json(jsonParam)})
    .setAppMiddleware({type: MIDDLEWARE_LEVEL.SYSTEM,middleware:express.urlencoded(urlExtendedParam)})
    .setAppMiddleware({type: MIDDLEWARE_LEVEL.SYSTEM,middleware: cors()})
    .setAppMiddleware({type: MIDDLEWARE_LEVEL.SYSTEM,middleware:helmet()})
    .setAppMiddleware({type:MIDDLEWARE_LEVEL.SYSTEM,middleware: compression()})
    .setAppMiddleware({type:MIDDLEWARE_LEVEL.AUTH,middleware: AuthorizationMiddleware})
    .setRoutes(PublicRoutes,false)
    .setRoutes(UserRoutes,true)
    .setRoutes(DocRoutes,false)
    .build()

App.run(port);
