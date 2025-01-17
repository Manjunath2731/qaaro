import mongoose, { Document, Schema } from 'mongoose';

// Interface for QaaroPlans
export interface IQaaroPlans extends Document {
    planCode: string;
    type: 'basic' | 'advance' | 'premium';
    period: 'monthly' | 'yearly' | '2yearly';
    duration: number; // in months
    bandwidth: 'BND1' | 'BND2' | 'BND3';
    cost: number; // amount in numbers
    userLimit: number; // limit of users
}

// Schema for QaaroPlans
const QaaroPlansSchema: Schema = new Schema({
    planCode: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['basic', 'advance', 'premium'],
        required: true
    },
    period: {
        type: String,
        enum: ['monthly', 'yearly', '2yearly'],
        required: true
    },
    duration: {
        type: Number, // in months
        required: true
    },
    band: {
        type: String,
        enum: ['BND1', 'BND2', 'BND3'],
        required: true
    },
    cost: {
        type: Number, // amount in numbers
        required: true
    },
    userLimit: {
        type: Number, // limit of users
        enum: [1000, 5000, 10000],
        required: true
    }
}, {
    timestamps: true
});

export const QaaroPlans = mongoose.model<IQaaroPlans>('QaaroPlans', QaaroPlansSchema);
