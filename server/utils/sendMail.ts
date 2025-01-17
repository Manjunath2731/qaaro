import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import juice from 'juice';
import { getTranslations } from '../i18n/translationService';

type Attachment = string | Express.Multer.File;

export interface EmailOptions {
    email: string | undefined;
    subject: string;
    template: string;
    data: { [key: string]: any };
    attachments?: Attachment[]; // Changed to 'attachments' with an array of attachments
    cc: string[];
    bcc: string[];
}

export interface TransportOptions {
    host: string;
    port: number;
    service: string;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

const sendMail = async (options: EmailOptions, transportOptions?: TransportOptions): Promise<string> => {
    const transporter: Transporter = nodemailer.createTransport(transportOptions || {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT!),
        service: process.env.SMTP_SERVICE,
        secure: process.env.SMTP_SECURE === 'false',
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        },
    });

    const { email, subject, template, data, attachments, cc, bcc } = options;
    const userLanguage = data.language || 'en';
    const translations = await getTranslations(userLanguage);
    
    // Get the path to the template
    const templatePath = path.join(__dirname, "../template/mails", template);
    const templatePathOptional = path.join(__dirname, "../template/mails", "locomail.ejs");

    // Render the HTML using EJS
    const html: string = await ejs.renderFile(templatePath, {...data, translations});
    const inlinedHtml = juice(html);

    const htmlOptional: string = await ejs.renderFile(templatePathOptional, { email, subject, data, cc, bcc });
    // Prepare the mail options
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        cc: cc,
        bcc: bcc,
        subject,
        html: inlinedHtml,
        attachments: attachments ? attachments.map(attachment => typeof attachment === 'string' ? { path: attachment } : {
            filename: attachment.originalname,
            content: attachment.buffer,
            contentType: attachment.mimetype
        }) : []
    };


    // Send the email
    await transporter.sendMail(mailOptions);
    return htmlOptional;
};

export default sendMail;
