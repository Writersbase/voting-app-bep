import {Schema, model} from "mongoose";
import {BIT, OTP_TYPE, STATUS} from "../constants/AppConstants";


const mongoosePaginate = require('mongoose-paginate-v2');

const BlacklistSchema = new Schema<IBlacklist>({
        ip_address: {type: String, required: true},
        status: {type: String, default: STATUS.ACTIVE, enum: Object.values(STATUS)},
        blacklist_end: {type: Date, default: new Date(Date.now() + 86400000) },
        expired: {type: Boolean,default: false},
        is_admin: {type: Boolean, default: false}
    },
    {
        toObject: {virtuals: true},
        toJSON: {virtuals: true},
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    });

export interface IBlacklist {
    status: string,
    ip_address: string,
    expiring: any,
    blacklist_end: any,
    expired: boolean,
    is_admin: boolean,
    _id: string,
    id: any
}

BlacklistSchema.plugin(mongoosePaginate);
export default model<IBlacklist>("Blacklist", BlacklistSchema);
