import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, Card, Grid, Tooltip, Divider, IconButton, useTheme } from '@mui/material';
import { useSelector } from '../../../../../store';
import { useTranslation } from 'react-i18next';
import FileIcon from 'src/components/FIleType/FileType';
import FilePopup from 'src/components/FIlePopup/FilePopUp';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import AttachEmailOutlinedIcon from '@mui/icons-material/AttachEmailOutlined';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import EditPopup from './EditDetails';
import EditDeniedDescriptionPopup from './EditDesc';
import { useMediaQuery, Theme } from '@mui/material'; // Import useMediaQuery and Theme from @mui/material
import EditInvoiceAndInsu from './EditInvoiceAndInsurance';
import StatusLabel from 'src/components/Label/statusLabel';
import SubStatusLabel from 'src/components/Label/subStatusLabel';

interface TabComponentProps {
    ticketDetails: any; // Define type for ticketDetails
    status: any;
    error: any;
}


const TabComponent: React.FC<TabComponentProps> = ({ ticketDetails }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const [clickedButton, setClickedButton] = useState<string | null>(null);
    console.log("ticketDetails DATA in tab", ticketDetails)
    const status = useSelector((state) => state.ticketDetails.status);


    const [selectedFile, setSelectedFile] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);


    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [popupData, setPopupData] = useState(null);
    const [popupCaseType, setPopupCaseType] = useState("");

    const [isEditPopupOpenTwo, setIsEditPopupOpenTwo] = useState(false);
    const [popupDataTwo, setPopupDataTwo] = useState(null);
    const [popupCaseTypeTwo, setPopupCaseTypeTwo] = useState("");



    const [isEditPopupOpenAgain, setEditPopupOpenAgain] = useState(false);
    const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);


    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isXLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    useEffect(() => {
        // Reset clickedButton to "Ticket Details" when ticketDetails changes
        setClickedButton("ticketDetails");
    }, [ticketDetails]);

    const handleButtonClick = (buttonName: string) => {
        setClickedButton(buttonName);

    };

    if (status === 'loading') {
        return (
            <Typography>Loading...</Typography>
        );
    }
    //DOCUMENTS LOGICS ALL HERE

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


    const getStatusLabelColor = (status: string) => {
        switch (status) {
            case 'NEW':
                return 'primary';
            case 'LOCO':
                return 'info';
            case 'COURIER':
                return 'warning';
            case 'PRELOCO':
                return 'secondary';
            case 'LOCO SUCCESS':
                return 'success';
            case 'LOCO LOST':
                return 'error';
            case 'INSURANCE':
                return 'black';
            case 'INVOICED':
                return 'success';
            case 'INSUOKAY':
                return 'success';
            case 'INSUREJECT':
                return 'error';
            case 'NOINSU':
                return 'error';
            default:
                return 'secondary';
        }
    };

    const getSubStatusBagroundColor = (SubStatus: string) => {
        switch (SubStatus) {
            case 'LAMI RETURNED':
                return 'primary';
            case 'COURIER RETURNED':
                return 'warning';
            case 'CUSTOMER ACCEPTED':
                return 'success';
            case 'CUSTOMER DENIED':
                return 'error';

            default:
                return 'error';
        }
    };

    //Edit Functionalitiy

    const handleEditIconClick = (caseType, data) => {
        setPopupCaseType(caseType);
        setPopupData(data);
        setIsEditPopupOpen(true);
    };

    const handleEditIconClickTwo = (caseType, data) => {
        setPopupCaseTypeTwo(caseType);
        setPopupDataTwo(data);
        setIsEditPopupOpenTwo(true);
    };


    // Function to handle clicking on the "Edit" button
    const handleEditIconClickAgain = (details) => {
        setSelectedTicketDetails(details);
        setEditPopupOpenAgain(true);
    };

    // Function to handle closing the pop-up
    const handleClosePopupAgain = () => {
        setSelectedTicketDetails(null);
        setEditPopupOpenAgain(false);
    };

    const isEmptyObject = (obj) => {
        return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
    }


    const renderMessage = () => {
        switch (clickedButton) {
            case "ticketDetails":
                return (
                    <Box p={2} mb={2}>
                        <Box p={1.5}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    flexDirection: isSmallScreen || isMediumScreen ? "column" : "row",
                                }}
                            >
                                <Box>
                                    <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>{t("ticketDetails")}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'normal', gap: "10px" }}>
                                    <StatusLabel color={getStatusLabelColor(ticketDetails.status)}>
                                        {ticketDetails.status}
                                    </StatusLabel>
                                    {ticketDetails.SubStatus && (
                                        <SubStatusLabel color={getSubStatusBagroundColor(ticketDetails.SubStatus)}>
                                            {ticketDetails.SubStatus}
                                        </SubStatusLabel>
                                    )}


                                    <Box sx={{ display: 'inline-block', borderRadius: '8px', overflow: 'hidden' }}>
                                        <Tooltip title="Edit">
                                            <IconButton
                                                sx={{
                                                    '&:hover': { color: 'black' },
                                                    p: '4px',
                                                }}
                                                onClick={() => handleEditIconClick("Ticket Details", ticketDetails)}
                                                size="small"
                                            >
                                                <BorderColorTwoToneIcon sx={{ fontSize: "25px" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: "25px", mt: "3px", width: "100%", height: "3px" }} />

                            <Box mb={2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                        <Typography variant="body1" gutterBottom>{t('dpdTicketNumber')}:</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>{ticketDetails?.dpdTicketNumber}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                        <Typography variant="body1" gutterBottom>{t('complainNumber')}:</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>{ticketDetails?.complainNumber}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                        <Typography variant="body1" gutterBottom>{t('packageNumber')}:</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>{ticketDetails?.packageNumber}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Second Row */}
                            <Box mb={2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                        <Typography variant="body1" gutterBottom>{t('claimType')}:</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>{ticketDetails?.claimType}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                        <Typography variant="body1" gutterBottom>{t('amountInDispute')}: </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>{ticketDetails?.amountInDispute}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                        <Typography variant="body1" gutterBottom>{t('dpdReferenceNumber')}:</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>{ticketDetails?.dpdReferenceNumber}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Third Row */}
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                        <Typography variant="body1" gutterBottom>{t('deadLineDate')}:</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>{ticketDetails?.deadlineDate}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={8} lg={4} xl={4}>
                                        <Typography variant="body1" gutterBottom>{t('problem')}: </Typography>
                                        <Tooltip title={ticketDetails?.problem || ''}>
                                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                                {ticketDetails?.problem ? (ticketDetails?.problem.length > 25 ? ticketDetails?.problem.substring(0, 350) + '...' : ticketDetails?.problem) : ''}
                                            </Typography>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Box>
                );
            case "parcelLabel":
                return (
                    <Box p={2}


                        marginBottom={2}>

                        <Box p={1.5}>
                            <Box sx={{
                                display: "flex", justifyContent: "space-between",
                                flexDirection: isSmallScreen || isMediumScreen ? "column" : "row",
                            }}
                            >
                                <Box>
                                    <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>{t("parcelLabelAddress")} </Typography>

                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'normal',
                                        gap: "10px"
                                    }}
                                >

                                    <StatusLabel color={getStatusLabelColor(ticketDetails.status)}>
                                        {ticketDetails.status}
                                    </StatusLabel>

                                    {ticketDetails.SubStatus && (
                                        <SubStatusLabel color={getSubStatusBagroundColor(ticketDetails.SubStatus)}>
                                            {ticketDetails.SubStatus}
                                        </SubStatusLabel>
                                    )}
                                    <Box
                                        sx={{
                                            display: 'inline-block',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Tooltip title="Edit">
                                            <IconButton
                                                sx={{
                                                    '&:hover': {

                                                        color: 'black',
                                                    },
                                                    padding: '4px',
                                                }}
                                                onClick={() => handleEditIconClick("Parcel Label Address", ticketDetails)}
                                                size="small"
                                            >
                                                <BorderColorTwoToneIcon sx={{ fontSize: "25px" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: "25px", mt: "3px", width: "115%", height: "3px" }} />

                            <Box mb={2}>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12} md={12} lg={6}>
                                        <Typography>{t('name')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.parcelLabelAddress?.name}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={6}>
                                        <Typography>{t('address')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.parcelLabelAddress?.address}</Typography>
                                    </Grid>

                                </Grid>
                            </Box>




                        </Box>
                    </Box>
                );
            case "recipent":
                return (
                    <Box p={2}

                        marginBottom={2}>


                        <Box p={1.5}>
                            <Box sx={{
                                display: "flex", justifyContent: "space-between", flexDirection: isSmallScreen || isMediumScreen ? "column" : "row",
                            }} >
                                <Box>
                                    <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>{t("recipentAddress")}</Typography>

                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'normal', gap: "10px" }}>

                                    <StatusLabel color={getStatusLabelColor(ticketDetails.status)}>
                                        {ticketDetails.status}
                                    </StatusLabel>
                                    {ticketDetails.SubStatus && (
                                        <SubStatusLabel color={getSubStatusBagroundColor(ticketDetails.SubStatus)}>
                                            {ticketDetails.SubStatus}
                                        </SubStatusLabel>
                                    )}
                                    <Box
                                        sx={{
                                            display: 'inline-block',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Tooltip title="Edit">
                                            <IconButton
                                                sx={{
                                                    '&:hover': {

                                                        color: 'black',
                                                    },
                                                    padding: '4px',
                                                }}
                                                onClick={() => handleEditIconClick("Recipient Address", ticketDetails)}
                                                size="small"
                                            >
                                                <BorderColorTwoToneIcon sx={{ fontSize: "25px" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: "25px", mt: "3px", width: "115%", height: "3px" }} />

                            <Box mb={2}>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography>{t('Name')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.recipientDetails?.name}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography>{t('address')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.recipientDetails?.address}</Typography>
                                    </Grid>

                                </Grid>
                            </Box>




                        </Box>
                    </Box>
                );
            case "packageDetails":
                return (
                    <Box p={2}

                        marginBottom={2}>
                        <Box p={1.5}>

                            <Box sx={{
                                display: "flex", justifyContent: "space-between", flexDirection: isSmallScreen || isMediumScreen ? "column" : "row",
                            }} >
                                <Box>
                                    <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>{t("packageDetails")}</Typography>

                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'normal', gap: "10px" }}>

                                    <StatusLabel color={getStatusLabelColor(ticketDetails.status)}>
                                        {ticketDetails.status}
                                    </StatusLabel>
                                    {ticketDetails.SubStatus && (
                                        <SubStatusLabel color={getSubStatusBagroundColor(ticketDetails.SubStatus)}>
                                            {ticketDetails.SubStatus}
                                        </SubStatusLabel>
                                    )}
                                    <Box
                                        sx={{
                                            display: 'inline-block',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Tooltip title="Edit">
                                            <IconButton
                                                sx={{
                                                    '&:hover': {

                                                        color: 'black',
                                                    },
                                                    padding: '4px',
                                                }}
                                                onClick={() => handleEditIconClick("Package Details", ticketDetails)}
                                                size="small"
                                            >
                                                <BorderColorTwoToneIcon sx={{ fontSize: "25px" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: "25px", mt: "3px", width: "115%", height: "3px" }} />


                            <Box mb={2}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <Typography>{t('item')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.packageDetails?.item}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <Typography>{t('category')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.packageDetails?.category}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <Typography>{t('amountInDispute')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.packageDetails?.amount}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box mb={2}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <Typography>{t('manufacture')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.packageDetails?.manufacturer}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <Typography>{t('article')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.packageDetails?.article}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <Typography>{t('furtherInformation')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.packageDetails?.furtherInformation}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Typography>{t('serialNumber')}:</Typography>
                                    <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.packageDetails?.serialNumber}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Typography>{t('EAN')}:</Typography>
                                    <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.packageDetails?.ean}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Typography>{t('ID')}:</Typography>
                                    <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.packageDetails?.id}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                );
            case "document":
                return (
                    <Box p={2}

                        marginBottom={2}>



                        <Box p={1.5} >
                            <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: isSmallScreen ? "column" : "row" }} >
                                <Box>
                                    <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>{t("uploadedDocuments")}</Typography>

                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'normal', gap: "10px" }}>

                                    <StatusLabel color={getStatusLabelColor(ticketDetails.status)}>
                                        {ticketDetails.status}
                                    </StatusLabel>
                                    {ticketDetails.SubStatus && (
                                        <SubStatusLabel color={getSubStatusBagroundColor(ticketDetails.SubStatus)}>
                                            {ticketDetails.SubStatus}
                                        </SubStatusLabel>
                                    )}
                                    {ticketDetails?.SubStatus === "CUSTOMER DENIED" && (
                                        <Tooltip title="Edit">
                                            <IconButton
                                                sx={{
                                                    '&:hover': {

                                                        color: 'black',
                                                    },
                                                    padding: '4px',
                                                }}
                                                onClick={() => handleEditIconClickAgain(ticketDetails)}
                                                size="small"
                                            >
                                                <BorderColorTwoToneIcon sx={{ fontSize: "25px" }} />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                </Box>
                            </Box>
                            <Divider sx={{ mb: "25px", mt: "3px", width: "115%", height: "3px" }} />

                            <Box mb={2}>
                                <Grid container spacing={1}> {/* Add spacing between grid items */}
                                    {ticketDetails?.signedoc?.files && ticketDetails.signedoc.files.length > 0 ? (
                                        ticketDetails.signedoc.files.map((fileUrl, index) => (
                                            <Grid key={index} item xs={6} sm={6} lg={3} xl={3}> {/* Adjust xs, sm, lg, and xl to desired widths */}
                                                <Tooltip title={getFileName(fileUrl)}>
                                                    <Box mr={1} mb={1} width="100%">
                                                        <Box display="flex" flexDirection="column" alignItems="center">
                                                            {/* Assuming FileIcon is a component that displays the file icon */}
                                                            <FileIcon fileUrl={fileUrl} onClick={() => handleFileClick(fileUrl, getFileType(fileUrl))} />
                                                            <Typography variant="body1" align="center">{getShortenedFileName(getFileName(fileUrl))}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Tooltip>
                                            </Grid>
                                        ))
                                    ) : (
                                        <Box>
                                            <Typography sx={{ mt: "20px" }} variant="h6">{t("noUploadedDocAvailable")}</Typography>
                                        </Box>
                                    )}
                                </Grid>








                            </Box>

                        </Box>
                    </Box>
                );
            case "returnDesc":
                return (
                    <Box p={2}

                        marginBottom={2}>

                        <Box p={1.5}>
                            <Box sx={{
                                display: "flex", justifyContent: "space-between", flexDirection: isSmallScreen || isMediumScreen ? "column" : "row"
                            }} >
                                <Box>
                                    <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>{t("returnDesc")}</Typography>

                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'normal', gap: "10px" }}>

                                    <StatusLabel color={getStatusLabelColor(ticketDetails.status)}>
                                        {ticketDetails.status}
                                    </StatusLabel>
                                    {ticketDetails.SubStatus && (
                                        <SubStatusLabel color={getSubStatusBagroundColor(ticketDetails.SubStatus)}>
                                            {ticketDetails.SubStatus}
                                        </SubStatusLabel>
                                    )}
                                </Box>
                            </Box>
                            <Divider sx={{ mb: "25px", mt: "3px", width: "115%", height: "3px" }} />

                            <Box mb={2}>

                                <Grid container spacing={3}>
                                    <Grid item xs={4} lg={62}>
                                        <Typography>{t('courierReturnDesc')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.returnDescCouri}</Typography>
                                    </Grid>

                                </Grid>
                                <Grid container spacing={3} sx={{ mt: "30px" }}>
                                    <Grid item xs={4} lg={62}>
                                        <Typography>{t('lamiReturnDesc')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.returnDescLami}</Typography>

                                    </Grid>

                                </Grid>
                            </Box>




                        </Box>
                    </Box>
                );
            case "attachments":
                return (
                    <Box p={2}

                        marginBottom={2}>

                        <Box p={1.5} >
                            <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: isSmallScreen || isMediumScreen ? "column" : "row" }} >
                                <Box>
                                    <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>{t("attachments")}</Typography>

                                </Box>
                                <Box sx={{
                                    display: 'flex', justifyContent: 'normal', gap: "10px",
                                }}>

                                    <StatusLabel color={getStatusLabelColor(ticketDetails.status)}>
                                        {ticketDetails.status}
                                    </StatusLabel>
                                    {ticketDetails.SubStatus && (
                                        <SubStatusLabel color={getSubStatusBagroundColor(ticketDetails.SubStatus)}>
                                            {ticketDetails.SubStatus}
                                        </SubStatusLabel>
                                    )}
                                </Box>
                            </Box>
                            <Divider sx={{ mb: "25px", mt: "3px", width: "115%", height: "3px" }} />

                            <Box mb={2}>
                                <Grid container spacing={1}> {/* Add spacing between grid items */}
                                    {ticketDetails?.attachment?.files && ticketDetails.attachment.files.length > 0 ? (
                                        ticketDetails.attachment.files.map((fileUrl, index) => (
                                            <Grid key={index} item xs={6} sm={6} lg={3} xl={3}> {/* Adjust xs, sm, lg, and xl to desired widths */}
                                                <Tooltip title={getFileName(fileUrl)}>
                                                    <Box mr={1} mb={1} width="100%">
                                                        <Box display="flex" flexDirection="column" alignItems="center">
                                                            {/* Assuming FileIcon is a component that displays the file icon */}
                                                            <FileIcon fileUrl={fileUrl} onClick={() => handleFileClick(fileUrl, getFileType(fileUrl))} />
                                                            <Typography variant="body1" align="center">{getShortenedFileName(getFileName(fileUrl))}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Tooltip>
                                            </Grid>
                                        ))
                                    ) : (
                                        <Box>
                                            <Typography sx={{ mt: "20px" }} variant="h6">{("noUploadedDocAvailable")}</Typography>
                                        </Box>
                                    )}
                                </Grid>
                            </Box>

                        </Box>
                    </Box>
                );
            case "invoice":
                return (
                    <Box p={2}

                        marginBottom={2}>
                        <Box p={1.5}>

                            <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: isSmallScreen ? "column" : "row" }} >
                                <Box>
                                    <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>{t("invoice")} Details</Typography>

                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'normal', gap: "10px" }}>

                                    <StatusLabel color={getStatusLabelColor(ticketDetails.status)}>
                                        {ticketDetails.status}
                                    </StatusLabel>
                                    {ticketDetails.SubStatus && (
                                        <SubStatusLabel color={getSubStatusBagroundColor(ticketDetails.SubStatus)}>
                                            {ticketDetails.SubStatus}
                                        </SubStatusLabel>
                                    )}
                                    {ticketDetails?.status === "INVOICED" && (
                                        <Box
                                            sx={{
                                                display: 'inline-block',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    sx={{
                                                        '&:hover': {

                                                            color: 'black',
                                                        },
                                                        padding: '4px',
                                                    }}
                                                    onClick={() => handleEditIconClickTwo("Invoice", ticketDetails.invoicedData)}
                                                    size="small"
                                                >
                                                    <BorderColorTwoToneIcon sx={{ fontSize: "25px" }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>

                                    )}

                                </Box>
                            </Box>
                            <Divider sx={{ mb: "25px", mt: "3px", width: "115%", height: "3px" }} />


                            <Box mb={2}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography>{t('emailHeaderNumber')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.invoicedData?.mailHeaderNumber}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography>{t('dPDInvoiceNumber')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.invoicedData?.dpdInvoiceNumber}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography>{t('invoiceDate')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{formatDate(ticketDetails?.invoicedData?.date)}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box mb={2}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography>{t('complainNumber')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.complainNumber}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography>{t('packageNumber')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.packageNumber}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography>{t('Final Amount To Pay')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.invoicedData?.finalLostAmmount}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box mb={2} mt={5}>


                                <Grid container spacing={3}>
                                    <Typography sx={{ paddingLeft: "25px" }}>{t('attachments')}:</Typography>

                                    <Box mt={3} gap={4} display="flex" flexWrap="wrap" alignItems="center" justifyContent="flex-start" maxWidth="115%" flexDirection={isSmallScreen ? "column" : "row"}
                                    >
                                        {ticketDetails?.invoicedData?.attachment?.files && ticketDetails?.invoicedData?.attachment?.files.length > 0 ? (
                                            ticketDetails.invoicedData.attachment.files.map((fileUrl, index) => (
                                                <Tooltip title={getFileName(fileUrl)} key={index}>
                                                    <Box mr={1} mb={1} width="calc(25% - 16px)"> {/* Set each file item to occupy 25% of the container width with margin included */}
                                                        <Box display="flex" flexDirection="column" alignItems="center">
                                                            <FileIcon fileUrl={fileUrl} onClick={() => handleFileClick(fileUrl, getFileType(fileUrl))} />
                                                            <Typography variant="h6">{getShortenedFileName(getFileName(fileUrl))}</Typography> {/* Display shortened file name */}
                                                        </Box>
                                                    </Box>
                                                </Tooltip>
                                            ))
                                        ) : (
                                            <Box>
                                                <Typography sx={{ mt: "40px" }} variant="h6">No Uploaded documents available</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>
                            </Box>
                        </Box>
                    </Box>
                );
            case "insurance":
                return (
                    <Box p={2}

                        marginBottom={2}>
                        <Box p={1.5}>

                            <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: isSmallScreen ? "column" : "row" }} >
                                <Box>
                                    <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>{t("insurance")} Details</Typography>

                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'normal', gap: "10px" }}>

                                    <StatusLabel color={getStatusLabelColor(ticketDetails.status)}>
                                        {ticketDetails.status}
                                    </StatusLabel>
                                    {ticketDetails.SubStatus && (
                                        <SubStatusLabel color={getSubStatusBagroundColor(ticketDetails.SubStatus)}>
                                            {ticketDetails.SubStatus}
                                        </SubStatusLabel>
                                    )}
                                    {(ticketDetails.status === "INSUOKAY" || ticketDetails.status === "INSUREJECT") && (
                                        <Box
                                            sx={{
                                                display: 'inline-block',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    sx={{
                                                        '&:hover': {

                                                            color: 'black',
                                                        },
                                                        padding: '4px',
                                                    }}
                                                    onClick={() => handleEditIconClickTwo("Insurance", ticketDetails.insuranceData)}
                                                    size="small"
                                                >
                                                    <BorderColorTwoToneIcon sx={{ fontSize: "25px" }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    )}

                                </Box>
                            </Box>
                            <Divider sx={{ mb: "25px", mt: "3px", width: "115%", height: "3px" }} />


                            <Box mb={2}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography>{t('claimNumber')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.insuranceData?.insuClaimNumber}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography>{t('ourSign')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.insuranceData?.insuOurSign}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography>{t('date')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.insuranceData?.insuDate}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box mb={2}>
                                <Grid container spacing={3}>

                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography>{t('claim')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.insuranceData?.insuCompensationAmount}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={6}>
                                        <Typography>{t('deductible')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.insuranceData?.insuDeductible}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography>{t('compensation')}:</Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.insuranceData?.insuTransferAmount}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} md={6} lg={62}>
                                    <Typography>{t('note')}:</Typography>
                                    <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.insuranceData?.notes}</Typography>
                                </Grid>

                            </Grid>
                        </Box>
                    </Box>
                );
            default:
                return null;
        }
    };
    const buttonMapping = {
        ticketDetails: t("ticketDetails"),
        packageDetails: t("packageDetails"),
        parcelLabel: t("parcelLabel"),
        recipent: t("recipent"),
        attachments: t("attachments"),
        returnDesc: t("returnDesc"),
        document: t("document"),
        invoice: t("invoice"),
        insurance: t("insurance"),
    };

    const buttons = [
        { key: "ticketDetails", icon: <PrivacyTipOutlinedIcon /> },
        { key: "packageDetails", icon: <ClassOutlinedIcon /> },
        { key: "parcelLabel", icon: <HomeOutlinedIcon /> },
        { key: "recipent", icon: <AccountCircleOutlinedIcon /> },
        { key: "attachments", icon: <AttachEmailOutlinedIcon /> },
        { key: "returnDesc", icon: <AssignmentReturnOutlinedIcon /> },
        { key: "document", icon: <ContentPasteOutlinedIcon /> },
        
    ];

    return (
        <>
            <Box sx={{ display: 'flex', mt: "30px" }}>
                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                    {buttons.map((button, index) => (
                        <Button
                            key={index}
                            variant="contained"
                            onClick={() => handleButtonClick(button.key)}
                            style={{
                                width: "230px",
                                marginBottom: '15px',
                                backgroundColor: clickedButton === button.key ? 'white' : 'white',
                                color: clickedButton === button.key ? 'black' : '#989898',
                                border: clickedButton === button.key ? '2px solid #8FC5FF' : '#8c8c8c',
                                boxShadow: clickedButton === button.key ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : '0px 8px 8px rgba(0, 0, 0, 0.1)',
                                justifyContent: "flex-start",
                                gap: "10px"
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: "flex-start", alignItems: "left", gap: "10px" }}>
                                {React.cloneElement(button.icon, {
                                    style: { color: clickedButton === button.key ? '#000000' : '#989898' }
                                })}
                                <Typography>{buttonMapping[button.key]}</Typography>
                            </Box>
                        </Button>
                    ))}
                    {!isEmptyObject(ticketDetails.invoicedData) && (
                        <Button
                            variant="contained"
                            onClick={() => handleButtonClick("invoice")}
                            style={{
                                width: "230px",
                                marginBottom: '15px',
                                backgroundColor: clickedButton === "invoice" ? 'white' : 'white',
                                color: clickedButton === "invoice" ? 'black' : '#989898',
                                border: clickedButton === "invoice" ? '2px solid #8FC5FF' : '#8c8c8c',
                                boxShadow: clickedButton === "invoice" ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : '0px 8px 8px rgba(0, 0, 0, 0.1)',
                                justifyContent: "flex-start",
                                gap: "10px"
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: "flex-start", alignItems: "left", gap: "10px" }}>
                                <HomeOutlinedIcon />
                                <Typography>{buttonMapping["invoice"]}</Typography>
                            </Box>
                        </Button>
                    )}
                    {!isEmptyObject(ticketDetails?.insuranceData) && (
                        <Button
                            variant="contained"
                            onClick={() => handleButtonClick("insurance")}
                            style={{
                                width: "230px",
                                marginBottom: '15px',
                                backgroundColor: clickedButton === "insurance" ? 'white' : 'white',
                                color: clickedButton === "insurance" ? 'black' : '#989898',
                                border: clickedButton === "insurance" ? '2px solid #8FC5FF' : '#8c8c8c',
                                boxShadow: clickedButton === "insurance" ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : '0px 8px 8px rgba(0, 0, 0, 0.1)',
                                justifyContent: "flex-start",
                                gap: "10px"
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: "flex-start", alignItems: "left", gap: "10px" }}>
                                <HomeOutlinedIcon />
                                <Typography>{buttonMapping["insurance"]}</Typography>
                            </Box>
                        </Button>
                    )}
                </div>

                <Card style={{ overflow: 'hidden', width: '100%', height: '478px' }}>
                    {renderMessage()}
                    {isEditPopupOpen && (
                        <EditPopup
                            caseType={popupCaseType}
                            data={popupData}
                            open={isEditPopupOpen}
                            onClose={() => setIsEditPopupOpen(false)}
                        />
                    )}
                    {isEditPopupOpenTwo && (
                        <EditInvoiceAndInsu
                            caseType={popupCaseTypeTwo}
                            data={popupDataTwo}
                            open={isEditPopupOpenTwo}
                            onClose={() => setIsEditPopupOpenTwo(false)}
                        />
                    )}
                </Card>
            </Box>

            {selectedFile && (
                <FilePopup open={isPopupOpen} onClose={handleClosePopup} fileUrl={selectedFile.fileUrl} fileType={selectedFile.fileType} />
            )}
            <EditDeniedDescriptionPopup
                ticketDetails={selectedTicketDetails}
                isOpen={isEditPopupOpenAgain}
                onClose={handleClosePopupAgain}
            />
        </>
    );
};

export default TabComponent;
