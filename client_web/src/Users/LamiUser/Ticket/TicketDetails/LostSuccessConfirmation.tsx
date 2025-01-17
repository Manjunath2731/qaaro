import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress, TextField, Typography, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';
import { useDispatch, useSelector } from '../../../../store';
import { finalizeTicket } from '../../../../slices/Ticket/Finalization'; // Update the path
import { useNavigate } from 'react-router-dom';
import { RootState } from 'src/store/rootReducer';
import { useTranslation } from 'react-i18next';

const FinalizeConfirmation = ({ open, onClose, ticketId }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const ticketFinal = useSelector((state: RootState) => state.ticketFinal.status);

    const [description, setDescription] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const handleConfirm = async () => {
        try {
            // Dispatch the finalizeTicket action with ticketId, selectedStatus, and description
            await dispatch(finalizeTicket({ ticketId, status: selectedStatus, description }));
            // Close the confirmation dialog
            onClose();
            navigate(`/lami/ticket-ticket_list`);
        } catch (error) {
            // Handle error
            console.error('Error finalizing ticket:', error);
        }
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography variant='h3'>{t("locoSuccessLost")}</Typography>
            </DialogTitle>
            <DialogTitle sx={{ mt: "-25px" }}>
                <Typography variant='h6'>{t("pleaseProvideBelowDetails")}</Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <RadioGroup
                        row
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        sx={{ justifyContent: 'center', marginBottom: 2 }}
                    >
                        <FormControlLabel
                            value="locosuccess"
                            control={<Radio sx={{ color: 'green', '&.Mui-checked': { color: 'green' } }} />}
                            label={t("success")}
                        />
                        <FormControlLabel
                            value="locolost"
                            control={<Radio sx={{ color: 'red', '&.Mui-checked': { color: 'red' } }} />}
                            label={t("lost")}
                        />
                    </RadioGroup>

                </Box>

                <TextField
                    sx={{ width: "500px" }}
                    autoFocus
                    multiline
                    rows={5}
                    margin="dense"
                    id="description"
                    label="Description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant='outlined' color="primary">
                    {t("cancel")}
                </Button>
                <Button
                    variant='contained'
                    onClick={handleConfirm}
                    color="primary"
                    autoFocus
                    disabled={!description || !selectedStatus}
                >
                    {ticketFinal === 'loading' ? <CircularProgress color='inherit' size="1rem" /> : t("send")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FinalizeConfirmation;
