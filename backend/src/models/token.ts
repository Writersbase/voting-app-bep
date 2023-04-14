import {Schema, model} from "mongoose";
import {BIT, OTP_TYPE, STATUS} from "../constants/AppConstants";


const mongoosePaginate = require('mongoose-paginate-v2');

const TokenSchema = new Schema<IToken>({
        token: {type: String,required: true},
        ip_address: {type: String, required: true},
        status: {type: String, default: STATUS.ACTIVE, enum: Object.values(STATUS)},
        expiring: {type: Date, default: new Date(Date.now() + 259200000) },
        expired: {type: Boolean,default: false},
        is_admin: {type: Boolean, default: false}
    },
    {
        toObject: {virtuals: true},
        toJSON: {virtuals: true},
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    });

export interface IToken {
    token: string,
    status: string,
    ip_address: string,
    expiring: any,
    expired: boolean,
    is_admin: boolean,
    _id: string,
    id: any
}

TokenSchema.plugin(mongoosePaginate);
export default model<IToken>("Token", TokenSchema);
