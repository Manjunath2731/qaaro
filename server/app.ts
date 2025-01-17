require('dotenv').config();
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import cron from 'node-cron';
import specs from './docs/swagger';
import { ErrorMiddleware } from './middleware/error';
import backupDatabase from './script/backupDatabase';
import { deleteOldBackupsFromS3 } from './script/deleteOldBackupsFromS3';
import { deactivateExpiredLinks } from './script/linkExpired';
import userRouter from './routes/user.routes';
import ticketRouter from './routes/tickets.routes';
import resourceRouter from './routes/upload.routes';
import mobile from './routes/mobile.routes';
import cronRouter from './routes/job.routes';
import { checkConnectionJs, getMailJs } from './controllers/cron/mail.controller';
import subscription from './routes/subscription.routes';

const env = process.env.ENVIRONMENT;

export const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(
    cors({
        origin: '*',
        credentials: true,
    })
);

// router
app.use('/api/v1', userRouter);
app.use('/api/v1/tickets/', ticketRouter);
app.use('/api/v1/resource/', resourceRouter);
app.use('/api/v1/mobile/', mobile);
app.use('/api/v1/subscription/', subscription);
// app.use('/api/v1/job/', cronRouter);

// Define routes
app.post('/api/v1/mail/get', getMailJs);
app.post('/api/v1/mail/check', checkConnectionJs);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "API is working"
    })
})

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const e = new Error(`Not Found: 400`) as any;
    e.statusCode = 404;
    next(e);
})

cron.schedule('0 0 * * *', async () => {
    console.log('deactivate expired links...');
    await deactivateExpiredLinks();
});

if (env === 'production') {
    cron.schedule('0 5 * * *', () => {
        deleteOldBackupsFromS3();
    })

    cron.schedule('0 4 * * *', () => {
        console.log('Starting database backup process...');
        backupDatabase();
    }, {
        timezone: 'Asia/Kolkata'
    });
}


app.use(ErrorMiddleware);