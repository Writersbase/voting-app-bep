import bcrypt from "bcrypt";

export interface IHash {
    password: any;
    salt?: any;
}


class Hash {
    private password: any;
    private salt: any;
    constructor(config: IHash) {
        this.password = config.password;
        this.salt = config.salt;
    }

    hashPassword(){

        return new Promise<IHash>((resolve, reject) => {
            this.salt = this.randomSaltGen();
            bcrypt.hash(this.password,this.salt)
                .then((hash) => {
                    resolve({password: hash,salt: this.salt})
                }).catch((err) => {
                    reject(err)
            })
        })
    }

    verifyPassword(cryptedPassword: string){
        return new Promise((resolve, reject) => {
            bcrypt.compare(this.password,cryptedPassword)
                .then((status) => {
                    resolve(status);
                }).catch((err) => {
                    reject(err);
            })
        })
    }

    private randomSaltGen(){
        return Math.floor(Math.random() * 10);
    }
}


class HashBuilder{
    private password: any = null;
    private salt: any = null;

    setPassword(password: string){
        this.password = password;
        return this;
    }
    setSalt(salt: number){
        this.salt = salt;
        return this;
    }

    build(){
        return new Hash({password: this.password, salt:this.salt});
    }

}

export default HashBuilder;
