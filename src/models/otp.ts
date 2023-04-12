import {Schema, model} from "mongoose";
import {BIT, OTP_TYPE, STATUS} from "../constants/AppConstants";


const mongoosePaginate = require('mongoose-paginate-v2');

const OtpSchema = new Schema<IOtp>({
        otp: {type: String},
        status: {type: String, default: STATUS.ACTIVE, enum: Object.values(STATUS)},
        user: {type: Schema.Types.ObjectId,REF:"User"},
        expiring: {type: Date, default: new Date(Date.now() + 480000) },
        expired: {type: Boolean,defalt: false}
    },
    {
        toObject: {virtuals: true},
        toJSON: {virtuals: true},
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    });

export interface IOtp {
    user: any,
    otp: string,
    status: string,
    expiring: any,
    expired: boolean,
    _id: string,
    id: any
}

OtpSchema.plugin(mongoosePaginate);
export default model<IOtp>("Otp", OtpSchema);
