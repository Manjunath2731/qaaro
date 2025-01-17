import mongoose, { Document, Schema } from 'mongoose';

export enum SubscriptionStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}

export enum SubscriptionReqTypes {
    NEW = "new",
    RENEW = "renew"
}

export interface ISubscriptionRequest extends Document {
    clientId: mongoose.Schema.Types.ObjectId;
    planId: mongoose.Schema.Types.ObjectId;
    requestDate: Date;
    requestType: SubscriptionReqTypes;
    status: SubscriptionStatus;
}


const SubscriptionRequestSchema: Schema = new Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QaaroPlans',
        required: true
    },
    requestDate: {
        type: Date,
        required: true
    },
    requestType: {
        type: String,
        enum: Object.values(SubscriptionReqTypes),
        required: true
    },
    status: {
        type: String,
        enum: Object.values(SubscriptionStatus),
        default: SubscriptionStatus.PENDING
    }
}, {
    timestamps: true
});

export const SubscriptionRequest = mongoose.model<ISubscriptionRequest>('SubscriptionRequest', SubscriptionRequestSchema);