import express from 'express';
import {
    acceptInsurance,
    addPaidAmount,
    addTickets, annonymousEmail, annonymousEmailDelete, annonymousEmailupdate, applyInsurance, assignCourier,
    attachInvoice,
    attachToTicket, cancelCourier, checkLinkStatus, contactCustomer, disconnectAccount, dragdrop, emailList, emailStatusUpdate, finalInsurance, finalTicket, getAmount, getInsuranceList, getInvoiceList, getPaidAmount, getTicketsDetails,
    getTicketsList, lamiReturnDetails, newTicketDetails, reAssignCourier, rejectInsurance, returnToLoCo, updateInsurance, updateInvoice, updateTicket
} from '../controllers/user/lami-admin/tickets/tickets.controller';
import { ticketTracker, ticketTrackerDetails } from '../controllers/user/lami-admin/tickets/ticketTracker.controller';
import { returnToLaMi } from '../controllers/user/lami-courier/lamiCourier.controller';
import upload from '../middleware/multerMiddleware';

const ticketRouter = express.Router();

//Ticket Details
ticketRouter.get('/get-ticket-list', getTicketsList);
ticketRouter.get('/get-ticket-details', getTicketsDetails);

//email list
ticketRouter.get('/get-ticket-email-list', emailList);
ticketRouter.post('/update-ticket-email', emailStatusUpdate);

//annonymous
ticketRouter.get('/get-annonymous-ticket', annonymousEmail);
ticketRouter.post('/update-annonymous-ticket', annonymousEmailupdate);
ticketRouter.delete('/delete-annonymous-ticket', annonymousEmailDelete);
ticketRouter.post('/attach-to-ticket', attachToTicket);

//assign and reassign cancel courier
ticketRouter.post('/assign-courier', assignCourier);
ticketRouter.post('/return-courier', reAssignCourier);
ticketRouter.post('/cancel-courier', cancelCourier);

//return to loco
ticketRouter.get('/get-return-ticket', lamiReturnDetails);
ticketRouter.post('/return-to-loco', upload.array('newAttachment', 10), returnToLoCo);

//return to lami
ticketRouter.post('/return-to-lami', upload.array('files', 10), returnToLaMi);

//tracker
ticketRouter.get('/ticket-tracker', ticketTracker);
ticketRouter.get('/ticket-tracket-details', ticketTrackerDetails);

//Add and update
ticketRouter.patch('/ticket-update', updateTicket);
ticketRouter.post('/add-tickets', addTickets);


//finalize mark locolost or locosuccess
ticketRouter.post('/ticket-final', finalTicket);
ticketRouter.post('/insurance-final', finalInsurance);

//insurance
ticketRouter.post('/apply-insurance',upload.array('files', 10), applyInsurance);
ticketRouter.post('/accept-insurance', acceptInsurance);
ticketRouter.post('/reject-insurance', rejectInsurance);
ticketRouter.post('/update-insurance', updateInsurance);


//invoice
ticketRouter.post('/add-invoice', upload.array('attachment', 10), attachInvoice);
ticketRouter.get('/get-insurance-list', getInsuranceList);
ticketRouter.get('/get-invoice-list', getInvoiceList);
ticketRouter.post('/update-invoice', updateInvoice);


ticketRouter.post('/drag-and-drop', dragdrop);
ticketRouter.get('/get-insurance-amount', getAmount);


ticketRouter.post('/add-paid-amount', addPaidAmount);
ticketRouter.get('/get-paid-amount', getPaidAmount);


ticketRouter.post('/contact-customer', contactCustomer);
ticketRouter.get('/link-status', checkLinkStatus);
ticketRouter.get('/new-ticket-details', newTicketDetails);

ticketRouter.post('/disconnect', disconnectAccount);

export default ticketRouter;