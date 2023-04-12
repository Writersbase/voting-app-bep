
interface IError {
    type: string;
    message: string;
    service?: string;
}

class SystemError extends Error {
    private type;
    private service;
    constructor(error:IError) {
        super(error.message);
        Error.captureStackTrace(this,this.constructor);
        this.type = error.type
        this.service = error.service
    }


}

export default SystemError;
