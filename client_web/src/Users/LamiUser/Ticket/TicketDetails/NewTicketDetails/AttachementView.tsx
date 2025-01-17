import React, { FC, useState, useEffect } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, Typography, Checkbox, Button, Tooltip, CircularProgress } from '@mui/material';
import FilePopup from 'src/components/FIlePopup/FilePopUp';
import FileIcon from 'src/components/FIleType/FileType';
import { RootState, useDispatch, useSelector } from 'src/store';
import { uploadAttachments } from 'src/slices/Ticket/FileTransfer';
import { fetchTicketDetails } from 'src/slices/Ticket/TicketDetails';
import { ErrorOutline } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface AttachmentsViewProps {
    open: boolean;
    onClose: () => void;
    Value: {
        files: string[]; // Assuming files is an array of string URLs
        _id: string; // Assuming _id is a string
    };
    ticketId: string | null;
    type: string | null; // Add type to the props
}

const AttachmentsView: FC<AttachmentsViewProps> = ({ open, onClose, Value, ticketId, type }) => {



    const { t } = useTranslation();
    console.log("AttachmentsView - open:", Value);
    const emails = useSelector((state: any) => state.uniqueTickets.data);
    console.log("emailType - open:", emails);
    const errorMessage = useSelector((state: RootState) => state.attachments.error); // Get error message from Redux store
    const status = useSelector((state: RootState) => state.attachments.status); // Get loading state from Redux store

    const dispatch = useDispatch();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [showErrorMessage, setShowErrorMessage] = useState(false); // State to control visibility of error message box

    useEffect(() => {
        console.log("AttachmentsView - open changed:", open);
    }, [open]);

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

    const handleClosePopup = () => {
        console.log("FilePopup close button clicked");
        setIsPopupOpen(false);
    };

    const handleClose = () => {
        console.log("Dialog close button clicked");
        onClose();
    };

    const handleCheckboxChange = (fileUrl: string) => {
        setSelectedFiles((prevSelectedFiles) =>
            prevSelectedFiles.includes(fileUrl)
                ? prevSelectedFiles.filter((file) => file !== fileUrl)
                : [...prevSelectedFiles, fileUrl]
        );
    };

    const handleSend = async () => {
        if (!ticketId) return;

        try {
            const action = await dispatch(uploadAttachments({ ticketId, attachments: selectedFiles }));
            console.log('Files sent successfully');
            if (uploadAttachments.fulfilled.match(action)) {
                dispatch(fetchTicketDetails(ticketId));
                onClose(); // Close the dialog only when the API call is successful
            } else if (uploadAttachments.rejected.match(action)) {
                setShowErrorMessage(true);
                const timer = setTimeout(() => {
                    setShowErrorMessage(false);
                }, 5000);
                return () => clearTimeout(timer);
            }
        } catch (error) {
            console.error('Error sending files:', error);
        }
    };

    const getFileName = (fileUrl: string) => {
        const splitUrl = fileUrl.split('/');
        return splitUrl[splitUrl.length - 1];
    };

    const getShortenedFileName = (fileName: string) => {
        return fileName.length > 15 ? fileName.substring(0, 15) + '...' : fileName;
    };

    const getFileType = (fileUrl) => {
        const extension = fileUrl.split('.').pop().toLowerCase();
        console.log("File extension:", extension); // Add this line for debugging
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
            case 'docx':
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case 'doc':
                return 'application/msword';
            default:
                return 'unknown';
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle sx={{ fontWeight: "bold", fontSize: "20px" }}>{t("mailAttachments")}</DialogTitle>
                <DialogContent>

                    {showErrorMessage && (
                        <Box sx={{ mt: "-10px", mb: "10px", bgcolor: "#ffede9", ml: "30px", mr: "30px" }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
                                <ErrorOutline sx={{ mr: 1 }} />
                                <Typography variant='body1'>
                                    {errorMessage}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    <Box display="flex" flexWrap="wrap" alignItems="center">
                        {Value?.files && Value?.files.length > 0 ? (
                            Value?.files.map((fileUrl, index) => (
                                <Tooltip title={getFileName(fileUrl)} key={index}>
                                    <Box p={1} mt={4} mr={1} mb={1} position="relative">
                                        <Box position="absolute" top={-10} left={30} width={20} height={20} borderRadius="50%" display="flex" alignItems="center" justifyContent="center" sx={{ bgcolor: "#e4e4e4" }}>
                                            <Typography sx={{ color: "black" }} variant="body1">{index + 1}</Typography>
                                        </Box>
                                        <Box display="flex" flexDirection="row" alignItems="center">
                                            {type === 'IN' && ( // Conditionally render checkbox
                                                <Checkbox
                                                    checked={selectedFiles.includes(fileUrl)}
                                                    onChange={() => handleCheckboxChange(fileUrl)}
                                                />
                                            )}
                                            <Box>
                                                <FileIcon fileUrl={fileUrl} onClick={() => handleFileClick(fileUrl, getFileType(fileUrl))} />
                                                <Typography variant="h6">{getShortenedFileName(getFileName(fileUrl))}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Tooltip>
                            ))
                        ) : (
                            <Box ml={3} mt={3} pb={9.3} height={"60px"} width={"400px"}>
                                <Typography variant="h6">No attachments available</Typography>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                    <Button variant='outlined' onClick={handleClose}>
                        {t("close")}
                    </Button>
                    {type === 'IN' && ( // Conditionally render attach button
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handleSend}
                            sx={{ ml: 2 }}
                            disabled={selectedFiles.length === 0} // Disable button if no files selected or loading
                        >
                            {status === "loading" ? <CircularProgress size={24} /> : t("attach")}
                        </Button>
                    )}
                </Box>
            </Dialog>
            {selectedFile && (
                <FilePopup open={isPopupOpen} onClose={handleClosePopup} fileUrl={selectedFile.fileUrl} fileType={selectedFile.fileType} />
            )}
        </>
    );
};

export default AttachmentsView;
