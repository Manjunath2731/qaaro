import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, Typography, TextField, Button, Box, Grid, CircularProgress } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { RootState, useDispatch, useSelector } from 'src/store';
import { acceptInsurance } from 'src/slices/Ticket/InsuOk';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface InsuranceOkprops {
    open: boolean;
    onClose: () => void;
}

const InsuranceOk: React.FC<InsuranceOkprops> = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const ticketDetails = useSelector((state) => state.ticketDetails.ticketDetails);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const aPPROVE = useSelector((state: RootState) => state.acceptInsurance.status); // Assuming the slice name is attachInvoice
    const errorMessage = useSelector((state: RootState) => state.acceptInsurance.status); // Assuming the slice name is attachInvoice

    const [insuClaimNumber, setInsuClaimNumber] = useState('');
    const [insuOurSign, setInsuOurSign] = useState('');
    const [insuDate, setInsuDate] = useState('');
    const [insuTransferAmount, setInsuTransferAmount] = useState('');
    const [insuCompensationAmount, setInsuCompensationAmount] = useState('');
    const [insuDeductible, setInsuDeductible] = useState('');
    const [notes, setNotes] = useState('');
    const [sending, setSending] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);


    useEffect(() => {
        if (aPPROVE === 'succeeded') {
            onClose();
            setSending(false);


        }
    }, [aPPROVE, onClose]);

    const handleCancel = () => {
        onClose();
        setInsuClaimNumber('');
        setInsuOurSign('');
        setInsuDate('');
        setInsuTransferAmount('');
        setInsuCompensationAmount('');
        setInsuDeductible('');
        setNotes('');
        setSending(false);
    };

    const handleSend = async () => {
        setSending(true);
        try {
            const actionValue = await dispatch(acceptInsurance({
                ticketId: ticketDetails._id,
                data: {
                    insuClaimNumber,
                    insuOurSign,
                    insuDate: new Date(insuDate),
                    insuTransferAmount: Number(insuTransferAmount),
                    insuCompensationAmount: Number(insuCompensationAmount),
                    insuDeductible: Number(insuDeductible),
                    notes,
                }
            }))

            if (acceptInsurance.fulfilled.match(actionValue)) {
                navigate(`/lami/ticket-ticket_list`);
            }
        } catch (error) {
            setShowErrorMessage(true);
            setSending(false);
        }
    };


    useEffect(() => {
        if (showErrorMessage) {
            const timer = setTimeout(() => setShowErrorMessage(false), 10000);
            return () => clearTimeout(timer);
        }
    }, [showErrorMessage]);

    const transformErrorMessage = (errorMessage: string): string => {
        return 'Something went wrong. Please try again.';
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box padding="20px">
                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                    {t("insuApprove")}
                </Typography>
                <Typography variant="h6" gutterBottom style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                    {t("pleaseProvideBelowDetails")}
                </Typography>
            </Box>

            <DialogContent>
                {showErrorMessage && (
                    <Box sx={{ mb: "10px", bgcolor: "#ffede9" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
                            <ErrorOutline sx={{ mr: 1 }} />
                            <Typography variant='body1'>
                                {transformErrorMessage(errorMessage)}
                            </Typography>
                        </Box>
                    </Box>
                )}
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t("insuranceClaimNumber")}</Typography>
                        <TextField
                            autoFocus
                            label=""
                            margin="dense"
                            fullWidth
                            value={insuClaimNumber}
                            onChange={(e) => setInsuClaimNumber(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t("insuranceOurSign")}</Typography>
                        <TextField
                            label=""
                            margin="dense"
                            fullWidth
                            value={insuOurSign}
                            onChange={(e) => setInsuOurSign(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t("insuranceDate")}</Typography>
                        <TextField
                            label={t("required")}
                            margin="dense"
                            fullWidth
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={insuDate}
                            onChange={(e) => setInsuDate(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t("claimAmount")}</Typography>
                        <TextField
                            label={t("required")}
                            margin="dense"
                            fullWidth
                            type="number"
                            value={insuCompensationAmount}
                            onChange={(e) => setInsuCompensationAmount(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{("deductibleAmount")}</Typography>
                        <TextField
                            label={t("required")}
                            margin="dense"
                            fullWidth
                            type="number"
                            value={insuDeductible}
                            onChange={(e) => setInsuDeductible(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t("compensatationAmount")}</Typography>
                        <TextField
                            label={t("required")}
                            margin="dense"
                            fullWidth
                            type="number"
                            value={insuTransferAmount}
                            onChange={(e) => setInsuTransferAmount(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t("noteIfAny")}</Typography>
                        <TextField
                            margin="dense"
                            fullWidth
                            multiline
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </Grid>

                </Grid>
            </DialogContent>

            <Box display="flex" justifyContent="flex-end" padding="20px" gap="10px">
                <Button variant="outlined" color="primary" onClick={handleCancel}>
                    {t("cancel")}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSend}
                    disabled={sending || !insuDate || !insuTransferAmount || !insuCompensationAmount || !insuDeductible}
                >
                    {sending ? <CircularProgress color="inherit" size="1rem" /> : t("send")}
                </Button>
            </Box>
        </Dialog>
    );
};

export default InsuranceOk;
