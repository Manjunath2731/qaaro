import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'src/store/rootReducer';
import { finalizeNoClaim } from 'src/slices/Ticket/NoClaim';
import { useTranslation } from 'react-i18next';

const NoClaim = ({ open, onClose }) => {
    const ticketDetails = useSelector((state) => state.ticketDetails.ticketDetails);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const ticketFinal = useSelector((state: RootState) => state.ticketFinal.status);

    const [description, setDescription] = useState('');

    const handleConfirm = async () => {
        try {
            // Dispatch the finalizeTicket action with ticketId, status, and description
            await dispatch(finalizeNoClaim({ ticketId: ticketDetails._id, description }));
            // Close the confirmation dialog
            onClose();
            navigate(`/lami/ticket-ticket_list`);
        } catch (error) {
            // Handle error
            console.error('Error finalizing ticket:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography variant='h3'>{t("noInsurance")}</Typography>
            </DialogTitle>
            <DialogTitle sx={{ mt: "-25px" }}>
                <Typography variant='h6'>{t("pleaseProvideBelowDetails")}</Typography>
            </DialogTitle>            <DialogContent>
                <TextField
                    sx={{ width: "500px" }}
                    autoFocus
                    multiline
                    rows={5}
                    margin="dense"
                    id="description"
                    label={t("description")}
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant='outlined' color="primary">
                    {t("cancel")}
                </Button>
                <Button variant='contained' onClick={handleConfirm} color="primary" autoFocus disabled={!description}>
                    {ticketFinal === 'loading' ? <CircularProgress color='inherit' size="1rem" /> : t("send")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NoClaim;
