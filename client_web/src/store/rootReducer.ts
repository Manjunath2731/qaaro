import { combineReducers } from '@reduxjs/toolkit';
import { accountDetailsReducer } from 'src/slices/AccountSetting/AddDetails';
import { changeStatusReducer } from 'src/slices/AccountSetting/ChangeConnection';
import { getAccountDetailsReducer } from 'src/slices/AccountSetting/GetDetails';
import { connectionReducer } from 'src/slices/AccountSetting/MailConnection';
import { updateDetailsReducer } from 'src/slices/AccountSetting/UpdateDetails';
import { attachToTicketReducer } from 'src/slices/Annonymous/AttachToTicket';
import { addTicketsReducer } from 'src/slices/Annonymous/CreateNewTicket';
import { deleteAnonymousTicketsReducer } from 'src/slices/Annonymous/DeleteList';
import { anonymousTicketsReducer } from 'src/slices/Annonymous/TabelList';
import { resetPasswordReducer } from 'src/slices/ChangePassword';
import { createClientAdminReducer } from 'src/slices/ClientAdmin/CreateClientAdmin';
import { deleteClientAdminReducer } from 'src/slices/ClientAdmin/DeleteClientAdmin';
import { updateClientAdminReducer } from 'src/slices/ClientAdmin/EditClientAdmin';
import { clientAdminReducer } from 'src/slices/ClientAdmin/GetClientAdmin';
import { lamiOverviewDetailsReducer } from 'src/slices/ClientAdmin/SpPieChart';
import { adminReducer } from 'src/slices/ClientList';
import { graphReducer } from 'src/slices/CourierDashboard/AssignVsComp';
import { pdfReducer } from 'src/slices/CourierDashboard/CourierAccepted';
import { courierDetailsReducer } from 'src/slices/CourierDashboard/CourierDetails';
import { courierTicketReducer } from 'src/slices/CourierDashboard/CourierList';
import { deniedPdfReducer } from 'src/slices/CourierDashboard/CustomerDenied';
import { ticketSummaryReducer } from 'src/slices/CourierDashboard/GetCardsNo';
import { ticketOpenedReducer } from 'src/slices/CourierDashboard/OpenTickets';
import { graphSecondReducer } from 'src/slices/CourierDashboard/PieValue';
import { returnToLamiReducer } from 'src/slices/CourierDashboard/ReturnTo';
import { customerEmailReducer } from 'src/slices/CustomerContact/CustomerEmail';
import { linkStatusReducer } from 'src/slices/CustomerContact/LinkStatus';
import { newTicketDetailsReducer } from 'src/slices/CustomerContact/LinkTicketDetails';
import { createDepoAdminReducer } from 'src/slices/DepoClient/CreateDepoClient';
import deleteDepoAdminReducer from 'src/slices/DepoClient/DeleteDepoClient';
import { depoOverviewDetailsReducer } from 'src/slices/DepoClient/DepoPieChart';
import { updateDepoAdminReducer } from 'src/slices/DepoClient/EditDepoCLient';
import { depoAdminReducer } from 'src/slices/DepoClient/GetDepoClient';
import { languagesReducer } from 'src/slices/GetLanguage';
import insuranceReducer from 'src/slices/Insurance';
import insuranceAmountReducer from 'src/slices/InsuranceAmount';
import invoiceListReducer from 'src/slices/InvoiceList';
import { createCourierReducer } from 'src/slices/LaMiCourierList/CourierCreate';
import { deleteCourierReducer } from 'src/slices/LaMiCourierList/CourierDelete';
import { courierReducer } from 'src/slices/LaMiCourierList/CourierGet';
import { generatePasswordReducer } from 'src/slices/LaMiCourierList/GeneratePassword';
import { offsetCourierReducer } from 'src/slices/LaMiCourierList/OffsetCreate';
import { ticketAmountReducer } from 'src/slices/LaMiCourierList/PaymentHostory';
import { dashboardAnonymousTableReducer } from 'src/slices/LamiDashboard/Anonymous';
import { dashboardTicketCourierReducer } from 'src/slices/LamiDashboard/CourierData';
import { returnTicketReducer } from 'src/slices/LamiDashboard/GetReturnLoco';
import { graph1Reducer } from 'src/slices/LamiDashboard/Graph1';
import { dashboardCardReducer } from 'src/slices/LamiDashboard/LamiCards';
import { dashboardTicketTableReducer } from 'src/slices/LamiDashboard/LamiTicketTable';
import { graph2Reducer } from 'src/slices/LamiDashboard/OpenVsComp';
import { graph3Reducer } from 'src/slices/LamiDashboard/PieGraph';
import { mailReducer } from 'src/slices/Mail';
import { subscriptionApproveReducer } from 'src/slices/Plans/ApprovePlan';
import { createSubscriptionReducer } from 'src/slices/Plans/BuyPlans';
import { subscriptionPlansReducer } from 'src/slices/Plans/GetPlans';
import { detailsSubscriptionReducer } from 'src/slices/Plans/PlanDetails';
import { subscriptionRequestReducer } from 'src/slices/Plans/SubscriptionReq';
import { courierServiceReducer } from 'src/slices/ServiceCourier/CreateServiceCourier';
import { updateCourierReducer } from 'src/slices/ServiceCourier/EditServiceCourier';
import { getCourierReducer } from 'src/slices/ServiceCourier/GetServiceCouriers';
import { registerReducer } from 'src/slices/ServiceInviter/EmailInvite';
import { otpReducer } from 'src/slices/ServiceInviter/GenerateOtp';
import { invitationsReducer } from 'src/slices/ServiceInviter/GetInviteList';
import { resendInvitationReducer } from 'src/slices/ServiceInviter/Re-sendInvite';
import { registrationReducer } from 'src/slices/ServiceInviter/RegisterInvite';
import { registerUploadReducer } from 'src/slices/ServiceInviter/UploadExcelInvite';
import { assignCourierReducer } from 'src/slices/Ticket/AssignCourier';
import { invoiceReducer } from 'src/slices/Ticket/AttachInvoice';
import { changeCourierReducer } from 'src/slices/Ticket/ChangeCourier';
import { claimInsuranceReducer } from 'src/slices/Ticket/ClaimInsuarance';
import { courierHistoryReducer } from 'src/slices/Ticket/CourierHistory';
import { courierHistoryDetailsReducer } from 'src/slices/Ticket/CourierHistoryDetails';
import { postDeniedPdfReducer } from 'src/slices/Ticket/EditDeniedDesc';
import { ticketUpdateReducer } from 'src/slices/Ticket/EditDetails';
import { insuranceUpdateReducer } from 'src/slices/Ticket/EditInsuranceDetails';
import { invoiceUpdateReducer } from 'src/slices/Ticket/EditInvoiceDetails';
import { uniqueTicketReducer } from 'src/slices/Ticket/EmailList';
import { updateTicketEmailReducer } from 'src/slices/Ticket/EmailStatusReader';
import attachmentReducer from 'src/slices/Ticket/FileTransfer';
import { ticketFinalReducer } from 'src/slices/Ticket/Finalization';
import { pdfDataReducer } from 'src/slices/Ticket/GetDesc';
import { ticketReducer } from 'src/slices/Ticket/GetTicketList';
import { acceptInsuranceReducer } from 'src/slices/Ticket/InsuOk';
import { rejectInsuranceReducer } from 'src/slices/Ticket/InsuRejec';
import { noClaimReducer } from 'src/slices/Ticket/NoClaim';
import { reassignCourierReducer } from 'src/slices/Ticket/Re-AssignCourier';
import { returnToLocoReducer } from 'src/slices/Ticket/ReturnToLoco';
import { emailReducer } from 'src/slices/Ticket/SendEmail';
import { ticketDetailsReducer } from 'src/slices/Ticket/TicketDetails';
import { trackerDetailsReducer } from 'src/slices/Ticket/TicketTrackerDetails';
import { ticketTrackerReducer } from 'src/slices/Ticket/TicketTrackerList';
import { updateUserReducer } from 'src/slices/UpdateProfile';
import { userDataReducer } from 'src/slices/UserData';
import { deleteLamiAdminReducer } from 'src/slices/deleteLamiSlice';
import { lamiReducer } from 'src/slices/getLamySLice';
import { updateLamiAdminReducer } from 'src/slices/updateLaMislice';

