let imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const _ = require('lodash');
const AWS = require('aws-sdk');
const path = require('path');
const uuid = require('uuid');
const Ticket = require('./../../models/tickets/tickets.model');
const { LamiAccountModel } = require('./../../models/LamiAccount.model');
const LocoEmailModel = require('./../../models/locoEmail.model');
const TicketAudit = require('./../../models/tickets/ticketsaudit.model');
const LamiLogModel = require('./../../models/lamilog.model');
const mongoose = require('mongoose');
const AnonymousMailModel = require('./../../models/tickets/ticketAnnonyous.model');
const { JSDOM } = require('jsdom');

async function processMail(lamilist) {
    console.log("lami list....", lamilist)
    // Map over the lamilist asynchronously
    const promises = lamilist.map(async lami => {
        await LamiAccountModel.findByIdAndUpdate({ _id: lami._id }, { lastRun: new Date().toISOString() }, { new: true })

        const config = {
            imap: {
                user: lami.emailServer.user,
                password: lami.emailServer.password,
                host: lami.emailServer.host,
                port: lami.emailServer.port,
                tls: true,
                tlsOptions: { rejectUnauthorized: false }, // This line bypasses the certificate validation
                authTimeout: 10000
            }
        };


        try {


            let emails = [];
            let files = [];
            const uploadPromises = [];
            const uploadPromisesforAnms = [];


            // var delay = 5 * 3600 * 1000; // 5 hours in milliseconds
            var last_run = new Date(lami.lastRun).toISOString();
            imaps.connect(config).then(function (connection) {
                return connection.openBox('INBOX').then(function () {
                    var searchCriteria = ['ALL', ['SINCE', last_run]];
                    // var searchCriteria = ['ALL'];
                    var fetchOptions = {
                        bodies: ['HEADER', 'TEXT', ''],
                    };
                    return connection.search(searchCriteria, fetchOptions).then(function (messages) {
                        var promises = messages.map(function (item) {
                            return new Promise(function (resolve, reject) {
                                var all = _.find(item.parts, { "which": "" })
                                var id = item.attributes.uid;
                                var idHeader = "Imap-Id: " + id + "\r\n";

                                simpleParser(idHeader + all.body, (err, mail) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        // console.log('itemmmmmm maillllllll', mail.html)
                                        // console.log('itemmmmmm maillllllll',mail.headerLines)

                                        if (new Date(lami.lastRun) < new Date(mail.date)) {
                                            let maildata = { sub: mail.subject, attachments: mail.attachments }
                                            let html = `
                                            <!DOCTYPE html>
                                            <html lang="en">
                                            <head>
                                                <meta charset="UTF-8">
                                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                <title>Mail</title>
                                                <style>
                                                    body {
                                                        min-width: 100;
                                                        font-family: Arial, Helvetica, sans-serif;
                                                        font-size: 16px;
                                                        line-height: 1.5;
                                                        color: #222222;
                                                    }
                                                    .message {
                                                        white-space: pre-line;
                                                    }
                                                    p {
                                                        color: #000000;
                                                    }
                                                </style>
                                            </head>
                                            <body>
                                                <div class="container">
                                            
                                                </div>
                                            </body>
                                            </html>
                                            `;

                                            const dom = new JSDOM(html);
                                            const document = dom.window.document;

                                            // Array of text content for the new <p> elements
                                            const newParagraphsText = [
                                                `Subject: ${mail?.subject}`,
                                                `From: ${mail?.from?.value[0]?.address}`,
                                                `To: ${mail?.to?.value[0]?.address}`,
                                                `Cc: ${mail?.cc == undefined ? '[ ]' : mail?.cc?.value?.address}`,
                                                `Bcc: ${mail?.bcc == undefined ? '[ ]' : mail?.bcc?.value?.address}`
                                            ];

                                            // Append each new <p> element to the container div
                                            const container = document.querySelector('.container');
                                            if (container) {
                                                newParagraphsText.forEach(text => {
                                                    const newParagraph = document.createElement('p');
                                                    newParagraph.textContent = text;
                                                    container.appendChild(newParagraph);
                                                });
                                            }

                                            // Serialize the document back to a string
                                            const updatedHTML = dom.serialize();

                                            // Output the updated HTML

                                            console.log("updatedhtmll.....", updatedHTML);
                                            console.log("nhtmllll.....", mail.html);


                                            emails.push({
                                                sub: mail.subject,
                                                body: mail.html,
                                                attachments: maildata,
                                                date: mail.date,
                                                bcc: mail?.bcc?.value?.address,
                                                cc: mail?.cc?.value?.address,
                                                to: mail?.to?.value?.address,
                                                from: mail?.from?.value?.address,
                                                headerhtml: updatedHTML
                                            });
                                        }

                                        // files.push(maildata)
                                        resolve();
                                    }
                                });
                            });
                        });

                        // Wait for all promises to resolve
                        return Promise.all(promises);
                    });
                });
            }).then(function () {
                // Send the response after all emails are fetched
                console.log(" ")
                console.log(" ")
                console.log(" ")
                console.log("Email box connected......", config?.imap?.user)
                nextProgram();


                function parseStringToObject(dataString, body, file, date, headerhtml) {
                    let attachments_file = [];
                    if (file?.attachments?.length > 0) {

                        file?.attachments?.forEach(element => {


                            const fileExtension = path.extname(element.filename);
                            const fileName = uuid.v4();

                            const s3 = new AWS.S3();

                            // Define parameters

                            const params = {
                                Bucket: 'logistic-email-service',
                                Key: `${Date.parse(date)}/${file.sub}/${element.filename}`,
                                Body: Buffer.from(element?.content), // Your file[0] data
                                ContentType: element?.contentType,
                                ContentDisposition: 'inline',
                                ContentId: element?.contentId,
                                Metadata: {
                                    'partId': element?.partId,
                                    'checksum': element?.checksum,
                                    'size': element?.size.toString()
                                    // Add other metadata if needed
                                }
                            };

                            // Upload to S3
                            const uploadPromise = new Promise((resolve, reject) => {
                                // Upload to S3
                                s3.upload(params, (err, data) => {
                                    if (err) {
                                        console.error("Error uploading file to S3:", err);
                                        reject(err);
                                    } else {

                                        attachments_file.push(data.Location);
                                        resolve(data);
                                    }
                                });
                            });

                            uploadPromises.push(uploadPromise);

                        });

                    }

                    // Define regular expression to extract key-value pairs
                    var regex = /(?:\[([^]+?)\])?\s*[-–]\s*(\w+(?:\s\w+)*)\s*([^]+)/g;
                    var match;
                    var dataObject = {};
                    var packageDetails = {};
                    var locoDetails = {};

                    var parcelAdd = {};
                    var recepentAdd = {};

                    var m2 = body.match(/\b\d{14}\b/);
                    var packageNo = m2 ? m2[0] : null;
                    // console.log("bodyyy", body)


                    var pattern = /ClaimArt:\s*([^<]+)<br>/;
                    var m3 = body.match(pattern);
                    var claimArtWords = null;
                    if (m3) {
                        claimArtWords = m3[1]?.trim();
                    }


                    var pattern2 = /Problem:\s*([^<]+)<br>/;
                    var m4 = body.match(pattern2);
                    var problem = m4 ? m4[1]?.trim() : null;


                    var pattern3 = /Streitwert:\s*([^<]*)/;
                    var m5 = body.match(pattern3);
                    var Streitwert = "";
                    if (m5 && m5?.length > 1) {
                        Streitwert = m5[1]?.trim();
                    }

                    var numberPattern = /\d+,\d+/;
                    var extractedNumber = Streitwert.match(numberPattern);
                    let numberWithDot;
                    if (extractedNumber) {
                        numberWithDot = extractedNumber[0]?.replace(',', '.');

                    } else {
                        numberWithDot = numberWithDot == undefined ? 0 : numberWithDot
                    }
                    // console.log("num ", numberWithDot)


                    var pattern4 = /DPD Referenz:\s*([^<]*)<\/b>/;
                    var m6 = body.match(pattern4);
                    //  console.log('m5',m5)
                    // Extract the text after "DPD Referenz:" and before the <br> tag
                    var dpdReferenzText = "";
                    if (m6 && m6?.length > 1) {
                        dpdReferenzText = m6[1]?.trim();
                    }

                    var pattern5 = /Pos:\s*([^<]+)<br>/;
                    var m7 = body.match(pattern5);
                    var item = m7 ? m7[1]?.trim() : null;


                    var pattern6 = /Kategorie:\s*([^<]+)<br>/;
                    var m8 = body.match(pattern6);
                    var category = m8 ? m8[1]?.trim() : null;

                    var pattern7 = /Anzahl:\s*([^<]+)<br>/;
                    var m9 = body.match(pattern7);
                    var amount = m9 ? m9[1]?.trim() : null;

                    var pattern8 = /Hersteller:\s*([^<]+)<br>/;
                    var m10 = body.match(pattern8);
                    var manufacturer = m10 ? m10[1]?.trim() : "";

                    var pattern9 = /Artikel:\s*([^<]+)<br>/;
                    var m11 = body.match(pattern9);
                    var article = m11 ? m11[1]?.trim() : "";

                    var pattern10 = /Weiter Info:\s*([^<]+)<br>/;
                    var m12 = body.match(pattern10);
                    var further_info = m12 ? m12[1]?.trim() : "";

                    var pattern11 = /SerienNr:\s*([^<]+)<br>/;
                    var m13 = body.match(pattern11);
                    var serial_number = m13 ? m13[1]?.trim() : "";

                    var pattern12 = /EAN:\s*([^<]+)<br>/;
                    var m14 = body.match(pattern12);
                    var ean = m14 ? m14[1]?.trim() : "";

                    var pattern13 = /ID:\s*([^<]+)<br>/;
                    var m15 = body.match(pattern13);
                    var id = m15 ? m15[1]?.trim() : "";

                    var pattern14 = /<b>Empfängeradresse<\/b>(.*?)<b>Paketscheinadresse<\/b>/s;
                    var m16 = body.match(pattern14);
                    var recipientAddress = m16 ? m16[1]?.trim() : null;
                    recipientAddress = recipientAddress?.replace(/<[^>]+>/g, '');

                    var pattern15 = /Bitte klären Sie den Umstand bis spätestens\s*([^<]+)<br>/;
                    var m17 = body.match(pattern15);
                    var deadline = m17 ? m17[1]?.trim() : "";

                    var parts = deadline?.split(/[.\s]/);

                    var day = parseInt(parts[0], 10);
                    var month = parseInt(parts[1], 10) - 1;
                    var year = parseInt(parts[2], 10);

                    console.log("daaaaa", day, month, year, deadline)
                    // Create a new Date object
                    var deadlinedate = deadline == "" ? new Date() : new Date(year, month, day);

                    var pattern16 = /<br><br>Viele Grüße<br><b>(.*?)<\/b><br><br>/s;
                    var m18 = body.match(pattern16);
                    var loco_name = m18 ? m18[1]?.trim() : "";



                    var pattern17 = /<a href="mailto:(.*?)"/;
                    var m19 = body.match(pattern17);
                    var loco_email = m19 ? m19[1]?.trim() : "";

                    var pattern18 = /sans-serif"><br><br>(.*?)\s+\|\s+<a href="https:/;
                    var m20 = body.match(pattern18);
                    var loco_address = m20 ? m20[1]?.trim() : "";
                    // console.log("ladddd", loco_address)
                    loco_address = loco_address?.replace(/<br>/g, " ");
                    loco_address = loco_address?.replace(/<\/?[^>]+(>|$)/g, "")?.trim();


                    var pattern19 = /Reklamationsnummer:\s*([^<]+)<br>/;
                    var m21 = body.match(pattern19);
                    var ComplaintNumber = m21 ? m21[1]?.trim() : "";


                    var pattern20 = /<b>Paketscheinadresse<\/b>(.*?)<br><br>Bitte klären Sie den Umstand bis spätestens/s;
                    var m22 = body.match(pattern20);
                    // var extractedData = m22 ? m22.map(match => match?.replace(/<b>Paketscheinadresse<\/b>/, '')?.trim()) : [];
                    var parcelLabelAddress = m22 ? m22[1]?.trim() : null;
                    parcelLabelAddress = parcelLabelAddress?.replace(/<[^>]+>/g, '');

                    var pattern21 = /<br><b>Paketscheinadresse<\/b><br>(.*?)<br>/;
                    var m23 = body.match(pattern21);
                    var parcelLabelAddress_name = m23 ? m23[1]?.trim() : "";

                    var pattern22 = /<br><b>Empfängeradresse<\/b><br>(.*?)<br>/;
                    var m24 = body.match(pattern22);
                    var recipientAddress_name = m24 ? m24[1]?.trim() : "";

                    recipientAddress = recipientAddress?.replace(recipientAddress_name, '');
                    parcelLabelAddress = parcelLabelAddress?.replace(parcelLabelAddress_name, '');

                    // Iterate over matches
                    while ((match = regex.exec(dataString)) !== null) {
                        // Extract key and value
                        var key = match[2];
                        var value = match[3];
                        // If there's a matched group for [DPD TICKET #...], extract the number
                        if (match[1]) {
                            var ticketMatch = match[1].match(/#(\d+)/);
                            var comMatch = match[3].match(/D\.\d+\.\d+/);

                            var p23 = /REKLAMATIONSKLÄRUNG\s(.+)/;
                            var m25 = dataString.match(p23);

                            var complain_num = m25 ? m25[1] : "";

                            //  console.log("numbeeeerrr",complain_num,"...............")

                            if (ticketMatch) {
                                dataObject["dpdTicketNumber"] = ticketMatch[1];
                                dataObject["complainNumber"] = complain_num;
                                dataObject["packageNumber"] = packageNo;
                                dataObject["ComplaintNumberBody"] = ComplaintNumber;
                                dataObject["claimType"] = claimArtWords;
                                dataObject["problem"] = problem;
                                dataObject["amountInDispute"] = parseFloat(numberWithDot);
                                dataObject["dpdReferenceNumber"] = dpdReferenzText;
                                packageDetails['item'] = item
                                packageDetails['category'] = category
                                packageDetails['amount'] = amount
                                packageDetails['manufacturer'] = manufacturer
                                packageDetails['article'] = article
                                packageDetails['further_info'] = further_info
                                packageDetails['serial_number'] = serial_number
                                packageDetails['ean'] = ean
                                packageDetails['id'] = id

                                parcelAdd['name'] = parcelLabelAddress_name
                                parcelAdd['address'] = parcelLabelAddress

                                recepentAdd['name'] = recipientAddress_name
                                recepentAdd['address'] = recipientAddress

                                dataObject["packageDetails"] = packageDetails
                                dataObject["recipientDetails"] = recepentAdd
                                dataObject["parcelLabelAddress"] = parcelAdd

                                dataObject["deadlineDate"] = deadlinedate

                                locoDetails['name'] = loco_name
                                locoDetails['email'] = loco_email
                                locoDetails['address'] = loco_address

                                dataObject['locoContacts'] = locoDetails
                                dataObject['status'] = "new"
                                // dataObject['add_name'] = recipientAddress_name
                                // dataObject['add_name2'] = parcelLabelAddress_name
                                dataObject['attachment'] = { files: attachments_file }
                                dataObject['subject'] = dataString
                                dataObject['body'] = body
                                dataObject['date'] = date
                                dataObject['headerhtml'] = headerhtml
                            }
                        }
                    }
                    return dataObject;

                }

                function nextProgram() {
                    let finaldbData = []
                    if (emails?.length > 0) {
                        emails.forEach(edata => {
                            console.log("wokringggg.....", edata?.sub)
                            if (edata?.sub?.includes("REKLAMATIONSKLÄRUNG")) {
                                const parsedObject = parseStringToObject(edata.sub, edata.body, edata.attachments, edata.date, edata.headerhtml);
                                // console.log("email scrapping started.....")
                                finaldbData.push(parsedObject)

                            }
                            else {
                                // console.log("tes......", edata?.sub, edata.attachments?.attachments?.length ,  edata.attachments , edata.attachments?.attachments  )
                                let attachments_file = [];
                                if (edata.attachments?.attachments?.length > 0) {

                                    edata.attachments?.attachments?.forEach(element => {


                                        const fileExtension = path.extname(element.filename);
                                        const fileName = uuid.v4();

                                        const s3 = new AWS.S3();

                                        // Define parameters

                                        const params = {
                                            Bucket: 'logistic-email-service',
                                            Key: `${Date.parse(edata?.date)}/${edata.attachments.sub}/${element.filename}`,
                                            Body: Buffer.from(element?.content), // Your file[0] data
                                            ContentType: element?.contentType,
                                            ContentDisposition: 'inline',
                                            ContentId: element?.contentId,
                                            Metadata: {
                                                'partId': element?.partId,
                                                'checksum': element?.checksum,
                                                'size': element?.size.toString()
                                                // Add other metadata if needed
                                            }
                                        };

                                        // Upload to S3
                                        const uploadPromise = new Promise((resolve, reject) => {
                                            // Upload to S3
                                            s3.upload(params, (err, data) => {
                                                if (err) {
                                                    console.error("Error uploading file to S3:", err);
                                                    reject(err);
                                                } else {
                                                    console.log("upload sucess")
                                                    attachments_file.push(data.Location);
                                                    resolve(data);
                                                }
                                            });
                                        });

                                        uploadPromisesforAnms.push(uploadPromise);

                                    });

                                }

                                Promise.all(uploadPromisesforAnms)
                                    .then(async () => {

                                        await AnonymousMailModel.default.create({
                                            lamiAdminId: lami.lamiId,
                                            emailBody: edata?.headerhtml + '<hr/> <br/>' + edata?.body,
                                            status: "pending",
                                            emailDate: new Date(edata?.date),
                                            attachment: { files: attachments_file }
                                        })

                                    })
                                    .catch(error => {
                                        console.error("Error uploading files:", error);
                                    });
                            }
                        }
                        );
                    }

                    Promise.all(uploadPromises)
                        .then(async () => {

                            // Call your next program here
                            finaldbData.forEach(async emaildata => {
                                // console.log(".. Complaint Number.....", emaildata?.complainNumber);
                                let dotPosition = -1;
                                let dotPositions = [];

                                // Loop until all occurrences of dot are found
                                while ((dotPosition = emaildata?.complainNumber?.indexOf(".", dotPosition + 1)) !== -1) {
                                    dotPositions.push(dotPosition);
                                }

                                if (emaildata?.complainNumber == "") {
                                    await AnonymousMailModel.default.create({
                                        lamiAdminId: lami.lamiId,
                                        emailBody: emaildata?.headerhtml + '<hr/> <br/>' + emaildata?.body,
                                        status: "pending",
                                        emailDate: new Date(emaildata?.date),
                                        attachment: emaildata.attachment
                                    })
                                } else if (emaildata?.complainNumber?.includes(' ')) {
                                    await AnonymousMailModel.default.create({
                                        lamiAdminId: lami.lamiId,
                                        emailBody: emaildata?.headerhtml + '<hr/> <br/>' + emaildata?.body,
                                        status: "pending",
                                        emailDate: new Date(emaildata?.date),
                                        attachment: emaildata.attachment
                                    })
                                } else if (!dotPositions.includes(1) || !dotPositions.includes(8)) {
                                    await AnonymousMailModel.default.create({
                                        lamiAdminId: lami.lamiId,
                                        emailBody: emaildata?.headerhtml + '<hr/> <br/>' + emaildata?.body,
                                        status: "pending",
                                        emailDate: new Date(emaildata?.date),
                                        attachment: emaildata.attachment
                                    })
                                } else {
                                    console.log("4:", emaildata?.complainNumber);
                                    const existMails = await Ticket.default.find({ complainNumber: emaildata.complainNumber, lamiAdminId: lami.lamiId });
                                    // const existMails = await Ticket.find({ complainNumber: emaildata.complainNumber, lamiAdminId: lami.lamiId })
                                    if (existMails.length > 0) {

                                        await LocoEmailModel.default.create({
                                            ticketId: existMails[0]._id,
                                            lamiAdminId: lami.lamiId,
                                            emailBody: emaildata?.headerhtml + '<hr/> <br/>' + emaildata?.body,
                                            status: "pending",
                                            type: "IN",
                                            emailDate: new Date(emaildata.date),
                                            attachment: emaildata.attachment
                                        })

                                    } else {
                                        console.log("New Complaint Number.....", emaildata?.complainNumber);
                                        const ticket = await Ticket.default.create({
                                            lamiAdminId: lami.lamiId, ...emaildata
                                        });


                                        await LocoEmailModel.default.create({
                                            ticketId: ticket._id,
                                            lamiAdminId: lami.lamiId,
                                            emailBody: emaildata?.headerhtml + '<hr/> <br/>' + emaildata?.body,
                                            status: "pending",
                                            type: "IN",
                                            emailDate: new Date(emaildata.date),
                                            attachment: emaildata.attachment
                                        })


                                        await TicketAudit.default.create({
                                            ticketId: ticket._id,
                                            status: "new",
                                            date: new Date()
                                        })

                                        const currentDate = new Date();


                                        const query_m = {
                                            userId: new mongoose.Types.ObjectId(lami.lamiId),
                                            $expr: {
                                                $and: [
                                                    { $eq: [{ $year: "$date" }, currentDate.getFullYear()] },
                                                    { $eq: [{ $month: "$date" }, currentDate.getMonth() + 1] },
                                                    { $eq: [{ $dayOfMonth: "$date" }, currentDate.getDate()] }
                                                ]
                                            }
                                        };

                                        const existLamilog = await LamiLogModel.default.find(query_m);

                                        if (existLamilog.length > 0) {

                                            await LamiLogModel.default.findByIdAndUpdate({ _id: existLamilog[0]._id }, { open: existLamilog[0].open + 1 }, { new: true })
                                        } else {

                                            await LamiLogModel.default.create({
                                                userId: lami.lamiId,
                                                date: new Date(),
                                                open: 1

                                            })

                                        }
                                    }

                                }

                            });

                        })
                        .catch(error => {
                            console.error("Error uploading files:", error);
                        });
                }

            }).catch(function (error) {
                console.log("connection error....", config?.imap?.user, "    ", error)
            });

        } catch (error) {
            console.log("error: " + error)
        }
    })

    await Promise.all(promises);
    return true;
}

module.exports = processMail;