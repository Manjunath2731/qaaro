import express from 'express';
import { addDataToCustometAcceptedPDF, addDataToCustometDeniedPDF, custometAcceptedPDF } from '../controllers/user/lami-courier/courierPdf.controller';
import { CreateDeniedPdf, getPdfData } from '../controllers/user/lami-admin/tickets/tickets.controller';

const resourceRouter = express.Router();

resourceRouter.post('/add-acceptedpdf', addDataToCustometAcceptedPDF);
resourceRouter.post('/add-deniedpdf', addDataToCustometDeniedPDF);

resourceRouter.post('/accept-pdf', custometAcceptedPDF);

resourceRouter.get('/get-pdf-data', getPdfData);
resourceRouter.post('/add-new-deniedpdf', CreateDeniedPdf);

export default resourceRouter;