import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, Typography, TextField, Button, Box, CircularProgress, Grid, Tooltip, Checkbox } from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import { sendEmail } from 'src/slices/Ticket/SendEmail';
import { RootState } from 'src/store';
import { ErrorOutline } from '@mui/icons-material';
import { fetchTicketEmailList } from 'src/slices/Ticket/EmailList';
import FilePopup from 'src/components/FIlePopup/FilePopUp';
import FileIcon from 'src/components/FIleType/FileType';
import { useTranslation } from 'react-i18next';

const SendEmail: React.FC = () => {

    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [to, setTo] = useState('');
    const [cc, setCc] = useState<string[]>([]); // Initialize as an array
    const [bcc, setBcc] = useState<string[]>([]); // Initialize as an array
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [sending, setSending] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false); // State to control visibility of error message box

    const [selectedFile, setSelectedFile] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [selectedAttachmentFiles, setSelectedAttachmentFiles] = useState<string[]>([]);
    const [selectedPreviousFiles, setSelectedPreviousFiles] = useState<string[]>([]);
    const [selectedSignedocFiles, setSelectedSignedocFiles] = useState<string[]>([]);

    const dispatch = useDispatch();

    const ticketDetails = useSelector((state: RootState) => state.ticketDetails.ticketDetails);
    const status = useSelector((state: RootState) => state.email.status);
    const errorMessage = useSelector((state: RootState) => state.email.error);

    const handleCancel = () => {
        setOpen(false);
        setTo('');
        setCc([]);
        setBcc([]);
        setSubject('');
        setMessage('');
        setSelectedFiles([]);
        setSelectedAttachmentFiles([]);
        setSelectedPreviousFiles([]);
        setSelectedSignedocFiles([]);
        setSending(false);
    };

    const handleSend = async () => {
        setSending(true);

        const combinedAttachments = [
            ...selectedAttachmentFiles,
            ...selectedPreviousFiles,
            ...selectedSignedocFiles
        ];

        try {
            const emailData = {
                ticketId: ticketDetails._id,
                data: {
                    to: to,
                    cc: cc,
                    bcc: bcc,
                    subject: subject,
                    message: message,
                    files: selectedFiles,
                    attachment: combinedAttachments.join(','),
                }
            };

            // Dispatch the sendEmail action and wait for it to complete
            const actionValue = await dispatch(sendEmail(emailData));
            if (sendEmail.fulfilled.match(actionValue)) {
                setOpen(false);
                dispatch(fetchTicketEmailList(ticketDetails._id))
                handleCancel(); // Reset all states
            } else if (sendEmail.rejected.match(actionValue)) {
                setSending(false); // Update sending state
                setShowErrorMessage(true);
                const timer = setTimeout(() => {
                    setShowErrorMessage(false);
                }, 5000);
                return () => clearTimeout(timer);
            }
        } catch (error) {
            console.error('Failed to send email:', error);
        } finally {
            setSending(false);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (selectedFiles.length + files.length > 5) {
            return;
        }
        setSelectedFiles([...selectedFiles, ...files]);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const transformErrorMessage = (errorMessage: string): string => {
        switch (errorMessage) {
            case 'phone_duplicate':
                return 'Please check your Phone No. This one is already in use!';
            default:
                return 'Something went wrong. Please try again.';
        }
    };

    const handleCheckboxChange = (fileUrl: string, setSelectedFiles: React.Dispatch<React.SetStateAction<string[]>>, selectedFiles: string[]) => {
        if (selectedFiles.includes(fileUrl)) {
            setSelectedFiles(selectedFiles.filter((file) => file !== fileUrl));
        } else {
            setSelectedFiles([...selectedFiles, fileUrl]);
        }
    };

    const getFileName = (fileUrl: string) => {
        const splitUrl = fileUrl.split('/');
        return splitUrl[splitUrl.length - 1];
    };

    const getShortenedFileName = (fileName: string) => {
        return fileName.length > 15 ? fileName.substring(0, 15) + '...' : fileName;
    };

    const handleFileClick = (fileUrl, fileType) => {
        if (fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            const anchor = document.createElement('a');
            anchor.href = fileUrl;
            anchor.download = getFileName(fileUrl);
            anchor.click();
        } else {
            setSelectedFile({ fileUrl, fileType });
            setIsPopupOpen(true);
        }
    };

    const getFileType = (fileUrl) => {
        const extension = fileUrl.split('.').pop().toLowerCase();
        console.log("File extension:", extension);
        switch (extension) {
            case 'png':
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'pdf':
                return 'application/pdf';
            case 'PDF':
                return 'application/pdf';
            case 'xlsx':
                return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            default:
                return 'unknown';
        }
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <>
            <Typography
                component="span"
                style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                onClick={handleClickOpen}
            >
                {t("sendEmail")}
            </Typography>

            <Dialog open={open} onClose={handleCancel} maxWidth={false}>
                <Box padding="20px">
                    <Typography variant="h6" gutterBottom style={{ paddingBottom: '16px', fontWeight: 'bold', fontSize: '1.5rem' }}>
                        {t("sendEmail")}

                    </Typography>
                    <Typography variant="h6" gutterBottom style={{ paddingBottom: '10px', fontSize: '0.9rem', marginTop: '-15px' }}>
                        {t("pleaseProvideBelowDetails")}
                    </Typography>
                </Box>

                <DialogContent sx={{ width: '700px', mt: "-10px" }}>
                    {showErrorMessage && (
                        <Box sx={{ mt: "-20px", mb: "10px", bgcolor: "#ffede9" }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
                                <ErrorOutline sx={{ mr: 1 }} />
                                <Typography variant='body1'>
                                    {transformErrorMessage(errorMessage)}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {t("to")}
                            </Typography>
                            <TextField
                                autoFocus
                                label={t("required")}
                                margin="dense"
                                fullWidth
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t("cc")}</Typography>
                            <TextField
                                margin="dense"
                                fullWidth
                                value={cc}
                                onChange={(e) => setCc(e.target.value.split(',').map(item => item.trim()))}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t("bcc")}</Typography>
                            <TextField
                                margin="dense"
                                fullWidth
                                value={bcc}
                                onChange={(e) => setBcc(e.target.value.split(',').map(item => item.trim()))}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t("subject")}</Typography>
                            <TextField
                                label={t("required")}
                                margin="dense"
                                fullWidth
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t("emailMessage")}</Typography>
                            <TextField
                                margin="dense"
                                fullWidth
                                label={t("required")}
                                multiline
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t("invoicedAttachments")}</Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", mt: "20px" }}>
                                {ticketDetails?.invoicedData?.attachment?.files && ticketDetails?.invoicedData?.attachment?.files.length > 0 ? (
                                    ticketDetails.invoicedData.attachment.files.map((fileUrl, index) => (
                                        <Tooltip title={getFileName(fileUrl)} key={index}>
                                            <Box mr={1} mb={1} width="calc(25% - 16px)">
                                                <Box display="flex" flexDirection="row" alignItems="center" flexWrap={"wrap"}>
                                                    <Checkbox
                                                        checked={selectedAttachmentFiles.includes(fileUrl)}
                                                        onChange={() => handleCheckboxChange(fileUrl, setSelectedAttachmentFiles, selectedAttachmentFiles)}
                                                    />
                                                    <FileIcon fileUrl={fileUrl} onClick={() => handleFileClick(fileUrl, getFileType(fileUrl))} />
                                                    <Typography variant="h6">{getShortenedFileName(getFileName(fileUrl))}</Typography>
                                                </Box>
                                            </Box>
                                        </Tooltip>
                                    ))
                                ) : (
                                    <Box>
                                        <Typography sx={{ mt: "-10px", pl: "20px", fontWeight: "bold" }} variant="h6">{t("noUplaodedDocumentsAvailable")}</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Ticket {t("attachments")}</Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", mt: "20px" }}>
                                {ticketDetails?.attachment?.files && ticketDetails.attachment?.files.length > 0 ? (
                                    ticketDetails.attachment.files.map((fileUrl, index) => (
                                        <Tooltip title={getFileName(fileUrl)} key={index}>
                                            <Box mr={1} mb={1} width="calc(25% - 16px)">
                                                <Box display="flex" flexDirection="row" alignItems="center" flexWrap={"wrap"}>
                                                    <Checkbox
                                                        checked={selectedPreviousFiles.includes(fileUrl)}
                                                        onChange={() => handleCheckboxChange(fileUrl, setSelectedPreviousFiles, selectedPreviousFiles)}
                                                    />
                                                    <FileIcon fileUrl={fileUrl} onClick={() => handleFileClick(fileUrl, getFileType(fileUrl))} />
                                                    <Typography variant="h6">{getShortenedFileName(getFileName(fileUrl))}</Typography>
                                                </Box>
                                            </Box>
                                        </Tooltip>
                                    ))
                                ) : (
                                    <Box>
                                        <Typography sx={{ mt: "-10px", pl: "20px", fontWeight: "bold" }} variant="h6">{t("noUplaodedDocumentsAvailable")}</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t("uploadedDocuments")}</Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", mt: "20px" }}>
                                {ticketDetails?.signedoc?.files && ticketDetails.signedoc?.files.length > 0 ? (
                                    ticketDetails.signedoc.files.map((fileUrl, index) => (
                                        <Tooltip title={getFileName(fileUrl)} key={index}>
                                            <Box mr={1} mb={1} width="calc(25% - 16px)">
                                                <Box display="flex" flexDirection="row" alignItems="center" flexWrap={"wrap"}>
                                                    <Checkbox
                                                        checked={selectedSignedocFiles.includes(fileUrl)}
                                                        onChange={() => handleCheckboxChange(fileUrl, setSelectedSignedocFiles, selectedSignedocFiles)}
                                                    />
                                                    <FileIcon fileUrl={fileUrl} onClick={() => handleFileClick(fileUrl, getFileType(fileUrl))} />
                                                    <Typography variant="h6">{getShortenedFileName(getFileName(fileUrl))}</Typography>
                                                </Box>
                                            </Box>
                                        </Tooltip>
                                    ))
                                ) : (
                                    <Box>
                                        <Typography sx={{ mt: "-10px", pl: "20px", fontWeight: "bold" }} variant="h6">{t("noUplaodedDocumentsAvailable")}</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <input
                                id="file-upload" // Add an id to the input element
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                                multiple // Allow selecting multiple files
                            />
                            <label htmlFor="file-upload"> {/* Match htmlFor with id of input */}
                                <Typography component="span" style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                                    {t("addMoreFiles")}
                                </Typography>
                                <Typography variant="body1" gutterBottom style={{ color: 'grey', marginTop: '5px' }}>
                                    {t("maximum5FilesAllowed")}
                                </Typography>
                            </label>

                            {selectedFiles.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Attached Files:</Typography>
                                    {selectedFiles.map((file, index) => (
                                        <Typography key={index}>{file.name}</Typography>
                                    ))}
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>

                <Box display="flex" justifyContent="flex-end" margin="20px" gap="10px">
                    <Button variant="outlined" color="primary" onClick={handleCancel}>
                        {t("cancel")}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSend}
                        disabled={sending || !to || !subject || !message}
                    >
                        {sending ? <CircularProgress color="inherit" size="1rem" /> : t("send")}
                    </Button>
                </Box>
            </Dialog>
            {selectedFile && (
                <FilePopup
                    open={isPopupOpen}
                    onClose={handleClosePopup}
                    fileUrl={selectedFile.fileUrl}
                    fileType={selectedFile.fileType}
                />
            )}
        </>
    );
};

export default SendEmail;
