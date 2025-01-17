import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../../../../store';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, CircularProgress } from '@mui/material';
import { updateTicket } from 'src/slices/Ticket/EditDetails';
import { ErrorOutline } from '@mui/icons-material';
import { fetchTicketDetails } from 'src/slices/Ticket/TicketDetails';
import { useTranslation } from 'react-i18next';


const EditPopup = ({ caseType, data, open, onClose }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [updatedData, setUpdatedData] = useState({ ...data }); // State to hold the updated data
    const [updating, setUpdating] = useState(false); // State to indicate whether the update process is ongoing
    const status = useSelector((state) => state.ticketUpdate.status); // Use RootState
    const errorMessage = useSelector((state) => state.ticketUpdate.error); // Get error message from Redux store


    const [showErrorMessage, setShowErrorMessage] = useState(false); // State to control visibility of error message box

    const handleEdit = () => {
        // Set updating state to true during the API call
        setUpdating(true);

        // Remove _id and updatedAt fields from the updatedData object
        const { SubStatus, status, _id, updatedAt, ...dataWithoutIdAndUpdatedAt } = updatedData;

        // Add ticketId to the updatedData object
        const updatedDataWithId = {
            ...dataWithoutIdAndUpdatedAt,
            ticketId: data._id // Assuming data object contains the ticketId
        };

        // Dispatch the updateTicket action with the updated data
        dispatch(updateTicket(updatedDataWithId))
            .then(() => {
                window.location.reload();
                // Handle success if needed
                setUpdating(false); // Set updating state back to false
                setShowErrorMessage(true); // Show error message
                dispatch(fetchTicketDetails(data._id)); // Pass ticketId to fetchTicketDetails

            })
            .catch((error) => {
                // Handle error if needed
                console.error('Error updating ticket:', error);
                setUpdating(false); // Set updating state back to false
                setShowErrorMessage(true); // Show error message
            });
    };



    const handleClose = () => {

        onClose();
        setShowErrorMessage(false);

    };

    if (status === 'succeeded') {
        onClose();
    }

    useEffect(() => {
        if (status === 'failed') {
            const timer = setTimeout(() => {
                setShowErrorMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [status]);


    const handleChange = (fieldName, value) => {
        // Update the state with the changed field value
        setUpdatedData(prevState => ({
            ...prevState,
            [fieldName]: value,
        }));
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography variant='h4' sx={{ fontWeight: "bold" }}> {t("edit")} {caseType}</Typography>
            </DialogTitle>
            <DialogContent>
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
                <Box p={2}>
                    <form onSubmit={(e) => { e.preventDefault(); }}>
                        {caseType === "Ticket Details" && (
                            <>
                                <TextField label={t('dpdTicketNumber')} value={updatedData.dpdTicketNumber} onChange={(e) => handleChange('dpdTicketNumber', e.target.value)} fullWidth margin="dense" />
                                <TextField label={t('complainNumber')} value={updatedData.complainNumber} onChange={(e) => handleChange('complainNumber', e.target.value)} fullWidth margin="dense" />
                                <TextField label={t('packageNumber')} value={updatedData.packageNumber} onChange={(e) => handleChange('packageNumber', e.target.value)} fullWidth margin="dense" />
                                <TextField label={t('problem')} value={updatedData.problem} onChange={(e) => handleChange('problem', e.target.value)} fullWidth margin="dense" />
                                <TextField label={t('amountInDispute')} value={updatedData.amountInDispute} onChange={(e) => handleChange('amountInDispute', e.target.value)} fullWidth margin="dense" />
                                <TextField label={t('dpdReferenceNumber')} value={updatedData.dpdReferenceNumber} onChange={(e) => handleChange('dpdReferenceNumber', e.target.value)} fullWidth margin="dense" />
                                <TextField label={t('deadLineDate')} value={updatedData.deadlineDate} onChange={(e) => handleChange('deadlineDate', e.target.value)} fullWidth margin="dense" />
                                <TextField label={t('claimType')} value={updatedData.claimType} onChange={(e) => handleChange('claimType', e.target.value)} fullWidth margin="dense" />
                            </>
                        )}
                        {caseType === "Parcel Label Address" && (
                            <>
                                <TextField label="Name" value={updatedData.parcelLabelAddress.name} onChange={(e) => handleChange('parcelLabelAddress', { ...updatedData.parcelLabelAddress, name: e.target.value })} fullWidth margin="dense" />
                                <TextField label={t('address')} value={updatedData.parcelLabelAddress.address} onChange={(e) => handleChange('parcelLabelAddress', { ...updatedData.parcelLabelAddress, address: e.target.value })} fullWidth margin="dense" />
                            </>
                        )}
                        {caseType === "Recipient Address" && (
                            <>
                                <TextField label="Name" value={updatedData.recipientDetails.name} onChange={(e) => handleChange('recipientDetails', { ...updatedData.recipientDetails, name: e.target.value })} fullWidth margin="dense" />
                                <TextField label={t('address')} value={updatedData.recipientDetails.address} onChange={(e) => handleChange('recipientDetails', { ...updatedData.recipientDetails, address: e.target.value })} fullWidth margin="dense" />
                            </>
                        )}
                        {caseType === "Package Details" && (
                            <>
                                <TextField label={t('item')} value={updatedData.packageDetails.item} onChange={(e) => handleChange('packageDetails', { ...updatedData.packageDetails, item: e.target.value })} fullWidth margin="dense" />
                                <TextField label={t('category')} value={updatedData.packageDetails.category} onChange={(e) => handleChange('packageDetails', { ...updatedData.packageDetails, category: e.target.value })} fullWidth margin="dense" />
                                <TextField label={t('amountInDispute')} value={updatedData.packageDetails.amount} onChange={(e) => handleChange('packageDetails', { ...updatedData.packageDetails, amount: e.target.value })} fullWidth margin="dense" />
                                <TextField label={t('manufacture')} value={updatedData.packageDetails.manufacturer} onChange={(e) => handleChange('packageDetails', { ...updatedData.packageDetails, manufacturer: e.target.value })} fullWidth margin="dense" />
                                <TextField label={t('article')} value={updatedData.packageDetails.article} onChange={(e) => handleChange('packageDetails', { ...updatedData.packageDetails, article: e.target.value })} fullWidth margin="dense" />
                                <TextField label={t('furtherInformation')} value={updatedData.packageDetails.furtherInformation} onChange={(e) => handleChange('packageDetails', { ...updatedData.packageDetails, furtherInformation: e.target.value })} fullWidth margin="dense" />
                                <TextField label={t('serialNumber')} value={updatedData.packageDetails.serialNumber} onChange={(e) => handleChange('packageDetails', { ...updatedData.packageDetails, serialNumber: e.target.value })} fullWidth margin="dense" />
                                <TextField label="EAN" value={updatedData.packageDetails.ean} onChange={(e) => handleChange('packageDetails', { ...updatedData.packageDetails, ean: e.target.value })} fullWidth margin="dense" />
                                <TextField label="ID" value={updatedData.packageDetails.id} onChange={(e) => handleChange('packageDetails', { ...updatedData.packageDetails, id: e.target.value })} fullWidth margin="dense" />
                            </>
                        )}
                    </form>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleEdit}>
                    {updating ? <CircularProgress color='inherit' size="1rem" /> : "Update"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditPopup;
