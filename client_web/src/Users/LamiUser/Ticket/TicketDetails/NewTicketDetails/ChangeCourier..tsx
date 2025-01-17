import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../../../../store';
import { RootState } from '../../../../../store/rootReducer';
import { fetchLamiCouriers } from '../../../../../slices/LaMiCourierList/CourierGet';
import { changeCourier } from '../../../../../slices/Ticket/ChangeCourier'; // Import the changeCourier slice
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { fetchTicketDetails } from 'src/slices/Ticket/TicketDetails';
import { useTranslation } from 'react-i18next';

const CourierChangePopup: React.FC<{ open: boolean; onClose: () => void; existingCourierId: string | null }> = ({ open, onClose, existingCourierId }) => {

    const { t } = useTranslation();
    const [sending, setSending] = useState(false); // State to track sending status
    const [confirmOpen, setConfirmOpen] = useState(false); // State to manage confirmation popup
    const { ticketId } = useParams(); // Get ticketId from URL params
    console.log("sakhdkjhsad Ticket id", ticketId)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeCourierStatus = useSelector((state: RootState) => state.changeCourier.status); // Get the status of the changeCourier slice

    useEffect(() => {
        if (changeCourierStatus === 'succeeded') {
            onClose();
            dispatch(fetchTicketDetails(ticketId)); // Pass ticketId to fetchTicketDetails
        }
    }, [changeCourierStatus, onClose]);

    useEffect(() => {
        if (existingCourierId) {
            setConfirmOpen(true); // Open the confirmation popup
        }
    }, [existingCourierId]);


    const handleConfirmation = async () => {

        setSending(true);
        try {
            // Dispatch the changeCourier thunk action with the payload
            await dispatch(changeCourier({ ticketId, courierId: existingCourierId })); // Pass null for newCourierId
            console.log('Courier removed successfully');
            window.location.reload();
        } catch (error) {
            console.error('Failed to remove courier:', error);
            // Handle error accordingly
        } finally {
            setSending(false);
        }

    };

    const handleClose = () => {

        onClose();

    };


    return (
        <Dialog open={confirmOpen} onClose={onClose} maxWidth={false}>
            <DialogTitle sx={{
                width: "500px",
                fontWeight: "bold",
                fontSize: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",  // Center horizontally
                justifyContent: "center", // Center vertically
                mt: "10px"
            }}>
                <NotInterestedIcon sx={{ fontSize: "50px", color: "blue" }} />

                <Typography sx={{ fontWeight: "bold", fontSize: "20px", mt: "10px" }}>
                    {t("confirmationNeeded")}

                </Typography>

            </DialogTitle>



            <DialogTitle sx={{ fontSize: "20px", display: "flex", alignItems: "center", mt: "-10px" }} >
                Are you sure you want to remove this courier?
            </DialogTitle>
            <DialogContent>
                {/* You can add more details or context here if needed */}
            </DialogContent>
            <DialogActions >
                <Button variant='outlined' onClick={handleClose}>No</Button>
                <Button variant="contained" onClick={() => handleConfirmation()} disabled={sending}>
                    {sending ? 'Removing...' : ('yes')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CourierChangePopup;
