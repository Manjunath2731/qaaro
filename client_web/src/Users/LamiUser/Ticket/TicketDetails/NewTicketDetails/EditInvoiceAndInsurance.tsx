import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'src/store';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, CircularProgress } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { editInvoiceDetails } from 'src/slices/Ticket/EditInvoiceDetails';
import { editInsuranceDetails } from 'src/slices/Ticket/EditInsuranceDetails';
import { fetchTicketDetails } from 'src/slices/Ticket/TicketDetails';

const EditInvoiceAndInsu = ({ caseType, data, open, onClose }) => {
    const dispatch = useDispatch();
    const [updatedData, setUpdatedData] = useState({ ...data });
    const [updating, setUpdating] = useState(false);
    const errorMessage = useSelector((state) => state.invoiceUpdate.error || state.insuranceUpdate.error);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const handleEdit = async () => {
        try {
            setUpdating(true);
            const ticketId = updatedData.ticketId; // Assuming data has the _id field

            if (caseType === "Invoice") {
                const result = await dispatch(editInvoiceDetails({ ...updatedData, ticketId }));

                if (editInvoiceDetails.fulfilled.match(result)) {
                    dispatch(fetchTicketDetails(ticketId));
                    setUpdating(false);
                    setShowErrorMessage(false);
                    onClose();
                } else if (editInvoiceDetails.rejected.match(result)) {
                    setUpdating(false);
                    setShowErrorMessage(true);
                    const timer = setTimeout(() => {
                        setShowErrorMessage(false);
                    }, 5000);
                    return () => clearTimeout(timer);
                }

            } else if (caseType === "Insurance") {
                const action = await dispatch(editInsuranceDetails({ ...updatedData, ticketId }));
                if (editInsuranceDetails.fulfilled.match(action)) {
                    dispatch(fetchTicketDetails(ticketId));
                    setUpdating(false);
                    setShowErrorMessage(false);
                    onClose();
                } else if (editInsuranceDetails.rejected.match(action)) {
                    setUpdating(false);
                    setShowErrorMessage(true);
                    const timer = setTimeout(() => {
                        setShowErrorMessage(false);
                    }, 5000);
                    return () => clearTimeout(timer);
                }
            }

        } catch (error) {
            console.error('Error updating details:', error);

        }
    };


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
                <Typography variant='h4' sx={{ fontWeight: "bold" }}> Edit {caseType}</Typography>
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
                        {caseType === "Invoice" && (
                            <>
                                <TextField label="E-mail Header Number" value={updatedData?.mailHeaderNumber} onChange={(e) => handleChange('mailHeaderNumber', e.target.value)} fullWidth margin="dense" />
                                <TextField label="Complain Number" value={updatedData?.dpdInvoiceNumber} onChange={(e) => handleChange('dpdInvoiceNumber', e.target.value)} fullWidth margin="dense" />
                                <TextField
                                    label="Invoice Date"
                                    type="date"
                                    value={updatedData?.date ? updatedData?.date.split('T')[0] : ''} // Assuming date format is 'YYYY-MM-DDTHH:MM:SS'
                                    onChange={(e) => handleChange('date', e.target.value)}
                                    fullWidth
                                    margin="dense"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />                                <TextField label="Complain Number" value={updatedData?.complainNumber} onChange={(e) => handleChange('complainNumber', e.target.value)} fullWidth margin="dense" />
                                <TextField label="Package Number" value={updatedData?.packageNumber} onChange={(e) => handleChange('packageNumber', e.target.value)} fullWidth margin="dense" />
                                <TextField label="Final Amount To Pay" value={updatedData?.finalLostAmmount} onChange={(e) => handleChange('finalLostAmmount', e.target.value)} fullWidth margin="dense" />
                            </>
                        )}
                        {caseType === "Insurance" && (
                            <>
                                <TextField label="Insurance Claim Number" value={updatedData.insuClaimNumber} onChange={(e) => handleChange('insuClaimNumber', e.target.value)} fullWidth margin="dense" />
                                <TextField label="Insurance Our Sign" value={updatedData.insuOurSign} onChange={(e) => handleChange('insuOurSign', e.target.value)} fullWidth margin="dense" />
                                <TextField
                                    label="Insurance Date"
                                    type="date"
                                    value={updatedData.insuDate ? updatedData.insuDate.split('T')[0] : ''} // Assuming date format is 'YYYY-MM-DDTHH:MM:SS'
                                    onChange={(e) => handleChange('insuDate', e.target.value)}
                                    fullWidth
                                    margin="dense"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField label="Claim Amount" value={updatedData.insuCompensationAmount} onChange={(e) => handleChange('insuCompensationAmount', e.target.value)} fullWidth margin="dense" />
                                <TextField label="Deductible Anount" value={updatedData.insuDeductible} onChange={(e) => handleChange('insuDeductible', e.target.value)} fullWidth margin="dense" />
                                <TextField label="Compensation Amount" value={updatedData.insuTransferAmount} onChange={(e) => handleChange('insuTransferAmount', e.target.value)} fullWidth margin="dense" />

                                <TextField label="Notes" value={updatedData.notes} onChange={(e) => handleChange('notes', e.target.value)} fullWidth margin="dense" />
                            </>
                        )}
                    </form>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleEdit}>
                    {updating ? <CircularProgress color='inherit' size="1rem" /> : "Update"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditInvoiceAndInsu;
