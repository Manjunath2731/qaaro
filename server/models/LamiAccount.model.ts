import mongoose, { Document, Model, Schema } from 'mongoose';

// Define interface for EmailServer
interface EmailServer {
    user: string;
    password: string;
    host: string;
    port: number;
}

interface Lami {
    lamiId: mongoose.Types.ObjectId;
    emailServer: EmailServer;
    lastRun: string;
}

// Define interface for LamiAccount
interface ILamiAccount extends Document {
    lamiId: mongoose.Types.ObjectId;
    emailServer: EmailServer;
    emailTemplate?: string;
    emailSignatureUrl?: string;
    connected: boolean;
    lastRun?: string;
}

// Define schema for LamiAccount
const LamiAccountSchema: Schema<ILamiAccount> = new Schema({
    lamiId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    emailServer: { type: Object, required: true },
    emailTemplate: { type: String },
    emailSignatureUrl: { type: String },
    connected: { type: Boolean },
    lastRun: { type: String } 
}, { timestamps: true });

const LamiAccountModel: Model<ILamiAccount> = mongoose.model<ILamiAccount>("LamiAccount", LamiAccountSchema);

export { ILamiAccount, LamiAccountModel };