const rootReducer = combineReducers({
    admin: adminReducer,
    lami: lamiReducer,
    deleteLamiAdmin: deleteLamiAdminReducer,
    management: updateLamiAdminReducer,
    passwordReset: resetPasswordReducer,
    userData: userDataReducer,
    courier: courierReducer,
    courierCreation: createCourierReducer,
    // courierUpdate: updateCourierReducer,
    courierDelete: deleteCourierReducer,
    userUpdate: updateUserReducer,
    tickets: ticketReducer,
    ticketDetails: ticketDetailsReducer,
    assignCourier: assignCourierReducer,
    returnToLoco: returnToLocoReducer,
    courierTickets: courierTicketReducer,
    languages: languagesReducer,
    ticketTracker: ticketTrackerReducer,
    trackerDetails: trackerDetailsReducer,
    courierDetails: courierDetailsReducer,
    returnToLami: returnToLamiReducer,
    pdf: pdfReducer,
    deniedPdf: deniedPdfReducer,
    ticketSummary: ticketSummaryReducer,
    ticketOpened: ticketOpenedReducer,
    graph: graphReducer,
    graphSecond: graphSecondReducer,
    dashboardCard: dashboardCardReducer,
    dashboardTicketTable: dashboardTicketTableReducer,
    dashboardTicketCourier: dashboardTicketCourierReducer,
    graph2: graph2Reducer,
    graph1: graph1Reducer,
    graph3: graph3Reducer,
    returnTicket: returnTicketReducer,
    ticketFinal: ticketFinalReducer,
    accountDetails: accountDetailsReducer,
    getAccountDetails: getAccountDetailsReducer,
    updateDetails: updateDetailsReducer,
    courierHistory: courierHistoryReducer,
    connection: connectionReducer,
    dashboardAnonymousTable: dashboardAnonymousTableReducer,
    courierHistoryDetails: courierHistoryDetailsReducer,
    mail: mailReducer,
    changeCourier: changeCourierReducer,
    ticketUpdate: ticketUpdateReducer,
    uniqueTickets: uniqueTicketReducer,
    updateTicketEmail: updateTicketEmailReducer,
    anonymousTickets: anonymousTicketsReducer,
    deleteAnonymousTickets: deleteAnonymousTicketsReducer,
    attachToTicket: attachToTicketReducer,
    addTickets: addTicketsReducer,
    pdfData: pdfDataReducer,
    postDeniedPdf: postDeniedPdfReducer,
    reassignCourier: reassignCourierReducer,
    email: emailReducer,
    invoice: invoiceReducer,
    claimInsurance: claimInsuranceReducer,
    acceptInsurance: acceptInsuranceReducer,
    insuranceReject: rejectInsuranceReducer,
    insurance: insuranceReducer,
    invoiceList: invoiceListReducer,
    insuranceAmount: insuranceAmountReducer,
    invoiceUpdate: invoiceUpdateReducer,
    insuranceUpdate: insuranceUpdateReducer,
    noClaim: noClaimReducer,
    attachments: attachmentReducer,
    offsetCourier: offsetCourierReducer,
    ticketAmount: ticketAmountReducer,
    generatePassword: generatePasswordReducer,
    customerEmail: customerEmailReducer,
    linkStatus: linkStatusReducer,
    newTicketDetails: newTicketDetailsReducer,
    changeStatus: changeStatusReducer,
    register: registerReducer,
    registerUpload: registerUploadReducer,
    invitations: invitationsReducer,
    otp: otpReducer,
    resendInvitation: resendInvitationReducer,
    registration: registrationReducer,
    clientAdminCreation: createClientAdminReducer,
    clientAdminFetch: clientAdminReducer,
    deleteClientAdmin: deleteClientAdminReducer,
    updateClientAdmin: updateClientAdminReducer,
    depoAdminCreation: createDepoAdminReducer,
    depoAdmin: depoAdminReducer,
    deleteDepoAdmin: deleteDepoAdminReducer,
    updateDepoAdmin: updateDepoAdminReducer,
    courierService: courierServiceReducer,
    getCouriers: getCourierReducer,
    updateCourier: updateCourierReducer,
    lamiOverviewDetails: lamiOverviewDetailsReducer,
    depoOverviewDetails: depoOverviewDetailsReducer,
    subscription: subscriptionPlansReducer,
    createSubscription: createSubscriptionReducer,
    detailsSubscription: detailsSubscriptionReducer,
    subscriptionRequest: subscriptionRequestReducer,
    subscriptionApprove: subscriptionApproveReducer,
    subscriptionReject:subscriptionRequestReducer,



});


export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
