import dotenv from 'dotenv';
dotenv.config();


class ConfigValidator {
    constructor() {

    }
    validate(env: string){
        console.log(`Validating ${env} is not empty!`)
        let processName = process.env[env];
        if(!processName){
            console.log(`${env} is empty or not present in env`)
            process.exit(1);
        }else{
            console.log(`Validated ${env}`)
            return this;
        }

    }
}

class ConfigValidatorBuilder{
    build(){
        return new ConfigValidator();
    }
}

export default ConfigValidatorBuilder;
