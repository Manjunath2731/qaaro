import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, List, ListItem, ListItemText, Typography, CircularProgress, Box, Grid, Tooltip, Checkbox } from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import { RootState } from 'src/store';
import { attachInvoice } from 'src/slices/Ticket/AttachInvoice';
import { ErrorOutline } from '@mui/icons-material';
import { fetchTicketDetails } from 'src/slices/Ticket/TicketDetails';
import { useNavigate } from 'react-router-dom';
import FileIcon from 'src/components/FIleType/FileType';
import FilePopup from 'src/components/FIlePopup/FilePopUp';
import { useTranslation } from 'react-i18next';

interface AttachInvoiceprops {
    open: boolean;
    onClose: () => void;
}

const AttachInvoice: React.FC<AttachInvoiceprops> = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const ticketDetails = useSelector((state: RootState) => state.ticketDetails.ticketDetails);
    const attachInvoiceStatus = useSelector((state: RootState) => state.invoice.status); // Assuming the slice name is attachInvoice
    const errorMessage = useSelector((state: RootState) => state.invoice.status); // Assuming the slice name is attachInvoice
    const [showErrorMessage, setShowErrorMessage] = useState(false); // State to control visibility of error message box

    const [sending, setSending] = useState(false);

    const [saveDisabled, setSaveDisabled] = useState(true); // State to control the disabled state of the save button
    const [selectedFile, setSelectedFile] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [selectedPreviousFiles, setSelectedPreviousFiles] = useState<string[]>([]);
    const [selectedSignedocFiles, setSelectedSignedocFiles] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        emailHeaderNumber: '',
        dpdInvoiceNumber: '',
        date: '',
        packageNumber: '',
        complainNumber: '',
        finalLostValue: '',
        note: '',
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    useEffect(() => {
        if (ticketDetails) {
            setFormData((prevData) => ({
                ...prevData,
                packageNumber: ticketDetails.packageNumber || '',
                complainNumber: ticketDetails.complainNumber || '',
            }));
        }
    }, [ticketDetails]);

    const checkRequiredFields = () => {
        const requiredFields = ['emailHeaderNumber', 'dpdInvoiceNumber', 'date', 'finalLostValue'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                return false; // Return false if any required field is empty
            }
        }
        return true; // Return true if all required fields are filled
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };

    const handleSubmit = async () => {
        setSending(true);

        const combinedAttachments = [
            ...selectedPreviousFiles,
            ...selectedSignedocFiles
        ];

        const data = new FormData();
        data.append('mailHeaderNumber', formData.emailHeaderNumber);
        data.append('dpdInvoiceNumber', formData.dpdInvoiceNumber);
        data.append('date', formData.date);
        data.append('packageNumber', formData.packageNumber);
        data.append('complainNumber', formData.complainNumber);
        data.append('finalLostAmmount', formData.finalLostValue);
        data.append('notes', formData.note);
        data.append('files', combinedAttachments.join(','));

        selectedFiles.forEach((file) => {
            data.append('attachment', file);
        });

        try {
            const actionValue = await dispatch(attachInvoice({ ticketId: ticketDetails._id, data }));

            if (attachInvoice.fulfilled.match(actionValue)) {
                navigate(`/lami/ticket-ticket_list`);
                onClose();
            } else {
                // Handle the case where the attachInvoice action was not fulfilled
                console.error('Failed to attach invoice:', actionValue);
            }
        } catch (error) {
            console.error('Error attaching invoice:', error);
        } finally {
            setSending(false);
        }
    };

    const transformErrorMessage = (errorMessage: string): string => {
        switch (errorMessage) {
            default:
                return 'Something went wrong. Please try again.';
        }
    };

    useEffect(() => {
        setSaveDisabled(!checkRequiredFields());
    }, [formData]);

    useEffect(() => {
        if (attachInvoiceStatus === 'failed') {
            setShowErrorMessage(true);
            const timer = setTimeout(() => {
                setShowErrorMessage(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [attachInvoiceStatus]);

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
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontWeight: "bold", fontSize: "20px" }}>{t("attach")} {t("invoice")}</DialogTitle>
            <DialogTitle sx={{ mt: "-30px", mb: "30px" }}>{t("pleaseProvideBelowDetails")}</DialogTitle>

            <DialogContent >
                {showErrorMessage && (
                    <Box sx={{
                        mb: "20px", bgcolor: "#ffede9"
                    }}>
                        < Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
                            <ErrorOutline sx={{ mr: 1 }} />
                            <Typography variant='body1'>
                                {transformErrorMessage(errorMessage)}
                            </Typography>
                        </Box>
                    </Box>
                )
                }
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }}>
                            {t("emailHeaderNumber")}
                        </Typography>

                        <TextField
                            label={t("required")}
                            name="emailHeaderNumber"
                            value={formData.emailHeaderNumber}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }}>
                            {t("dPDInvoiceNumber")}
                        </Typography>

                        <TextField
                            label={t("required")}
                            name="dpdInvoiceNumber"
                            value={formData.dpdInvoiceNumber}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }}>
                            {t("invoiceDate")}
                        </Typography>

                        <TextField
                            label={t("required")}
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }}>
                            {t("packageNumber")}
                        </Typography>
                        <TextField
                            label={t("required")}
                            name="packageNumber"
                            value={formData.packageNumber}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }}>
                            {t("complainNumber")}
                        </Typography>
                        <TextField
                            label={t("required")}
                            name="complainNumber"
                            value={formData.complainNumber}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }}>
                            {t("finalLostValue")}
                        </Typography>
                        <TextField
                            label={t("required")}
                            name="finalLostValue"
                            value={formData.finalLostValue}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            type="number"
                            inputProps={{ min: 0 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }}>
                            {t("noteIfAny")}
                        </Typography>
                        <TextField
                            label=""
                            name="note"
                            value={formData.note}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={5}
                        />
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
                                    <Typography sx={{ mt: "-10px", pl: "20px", fontWeight: "bold" }} variant="h6">{t("noUploadedDocAvailable")}</Typography>
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
                                    <Typography sx={{ mt: "-10px", pl: "20px", fontWeight: "bold" }} variant="h6">{t("noUploadedDocAvailable")}</Typography>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            variant="body2"
                            color="primary"
                            component="span"
                            style={{ cursor: 'pointer', textDecoration: 'underline', display: 'block', margin: '20px 0', color: "blue" }}
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >
                            {t("uploadInvoiceAttachment")}
                        </Typography>
                        <input
                            id="file-upload"
                            type="file"
                            hidden
                            multiple
                            onChange={handleFileChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <List sx={{ mt: "-20px" }}>
                            {selectedFiles.map((file, index) => (
                                <ListItem key={index} >
                                    <ListItemText primary={file.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </DialogContent >
            <DialogActions>
                <Button variant='outlined' onClick={onClose} color="secondary">
                    {t("cancel")}
                </Button>
                <Button variant='contained' onClick={handleSubmit} color="primary" disabled={saveDisabled} >
                    {sending ? <CircularProgress color="inherit" size="1rem" /> : t("send")}
                </Button>
            </DialogActions>
            {selectedFile && (
                <FilePopup
                    open={isPopupOpen}
                    onClose={handleClosePopup}
                    fileUrl={selectedFile.fileUrl}
                    fileType={selectedFile.fileType}
                />
            )}
        </Dialog >
    );
};

export default AttachInvoice;
