import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILocoEmail extends Document {
    ticketId: mongoose.Types.ObjectId;
    lamiAdminId: mongoose.Types.ObjectId;
    emailBody: string; // HTML format
    status: string;// status can be defied as enum if required
    type: string;
    attachment?: { files: string[] };
    emailDate?: Date;
}

const LocoEmailSchema: Schema<ILocoEmail> = new Schema({
    ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    lamiAdminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    emailBody: { type: String, required: true },
    attachment: { type: { files: [String] } },
    status: { type: String, required: true },
    type:{type:String, enum:['IN', 'OUT']},
    emailDate: { type: Date, required: true }
}, { timestamps: true });

const LocoEmailModel: Model<ILocoEmail> = mongoose.model<ILocoEmail>("LocoEmail", LocoEmailSchema);

export default LocoEmailModel;
