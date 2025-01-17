import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Typography, Box, CircularProgress } from '@mui/material';
import { RootState, useDispatch, useSelector } from 'src/store';
import { addNewTicket, TicketDetails } from 'src/slices/Annonymous/CreateNewTicket'; // Assuming correct import path
import { fetchAnonymousTickets } from 'src/slices/Annonymous/TabelList';
import { ErrorOutline } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';


interface PopupFormProps {
    open: boolean;
    onClose: () => void;
    anonymousId: string | null; // Define the anonymousId prop
}

const PopupForm: React.FC<PopupFormProps> = ({ open, onClose, anonymousId }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const adminStatus = useSelector((state: RootState) => state.addTickets.status); // Use RootState
    const errorMessage = useSelector((state: RootState) => state.addTickets.error); // Get error message from Redux store
    const [showErrorMessage, setShowErrorMessage] = useState(false); // State to control visibility of error message box


    const [formValues, setFormValues] = useState<TicketDetails>({
        dpdTicketNumber: '',
        complainNumber: '',
        packageNumber: '',
        claimType: '',
        problem: '',
        amountInDispute: 0,
        dpdReferenceNumber: '',
        deadlineDate: new Date(), // Initialize with current date

        packageDetails: {
            item: '',
            category: '',
            amount: 0,
            manufacturer: '',
            article: '',
            furtherInformation: '',
            serialNumber: '',
            ean: '',
            id: '',
        },
        recipientDetails: {
            name: '',
            address: '',
        },
        parcelLabelAddress: {
            name: '',
            address: '',
        },
    });

    const handleSubmit = () => {
        dispatch(addNewTicket({ ticketDetails: formValues, anonymousId }))
            .then((resultAction: any) => {
                if (resultAction.payload) {
                    // Adjust this condition based on your actual implementation
                    onClose();

                    dispatch(fetchAnonymousTickets());

                } else {
                    console.error('Error adding new ticket:', resultAction.error);
                }
            })
            .catch((error: any) => {
                console.error('Error adding new ticket:', error);
            });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        // Handle date field separately
        if (name === "deadLineDate") {
            // Ensure the value is a valid date
            const selectedDate = new Date(value);
            if (!isNaN(selectedDate.getTime())) {
                setFormValues({
                    ...formValues,
                    deadlineDate: selectedDate
                });
            }
        } else {

            if (name.includes('.')) {
                const [parentName, childName] = name.split('.');
                setFormValues({
                    ...formValues,
                    [parentName]: {
                        ...formValues[parentName],
                        [childName]: value,
                    },
                });
            } else {
                setFormValues({
                    ...formValues,
                    [name]: value,
                });
            }
        }
    };



    useEffect(() => {
        if (adminStatus === 'failed') {
            setShowErrorMessage(true);
            const timer = setTimeout(() => {
                setShowErrorMessage(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [adminStatus]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth={false}>
            <DialogTitle>
                <Typography variant="h4" fontWeight="bold">
                    {t("createNewTicket")}
                </Typography>
                <Typography variant="body2" sx={{ mb: "10px" }} color="textSecondary">
                    {t("pleaseProvideBelowDetails")}
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ width: "900px" }}>
                {showErrorMessage && (
                    <Box sx={{ mt: "10px", mb: "10px", bgcolor: "#ffede9" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
                            <ErrorOutline sx={{ mr: 1 }} />
                            <Typography variant='body1'>
                                {errorMessage}
                            </Typography>
                        </Box>
                    </Box>
                )}

                <Grid container spacing={2}>
                    {/* Ticket Details */}
                    <Grid item xs={12} md={12}>
                        <Typography variant="h5" sx={{ fontWeight: "bold", mb: "10px" }} gutterBottom>
                            1. {t("ticketDetails")}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="dpdTicketNumber"
                                    label={t("dpdTicketNumber")}
                                    fullWidth
                                    value={formValues.dpdTicketNumber}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="complainNumber"
                                    label={`${t('complainNumber')} ${t('required')}`}
                                    fullWidth
                                    value={formValues.complainNumber}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="packageNumber"
                                    label={t("packageNumber")}
                                    fullWidth
                                    value={formValues.packageNumber}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="claimType"
                                    label={t("claimType")}
                                    fullWidth
                                    value={formValues.claimType}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="problem"
                                    label={t("problem")}
                                    fullWidth
                                    value={formValues.problem}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="amountInDispute"
                                    label={`${t('amountInDispute')} ${t('required')}`}
                                    type="number"
                                    fullWidth
                                    value={formValues.amountInDispute}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="dpdReferenceNumber"
                                    label={t("dpdReferenceNumber")}
                                    fullWidth
                                    value={formValues.dpdReferenceNumber}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="deadLineDate"
                                    label={`${t('deadLineDate')} ${t('required')}`}
                                    type="date"
                                    fullWidth
                                    value={formValues.deadlineDate.toISOString().split('T')[0]} // Convert Date to ISO string format ("YYYY-MM-DD")
                                    onChange={handleChange}
                                />

                            </Grid>
                        </Grid>
                    </Grid>
                    {/* Packet Details */}
                    <Grid item xs={12} md={12}>
                        <Typography variant="h5" sx={{ fontWeight: "bold", mb: "10px" }} gutterBottom>
                            2. {t("packageDetails")}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="packageDetails.item"
                                    label={t("item")}
                                    fullWidth
                                    value={formValues.packageDetails.item}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="packageDetails.category"
                                    label={t("category")}
                                    fullWidth
                                    value={formValues.packageDetails.category}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="packageDetails.amount"
                                    label="Amount"
                                    type="number"
                                    fullWidth
                                    value={formValues.packageDetails.amount}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="packageDetails.manufacturer"
                                    label={t("manufacture")}
                                    fullWidth
                                    value={formValues.packageDetails.manufacturer}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="packageDetails.article"
                                    label={t("article")}
                                    fullWidth
                                    value={formValues.packageDetails.article}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="packageDetails.furtherInformation"
                                    label={t("furtherInformation")}
                                    fullWidth
                                    value={formValues.packageDetails.furtherInformation}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="packageDetails.serialNumber"
                                    label={t("serialNumber")}
                                    fullWidth
                                    value={formValues.packageDetails.serialNumber}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="packageDetails.ean"
                                    label="EAN"
                                    fullWidth
                                    value={formValues.packageDetails.ean}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} xl={4}>
                                <TextField
                                    name="packageDetails.id"
                                    label="ID"
                                    fullWidth
                                    value={formValues.packageDetails.id}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* Parcel Label Address */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" sx={{ fontWeight: "bold", mb: "10px" }} gutterBottom>
                            3. {t("parcelLabelAddress")}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="parcelLabelAddress.name"
                                    label="Name"
                                    fullWidth
                                    value={formValues.parcelLabelAddress.name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="parcelLabelAddress.address"
                                    label={("address")}
                                    fullWidth
                                    value={formValues.parcelLabelAddress.address}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* Recipient Details */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" sx={{ fontWeight: "bold", mb: "10px" }} gutterBottom>
                            4. {t("Recipient Details")}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={12}>
                                <TextField
                                    name="recipientDetails.name"
                                    label={`${t('Name')} ${t('required')}`}
                                    fullWidth
                                    value={formValues.recipientDetails.name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} lg={12}>
                                <TextField
                                    name="recipientDetails.address"
                                    label={`${t('address')} ${t('required')}`}
                                    fullWidth
                                    value={formValues.recipientDetails.address}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button variant='outlined' onClick={onClose}>{t("cancel")}</Button>
                <Button variant='contained' disabled={
                    !formValues.complainNumber || // Check if complainNumber is empty
                    !formValues.amountInDispute || // Check if amountInDispute is empty
                    !formValues.deadlineDate ||
                    !formValues.recipientDetails.name ||
                    !formValues.recipientDetails.address



                } onClick={handleSubmit}
                >
                    {adminStatus === 'loading' ? <CircularProgress color='inherit' size="1rem" /> : t('create')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PopupForm;
