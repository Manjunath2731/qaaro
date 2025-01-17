import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, Divider, Typography, TextField, Button, Box, Tooltip, IconButton, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from '../../store';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete'; // Import delete icon

import { fetchReturnTicket } from '../../slices/LamiDashboard/GetReturnLoco';
import { returnToLoco, ReturnToLocoRequest } from 'src/slices/Ticket/ReturnToLoco';
import { fetchTicketList } from 'src/slices/Ticket/GetTicketList';
import FileIcon from '../FIleType/FileType';
import FilePopup from '../FIlePopup/FilePopUp';
import { RootState } from '../../store/rootReducer'; // Import RootState type
import { ErrorOutline } from '@mui/icons-material';
import { useMediaQuery, Theme } from '@mui/material'; // Import useMediaQuery and Theme from @mui/material
import { useTranslation } from 'react-i18next';


const ReturnToLoco = ({ open, onClose, ticketId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const loco = useSelector((state: RootState) => state.returnToLoco.status); // Use RootState
    const errorMessage = useSelector((state: RootState) => state.returnToLoco.error); // Get error message from Redux store
    const { ticket, status, error } = useSelector((state) => state.returnTicket);
    const [sending, setSending] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [filesForDeletion, setFilesForDeletion] = useState([]); // State to manage files for deletion
    const [description, setDescription] = useState(''); // State to store description
    const [editedTo, setEditedTo] = useState([]); // State to store edited 'To' field as an array of strings
    const [editedMessage, setEditedMessage] = useState(''); // State to store edited 'Message' field
    const [newSignature, setNewSignature] = useState(null); // State to store new signature file
    const [newAttachments, setNewAttachments] = useState([]); // State to store new attachments files
    const [showErrorMessage, setShowErrorMessage] = useState(false); // State to control visibility of error message box
    const [ccArray, setCcArray] = useState([]);
    const [bccArray, setBccArray] = useState([]);
    const [selectedFilesCount, setSelectedFilesCount] = useState(0);


    const [editedSubject, setEditedSubject] = useState(ticket?.subject || ''); // State to store edited subject

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));


    useEffect(() => {
        if (ticketId) {
            dispatch(fetchReturnTicket(ticketId));
        }
    }, [ticketId]);

    useEffect(() => {
        if (ticket) {
            setEditedTo([ticket.to] || []);
            setEditedMessage(ticket.message || '');
            setEditedSubject(ticket?.subject || '')

        }
    }, [ticket]);

    const handleCancel = () => {
        onClose();
        setShowErrorMessage(false);
        setBccArray([]);
        setCcArray([]);
        setSelectedFilesCount(0);
        setDescription('');
        setEditedSubject(ticket?.subject || '')
        setEditedMessage(ticket?.message || '');
        setEditedTo(ticket?.to ? [ticket.to] : []);

    };


    const handleSend = () => {
        if (ticket) {
            setSending(true);

            const attachmentFiles = ticket?.attachment?.files
                ?.filter(fileUrl => !filesForDeletion?.includes(fileUrl))
                .join(',');

            const requestData: Partial<ReturnToLocoRequest> = {
                to: editedTo,
                cc: ccArray,
                bcc: bccArray,
                subject: editedSubject,
                message: editedMessage,
                description: description,
                attachment: attachmentFiles,
                newAttachment: newAttachments,
                newsignature: newSignature,
                signature: ticket?.signature && !filesForDeletion?.includes(ticket.signature) ? ticket.signature : null
            };

            const returnToLocoRequest = {
                ticketId: ticketId,
                requestData: requestData as ReturnToLocoRequest
            };

            dispatch(returnToLoco(returnToLocoRequest))
                .then((result) => {
                    if (returnToLoco.fulfilled.match(result)) {
                        dispatch(fetchTicketList());
                        onClose(); // Close the dialog only when the API call is successful
                        setIsPopupOpen(false); // Close the popup if it's open
                        setSending(false); // Update sending state
                        navigate(`/lami/ticket-ticket_list`);
                        setBccArray([]);
                        setCcArray([]);
                        setSelectedFilesCount(0);
                        setDescription('');
                    } else if (returnToLoco.rejected.match(result)) {
                        setSending(false); // Update sending state

                        setShowErrorMessage(true);
                        const timer = setTimeout(() => {
                            setShowErrorMessage(false);
                        }, 5000);
                        return () => clearTimeout(timer);
                    }
                })
                .catch(error => {
                    setSending(false);
                    // Handle error here, show error message, etc.
                });
        }
    };


    const handleFileClick = (fileUrl, fileType) => {
        setSelectedFile({ fileUrl, fileType });
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const getFileType = (fileUrl) => {
        const extension = fileUrl.split('.').pop().toLowerCase();
        switch (extension) {
            case 'png':
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'pdf':
                return 'application/pdf';
            default:
                return 'unknown';
        }
    };

    const getFileName = (fileUrl) => {
        const splitUrl = fileUrl.split('/');
        return splitUrl[splitUrl.length - 1];
    };

    const getShortenedFileName = (fileName) => {
        return fileName.length > 15 ? fileName.substring(0, 15) + '...' : fileName;
    };






    const handleMultipleFilesUpload = (event) => {
        const files = Array.from(event.target.files);
        const totalFiles = newAttachments.length + files.length;

        if (totalFiles > 5) {
            // If total files exceed the limit, show the file limit message
            setSelectedFilesCount(5); // Limit the count of selected files to 5
            return; // Exit the function to prevent further processing
        }

        // If the total files are within the limit, update the state with the new attachments and the selected files count
        setNewAttachments([...newAttachments, ...files]);
        setSelectedFilesCount(totalFiles);
    };



    //FORM validation Conditipns 




    const transformErrorMessage = (errorMessage: string): string => {
        switch (errorMessage) {

            case 'Account_Not_Connected':
                return 'Account Not Connected'
            default:
                return 'Something went wrong. Please try again.';
        }
    };


    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth={false}>
                <Box padding={"20px"}>
                    <Typography variant="h6" gutterBottom style={{ paddingBottom: '16px', fontWeight: 'bold', fontSize: '1.5rem' }}>
                        {t("returnToLoco")}
                    </Typography>
                    <Typography variant="h6" gutterBottom style={{ paddingBottom: '10px', fontSize: '0.9rem', marginTop: "-15px" }}>
                        {t("pleaseProvideBelowDetails")}
                    </Typography>
                </Box>
                {showErrorMessage && (
                    <Box sx={{ mt: "-10px", mb: "10px", bgcolor: "#ffede9", ml: "30px", mr: "30px" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
                            <ErrorOutline sx={{ mr: 1 }} />
                            <Typography variant='body1'>
                                {transformErrorMessage(errorMessage)}
                            </Typography>
                        </Box>
                    </Box>
                )}
                <DialogContent sx={{
                    width: isSmallScreen || isMediumScreen ? "500px" : "1000px",
                    display: 'flex', flexDirection: isSmallScreen || isMediumScreen ? 'column' : 'row',



                }}>

                    <Box sx={{ width: isSmallScreen || isMediumScreen ? '100%' : '50%', paddingRight: '16px', paddingLeft: "16px" }}>

                        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }}>
                            {t("to")}
                        </Typography>
                        <TextField
                            label={t("required")}
                            margin='dense'
                            fullWidth
                            value={editedTo.join(', ')} // Join array elements with comma and space
                            onChange={(e) => setEditedTo(e.target.value.split(',').map(item => item.trim()))} // Convert comma-separated string to array

                        />
                        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }}>
                            {t("cc")}
                        </Typography>
                        <TextField
                            autoFocus
                            margin='dense'
                            fullWidth
                            value={ccArray.join(', ')}
                            onChange={(e) => setCcArray(e.target.value.split(',').map(item => item.trim()))}
                        />



                        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }}>
                            {t("bcc")}
                        </Typography>
                        <TextField
                            autoFocus
                            margin='dense'
                            fullWidth
                            value={bccArray.join(', ')}
                            onChange={(e) => setBccArray(e.target.value.split(',').map(item => item.trim()))}
                        />

                        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold', marginTop: '20px' }}>
                            {t("subject")}
                        </Typography>
                        <TextField
                            label={t("required")}
                            autoFocus
                            margin='dense'
                            fullWidth
                            value={editedSubject}
                            onChange={(e) => setEditedSubject(e.target.value)} // Update editedSubject state
                        />

                        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold', marginTop: '20px' }}>
                            {t("emailMessage")}
                        </Typography>
                        <TextField
                            label={t("required")}

                            autoFocus
                            margin='dense'
                            fullWidth
                            multiline
                            rows={5}
                            value={editedMessage} // Use editedMessage state
                            onChange={(e) => setEditedMessage(e.target.value)} // Update editedMessage state
                        />

                    </Box>

                    <Box sx={{ width: isSmallScreen || isMediumScreen ? '100%' : '50%', paddingLeft: '16px', paddingRight: "16px" }}>

                        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }}>
                            {t("returnDesc")}
                        </Typography>
                        <TextField
                            autoFocus
                            label={t("required")}

                            margin='dense' fullWidth
                            multiline
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} // Update description state
                        />
                        <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', marginTop: "20px", marginBottom: "15px" }}>
                            {t("attachments")}
                        </Typography>
                        <Box padding="3px" display="flex" alignItems="center" flexWrap={"wrap"} >
                            {ticket?.attachment?.files?.filter(fileUrl => !filesForDeletion?.includes(fileUrl)).length > 0 ? (
                                ticket?.attachment?.files?.filter(fileUrl => !filesForDeletion?.includes(fileUrl)).map((fileUrl, index) => (
                                    <Tooltip title={getFileName(fileUrl)} key={index}>
                                        <Box mr={1}>
                                            <Box mt={1} display="flex" flexDirection="column" flexWrap={"wrap"} alignItems="center">
                                                <FileIcon fileUrl={fileUrl} onClick={() => handleFileClick(fileUrl, getFileType(fileUrl))} />
                                                <Typography variant="h6">{getShortenedFileName(getFileName(fileUrl))}</Typography> {/* Display shortened file name */}
                                            </Box>
                                        </Box>
                                    </Tooltip>
                                ))
                            ) : (
                                <Box sx={{ pb: "100px" }}>
                                    <Typography sx={{ mt: "20px" }} variant="h6">{t("noAttachAvailable")}</Typography>
                                </Box>
                            )}


                        </Box>
                        <Box sx={{ position: 'relative', display: 'inline-block', mt: "-30px" }}>
                            <Box sx={{ display: "flex", mt: "60px" }}>
                                <Typography sx={{ color: "blue", textDecoration: "underline" }} component="label" htmlFor="file-upload">
                                    {t("addMoreFiles")}
                                </Typography>
                                {selectedFilesCount > 0 && ( // Display selected file name if available
                                    <Typography variant="body1" gutterBottom style={{ marginLeft: '10px' }}>
                                        ({selectedFilesCount} Files Selected)
                                    </Typography>
                                )}
                            </Box>
                            <Typography variant="body1" gutterBottom style={{ color: 'grey', marginTop: '5px' }}>
                                {t("maximum5FilesAllowed")}
                            </Typography>

                            <input
                                id="file-upload"
                                type="file"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '70%',
                                    height: '20%',
                                    opacity: 0,
                                    cursor: 'pointer',
                                }}
                                multiple
                                onChange={handleMultipleFilesUpload}
                            />
                        </Box>

                        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold', marginTop: '40px', marginBottom: "10px" }}>
                            {t("emailSignature")}
                        </Typography>
                        <div style={{ marginBottom: '16px', }}>
                            {ticket?.signature && !filesForDeletion?.includes(ticket.signature) ? (
                                <Box key="signature" style={{ display: 'flex', alignItems: 'center', marginBottom: '-10px' }}>
                                    <Tooltip title={getFileName(ticket?.signature)}>
                                        <Box mr={1}>
                                            <Box mt={1} display="flex" flexWrap={"wrap"} flexDirection="column" alignItems="left" mb={"20px"}>
                                                <FileIcon fileUrl={ticket?.signature} onClick={() => handleFileClick(ticket.signature, getFileType(ticket.signature))} />
                                                <Typography variant="h6">{getShortenedFileName(getFileName(ticket.signature))}</Typography>
                                            </Box>
                                        </Box>
                                    </Tooltip>
                                </Box>
                            ) : (
                                <Typography variant="h6">No Document Available</Typography>
                            )}

                        </div>
                    </Box>

                </DialogContent>

                <div style={{ display: 'flex', justifyContent: 'flex-end', margin: "20px", gap: "10px" }}>
                    <Button variant="outlined" color="primary" onClick={handleCancel}>
                        {t("cancel")}
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSend}
                        disabled={
                            sending || // Disable if sending is in progress
                            !editedTo.some(item => item.trim()) || // Check if editedTo contains non-empty values
                            !editedMessage ||
                            !description ||
                            !editedSubject
                        }

                    >
                        {sending ? <CircularProgress color='inherit' size="1rem" /> : t("send")}
                    </Button>
                </div>
            </Dialog >

            {selectedFile && (
                <FilePopup open={isPopupOpen} onClose={handleClosePopup} fileUrl={selectedFile.fileUrl} fileType={selectedFile.fileType} />
            )
            }
        </>
    );
};

export default ReturnToLoco;
