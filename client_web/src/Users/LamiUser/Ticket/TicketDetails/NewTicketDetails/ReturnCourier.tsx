import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, CircularProgress, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reassignCourierToTicket } from '../../../../../slices/Ticket/Re-AssignCourier'; // Importing the async thunk
import { fetchTicketList } from 'src/slices/Ticket/GetTicketList';
import { useDispatch } from 'src/store';
import { ErrorOutline } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface CourierReturnProps {
    open: boolean;
    onClose: () => void;
    onReAssign: (description: string) => void; // Update the function signature
}

const CourierReturn: React.FC<CourierReturnProps> = ({ open, onClose, onReAssign }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const reassignCourierStatus = useSelector((state: any) => state.reassignCourier.status);

    const reassignCourierError = useSelector((state: any) => state.reassignCourier.error);

    const navigate = useNavigate();

    const [showErrorMessage, setShowErrorMessage] = useState(false); // State to control visibility of error message box

    const [description, setDescription] = useState('');

    const handleReAssign = () => {
        onReAssign(description); // Pass the description


    };


    const transformErrorMessage = (errorMessage: string): string => {
        switch (errorMessage) {

            case 'phone_duplicate':
                return 'Please check your Phone No. This one is already in use !'
            default:
                return 'Something went wrong. Please try again.';
        }
    };


    useEffect(() => {
        if (reassignCourierStatus === 'failed') {
            setShowErrorMessage(true);
            const timer = setTimeout(() => {
                setShowErrorMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [reassignCourierStatus]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography variant='h3'>{t("reassignToCourier")}</Typography>
            </DialogTitle>
            <DialogTitle sx={{ mt: "-25px" }}>
                <Typography variant='h6'>{t("pleaseProvideBelowDetails")}</Typography>
            </DialogTitle>

            <DialogContent>
                {showErrorMessage && (
                    <Box sx={{ mt: "10px", mb: "10px", bgcolor: "#ffede9" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
                            <ErrorOutline sx={{ mr: 1 }} />
                            <Typography variant='body1'>
                                {transformErrorMessage(reassignCourierError)}
                            </Typography>
                        </Box>
                    </Box>
                )}
                <TextField
                    multiline
                    rows={6}
                    variant="outlined"
                    sx={{ width: "500px" }}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        console.log("Description updated:", e.target.value);
                    }}

                // Update description state here
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="outlined">
                    {t("cancel")}
                </Button>
                <Button
                    onClick={handleReAssign}
                    color="primary"
                    disabled={reassignCourierStatus === 'loading' || description.trim() === ''}
                    variant="contained"
                >
                    {reassignCourierStatus === 'loading' ? <CircularProgress size={24} /> : t("reAssign")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CourierReturn;
