import { Box, MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import PageHeading from 'src/components/PageHeading/PageHeading';
import { useSelector, useDispatch } from 'src/store';
import AcceptedPopUp from '../Details/AcceptedPopUp';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { addAcceptedPdf } from 'src/slices/CourierDashboard/CourierAccepted';
import DeniedPopUp from '../Details/DeniedPopUp';
import { addDeniedPdf } from 'src/slices/CourierDashboard/CustomerDenied';
import ReturnConfirmation from '../CourierList/ReturnConfirmation';
import { useMediaQuery, Theme } from '@mui/material'; // Import useMediaQuery and Theme from @mui/material

const CourierHeader = () => {

    const { ticketId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { t }: { t: any } = useTranslation();
    const { courierDetails, status, error } = useSelector((state) => state.courierDetails);


    const [isSignaturePopupOpen, setIsSignaturePopupOpen] = useState(false); // State to manage popup visibility
    const [isDeniedPopupOpen, setIsDeniedPopupOpen] = useState(false); // State to manage popup visibility
    const [selectedTicketId, setSelectedTicketId] = useState<string>(''); // State to store the selected ticketId
    const [openPopup, setOpenPopup] = useState(false); // State to manage the visibility of the popup


    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));


    const handleSignatureSubmit = async (signatureImage: string, dateAndPlace: string, name: string) => {

        if (ticketId) {

            try {
                const actionResult = await dispatch(
                    addAcceptedPdf({ ticketId, signatureImage, place: dateAndPlace, name })
                );
                if (addAcceptedPdf.fulfilled.match(actionResult)) {
                    navigate(`/lami-courier/courier-list`);

                    handleClosePopup()
                }

            } catch (error) {
                console.error('Failed to submit signature:', error);
            }
        }
    };







    const handleClosePopup = () => {
        setIsSignaturePopupOpen(false);
    }


    const handleDeniedSubmit = async (formData: { description: string; signatureImage: string; dateTimePlace: string; name: string }) => {
        // Dispatch the addDeniedPdf action with the ticketId, description, signatureImage, and dateTimePlace
        if (ticketId) {
            try {
                const actionValue = await dispatch(addDeniedPdf({ ticketId, description: formData.description, signatureImage: formData.signatureImage, place: formData.dateTimePlace, name: formData.name }
                ));

                if (addDeniedPdf.fulfilled.match(actionValue)) {
                    navigate(`/lami-courier/courier-list`);

                    handleCloseDeniedPopup()
                }
            }


            catch (error) {
                console.error('Error:', error);
                // Handle error if needed
            }
        }
    };



    const handleCloseDeniedPopup = () => {
        setIsDeniedPopupOpen(false);
    };



    const handleReturnToLami = (ticketId: string) => {
        setSelectedTicketId(ticketId); // Store the selected ticketId
        setOpenPopup(true); // Open the popup when "Return to Lami" is clicked
    };

    const handleConfmClosePopup = () => {
        setOpenPopup(false); // Close the popup
    };

    const handleSendDescription = (description: string) => {

        setOpenPopup(false); // Close the popup after sending
        navigate(`/lami-courier/courier-list`);

    };



    return (
        <>
            <Box
                display="flex"
                flexDirection={isSmallScreen ? "column" : "row"}
                justifyContent="space-between"
                alignItems="flex-start"
                mb={2}
            >
                <Box sx={{ margin: "10px", marginTop: "20px" }}>
                    <Box sx={{ display: 'flex', flexDirection: "column", alignItems: 'left', gap: "5px", flexWrap: "wrap" }}>
                        <PageHeading>{t('ticketDetails')}</PageHeading>
                        <span>
                            <Typography variant='h3' sx={{ color: "#b1b1b1", fontSize: { xs: "20px", sm: "25px" } }}>{courierDetails?.complainNumber}</Typography>
                        </span>
                        {courierDetails?.description && (


                            <Box
                                bgcolor="#feffcf"
                                color="black"
                                borderRadius="10px"
                                p={1}
                                pt={1.5}
                                pb={1.5}
                                textAlign="left"


                            >
                                <Typography sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }} variant="h6">LaMi Note :- {courierDetails?.description}</Typography>

                            </Box>

                        )}

                    </Box>
                </Box>
                <Box display="flex" sx={{ marginTop: "25px", marginRight: "30px" }}>
                    {(courierDetails?.status === 'OPEN' || courierDetails?.status === 'RE-OPEN') && (
                        <>
                            <Select
                                value=""
                                displayEmpty
                                sx={{
                                    '& input': { px: 0, textAlign: 'center', color: 'black' },
                                    '& .MuiSelect-select': { textAlign: 'center' },
                                    backgroundColor: '#ffffff',
                                    borderRadius: '20px 20px 20px 20px',
                                    boxShadow: 'none',
                                    pt: '0px',
                                    pb: '0px',
                                    pl: '10px',
                                    pr: '10px',
                                    border: '1.5px solid #A6C4E7',
                                    color: '#007bff',
                                    width: '200px',
                                    height: '43px',
                                    '&:focus': {
                                        backgroundColor: '#ffffff',
                                        borderColor: '#A6C4E7 !important',
                                        boxShadow: 'none',
                                    },
                                }}
                                renderValue={(selected) => {
                                    if (selected === '') {
                                        return <em>{t('selectAction')}</em>;
                                    }
                                    return selected;
                                }}
                            >
                                <MenuItem value="" disabled>
                                    <em>{t('selectAction')}</em>
                                </MenuItem>
                                <MenuItem value="customerAccepted" onClick={() => setIsSignaturePopupOpen(true)}>
                                    {t('customerAccepted')}
                                </MenuItem>
                                <MenuItem value="customerDenied" onClick={() => setIsDeniedPopupOpen(true)}>
                                    {t('customerDenied')}
                                </MenuItem>
                                <MenuItem value="returnToLami" onClick={() => handleReturnToLami(ticketId)}>
                                    {t('returnToLami')}
                                </MenuItem>

                            </Select>
                        </>
                    )}


                </Box>
            </Box >

            <AcceptedPopUp isOpen={isSignaturePopupOpen} onClose={handleClosePopup} onSubmit={handleSignatureSubmit} />
            <DeniedPopUp isOpen={isDeniedPopupOpen} onClose={handleCloseDeniedPopup} onSubmit={handleDeniedSubmit} />
            <ReturnConfirmation open={openPopup} onClose={handleConfmClosePopup} onSend={handleSendDescription} ticketId={selectedTicketId} />

        </>


    )
}

export default CourierHeader
