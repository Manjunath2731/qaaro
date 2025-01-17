import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, CircularProgress } from "@mui/material";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/store'; // Import from 'react-redux'
import { fetchPdfData } from "src/slices/Ticket/GetDesc";
import { postDeniedPdf } from "src/slices/Ticket/EditDeniedDesc";
import { fetchTicketDetails } from "src/slices/Ticket/TicketDetails";

const EditDeniedDescriptionPopup = ({ ticketDetails, isOpen, onClose }) => {
    // State to manage the description input
    const { ticketId } = useParams();
    const dispatch = useDispatch();
    const pdfData = useSelector((state) => state.pdfData.data);
    const EditDesc = useSelector((state) => state.pdfData.status);

    const [description, setDescription] = useState(pdfData?.descpription || "");
    const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(true);

    // Fetch PDF data when the dialog opens or when ticketId changes
    useEffect(() => {
        if (isOpen && ticketId) {
            dispatch(fetchPdfData(ticketId));
        }
    }, [dispatch, isOpen, ticketId]);

    // Set the description from the API data when it's available
    useEffect(() => {
        console.log("pdf data vailabl", pdfData?.data)

        setDescription(pdfData?.data?.descpription);

    }, [pdfData]);

    // Function to handle changes in the description input
    const handleDescriptionChange = (event) => {
        const inputValue = event.target.value;
        // Replace newline characters with spaces
        const cleanedValue = inputValue.replace(/(\r\n|\n|\r)/gm, " ");
        setDescription(cleanedValue);
        setIsDescriptionEmpty(cleanedValue.trim() === '');
    };

    // Function to handle saving the new description
    const handleSaveDescription = () => {
        // Dispatch the postDeniedPdf action with the ticketId and description
        dispatch(postDeniedPdf({ ticketId, description }));
        // Close the dialog
        onClose();
        dispatch(fetchTicketDetails(ticketId)); // Pass ticketId to fetchTicketDetails

    };

    const areRequiredFieldsEmpty = () => {
        return !description;
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth={false}>
            <DialogTitle sx={{ fontWeight: "bold", fontSize: "20px" }}>Edit Denied Description</DialogTitle>
            <DialogTitle sx={{ fontSize: "15px", mt: "-30px" }}> Please enter new description below :</DialogTitle>
            <DialogContent sx={{ width: "600px", height: "210px" }}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="description"
                    label="New Description"
                    type="text"
                    fullWidth
                    value={description}
                    onChange={handleDescriptionChange}
                    multiline
                    rows={6}
                />
            </DialogContent>
            <DialogActions sx={{ mt: "-20px", mb: "10px" }}>
                <Button onClick={onClose} variant="outlined" color="primary">
                    Close
                </Button>
                <Button onClick={handleSaveDescription} variant="contained" color="primary" disabled={areRequiredFieldsEmpty()}>

                    {EditDesc === 'loading' ? <CircularProgress color='inherit' size="1rem" /> : 'Save'}

                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDeniedDescriptionPopup;
