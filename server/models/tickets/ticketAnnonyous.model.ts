import mongoose, { Schema, Document } from 'mongoose';

interface IAnonymousMail extends Document {
    lamiAdminId: Schema.Types.ObjectId;
    emailBody: string;
    attachment: {
        files: string[];
    };
    status: string;
    emailDate: Date;
}

const AnonymousMailSchema: Schema<IAnonymousMail> = new Schema<IAnonymousMail>({
    lamiAdminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    emailBody: { type: String, required: true },
    attachment: {
        type: { files: [String] }
    },
    status: { type: String, required: true },
    emailDate: { type: Date, required: true }
}, { timestamps: true });

const AnonymousMailModel = mongoose.model<IAnonymousMail>("AnonymousMail", AnonymousMailSchema);

export default AnonymousMailModel;