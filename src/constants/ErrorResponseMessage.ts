class ErrorResponseMessage {


    public INCOMPLETE_PAYLOAD = {
        response_code: 1,
        message: "incomplete payload",
    };

    public INCORRECT_EMAIL_FORMAT = {
        response_code: 2,
        message: "email format incorrect",
    };

    public INCORRECT_PASSWORD_FORMAT = {
        response_code: 3,
        message: "password format incorrect",
    };

    public PASSWORD_NOT_HASHED = {
        response_code: 4,
        message: "password not hashed",
    };

    public USER_NOT_CREATED = {
        response_code: 5,
        message: "user not created",
    };

    public USER_EXIST = {
        response_code: 6,
        message: "user already exist",
    };

    public UNABLE_TO_VERIFY_PERMISSION = {
        response_code: 7,
        message: "unable to verify authorization! please pass in the correct permission token into the `authorization header`",
    };

    public NOT_AUTHORIZED_TOKEN = {
        response_code: 8,
        message: "permission token not found! you can't be authorized to access this api.",
    };

    public INVALID_TOKEN = {
        response_code: 9,
        message: "token is invalid! you may as well try to login again.",
    };

    public EXPIRED_TOKEN = {
        response_code: 10,
        // initiate an automatic logout once frontend hits this error
        message: "token is expired! login again.",
    };

    public USER_NOT_FOUND = {
        response_code: 11,
        message: "user not found.",
    };

    public PASSWORD_NOT_CORRECT = {
        response_code: 12,
        message: "incorrect password! try again.",
    };

    public UNABLE_TO_LOGIN = {
        response_code: 13,
        message: "unable to login! try again.",
    };

    public OTP_NOT_SENT = {
        response_code: 14,
        //handle in frontend
        message: "otp not sent.",
    };

    public LOGIN_REDIRECT = {
        response_code: 15,
        // handle in frontend
        message: "please login...",
    };

    public USER_NOT_EXIST = {
        response_code: 16,
        message: "user does not exist",
    };

    public OTP_EXPIRED = {
        response_code: 17,
        message: "otp expired try again",
    };

    public ACCOUNT_NOT_ACTIVATED = {
        response_code: 18,
        message: "account not activated try again",
    };

    public OTP_NOT_FOUND = {
        response_code: 19,
        message: "invalid otp",
    };

}

export default ErrorResponseMessage;
