import React, { useState, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from 'src/store';
import {
    Dialog, DialogTitle, DialogContent, TextField, Button, Box, CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { postOffsetCourier } from 'src/slices/LaMiCourierList/OffsetCreate';
import { fetchCourierHistoryDetails } from 'src/slices/Ticket/CourierHistoryDetails';
import { useTranslation } from 'react-i18next';

const OffsetForm: React.FC<{ open: boolean, onClose: () => void, courierId?: string }> = ({ open, onClose, courierId }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { status } = useSelector((state) => state.offsetCourier); // Get the loading status from Redux

    const [date, setDate] = useState<Date | null>(new Date());
    const [paidAmount, setpaidAmount] = useState<string>('');
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);

    useEffect(() => {
        // Enable submit button only if both date and paidAmount are provided
        setSubmitDisabled(!date || !paidAmount);
    }, [date, paidAmount]);

    const handleSubmit = () => {
        dispatch(postOffsetCourier({ courierId: courierId, date, paidAmount: Number(paidAmount) }))
            .then(() => {
                dispatch(fetchCourierHistoryDetails(courierId));
            })
            .finally(() => {
                handleClose();
            });
    };


    const handleClose = () => {
        setDate(new Date()); // Reset date field
        setpaidAmount(''); // Reset paidAmount field
        onClose(); // Close the dialog
    };

    const handleCancel = () => {
        handleClose(); // Close the dialog and clear fields
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle fontSize={"20px"} fontWeight={"bold"}>{t("offsetForm")}</DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box component="form" display="flex" flexDirection="column" gap={2} mt={2}>
                        <DatePicker
                            label={`${t('select')} ${t('date')}`}
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            disablePast
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                        <TextField
                            label={t("paidAmount")}
                            type="number"
                            value={paidAmount}
                            onChange={(e) => setpaidAmount(e.target.value)}
                            fullWidth
                        />
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button variant="outlined" onClick={handleCancel} sx={{ marginRight: 1 }}>{t("cancel")}</Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={submitDisabled || status === 'loading'} // Disable the button during loading or if fields are empty
                            >
                                {status === 'loading' ? <CircularProgress size={24} /> : t('send')}
                            </Button>
                        </Box>
                    </Box>
                </LocalizationProvider>
            </DialogContent>
        </Dialog>
    );
};

export default OffsetForm;
