
import dotenv from 'dotenv';
import SystemError from "../utils/system/SystemError";
import {ERROR_TYPE, SERVICES} from "../constants/SystemConstants";
import mongoose, {ConnectOptions} from 'mongoose';

dotenv.config();

let uri = process.env.MONGO_URI


class DataBase{
    private options: any;
    private mongoose;
    constructor(_options: any) {
        this.options = _options;
        this.mongoose = mongoose;
        this.mongoose.connect(uri,this.options as ConnectOptions)
        this.mongoose.connection.once('connecting',()=> {
            console.log('connecting to mongodb server via mongoose...')
        })
        this.mongoose.connection.once('connected',()=> {
            console.log('connected to mongodb server via mongoose...')
        })
        this.mongoose.connection.once('open',()=> {
            console.log('database is active...')
        })
        this.mongoose.connection.once('disconnecting',()=> {
            console.log('disconnecting from mongodb server...')
        })
        this.mongoose.connection.once('disconnected',()=> {
            console.log('disconnected from mongodb server...')
        })
        this.mongoose.connection.once('close',()=> {
            console.log('closing connections with mongodb server...')
        })
        this.mongoose.connection.once('reconnected',()=> {
            console.log('reconnected to mongodb server...')
        })
        this.mongoose.connection.once('error',(err)=> {
            console.log('mongodb server error...')
            console.log(err)
        })

    }




}

class DatabaseBuilder {
    private options: any;
    config(options: any){
     this.options = options;
     return this;
    }

    build(){
        return new DataBase(this.options);
    }

}


export default DatabaseBuilder;
