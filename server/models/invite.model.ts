import mongoose, { Document, Schema } from 'mongoose';

export interface IInvite extends Document {
    email: string;
    invitationDate: Date;
    registrationDate?: Date;
    status: 'pending' | 'success';
    role: 'Depo_Admin' | 'LaMi_Admin';
    otp?: number;
    invitedBy?: mongoose.Types.ObjectId;
}

const InviteSchema: Schema = new Schema({
    email: { type: String, required: true },
    invitationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'success'], default: 'pending' },
    registrationDate: { type: Date },
    role: { type: String, enum: ['Depo_Admin', 'LaMi_Admin'], required: true },
    otp: { type: Number },
    invitedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
});

export const Invite = mongoose.model<IInvite>('Invite', InviteSchema);