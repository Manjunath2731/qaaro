import React, { useRef, useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Grid, TextField, CircularProgress, useMediaQuery, Theme, useTheme
} from '@mui/material';
import SignatureCanvas from 'react-signature-canvas';
import { ErrorOutline } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import GppBadIcon from '@mui/icons-material/GppBad';

interface AcceptedPopUpProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (signature: string, name: string, additionalData: string) => void;
}

interface AdditionalData {
    date: string;
    place: string;
    name: string;
}

const AcceptedPopUp: React.FC<AcceptedPopUpProps> = ({ isOpen, onClose, onSubmit }) => {
    const accepted = useSelector((state: RootState) => state.pdf.status);
    const errorMessage = useSelector((state: RootState) => state.pdf.error);
    const { courierDetails } = useSelector((state: RootState) => state.courierDetails);

    const signatureRef = useRef<SignatureCanvas>(null);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [isSignatureEmpty, setIsSignatureEmpty] = useState<boolean>(true);
    const [date, setDate] = useState('');
    const [additionalData, setAdditionalData] = useState<AdditionalData>({
        date: '',
        place: '',
        name: '',
    });

    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        const canvas = signatureRef.current?.getCanvas();
        const isEmpty = signatureRef.current?.isEmpty() ?? true;
        setIsSignatureEmpty(isEmpty);

        const handleSignatureChange = () => {
            const isEmpty = signatureRef.current?.isEmpty() ?? true;
            setIsSignatureEmpty(isEmpty);
        };

        if (canvas) {
            canvas.addEventListener('touchend', handleSignatureChange);
            canvas.addEventListener('mouseup', handleSignatureChange);
        }

        return () => {
            if (canvas) {
                canvas.removeEventListener('touchend', handleSignatureChange);
                canvas.removeEventListener('mouseup', handleSignatureChange);
            }
        };
    }, [signatureRef.current]);

    const handleClearSignature = () => {
        if (signatureRef.current) {
            signatureRef.current.clear();
            setIsSignatureEmpty(true);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
    };

    const handleSubmitSignature = () => {
        if (signatureRef.current) {
            const signatureDataUrl = signatureRef.current.toDataURL();
            const signatureImageData = signatureDataUrl.split('base64,')[1];
            const additionalDataString = ` ${additionalData.place}, ${date} `;
            onSubmit(signatureImageData, additionalDataString, additionalData.name);
        }
    };

    useEffect(() => {
        if (accepted === 'failed') {
            setShowErrorMessage(true);
            const timer = setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [accepted]);

    const transformErrorMessage = (errorMessage: string): string => {
        switch (errorMessage) {
            default:
                return 'Something went wrong. Please try again.';
        }
    };

    const fileName = courierDetails?.attachment?.files?.map((file) => file.split('/').pop());
    const requiredSubstring = "Empfangsbestaetigung";

    const handleCancel = () => {
        onClose();
    };

    return (
        <>
            {fileName?.some(name => name.includes(requiredSubstring)) ? (
                <Dialog open={isOpen} onClose={handleCancel} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ fontWeight: "800", fontSize: "20px", mt: "10px" }}>Customer Accepted</DialogTitle>
                    <DialogTitle sx={{ mt: "-30px", mb: "20px" }}>Please provide below details and submit</DialogTitle>
                    <DialogContent>
                        {showErrorMessage && (
                            <Box sx={{ mt: "10px", mb: "10px", bgcolor: "#ffede9" }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '10px' }}>
                                    <ErrorOutline sx={{ mr: 1 }} />
                                    <Typography variant='body1'>
                                        {transformErrorMessage(errorMessage)}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
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
                                    value={additionalData.place}
                                    onChange={(e) => setAdditionalData({ ...additionalData, place: e.target.value })}
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 2 }}
                                />
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold", mt: "15px" }}>Name</Typography>
                                <TextField
                                    label="Required"
                                    value={additionalData.name}
                                    onChange={(e) => setAdditionalData({ ...additionalData, name: e.target.value })}
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 2 }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>Provide your signature:</Typography>
                                <Box
                                    style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}
                                    sx={{
                                        width: isSmallScreen ? '100%' : 400,
                                        height: 300,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <SignatureCanvas
                                        ref={signatureRef}
                                        canvasProps={{ width: isSmallScreen ? window.innerWidth * 0.8 : 400, height: 300, className: 'signature-canvas' }}
                                    />
                                </Box>
                                <Typography
                                    variant="body1"
                                    color={"blue"}
                                    sx={{ mt: 2, cursor: 'pointer', textDecoration: 'underline', width: "110px" }}
                                    onClick={handleClearSignature}
                                >
                                    Clear Signature
                                </Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ pr: 2, pb: 2 }}>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitSignature}
                            disabled={!date || !additionalData.place || !additionalData.name || isSignatureEmpty || accepted === 'loading'}
                        >
                            {accepted === 'loading' ? <CircularProgress color='inherit' size="1rem" /> : 'Submit'}
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : (
                <Dialog open={isOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: "red", justifyContent: "center" }}>
                            <GppBadIcon sx={{ fontSize: "45px" }} />
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ width: "100%", textAlign: 'center' }}>
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

export default AcceptedPopUp;
