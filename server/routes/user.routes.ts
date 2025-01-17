import express from 'express';
import { forgotPassword, login, logout, resetPassword } from '../controllers/auth/user.controller';
import { getUserData, updateUserData } from '../controllers/common/common.controller';
import { createLami, deleteLamiAdmin, dummy, getCourierNew, getLami, getLamiAdmins, updateLami } from '../controllers/user/plugo-admin/plugo.controller';
import { createCourier, createCourierByAdmin, deleteCourierByAdmin, deleteLamiCourier, generateNewPassword, getCourier, getCourierByAdmin, updateCourierByAdmin, updateLamiCourier } from '../controllers/user/lami-admin/lami.controller';
import { courierDashboardCardData, graphSecond, graphfirst, openedTicketsData, ticketStatusCounts, upCommingTickets } from '../controllers/user/lami-courier/dashboard/courierDashboard.controller';
import {
    courierHistory, courierHistoryDetails, lamiDashboardCardData, lamiDashboardGraph1, lamiDashboardGraph2, lamiDashboardGraph3,
    lamiDashboardTicketCourier, lamiDashboardTicketTable
} from '../controllers/user/lami-admin/dashboard/lamiDashboard.controller';
import { getCourierTickets, getCourierTicketsDetails } from '../controllers/user/lami-courier/lamiCourier.controller';
import { createLanguage, deleteLanguage, getAllLanguages, updateLanguage } from '../controllers/language/languageController';
import { addAccountData, getAccount, updateLamiAccount } from '../controllers/user/lami-admin/lamiAccount.controller';
import { mailSend } from '../controllers/user/lami-admin/tickets/tickets.controller';
import upload from '../middleware/multerMiddleware';
import { loginValidationRules, validate } from '../middleware/validator/loginValidator';
import { createLamiValidationRules, validateLamiUser } from '../middleware/validator/createLamiValidator';
import { generateOtp, getInvitation, inviteByEmail, inviteByExcelEmail, registation, resendInvitation } from '../controllers/user/invite/invite.controller';
import { createClientAdmin, deleteClientAdmin, depoAdminOverView, getAdmin, lamiAdminOverView, updateClientAdmin } from '../controllers/user/client-admin/client.controller';
import { createDepoAdmin, deleteDepoAdmin, getDepoAdmin, updateDepoAdmin } from '../controllers/user/depo-admin/depoAdmin.controller';
const userRouter = express.Router();


//Auth
userRouter.post('/login', loginValidationRules(), validate, login);
userRouter.post('/logout', logout);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

//Common
userRouter.get('/getuserdata', getUserData);
userRouter.post('/update-user', upload.single('avatar'),updateUserData);

/** After Qaaro Admin client_admin is the first level user on hierarchy */
//client_admin crid
userRouter.post('/create_client_admin', createClientAdmin);
userRouter.get('/get_client_Admin', getAdmin);
userRouter.put('/update_client_admin', updateClientAdmin);
userRouter.delete('/delete_client_admin', deleteClientAdmin);

//Sp Overview
userRouter.get('/lami-overview', lamiAdminOverView);

//Depo Overview
userRouter.get('/depo-overview', depoAdminOverView);

/** After client_admin depo_admin is the second level user on hierarchy */
//depo_admin crid
userRouter.post('/create_depo_admin', createDepoAdmin);
userRouter.get('/get_depo_admin', getDepoAdmin);
userRouter.put('/update_depo_admin', updateDepoAdmin);
userRouter.delete('/delete_depo_admin', deleteDepoAdmin);

/** After depo_admin lami_admin is the third level user on hierarchy */
// userRouter.post('/create-lami-admin',createLamiValidationRules(), validateLamiUser, createLami);
userRouter.post('/create-lami-admin', createLami);
userRouter.get('/get-lami-admin', getLami);
userRouter.get('/get_lami', getLamiAdmins);
userRouter.put('/update-lami-admin', updateLami);
userRouter.delete('/delete-lami-admin', deleteLamiAdmin);

/** After lami_admin lami-courier is the fourth level user on hierarchy */
//courier Crud
userRouter.post('/create-courier', createCourierByAdmin);
userRouter.get('/get-courier', getCourierByAdmin);
userRouter.put('/update-courier', updateCourierByAdmin);
userRouter.delete('/delete-courier', deleteCourierByAdmin);

//courier Crud for lami admin dashboard
userRouter.post('/create-lami-courier', createCourier);
userRouter.get('/get-lami-courier', getCourier);
userRouter.get('/get-courier', getCourierNew);
userRouter.put('/update-lami-courier', updateLamiCourier);
userRouter.delete('/delete-lami-courier', deleteLamiCourier);



//Generate password
userRouter.post('/generate-password', generateNewPassword);

//courier dashboard apis
userRouter.get('/ticket-summery', courierDashboardCardData);
userRouter.get('/ticket-opened', openedTicketsData);
userRouter.get('/graph-first', graphfirst);
userRouter.get('/graph-second', graphSecond);
userRouter.get('/get-upcomming-tickets', upCommingTickets);
userRouter.get('/ticket-status-counts', ticketStatusCounts);

//Lami dashboard apis
userRouter.get('/dashboard-card', lamiDashboardCardData);
userRouter.get('/dashboard-ticket-table', lamiDashboardTicketTable);
userRouter.get('/dashboard-ticket-courier', lamiDashboardTicketCourier);
userRouter.get('/dashboard-graph1', lamiDashboardGraph1);
userRouter.get('/dashboard-graph2', lamiDashboardGraph2);
userRouter.get('/dashboard-graph3', lamiDashboardGraph3);

userRouter.post('/add-account-details', addAccountData);
userRouter.get('/get-account-details', getAccount);
userRouter.put('/update-account-details', updateLamiAccount);

//Lami courier history api
userRouter.get('/courier-history', courierHistory);
userRouter.get('/courier-history-details', courierHistoryDetails);

//Lami courier Dashboard
userRouter.get('/get-courier-tickets', getCourierTickets);
userRouter.get('/get-courier-details', getCourierTicketsDetails);

//Client_Admin Api's


//new api's
userRouter.post('/invite-email', upload.none(), inviteByEmail);
userRouter.post('/invite-email-byexcel', upload.single('file'), inviteByExcelEmail);
userRouter.post('/generate-otp', generateOtp);
userRouter.post('/regestration', registation);
//Dashboard api
userRouter.get('/get-invitation', getInvitation);
userRouter.post('/resend-invitation',upload.none(), resendInvitation);

//Language
userRouter.post('/add-lang', createLanguage);
userRouter.get('/get-lang', getAllLanguages);
userRouter.put('/update-lang', updateLanguage);
userRouter.delete('/del-lang', deleteLanguage);

//Send Email
userRouter.post('/send-mail', upload.array('files', 5), mailSend);


userRouter.post('/dummy', dummy);
export default userRouter;