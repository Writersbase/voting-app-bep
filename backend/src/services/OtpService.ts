import DBService from './base/DBService';
import Otp, { IOtp } from '../models/otp';

class SessionService extends DBService<IOtp> {

    constructor(populatedFields:string[] = []) {
        super(Otp, populatedFields);
    }


}

export default SessionService;
