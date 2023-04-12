import {METHOD} from "../../constants/AppConstants";

interface IError {
    message: string;
    collection?: string;
    path: string;
    method:METHOD
}

class AppError extends Error {
    private collection;
    private path;
    private method;
    constructor(error:IError) {
        super(error.message);
        Error.captureStackTrace(this,this.constructor);
        this.collection = error.collection;
        this.path = error.path;
        this.method = error.method;
    }


}

export default AppError;
