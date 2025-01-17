import React, { useState } from 'react';
import { TextField, Button, Box, Container, Typography, Link, CircularProgress } from '@mui/material';
import axiosAPIInstanceProject from '../../../AxiosInstance/AxiosInstance';
import { ErrorOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordForm: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [emailError, setEmailError] = useState('');


    const handleEmailChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setEmail(event.target.value as string); // Type assertion to 'string'
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await axiosAPIInstanceProject.post('forgot-password', { email });

            // Reset email field after successful submission
            setEmail('');
            setError('');
            navigate('/');

        } catch (error) {
            console.error('Login failed:', error);
            if (error.response && error.response?.status === 400) {
                setError('Email does not exist !');
            } else {
                setError('Something went wrong. Please try again.');
            }
            setShowErrorMessage(true); // Show error message box
            setTimeout(() => {
                setShowErrorMessage(false); // Hide error message box after 5 seconds
            }, 5000);
        } finally {
            setIsLoading(false);
        }
    };

    const validateEmail = (value: string) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setEmailError(isValid ? '' : 'Invalid email format');
        return isValid;
    };

    const areRequiredFieldsEmpty = () => {
        return !email;
    };


    return (
        <Container maxWidth="sm" sx={{ mt: 20 }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: "5px",
                    marginBottom: "30px",
                    mr: "33px"

                }}
            >

                <img width={225} src="/Qaaro-Logo-White.png" alt="Your Icon" />

            </Box>

            <Box
                sx={{
                    maxWidth: 500,
                    backgroundColor: '#fff',
                    padding: '40px 56px',
                    fontSize: 14,
                    color: '#212121',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                    boxSizing: 'border-box',
                    borderRadius: 1,
                    boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.084), 0px 2px 3px rgba(0, 0, 0, 0.168)',
                    height: "420px",
                }}
            >
                <Typography variant="h3" align="center" sx={{ fontWeight: "bold", mb: "2px" }}>
                    Forgot Password
                </Typography>
                <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mt: "-30px", color: "#bdbdbd" }}>
                    Please enter your email address to request for a new password
                </Typography>

                {showErrorMessage && error && (
                    <Box sx={{ mb: "5px", bgcolor: "#ffede9", width: "100%", marginBottom: "-20px" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
                            <ErrorOutline sx={{ mr: 1 }} />
                            <Typography variant='body1'>
                                {error}
                            </Typography>
                        </Box>
                    </Box>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => {
                            handleEmailChange(e);
                            validateEmail(e.target.value);
                        }}
                        error={!!emailError}
                        helperText={emailError}
                        sx={{ mt: "5px", mb: "30px" }}
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth
                        disabled={areRequiredFieldsEmpty()}
                        sx={{
                            '&:disabled': {
                                backgroundColor: '#f2f2f2',

                            },
                        }}
                    >
                        {isLoading ? <CircularProgress color='inherit' size="1rem" /> : 'Send Email'}
                    </Button>
                </form>



                <Typography align="center" sx={{ fontWeight: 500 }}>
                    Want To Go Back?{' '}
                    <Link href="/" sx={{ color: '#1778f2', textDecoration: 'none', fontWeight: 400 }}>
                        Login
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default ForgotPasswordForm;
