import otpgen from 'otp-generator';

class Utils {
    constructor() {

    }


    genOtp(){
        return otpgen.generate(6,{lowerCaseAlphabets: false,upperCaseAlphabets: false,specialChars: false});
    }

}

export default Utils;
