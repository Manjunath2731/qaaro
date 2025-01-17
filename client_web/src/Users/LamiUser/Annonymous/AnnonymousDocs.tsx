// AnnonymousDocs.js

import React, { useEffect, useState } from 'react';
import { Box, Card, DialogContent, DialogTitle, Divider, Grid, Paper, Tooltip, Typography } from '@mui/material';
import FilePopup from 'src/components/FIlePopup/FilePopUp';
import FileIcon from 'src/components/FIleType/FileType';
import { useTranslation } from 'react-i18next';

const AnnonymousDocs: React.FC<{ selectedTicket: any }> = ({ selectedTicket }) => {

    const { t } = useTranslation()
    const [selectedFile, setSelectedFile] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        console.log(selectedTicket, "selectedTicket"); // Add this line for debugging
        if (selectedTicket) {
            // You can access selectedTicket here and use it as needed
            console.log(selectedTicket, "selectedTicket");

        }
    }, [selectedTicket]);




    const getFileName = (fileUrl: string) => {
        const splitUrl = fileUrl.split('/');
        return splitUrl[splitUrl.length - 1]; // Get the last part of the URL which is the file name
    };

    const getShortenedFileName = (fileName: string) => {
        return fileName.length > 15 ? fileName.substring(0, 15) + '...' : fileName;
    };

    const handleFileClick = (fileUrl, fileType) => {
        if (fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            // For Excel files, trigger download instead of opening a popup
            const anchor = document.createElement('a');
            anchor.href = fileUrl;
            anchor.download = getFileName(fileUrl); // Set the filename for download
            anchor.click(); // Trigger the download
        } else {
            // For other file types, open the file popup
            setSelectedFile({ fileUrl, fileType });
            setIsPopupOpen(true);
        }
    };


    const handleClosePopup = () => {
        setIsPopupOpen(false);
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
            case 'xlsx':
                return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            default:
                return 'unknown';
        }
    };

    return (
        <Box mt={8}>
            <Card sx={{ height: "710px", overflowY: "auto" }}>
                <Grid container spacing={2}>

                    <Grid item xs={12} style={{ borderRight: '1px solid #e0e0e0' }}> {/* Add border style to create a vertical border */}
                        <DialogTitle sx={{ fontWeight: "bold" }}>{t("emailRecieved")}</DialogTitle>
                        <Divider />
                        <DialogContent >
                            <style>
                                {`
                            ::-webkit-scrollbar {
                                width: 12px;
                                border-radius:"10px
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
                            <Typography dangerouslySetInnerHTML={{ __html: selectedTicket?.emailBody }}></Typography>
                        </DialogContent>
                    </Grid>
                    <Grid item xs={12}>
                        <DialogTitle sx={{ fontWeight: "bold" }}>{t("attachmentsAvailable")}</DialogTitle>
                        <Divider />

                        <div>
                            <Box mb={2} p={2} sx={{ mt: "-10px" }}>
                                <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="flex-start" maxWidth="100%" gap={"10px"}>
                                    {selectedTicket?.attachment?.files && selectedTicket.attachment.files.length > 0 ? (
                                        selectedTicket.attachment.files.map((fileUrl, index) => (
                                            <Tooltip title={getFileName(fileUrl)} key={index}>
                                                <Box mr={1} mb={1} > {/* Set each file item to occupy 25% of the container width with margin included */}
                                                    <Box display="flex" flexDirection="column" flexWrap={"wrap"} alignItems="center">
                                                        <FileIcon fileUrl={fileUrl} onClick={() => handleFileClick(fileUrl, getFileType(fileUrl))} />
                                                        <Typography variant="h6">{getShortenedFileName(getFileName(fileUrl))}</Typography> {/* Display shortened file name */}
                                                    </Box>
                                                </Box>
                                            </Tooltip>
                                        ))
                                    ) : (
                                        <Box>
                                            <Typography sx={{ mt: "10px" }} variant="h6">{t("noUplaodedDocumentsAvailable")}</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </div>

                    </Grid>
                    {selectedFile && (
                        <FilePopup open={isPopupOpen} onClose={handleClosePopup} fileUrl={selectedFile.fileUrl} fileType={selectedFile.fileType} />
                    )}
                </Grid>
            </Card>
        </Box >

    );
};

export default AnnonymousDocs;
