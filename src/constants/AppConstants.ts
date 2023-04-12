

export const APP_METHODS = {
    POST: "post",
    GET:"get",
    PATCH:"patch",
    DELETE:"delete"
}

export enum METHOD {GET="get",POST= "post",PATCH="patch",DELETE="delete"}

export const STATUS = {
    ACTIVE: "active",
    INACTIVE:"inactive",
    SUSPENDED:"suspended",
    BANNED:"banned",
    DELETED:"deleted"
};

export const OTP_TYPE = {
    AUTH:"auth",
    GENERAL:"general"
}

export enum GENDER {MALE="male",FEMALE="female"};

export const PASSWORD_VALIDATION = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
export const EMAIL_VALIDATION = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const APP_LABELS={
    USER:"_user",
    JWT:"_jwt"
}

export const BIT = {
    ON:1,
    OFF:0
}
