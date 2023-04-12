import Jwt from 'jsonwebtoken'
import {ILoginSession} from "../../models/login_session";
import dotenv from 'dotenv';
dotenv.config();

interface IErr {
    state: number,
    data: any
}

class Token {

    private token;
    constructor(token?: any) {
        this.token = token;
    }

    createLoginToken(loggingSession: ILoginSession){

        const data = {user: loggingSession.user, uuid: loggingSession.uuid,id: loggingSession.id};
        const token = Jwt.sign({data: data},process.env.TOKEN_SECRET,{expiresIn: '168h'})
        return token;

    }

    verifyLoginToken(){
        return new Promise<IErr>((resolve, reject) => {
            Jwt.verify(this.token,process.env.TOKEN_SECRET,(err,decoded) => {
                if(err){
                    if(err.name === 'TokenExpiredError'){
                        const payload = Jwt.verify(this.token, process.env.TOKEN_SECRET,{ignoreExpiration: true})
                        reject({state:1,data: payload})
                    }else{
                        reject({state: 0, data: err});
                    }

                }else{
                    resolve(decoded);
                }
            })
        })
    }


}


class TokenBuilder {
    private token;
    setToken(token: any){
        this.token = token;
        return this;
    }

    build(){
        return new Token(this.token);
    }
}


export default TokenBuilder;

//    create verify and create token
//    setup login session
//    login user after successful registration with loggin session
//    verify login session in token after parsing jwt token
