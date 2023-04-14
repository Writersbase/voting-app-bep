import DBService from './base/DBService';
import Blacklist , { IBlacklist } from '../models/blacklist';

class BlacklistService extends DBService<IBlacklist> {

    constructor(populatedFields:string[] = []) {
        super(Blacklist, populatedFields);
    }


}

export default BlacklistService;
