import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, Typography, TextField, Button, Box, CircularProgress, Grid, Tooltip, Checkbox, DialogActions } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { RootState, useDispatch, useSelector } from 'src/store';
import { sendClaimInsurance } from 'src/slices/Ticket/ClaimInsuarance';
import { useNavigate } from 'react-router-dom';
import FileIcon from 'src/components/FIleType/FileType';
import FilePopup from 'src/components/FIlePopup/FilePopUp';
import { useTranslation } from 'react-i18next';

interface ClaimInsuranceProps {
    open: boolean;
    onClose: () => void;
}

const ClaimInsurance: React.FC<ClaimInsuranceProps> = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const status = useSelector((state: RootState) => state.claimInsurance.status);
    const errorMessage = useSelector((state: RootState) => state.claimInsurance.error);
    const ticketDetails = useSelector((state: RootState) => state.ticketDetails.ticketDetails);

    const [to, setTo] = useState('');
    const [cc, setCc] = useState<string[]>([]);
    const [bcc, setBcc] = useState<string[]>([]);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [sending, setSending] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [selectedAttachmentFiles, setSelectedAttachmentFiles] = useState<string[]>([]);
    const [selectedPreviousFiles, setSelectedPreviousFiles] = useState<string[]>([]);
    const [selectedSignedocFiles, setSelectedSignedocFiles] = useState<string[]>([]);

    const handleCancel = () => {
        onClose();
        setTo('');
        setCc([]);
        setBcc([]);
        setSubject('');
        setMessage('');
        setNotes('');
        setSelectedFiles([]);
        setSending(false);
        setSelectedAttachmentFiles([]);
        setSelectedPreviousFiles([]);
        setSelectedSignedocFiles([]);
    };

    const handleSend = async () => {
        setSending(true);

        // Combine all selected files into one array
        const combinedAttachments = [
            ...selectedAttachmentFiles,
            ...selectedPreviousFiles,
            ...selectedSignedocFiles
        ];

        try {
            const actionValue = await dispatch(
                sendClaimInsurance({
                    ticketId: ticketDetails._id,
                    data: {
                        to,
                        cc,
                        bcc,
                        subject,
                        message,
                        notes,
                        files: selectedFiles,
                        attachment: combinedAttachments.join(','),
                    },
                })
            );

            if (sendClaimInsurance.fulfilled.match(actionValue)) {
                onClose();
                setSending(false);
                navigate(`/lami/ticket-ticket_list`);

                setTo('');
                setCc([]);
                setBcc([]);
                setSubject('');
                setMessage('');
                setNotes('');
                setSelectedFiles([]);
                setSelectedAttachmentFiles([]);
                setSelectedPreviousFiles([]);
                setSelectedSignedocFiles([]);
            } else {
                setSending(false);
            }
        } catch (error) {
            console.error('Error occurred while sending email:', error);
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

    useEffect(() => {
        if (status === 'failed') {
            setShowErrorMessage(true);
            const timer = setTimeout(() => {
                setShowErrorMessage(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const transformErrorMessage = (errorMessage: string): string => {
        switch (errorMessage) {
            default:
                return 'Something went wrong. Please try again.';
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

    const handleCheckboxChange = (fileUrl: string, setSelectedFiles: React.Dispatch<React.SetStateAction<string[]>>, selectedFiles: string[]) => {
        if (selectedFiles.includes(fileUrl)) {
            setSelectedFiles(selectedFiles.filter((file) => file !== fileUrl));
        } else {
            setSelectedFiles([...selectedFiles, fileUrl]);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth={false}>
                <Box padding="20px">
                    <Typography variant="h6" gutterBottom style={{ paddingBottom: '16px', fontWeight: 'bold', fontSize: '1.5rem' }}>
                        {t("claimInsu")}
                    </Typography>
                    <Typography variant="h6" gutterBottom style={{ paddingBottom: '10px', fontSize: '0.9rem', marginTop: '-15px' }}>
                        {t("pleaseProvideBelowDetails")}
                    </Typography>
                </Box>

                <DialogContent sx={{ width: '700px', mt: "-10px" }}>
                    <style>
                        {`
                            ::-webkit-scrollbar {
                                width: 12px;
                                border-radius: 10px;
                            }

                            ::-webkit-scrollbar-track {
                                background: white;
                            }

                            ::-webkit-scrollbar-thumb {
                                background-color: #dedede;
                                border-radius: 20px;
                                border: 3px solid #e2edff;
                            }
                        `}
                    </style>
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
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t("to")}</Typography>
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
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Notes:</Typography>
                            <TextField
                                margin="dense"
                                fullWidth
                                multiline
                                rows={5}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
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
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t("previousAttachments")}</Typography>
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
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t("signedDocuments")}</Typography>
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
                                id="file-upload"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                                multiple
                            />
                            <label htmlFor="file-upload">
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
                <DialogActions>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={handleCancel} color="primary" variant="outlined" sx={{ mr: 1 }}>
                            {t("cancel")}
                        </Button>
                        <Button
                            onClick={handleSend}
                            color="primary"
                            variant="contained"
                            disabled={sending}
                            startIcon={sending ? <CircularProgress size={20} /> : null}
                        >
                            {sending ? 'Sending...' : t("send")}
                        </Button>
                    </Box>

                </DialogActions>
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

export default ClaimInsurance;
