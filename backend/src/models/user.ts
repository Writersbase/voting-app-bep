import {model, Schema} from "mongoose";
import {GENDER, STATUS} from "../constants/AppConstants";


export const UserSchema = new Schema<IUser>({
        status: {type: String, default: STATUS.ACTIVE, enum: Object.values(STATUS)},
        first_name: {type: String, required: true},
        last_name: {type: String, required: true},
        email: {type: String, required: true},
        gender: {type: String, required: true, enum:GENDER},
        password: {type: String, required: true},
        salt: {type: Number, required: true},
        profile_pics: {type: String},
        is_activated: {type: Boolean, default: false}



    },
    {
        toObject: {virtuals: true},
        toJSON: {virtuals: true},
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    });

export interface IUser {
    status: string,
    first_name: string,
    last_name: string,
    email: string,
    gender: string,
    password: string,
    salt: number,
    profile_pics: string,
    is_activated: boolean,
    _id: any,
    id: any
}



export default model<IUser>("User", UserSchema);

