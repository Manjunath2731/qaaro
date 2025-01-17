import mongoose, { Document, Schema } from 'mongoose';

export interface IClientPlanUsage extends Document {
    clientId: mongoose.Schema.Types.ObjectId;
    planId: mongoose.Schema.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    availableCount: number;
}

const ClientPlanUsageSchema: Schema = new Schema({
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
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    availableCount: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

ClientPlanUsageSchema.index({ clientId: 1, planId: 1 }, { unique: true });

export const ClientPlanUsage = mongoose.model<IClientPlanUsage>('ClientSubscription', ClientPlanUsageSchema);