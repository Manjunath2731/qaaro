// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const translationEN = {
  //Sidebar

  dashboard: "DASHBOARD",
  courier: "COURIER",
  miscellaneous: "MISCELLANEOUS",
  locoInvoiceList: "LOCO Invoice List",
  insuaranceList: "Insurance  List",




  //NAVBAR and four cards
  delayed: "Delayed",
  delayedOpen: "Delayed (OPEN)",

  total: "Total",
  justified: "JUSTIFIED",
  denied: "DENIED",
  return: "Return",
  NoTicketsAvailable: "No Tickets Available",

  connected: "Connected",
  disconnected: "Disconnected",
  german: "Deutsch",
  changePassword: "Change Password",
  myProfile: "My Profile",
  accountSetting: "Account Settings",
  signOut: "Sign Out",
  open: "Open",
  onTime: "OnTime",
  completion: "Completion",
  lost: "Lost",
  value: "Value",
  active: "Active",
  couriers: "Couriers",
  synchronize: "Synchronize E-mail",

  //Pie chart
  ticketDistributionByValue: "Ticket Distribution By Value",
  pending: "Pending",
  success: "Success",
  totalValue: "Total Value",

  //
  courierTracker: "Courier Tracker",
  returned: "Returned",
  newTickets: "New Tickets",

  //
  complainNumber: "Complain Number",
  packageNumber: "PACKAGE NUMBER",
  amountInDispute: "Amount",
  deadLineDate: "Deadline Date",
  actions: "ACTIONS",

  allStatus: "Status",
  searchByComplainNumber: "Complain Number",
  ticketList: "Ticket List",

  claimType: "Claim Type",
  importDate: "IMPORT DATE",
  courierName: "COURIER",

  viewDetails: "View Details",
  returnToLoco: "Return To Loco",
  assignCourier: "Assign Courier",

  ticketTracker: "Ticket Tracker",
  nameOrPhone: "Name or Phone",
  courierList: "Courier List",
  delete: "Delete",
  edit: "Edit",

  courierHistory: "Courier History",

  completed: "Completed",
  lostValue: "Lost Value",
  hrs24: "24 hrs",
  hrs48: "48 hrs",
  dueInDays: "Due in 3 days",
  netLost: "Net Lost:",
  setOffset: "Set Offset",
  ticketsbyValue: "Tickets by Value",

  ticketbyCount: "Tickets by Count",
  returnedBySelf: "Returned by Self",
  customerAccepted: "Customer Accepted",

  customerDenied: "Customer Denied",
  annonymousMails: "Annonymous Mails",
  attachToTicket: "Attach To Ticket",
  createNewTicket: "Create New Ticket",
  importDate: "Import Date",
  emailRecieved: "E-mail Recieved",
  attachmentsAvailable: "Attachments Available",
  noUplaodedDocumentsAvailable: "No uploaded Documents Available",

  //courierselection pop-up
  selectCourier: "Select Your Courier",
  profile: "PROFILE",
  select: "SELECT",
  description: "DESCRIPTION",
  enterDesc: "Enter Description",
  reAssign: "Re-Assign",


  //ReturnTolOCO

  to: "To:",
  cc: "CC:",
  bcc: "BCC:",
  returnToLoco: "Return To LOCO",
  subject: "Subject:",
  emailMessage: "E-mail Message:",
  returnDesc: "Return Description:",
  returnDescription: "Return Description",
  attachments: "Attachments",
  addMoreFiles: "Add More Files:",
  emailSignature: "E-mail Signature:",
  maximum5FilesAllowed: "Maximum 5 Files Allowed",

  noAttachAvailable: "No Attachment Available",




  //TicketDetails

  disputeAmount: "Dispute Amount",
  assign: "Assign",
  noCourier: "No Courier",
  ticketDetails: "Ticket Details",
  sendEmail: "Send E-mail",
  emailsRecieved: "E-mails Recieved",
  emailsSent: "E-mails Sent",
  mailAttachments: "E-mails Attachments",
  close: "Close",
  attach: "Attach",
  emailView: "E-Mail View",

  packageDetails: "Package Details",
  uploadedDocuments: "Uploaded Documents",
  document: "Uploaded Documents",

  noUploadedDocAvailable: "No Uploaded Document Available",
  returnDesc: "Return Description",
  courierReturnDesc: "Courier Return Description",
  lamiReturnDesc: "LaMi Return Description",
  dpdTicketNumber: "DPD Ticket Number",
  dpdReferenceNumber: "DPD Reference Number",
  problem: "Problem",
  address: "Address",
  item: "Item",
  category: "Category",
  manufacture: "Manufacture",
  article: "Article",
  furtherInformation: "Further Information",
  serialNumber: "Serial Number",
  remove: "Remove",
  reassignToCourier: "Re-Assign To Courier",
  selectAction: "Select Action",
  sentDate: "SENT DATE",
  parcelLabelAddress: "Parcel Label Address",
  parcelLabel: "Parcel Label Address",
  recipent: "Recipent Address",
  recipentAddress: "Recipent Address",
  pleaseProvideBelowDetails: "Please provide below details",
  cancel: "Cancel",
  send: "Send",
  required: "Required",
  locoSuccessLost: "Mark Success or Lost",
  overDue: "Over Due",
  upcoming: "upcoming",


  //Attach Invoice
  invoice: "Invoice",
  invoicedAttachments: "Invoiced Attachments",
  emailHeaderNumber: "E-mail Header Number",
  dPDInvoiceNumber: "DPD Invoice Number",
  invoiceDate: "Invoice Date",
  finalLostValue: "Final Lost Value",
  noteIfAny: "Note (If Any)",
  uploadInvoiceAttachment: "Upload Invoice Attachment",
  previousAttachments: "Previous Attachments",
  signedDocuments: "Signed Documents",


  //claimInsurance
  claimInsu: "Claim Insurance",
  noInsurance: "No Insurance",


  //Approve Insu
  insuApprove: "Approve Insurance",
  insuranceClaimNumber: "Insurance Claim Number:",
  insuranceOurSign: "Insurance Our Sign:",
  insuranceDate: "Insurance Date:",
  claimAmount: "Claim Amount:",
  deductibleAmount: "Deductible Amount:",
  compensatationAmount: "Compensation Amount:",
  insuReject: "Reject Insurance",
  note: "Notes",


  //createCourier
  create: "Create",
  phone: "Phone No.",
  state: "State",
  zipCode: "Zip-Code",
  inactive: "Inactive",

  //Offset-FOrm & Pannel
  offsetForm: "Offset Form",
  paidAmount: "Paid Amount",
  lostValueDetails: "Lost Value Details",
  offsetDetails: "Offset Details",
  offset: "Offset",



  //InsuranceList
  insuranceList: "Insurance List",
  claimNumber: "Claim Number",
  ourSign: "Our Sign",
  date: "Date",
  claim: "Claim",
  deductible: "Deductible",
  compensation: "Compensation",
  totalClaim: "Total Claim",
  totalDeductible: "Total Deductible",
  totalCompenstation: "Total Compensation",
  insurance: "Insurance",


  //InvoiceList
  locoInvoiceList: "Invoice List",

  //AccountSettings
  emailUser: "Email User",
  emailPassword: "Email Password",
  emailHost: "Email Host",
  emailPort: "Email Port",
  connectionTestedSuccessfully: "Connection Tested Successfully",
  change: "Change",
  emailTemplate: "Email Template",
  uplaodEmailSign: "Upload Email Signature",
  update: "Update",


  // Chnage pASSWORF
  currentPassword: "Current Password",
  newPassword: "New Password",
  confirmNewPassword: "Confirm New Password",
  save: "Save",
  confirmationNeeded: "Confirmation  Needed",
  yes: "Yes",
  no: "No",

  enteruremail:"Enter Your Email",
  contactCustomer:"Contact Customer",






};













