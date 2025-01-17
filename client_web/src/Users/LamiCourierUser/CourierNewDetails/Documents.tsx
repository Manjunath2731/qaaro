import { Box, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import FilePopup from 'src/components/FIlePopup/FilePopUp';
import { useSelector } from 'src/store';
import FileIcon from 'src/components/FIleType/FileType';


function Documents() {


    const { courierDetails, status, error } = useSelector((state) => state.courierDetails);
    const [isFilePopupOpen, setIsFilePopupOpen] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileClick = (fileUrl, fileType) => {
        setSelectedFile({ fileUrl, fileType });
        setIsFilePopupOpen(true);
    };
    const handleCloseFilePopup = () => {
        setIsFilePopupOpen(false);
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
            // Add cases for other file types if needed
            default:
                return 'unknown';
        }
    };
    const getFileName = (fileUrl: string) => {
        const splitUrl = fileUrl.split('/');
        return splitUrl[splitUrl.length - 1]; // Get the last part of the URL which is the file name
    };

    const getShortenedFileName = (fileName: string) => {
        return fileName.length > 15 ? fileName.substring(0, 15) + '...' : fileName;
    };

    return (
        <>
            <Box>

                <Box sx={{ mt: 2 }}>
                    <Typography sx={{ fontWeight: "bold", margin: "30px", paddingLeft: "20px" }}>Uploaded Documents </Typography>
                    <Box gap={"20px"} padding={"10px"} paddingLeft={"38px"} display="flex" flexDirection="row" flexWrap={"wrap"} alignItems="center" sx={{ mt: "-10px" }}>
                        {courierDetails?.signedoc?.files && courierDetails.signedoc.files.length > 0 ? (
                            courierDetails.signedoc.files.map((fileUrl, index) => (
                                <Tooltip title={getFileName(fileUrl)} key={index}>
                                    <Box mr={1}>
                                        <Box mt={1} ml={3} mb={"11px"} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                            <FileIcon fileUrl={fileUrl} onClick={() => handleFileClick(fileUrl, getFileType(fileUrl))} />
                                            <Typography variant="h6">{getShortenedFileName(getFileName(fileUrl))}</Typography>
                                        </Box>
                                    </Box>
                                </Tooltip>

                            ))

                        ) : (
                            <Box ml={3} mt={3} pb={9.3}>
                                <Typography variant="h6">No Attachments Available</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
                <Box sx={{ mt: 2, padding: "30px", paddingLeft: "50px", display: "flex", flexDirection: "column", flexWrap: "wrap" }}>
                    <Typography sx={{ fontWeight: "bold", wordWrap: "break-word", }}>Return Description</Typography>
                    <Typography sx={{ fontWeight: "bold", wordWrap: "break-word", }}>{courierDetails?.returnDescCouri}</Typography>
                </Box>
                <Box sx={{ mt: 6 }}>

                    <Typography sx={{ fontWeight: "bold", margin: "30px", paddingLeft: "20px" }}>Attachments</Typography>

                    <Box padding="20px" width={"100%"} pl={"60px"} gap={"10px"} display="flex" flexWrap={"wrap"} flexDirection="row" alignItems="center" sx={{ mt: "-20px" }}
                    >

                        {courierDetails?.attachment?.files && courierDetails.attachment.files.length > 0 ? (
                            courierDetails.attachment.files.map((fileUrl, index) => (
                                <Tooltip title={getFileName(fileUrl)} key={index}>
                                    <Box mt={1} display="flex" flexWrap={"wrap"} flexDirection="column" alignItems="center" >
                                        <FileIcon fileUrl={fileUrl} onClick={() => handleFileClick(fileUrl, getFileType(fileUrl))} />
                                        <Typography variant="h6">{getShortenedFileName(getFileName(fileUrl))}</Typography> {/* Display shortened file name */}
                                    </Box>
                                </Tooltip>
                            ))
                        ) : (
                            <Box sx={{ pb: "100px" }}>
                                <Typography sx={{ mt: "20px" }} variant="h6">No Uploadeded Documents Available</Typography>
                            </Box>)}
                    </Box>
                </Box>
            </Box>



            {selectedFile && (
                <FilePopup open={isFilePopupOpen} onClose={handleCloseFilePopup} fileUrl={selectedFile.fileUrl} fileType={selectedFile.fileType} />
            )}
        </>
    )
}

export default Documents
