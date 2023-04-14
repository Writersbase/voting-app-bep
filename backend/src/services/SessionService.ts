import DBService from './base/DBService';
import { HydratedDocument } from 'mongoose';
import Session, { ILoginSession } from '../models/login_session';

class SessionService extends DBService<ILoginSession> {

    constructor(populatedFields:string[] = ['-password']) {
        super(Session, populatedFields);
    }


}

export default SessionService;