// German translations
const translationDE = {
  //sidebar
  courier: "KURIERE",
  miscellaneous: "ERWEITERT",
  locoInvoiceList: "LOCO Rechnungen",
  insuaranceList: "Versicherung",




  //NAVBAR and four cards

  delayed: "VERSPÄTETE",
  delayedOpen: "VERSPÄTETE OFFENE",
  NoTicketsAvailable: "Keine Tickets vorhanden",

  return: "Zurück",

  total: "Gesamt",
  justified: "BESTÄTIGTE",
  denied: "VERWEIGERTE",

  connected: "Verbunden",
  disconnected: "Getrennt",
  german: "Deutsch",
  changePassword: "Passwort ändern",
  myProfile: "Mein Profil",
  accountSetting: "Konto Einstellungen",
  signOut: "Abmelden",
  open: "Offene",
  onTime: "RECHTZEITIGE",
  completion: "FERTIGSTELLUNG",
  lost: "Verloren",
  value: "Wert",
  active: "Aktive",
  couriers: "KURIERE",
  synchronize: "E-Mail synchronisieren",

  //Pie chart
  ticketDistributionByValue: "Ticketverteilung nach Wert",
  pending: "Ausstehend",
  success: "Erfolg",
  totalValue: "Gesamtwert",

  //
  courierTracker: "Kurier Status",
  returned: "zurückkehren",
  newTickets: "Neu Tickets",

  //
  complainNumber: "Beschwerdenummer",
  packageNumber: "Paketnummer",
  amountInDispute: "Menge",
  deadLineDate: "Frist",
  actions: "AKTIONEN",
  allStatus: "AKTIONEN",
  searchByComplainNumber: "BESCHWERDENUMMER",

  ticketList: "Ticket Aufführen",
  claimType: "Anspruchsart",
  importDate: "Anspruchsart",

  courierName: "Kurier",




  viewDetails: "Details anzeigen",
  returnToLoco: "Zurückkehren zu",
  assignCourier: "Kurier zuweisen",


  ticketTracker: "Ticket Status",
  nameOrPhone: "Name or Telefon-Nr.",

  courierList: "Kurier",
  delete: "Löschen",
  edit: "Bearbeiten",
  courierHistory: "Kurier Status",
  completed: "ABGESCHLOSSENE",
  lostValue: "zum Verlust ",
  hrs24: "24 Stunden",
  hrs48: "48 Stunden",
  dueInDays: "Fällig in 3 Tagen",
  netLost: "Netto Verlust:",
  setOffset: "Verrechnung",
  ticketsbyValue: "Tickets nach Wert",

  ticketbyCount: "Tickets nach Anzahl",
  returnedBySelf: "Direkt Rückgabe von Kurier",
  customerAccepted: "Kunde akzeptiert",

  customerDenied: "Kunde lehnt ab",
  annonymousMails: "Anonyme Mails",

  attachToTicket: "Anhängen an Ticket",

  createNewTicket: "Erstelle neu Ticket",
  importDate: "Importdatum",
  emailRecieved: "E-mail erhalten",
  attachmentsAvailable: "Anhänge verfügbar",
  noUplaodedDocumentsAvailable: "Keine hochgeladenen Dokumente verfügbar",



  //courierselection pop-up
  selectCourier: "Kurier auswählen",
  profile: "PROFIL",
  select: "AUSWÄHLEN",
  description: "BESCHREIBUNG",
  enterDesc: "Erklärung eingeben",
  reAssign: "Erneut zuweisen",





  //ReturnTolOCO

  to: "An:",
  cc: "CC:",
  bcc: "BCC:",
  returnToLoco: "Zurück zu LOCO",
  subject: "Betreff:",
  emailMessage: "E-mail Nachricht:",
  returnDesc: "Zurück Beschreibung:",
  attachments: "Anhänge",
  addMoreFiles: "Weitere Dateien hinzufügen: ",
  emailSignature: "E-mail Signatur:",
  noAttachAvailable: "Keine Anhänge verfügbar",
  maximum5FilesAllowed: "Maximal 5 Dateien zulässig",

  //TicketDetails

  disputeAmount: "Streitwert",
  assign: "zuweisen",
  noCourier: "Kein Kurier",
  ticketDetails: "Ticketdetails",
  sendEmail: "E-Mail senden",
  emailsRecieved: "E-Mails erhalten",
  emailsSent: "E-Mails gesendet",
  mailAttachments: "E-Mail-Anhänge",
  close: "Schließen",
  attach: "Hinzufügen",
  emailView: "E-Mail-Ansicht",
  packageDetails: "Paketdetails",
  uploadedDocuments: "Hochgeladenen Dokumente",
  document: "Dokumente",
  noUploadedDocAvailable: "Keine hochgeladenen Dokumente verfügbar",
  returnDesc: "Erklärung des",
  returnDescription: "Erklärung des",

  courierReturnDesc: "Erklärung des Kuriers",
  lamiReturnDesc: "Erklärung des LaMi",
  dpdTicketNumber: "DPD Ticket Nummer",
  dpdReferenceNumber: "DPD Referenznummer",
  problem: "Problem",

  address: "Addresse",
  item: "Artikel",
  category: "Kategorie",
  manufacture: "Hersteller",
  article: "Artikel",
  furtherInformation: "Weitere Informationen",
  serialNumber: "Seriennummer",
  remove: "Entfernen",
  reassignToCourier: "Erklärung  Kuriers",
  selectAction: "Aktion auswählen",
  sentDate: "SENDEDATUM",
  parcelLabelAddress: "Adresse des Paketaufklebers",
  parcelLabel: "des Paketaufklebers",
  recipent: "Empfängers",

  recipentAddress: "Adresse des Empfängers",
  pleaseProvideBelowDetails: "Bitte geben Sie folgende Einzelheiten an",
  cancel: "Abbrechen",
  send: "senden",
  required: "Erforderlich",
  locoSuccessLost: "Markiere Erfolg/Verlust",
  overDue: "Fällig",
  upcoming: "Bevorstehend",



  //Attach Invoice
  invoice: "Rechnungsdetails",
  invoicedAttachments: "Rechnungsanhänge",
  emailHeaderNumber: "E-Mail-Betreffnummer",
  dPDInvoiceNumber: "Depot-Rechnungsnummer",
  invoiceDate: "Rechnungsdatum",
  finalLostValue: "Endgültiger Verlustwert",
  noteIfAny: "Hinweis (falls vorhanden)",
  uploadInvoiceAttachment: "Rechnungsdatei hochladen",
  previousAttachments: "Vorherige Anhänge",
  signedDocuments: "Unterschriebene Dokumente",




  //claimInsurance
  claimInsu: "Versicherungsanspruch geltend machen",
  noInsurance: "Keine Versicherung",
  insurance: "Versicherung",



  //Approve Insu
  insuApprove: "Versicherung genehmigt:",
  insuranceClaimNumber: "Vers. Anspruchsnummer::",
  insuranceOurSign: "Vers. Unser Zeichen:",
  insuranceDate: "Vers. Datum:",
  claimAmount: "Vers. Anspruchsbetrag:",
  deductibleAmount: "Vers. Selbstbeteiligung:",
  compensatationAmount: "Vers. Auszahlungsbetrag:",
  insuReject: "Versicherung Abgelehnt",
  note: "Hinweise",


  //createCourier
  create: "Erstellen",
  phone: "Telefon-Nr.",
  state: "Zustand",
  zipCode: "PLZ",
  inactive: "Inaktiv",


  //Offset-FOrm & Pannel
  offsetForm: "Verrechnung Formular",
  paidAmount: "Erhaltener Betrag",
  lostValueDetails: "Details zum Verlust",
  offsetDetails: "Details zur Verrechnung",
  offset: "Verrechnung",





  //InsuranceList
  insuranceList: "Versicherung Übersicht",
  claimNumber: "Anspruchsnummer",
  ourSign: "Externe Ticketnummer der Versicherung",
  date: "Datum",
  claim: "Anspruchs",
  deductible: "Selbstbehalt",
  compensation: "Compensation",
  totalClaim: "Gesamtanspruch",
  totalDeductible: "Gesamter Selbstbehalt",
  totalCompenstation: "Gesamtvergütung",

  //InvoiceList
  locoInvoiceList: "Rechnungs",



  //AccountSettings
  emailUser: "E-Mail Benutzer",
  emailPassword: "E-Mail Passwort",
  emailHost: "E-Mail Host",
  emailPort: "E-Mail Port",
  connectionTestedSuccessfully: " Verbindung erfolgreich getestet",
  change: "Ändern",
  emailTemplate: " E-Mail-Vorlage",
  uplaodEmailSign: "E-Mail-Signatur hochladen",
  update: "Aktualisieren",


  // Chnage pASSWORF
  currentPassword: "Aktuelles Passwort",
  newPassword: "Neues Passwort",
  confirmNewPassword: "Neues Passwort bestätigen",
  save: "Speichern",
  confirmationNeeded: "Bestätigung erforderlich",
  yes: "Ja",
  no: "Nein",


  enteruremail:"Geben sie ihre E-Mail Adresse ein",
  contactCustomer:"Kunden kontaktieren",



};

// Initialize i18next
i18n
  .use(LanguageDetector) // Detect user's language
  .use(initReactI18next) // Initialize react-i18next
  .init({
    resources: {
      en: {
        translation: translationEN, // English translations
      },
      de: {
        translation: translationDE, // German translations
      },
    },
    fallbackLng: 'en', // Fallback language if translation file for detected language is not available
    debug: true, // Enable debug mode
    interpolation: {
      escapeValue: false, // React already safely escapes interpolated values
    },
  });

export default i18n;
