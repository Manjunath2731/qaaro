import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, TextField, Grid, CircularProgress } from '@mui/material';
import SignatureCanvas from 'react-signature-canvas';
import { useSelector } from 'react-redux';
import { ErrorOutline } from '@mui/icons-material';
import { RootState } from '../../../store/rootReducer'; // Import RootState type
import GppBadIcon from '@mui/icons-material/GppBad';
import { useMediaQuery, Theme } from '@mui/material'; // Import useMediaQuery and Theme from @mui/material

interface DeniedPopUpProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: {
        description: string;
        signatureImage: string;
        name: string; // This is the parameter named "name"
        dateTimePlace: string;
    }) => void;
}

const DeniedPopUp: React.FC<DeniedPopUpProps> = ({ isOpen, onClose, onSubmit }) => {
    const denied = useSelector((state: RootState) => state.deniedPdf.status); // Use RootState
    const errorMessage = useSelector((state: RootState) => state.deniedPdf.error); // Get error message from Redux store
    const { courierDetails, status, error } = useSelector((state: RootState) => state.courierDetails);

    const [description, setDescription] = useState('');
    const [name, setName] = useState(''); // Changed field name to 'name'
    const [date, setDate] = useState('');
    const [place, setPlace] = useState('');
    const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(true);
    const [isNameEmpty, setIsNameEmpty] = useState(true); // Changed state name to 'isNameEmpty'
    const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
    const signatureRef = useRef<SignatureCanvas>(null);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    useEffect(() => {
        const isEmpty = signatureRef.current?.isEmpty() ?? true;
        console.log('Signature isEmpty:', isEmpty); // Add console log to check signature isEmpty

        setIsSignatureEmpty(isEmpty);
    }, [isOpen]);

    const handleClearSignature = () => {
        if (signatureRef.current) {
            signatureRef.current.clear();
            setIsSignatureEmpty(true);
        }
    };

    const handleSaveSignature = () => {
        if (signatureRef.current && description.trim() !== '' && date.trim() !== '' && place.trim() !== '') {
            const signatureDataUrl = signatureRef.current.toDataURL();
            const signatureImageData = signatureDataUrl.split('base64,')[1];
            const dateTimePlace = `  ${place},  ${date}`; // Concatenating date and place
            onSubmit({ description, signatureImage: signatureImageData, name, dateTimePlace }); // Changed field name to 'name'
        }
    };

    const handleDrawStart = () => {
        setIsSignatureEmpty(false);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Replace newline characters with spaces
        const cleanedValue = inputValue.replace(/(\r\n|\n|\r)/gm, " ");
        setDescription(cleanedValue);
        setIsDescriptionEmpty(cleanedValue.trim() === '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setIsNameEmpty(e.target.value.trim() === ''); // Changed state name to 'isNameEmpty'
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
    };

    const handlePlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlace(e.target.value);
    };

    const resetFields = () => {
        setDescription('');
        setName('');
        setDate('');
        setPlace('');
        setIsDescriptionEmpty(true);
        setIsNameEmpty(true);
        setIsSignatureEmpty(true);
        if (signatureRef.current) {
            signatureRef.current.clear();
        }
    };

    const handleCancel = () => {
        onClose();
    };

    useEffect(() => {
        if (denied === 'failed') {
            setShowErrorMessage(true);
            const timer = setTimeout(() => {
                setShowErrorMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [denied]);

    const transformErrorMessage = (errorMessage: string): string => {
        switch (errorMessage) {
            default:
                return 'Something went wrong. Please try again.';
        }
    };

    const fileName = courierDetails?.attachment?.files?.map((file) => file.split('/').pop());
    // const requiredFileName = "Rechtsverbindliche_Erkl%C3%A4rung.pdf";
    const requiredSubstring = "Erkl%C3%A4rung";

    return (
        <>
            {fileName?.some(name => name.includes(requiredSubstring)) ? (
                <Dialog open={isOpen} onClose={handleCancel} maxWidth={false}>
                    <DialogTitle sx={{ fontWeight: "800", fontSize: "20px", mt: "10px" }}>Customer Denied</DialogTitle>
                    <DialogTitle sx={{ mt: "-30px", mb: "20px" }}>Please provide below details and submit</DialogTitle>

                    <DialogContent sx={{ width: isSmallScreen ? "100%" : "85vw", maxWidth: "850px" }}>
                        {showErrorMessage && (
                            <Box sx={{ mt: "1px", mb: "10px", bgcolor: "#ffede9" }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
                                    <ErrorOutline sx={{ mr: 1 }} />
                                    <Typography variant='body1'>
                                        {transformErrorMessage(errorMessage)}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12} lg={6} xl={6}>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Date</Typography>
                                <TextField
                                    label="Required"
                                    type="date"
                                    fullWidth
                                    value={date}
                                    onChange={handleDateChange}
                                    variant="outlined"
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Place</Typography>
                                <TextField
                                    label="Required"
                                    fullWidth
                                    value={place}
                                    onChange={handlePlaceChange}
                                    variant="outlined"
                                    margin="normal"
                                />
                                <Box sx={{ display: "felx", flexDirection: "column" }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Description</Typography>
                                    <TextField
                                        label="Required"
                                        multiline
                                        rows={13.5}
                                        fullWidth
                                        value={description}
                                        onChange={handleDescriptionChange}
                                        variant="outlined"
                                        margin="normal"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={12} lg={6} xl={6}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>Provide your name:</Typography>
                                <TextField
                                    label="Required"
                                    fullWidth
                                    value={name}
                                    onChange={handleNameChange}
                                    variant="outlined"
                                    margin="normal"
                                />
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>Provide your signature:</Typography>
                                <Box style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '0px' }}>
                                    <SignatureCanvas
                                        ref={signatureRef}
                                        canvasProps={{ width: isSmallScreen ? window.innerWidth * 0.8 : 390, height: 300, className: 'signature-canvas' }}
                                        onBegin={handleDrawStart} // Update the state when drawing starts
                                    />
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Box>
                                    </Box>
                                    <Typography
                                        variant="body1"
                                        color={"blue"}
                                        sx={{ mt: 2, cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={handleClearSignature}
                                    >
                                        Clear Signature
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ pr: 2, pb: 2 }}>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveSignature}
                            disabled={isDescriptionEmpty || isNameEmpty || isSignatureEmpty}
                        >
                            {denied === 'loading' ? <CircularProgress color='inherit' size="1rem" /> : 'Submit'}
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : (
                <Dialog open={isOpen} onClose={handleCancel} maxWidth={false}>
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: "red", justifyContent: "center" }}>
                            <GppBadIcon sx={{ fontSize: "45px" }} />
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ width: "350px", textAlign: 'center' }}>
                        <Typography variant="h4">
                            File required for signature is missing.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' onClick={handleCancel} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default DeniedPopUp;
