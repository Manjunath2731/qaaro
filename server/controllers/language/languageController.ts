import { Request, Response, NextFunction } from "express";
import Language, { ILanguage } from '../../models/language.model';
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/ErrorHandler";
import { sendApiResponse } from "../../utils/apiresponse";


//Create Language
export const createLanguage = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, code, nativeName } = req.body;
        const language: ILanguage = new Language({
            name,
            code,
            nativeName
        });
        const savedLanguage = await language.save();

        sendApiResponse(res,{
            status:true,
            data:{},
            message: "Language Added successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 400))
    }
});


//Get All language
export const getAllLanguages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const languages = await Language.find().select('-__v');

        sendApiResponse(res, {
            status: true,
            data: languages,
            message: "Languages fetched"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500))
    }
};


// Update a language
export const updateLanguage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const languageId = req.params.id;
        const { name, code, nativeName } = req.body;
        const updatedLanguage = await Language.findByIdAndUpdate(languageId, { name, code, nativeName }, { new: true });
        if (!updatedLanguage) {
            return res.status(404).json({ message: 'Language not found' });
        }

        sendApiResponse(res,{
            status: true,
            data:{},
            message: "Language Updated"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500))
    }
};

// Delete a language
export const deleteLanguage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const languageId = req.params.id;
        const deletedLanguage = await Language.findByIdAndDelete(languageId);
        if (!deletedLanguage) {
            return res.status(404).json({ message: 'Language not found' });
        }


        sendApiResponse(res,{
            status: true,
            data:{},
            message: 'Language deleted successfully'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500))
    }
};
