import { Request, Response } from 'express';

// Import the JavaScript controller
const mailController = require('./mail.controller.js');

export const getMailJs = (req: Request, res: Response) => {
    mailController.getMailJs(req, res);
};

export const checkConnectionJs = (req: Request, res: Response) => {
    mailController.checkConnectionJs(req, res);
};