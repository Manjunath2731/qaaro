import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Card,
    styled,
    Avatar,
    CardContent,
    Button,
    useMediaQuery,
    Theme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from '../../../../../store';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import CourierChangePopup from './ChangeCourier.';
import { assignCourierToTicket } from 'src/slices/Ticket/AssignCourier';
import { fetchTicketDetails } from 'src/slices/Ticket/TicketDetails';
import { useParams } from 'react-router-dom';
import CourierSelectionPopup from '../AssignConfirmation';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';






import { MdDateRange } from "react-icons/md";

import Label from 'src/components/Label';

function CourierAvatar() {
    const { t }: { t: any } = useTranslation();
    const dispatch = useDispatch();
    const { ticketId } = useParams();

    const ticketDetails = useSelector((state) => state.ticketDetails.ticketDetails);
    const isCourierAssigned = ticketDetails?.courierdata;
    const [openPopup, setOpenPopup] = useState(false); // State to manage popup open/close
    const [existingCourierId, setExistingCourierId] = useState(null); // State to store existing courier _id
    const [openCourierPopup, setOpenCourierPopup] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState('');


    const [openCourierSelection, setOpenCourierSelection] = useState(false); // State to control CourierSelectionPopup visibility


    const handleOpenCourierSelection = () => {
        setOpenCourierSelection(true);
    };

    const handleAssignDescription = (courierId: string, description: string) => {
        dispatch(assignCourierToTicket({ ticketId: selectedTicketId, courierId, description })).then(() => dispatch(fetchTicketDetails(selectedTicketId)));
        setOpenPopup(false);
    };

    const handleCloseCourierSelection = () => {
        setOpenCourierSelection(false);
    };



    console.log("DATA OF TICKETID", ticketId)
    const handleEditClick = (courierId) => {
        console.log("Edit icon clicked. Courier ID:", courierId);
        setExistingCourierId(courierId); // Set the existing courier _id
        setOpenPopup(true); // Open the popup when the edit icon is clicked
    };


    const handleAssignToDriver = (ticketId: string, courierId: string) => {
        setOpenCourierSelection(true);
        setSelectedTicketId(ticketId); // Set the selected ticket ID
    };

    const handleClosePopup = () => {
        setOpenPopup(false); // Close the popup
    };

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.between("sm", "md"));


    return (
        <>


            <Card
                sx={{
                    p: 2
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Box display="flex" alignItems="center" mt={0.7}>
                        {!isSmallScreen && (
                            <Avatar src={ticketDetails?.courierdata?.avatar.url} sx={{ width: 60, height: 60, ml: 1, mr: 1 }}>
                                <AccountCircleIcon sx={{ fontSize: "65px" }} />
                            </Avatar>
                        )}

                        <Typography
                            variant="h5"
                            sx={{
                                pl: 1
                            }}
                            noWrap
                        >
                            {isCourierAssigned && ticketDetails?.status === 'COURIER' && (


                                <>
                                    <Typography sx={{
                                        fontWeight: "bold", cursor: "pointer", fontSize: "20px"
                                    }}>{ticketDetails?.courierdata?.name} </Typography>
                                    <Typography sx={{ fontWeight: "bold", mt: 0.3, color: "#B1B1B1", }}> Route No. {ticketDetails?.courierdata?.designation}</Typography>

                                </>
                            )}
                            <>
                                {!isCourierAssigned && (
                                    <Typography sx={{ fontWeight: "bold" }}>{t("noCourier")}</Typography>
                                )}
                            </>

                            <>
                                {isCourierAssigned && ticketDetails?.status !== 'COURIER' && (
                                    <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }} >
                                        <Typography sx={{
                                            fontWeight: "bold", fontSize: "20px"
                                        }}>{ticketDetails?.courierdata?.name}</Typography>

                                        <Typography sx={{ fontWeight: "bold", color: "#B1B1B1", }}> Route No. {ticketDetails?.courierdata?.designation}</Typography>

                                    </Box>
                                )}
                            </>
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            fontWeight: 'normal'
                        }}
                    >
                        {!isCourierAssigned && ticketDetails?.status === 'NEW' && (
                            <Button
                                sx={{
                                    textDecoration: "underline", cursor: "pointer", color: "blue", '&:hover': { // Override the hover effect
                                        backgroundColor: 'transparent', // Set the background color to transparent
                                    },
                                }}
                                onClick={() => handleAssignToDriver(ticketDetails?._id, ticketDetails?.courierdata?._id)}>
                                {t("assign")}
                            </Button>
                        )}
                        <>
                            {isCourierAssigned && ticketDetails?.status === 'COURIER' && (


                                <>

                                    <Box
                                        onClick={() => handleEditClick(ticketDetails?.courierdata?._id)}>
                                        <Button
                                            sx={{
                                                textDecoration: "underline", cursor: "pointer", color: "#E63571", '&:hover': { // Override the hover effect
                                                    backgroundColor: 'transparent', // Set the background color to transparent
                                                },
                                            }}>
                                            {t("remove")}
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </>

                    </Box >
                </Box >
                <Box
                    sx={{
                        pt: 1
                    }}
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                >
                    <Typography variant='h3'>
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>





                        </Box>
                        <>

                        </>

                    </Typography>


                </Box >
            </Card >
            {openPopup && <CourierChangePopup open={openPopup} onClose={handleClosePopup} existingCourierId={existingCourierId} />}

            <CourierSelectionPopup open={openCourierSelection} onClose={handleCloseCourierSelection}
                onSend={handleAssignDescription}

            />

        </>
    );
}

export default CourierAvatar;

