import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    Grid
} from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import { RootState } from 'src/store';
import { rejectInsurance } from 'src/slices/Ticket/InsuRejec';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface InsuranceRejectProps {
    open: boolean;
    onClose: () => void;
}

const InsuranceReject: React.FC<InsuranceRejectProps> = ({ open, onClose }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const ticketDetails = useSelector((state: RootState) => state.ticketDetails.ticketDetails);
    const dispatch = useDispatch();
    const status = useSelector((state: RootState) => state.insuranceReject.status);
    const error = useSelector((state: RootState) => state.insuranceReject.error);

    const [notes, setNotes] = useState('');
    const [insuClaimNumber, setInsuClaimNumber] = useState('');
    const [insuOurSign, setInsuOurSign] = useState('');
    const [insuDate, setInsuDate] = useState('');

    const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotes(event.target.value);
    };

    const handleSave = async () => {
        const dateObject = new Date(insuDate); // Convert the string to a Date object
        if (isNaN(dateObject.getTime())) {
            // Handle invalid date
            console.error('Invalid date');
            return;
        }

        try {
            const actionValue = await dispatch(rejectInsurance({
                ticketId: ticketDetails._id,
                notes,
                insuClaimNumber,
                insuOurSign,
                insuDate: dateObject,
            }));

            if (rejectInsurance.fulfilled.match(actionValue)) {
                onClose();
                navigate(`/lami/ticket-ticket_list`);
            }
        } catch (error) {
            console.error('Error occurred while rejecting insurance:', error);
            // Handle error
        }
    };


    const handleCancel = () => {
        setNotes('');
        setInsuClaimNumber('');
        setInsuOurSign('');
        setInsuDate('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box padding="20px">
                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                    {t("insuReject")}
                </Typography>
                <Typography variant="h6" gutterBottom style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                    {t("pleaseProvideBelowDetails")}
                </Typography>
            </Box>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            autoFocus
                            label={t("insuranceClaimNumber")}
                            margin="dense"
                            fullWidth
                            value={insuClaimNumber}
                            onChange={(e) => setInsuClaimNumber(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label={t("insuranceOurSign")}
                            margin="dense"
                            fullWidth
                            value={insuOurSign}
                            onChange={(e) => setInsuOurSign(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label={t("insuranceDate")}
                            margin="dense"
                            fullWidth
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={insuDate}
                            onChange={(e) => setInsuDate(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label={t("note")}
                            multiline
                            rows={5}
                            fullWidth
                            variant="outlined"
                            value={notes}
                            onChange={handleNotesChange}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={handleCancel} color="secondary">
                    {t("cancel")}
                </Button>
                <Button variant='contained' onClick={handleSave} color="primary" disabled={!notes || !insuDate || !insuClaimNumber || !insuOurSign || status === 'loading'}>
                    {status === 'loading' ? 'Saving...' : t("send")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InsuranceReject;
