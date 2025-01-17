export const getTranslations = async (language: string): Promise<{ [key: string]: string }> => {
    const translations: { [key: string]: { [key: string]: string } } = {
        en: {
            //Account Credentials
            subject: "Account credentials",
            welcome_message: "Welcome to QAARO",
            greeting: "Hello",
            registration_success: "Your registration with QAARO is successfully completed. Please use the following credentials to access the application. Please change your password after logging in.",
            user_id: "User ID",
            password: "Password",
            contact_support: "For any technical queries, please contact QAARO Customer Support.",

            //New Password
            new_pwd_subject: "New Password",
            new_pwd_greeting: "Hello",
            new_pwd_message: "Your new password request has been processed successfully. Please change your password after logging in.",
            new_pwd_password: "Your new password is",
            new_pwd_contact_support: "If you have not made this change, please contact QAARO Customer Service immediately.",

            //Contact Customer
            contact_subject: "Customer’s acknowledgement of receipt",
            contact_welcome_message: "Dear Customer,",
            contact_message: "Please click on the link below to access the Acknowledgement of Receipt form. Please enter the required information and sign the form directly on your smartphone or tablet. Finally, please review your details and submit the form to complete the process.",
            contact_button: "Open Form",
            contact_gratitude: "Thank you!",
            contact_best_regards: "Best regards",
            contact_team: "Your customer service team",

            //Invite
            invite_subject: "You're Invited!",
            invite_greeting: "Hello",
            invite_welcome_message: "We are excited to invite you to join our platform. Click the button below to accept your invitation and register:",
            invite_button: "Accept Invitation",
            invite_quary: "If you have any questions, feel free to reach out to us.",
            invite_vote_of_thanks: "Thank you!",
            invite_company_name: "© 2024 QAARO. All rights reserved",

            //Otp
            otp_subject: "Your OTP Code",
            otp_greeting: "Welcome to QAARO Platform",
            otp_welcome: "Dear Customer,",
            otp_welcomeline_code: "Your OTP code for registration is:",
            otp_conclusion: "Please use this code to complete your registration with QAARO Platform. If you did not request this code, please ignore this email",
            otp_vote_of_thanks: "Thank you for choosing us for your logistics needs!",
            otp_company: "© 2024 QAARO Platform"

        },
        de: {
            //Account Credentials
            subject: "Kontozugangsdaten",
            welcome_message: "Willkommen bei QAARO",
            greeting: "Hallo",
            registration_success: "Ihre Registrierung bei QAARO ist erfolgreich abgeschlossen. Bitte verwenden Sie folgende Anmeldeinformationen, um auf die Anwendung zuzugreifen. Bitte ändern Sie Ihr Passwort nach dem Einloggen.",
            user_id: "Benutzer-ID",
            password: "Passwort",
            contact_support: "Bei technischen Fragen wenden Sie sich bitte an den QAARO-Kundendienst.",

            //New Password
            new_pwd_subject: "Neues Passwort",
            new_pwd_greeting: "Hallo",
            new_pwd_message: "Ihre neue Passwortanforderung wurde erfolgreich verarbeitet. Bitte ändern Sie Ihr Passwort nach dem Einloggen.",
            new_pwd_password: "Ihr neues Passwort lautet",
            new_pwd_contact_support: "Wenn Sie diese Änderung nicht getätigt haben, wenden Sie sich bitte umgehend an den QAARO-Kundendienst.",

            //Contact Customer
            contact_subject: "Empfangsbestätigung des Kunden",
            contact_welcome_message: "Sehr geehrter Kunde,",
            contact_message: "Bitte klicken Sie auf den untenstehenden Link, um auf das Formular Empfangsbestätigung zuzugreifen. Bitte fügen Sie die erforderlichen Informationen ein und unterschreiben das Formular direkt auf Ihrem Smartphone oder Tablet. Zuletzt überprüfen Sie bitte Ihre Angaben und senden das Formular ab, um den Vorgang abzuschließen.",
            contact_button: "Formular öffnen",
            contact_gratitude: "Vielen Dank!",
            contact_best_regards: "Mit freundlichen Grüßen",
            contact_team: "Ihr Kundenservice-Team",

            //Invite
            invite_subject: "Sie sind eingeladen!",
            invite_greeting: "Hallo",
            invite_welcome_message: "Wir freuen uns, Sie einzuladen, unserer Plattform beizutreten. Klicken Sie auf die Schaltfläche unten, um Ihre Einladung anzunehmen und sich zu registrieren:",
            invite_button: "Einladung annehmen",
            invite_quary: "Wenn Sie Fragen haben, können Sie sich gerne an uns wenden.",
            invite_vote_of_thanks: "Vielen Dank!",
            invite_company_name: "© 2024 QAARO. Alle Rechte vorbehalten",

            //Otp
            otp_subject: "Ihr OTP-Code",
            otp_greeting: "Willkommen bei der QAARO-Plattform",
            otp_welcome: "Sehr geehrter Kunde,",
            otp_welcomeline_code: "Ihr OTP-Code für die Registrierung lautet:",
            otp_conclusion: "Bitte verwenden Sie diesen Code, um Ihre Registrierung bei der QAARO-Plattform abzuschließen. Wenn Sie diesen Code nicht angefordert haben, ignorieren Sie bitte diese E-Mail.",
            otp_vote_of_thanks: "Vielen Dank, dass Sie sich für uns für Ihre Logistikbedürfnisse entschieden haben!",
            otp_company: "© 2024 QAARO Plattform"
        }
    };

    return translations[language] || translations['en'];
};
