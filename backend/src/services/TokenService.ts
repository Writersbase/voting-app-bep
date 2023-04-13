import DBService from './base/DBService';
import Token , { IToken } from '../models/token';

class TokenService extends DBService<IToken> {

    constructor(populatedFields:string[] = []) {
        super(Token, populatedFields);
    }


}

export default TokenService;
