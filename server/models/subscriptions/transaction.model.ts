import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
    subscriptionId: mongoose.Schema.Types.ObjectId;
    clientId: mongoose.Schema.Types.ObjectId;
    type: string;
    date: Date;
    amount: number;
    status: 'success' | 'failed';
}

const TransactionSchema: Schema = new Schema({
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientSubscription',
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['cash', 'card','netBanking'],
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['success', 'failed']
    }
}, {
    timestamps: true
});

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
