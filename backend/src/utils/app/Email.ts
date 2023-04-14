import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config();

export interface IND_OTP {
    to: string;
    subject: string;
    otp: string;
    name: string;
}
const config = {
    service:'gmail',
    auth:{
        user:process.env.ND_EMAIL,
        pass: process.env.ND_PASS
    }
}

class Email {
    protected transport: any;
    constructor() {
        this.transport = nodemailer.createTransport(config);
    }
}


class EmailOtp extends Email {
    private content: IND_OTP;
    constructor(content: IND_OTP) {
        super();
        this.content = content;
    }
    sendOtp(){
        return new Promise((resolve, reject) => {
            this.transport.sendMail({
                from: process.env.ND_EMAIL,
                to: this.content.to,
                subject: this.content.subject,
                text: `Dear ${this.content.name}, \n Your otp pin is ${this.content.otp}`
            },(err,info) => {
                if(err){
                    reject({state: false,data: err});
                }
                resolve({state: true, data: info});
            })
        })
    }


}


class EmailBuilder {
    private content:IND_OTP;
    private state: string;

    setOTP(content: IND_OTP){
        this.content = content;
        this.state = "otp";
        return this;
    }

    build(){
        switch (this.state ) {
            case "otp":
                return new EmailOtp(this.content);
                break;
            default:
                return;
        }
    }

}

export default EmailBuilder;
