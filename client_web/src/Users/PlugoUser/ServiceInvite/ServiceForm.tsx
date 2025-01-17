import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Lottie from 'react-lottie';
import successAnimation from 'src/Animations/freeAnimation.json';
import {
    Button,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { styled } from '@mui/system';
import { RootState, AppDispatch } from 'src/store';
import { generateOtp } from '../../../slices/ServiceInviter/GenerateOtp';
import { registerUser } from '../../../slices/ServiceInviter/RegisterInvite';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

// Styled components
const FormField = styled(TextField)({
    marginBottom: '16px',
    width: '100%',
});

const OTPInput = styled('input')({
    width: '50px',
    height: '50px',
    margin: '0 4px',
    textAlign: 'center',
    fontSize: '18px',
    border: '1px solid #5569FF',
    borderRadius: '2px',
    color: "#5569FF"
});

const Heading = styled(Typography)({
    fontSize: '34px',
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: '24px',
    marginTop: "20px",
    paddingLeft: "20px"
});

const RequiredTypography = styled(Typography)({
    fontWeight: 'bold',
    marginBottom: '8px',
});

// The main form component
const ServiceForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { status: otpStatus, error: otpError } = useSelector((state: RootState) => state.otp);
    const { status: registrationStatus, successMessage, error: registrationError } = useSelector((state: RootState) => state.registration);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [address, setAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [designation, setDesignation] = useState('');
    const [language, setLanguage] = useState<'English' | 'German' | 'French'>('English');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [otpSuccessMessage, setOtpSuccessMessage] = useState('');
    const [displaySuccessMessage, setDisplaySuccessMessage] = useState<string | null>(null);
    const [displayErrorMessage, setDisplayErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const isFormValid = name && email && password && phoneNo && companyName;
    const isOtpFilled = otp.every(o => o.length === 1);

    useEffect(() => {
        if (registrationStatus === 'succeeded') {
            setOpenDialog(true);

        }
    }, [registrationStatus]);

    useEffect(() => {
        if (otpStatus === 'failed') {
            setDisplayErrorMessage( 'E-mail Verification Failed.');
            setTimeout(() => setDisplayErrorMessage(null), 5000);
        }
    }, [otpStatus, otpError]);

    useEffect(() => {
        if (registrationStatus === 'failed') {
            setDisplayErrorMessage(registrationError || 'Failed to register user.');
            setTimeout(() => setDisplayErrorMessage(null), 5000);
        }
    }, [registrationStatus, registrationError]);

    const handleGenerateOtp = async () => {
        if (isFormValid) {
            try {
                await dispatch(generateOtp({ email }));
                setOtpSuccessMessage(`OTP sent to ${email}`);
            } catch (error) {
                console.error('Failed to generate OTP', error);
            }
        }
    };

    const handleSubmit = async () => {
        if (isOtpFilled) {
            setIsSubmitting(true);
            try {
                const otpValue = otp.join('');
                await dispatch(registerUser({
                    name,
                    email,
                    mobile: parseInt(phoneNo),
                    address,
                    company: companyName,
                    status,
                    language,
                    designation,
                    state,
                    country,
                    zipcode: parseInt(zipCode),
                    password,
                    otp: parseInt(otpValue),
                }));
            } catch (error) {
                console.error('Failed to register user', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value.length === 1 && index < otp.length - 1) {
            const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        window.location.href = 'https://app.qaaro.com';
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: successAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', height: '100vh', position: 'relative' }}>
            {/* Top-left corner image */}
            <Box sx={{ position: 'absolute', top: '16px', right: '16px' }}>
                <img width={155} src="/Qaaro-Logo-White.png" alt="Your Icon" />
            </Box>

            {/* Title */}
            <Heading>Registration Form</Heading>
            <Typography sx={{ paddingLeft: "20px", fontSize: "15px", mt: "-10px", mb: "15px" }}>Please Provide below details to create your account</Typography>

            {/* Form and Image container */}
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    {/* Form Section */}
                    <Box sx={{ padding: '56px', display: 'flex', flexDirection: 'column' }}>
                        <Grid container spacing={2}>
                            {/* Form Fields */}
                            <Grid item xs={12} sm={6}>
                                <RequiredTypography>Full Name *</RequiredTypography>
                                <FormField
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <RequiredTypography>Email Address *</RequiredTypography>
                                <FormField
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <RequiredTypography>Company Name *</RequiredTypography>
                                <FormField
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                                <RequiredTypography>Phone Number *</RequiredTypography>
                                <FormField
                                    value={phoneNo}
                                    onChange={(e) => setPhoneNo(e.target.value)}
                                />
                                <RequiredTypography>Create Your Password *</RequiredTypography>
                                <FormField
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <RequiredTypography>Address</RequiredTypography>
                                <FormField
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                <RequiredTypography>Zip Code</RequiredTypography>
                                <FormField
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                />
                                <RequiredTypography>State</RequiredTypography>
                                <FormField
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                />
                                <RequiredTypography>Country</RequiredTypography>
                                <FormField
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                                <RequiredTypography>Designation</RequiredTypography>
                                <FormField
                                    value={designation}
                                    onChange={(e) => setDesignation(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Language</InputLabel>
                                    <Select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value as 'English' | 'German' | 'French')}
                                        label="Language"
                                    >
                                        <MenuItem value="English">English</MenuItem>
                                        <MenuItem value="German">German</MenuItem>
                                        <MenuItem value="French">French</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                                        label="Status"
                                    >
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="inactive">Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Box sx={{ marginTop: '50px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleGenerateOtp}
                                    disabled={!isFormValid || otpStatus === 'loading'}
                                >
                                    {otpStatus === 'loading' ? <CircularProgress size={24} /> : 'Generate OTP'}
                                </Button>
                                <Box sx={{ mt: '-24px' }}>
                                    {displayErrorMessage && (
                                        <Alert severity="error" sx={{ marginTop: '24px' }}>
                                            {displayErrorMessage}
                                        </Alert>
                                    )}
                                    {!displayErrorMessage && displaySuccessMessage && (
                                        <Alert severity="success" sx={{ marginTop: '24px' }}>
                                            {displaySuccessMessage}
                                        </Alert>
                                    )}
                                    {!displayErrorMessage && !displaySuccessMessage && otpStatus === 'succeeded' && otpSuccessMessage && (
                                        <Alert severity="success" sx={{ marginTop: '24px' }}>
                                            {otpSuccessMessage}
                                        </Alert>
                                    )}
                                </Box>

                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", mt: '24px' }}>
                                <Box sx={{ display: 'flex', gap: '8px' }}>
                                    {otp.map((value, index) => (
                                        <OTPInput
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={value}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                        />
                                    ))}
                                </Box>
                                <Box sx={{ display: 'flex', gap: '8px' }}>
                                    <Button variant="outlined" color="primary" onClick={() => {/* Handle cancel logic */ }}>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit}
                                        disabled={!isOtpFilled || isSubmitting}
                                    >
                                        {isSubmitting ? <CircularProgress size={24} /> : 'Verify OTP & Register'}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                {/* Image Section */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                        <img src="/Qaaro_Login.png" alt="Sign in" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                    </Box>
                </Grid>
            </Grid>

            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogContent style={{ textAlign: 'center' }}>
                    <Lottie options={defaultOptions} height={100} width={100} />
                    <DialogTitle style={{ fontWeight: 'bold', fontSize: '1.5em' }}>
                        You have been successfully registered to Qaaro.
                    </DialogTitle>
                    <Typography variant="body2" style={{ fontWeight: '500px', color: "grey", fontSize: '1.3em' }}>
                        Please Login to use our service
                    </Typography>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center', marginBottom: "20px" }}>
                    <Button onClick={handleDialogClose} variant='outlined' color="primary">
                        Continue to Login
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default ServiceForm;
