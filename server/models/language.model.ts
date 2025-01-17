import mongoose, { Document, Model, Schema } from "mongoose";

export interface ILanguage extends Document {
    name: string;
    code: string;
    nativeName: string;
}

const languageSchema: Schema<ILanguage> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    nativeName: {
        type: String,
        required: true
    }
});

const Language: Model<ILanguage> = mongoose.model("Language", languageSchema);

export default Language;
