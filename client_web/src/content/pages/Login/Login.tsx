import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Container, Card, CardContent, Typography, Grid, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import axiosAPIInstanceProject from '../../../AxiosInstance/AxiosInstance'; // Import the Axios instance
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../store';
import { fetchUserData } from '../../../slices/UserData'; // Import the fetchUserData action
import { ErrorOutline } from '@mui/icons-material';
import { LockOutlined, LockOpenOutlined } from '@mui/icons-material'; // Import LockOutlined and LockOpenOutlined icons
import { useMediaQuery, Theme } from '@mui/material'; // Import useMediaQuery and Theme from @mui/material


const LoginForm: React.FC = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state: any) => state.userData.userData);
    const errorr = useSelector((state: any) => state.userData.error); // Accessing error from Redux store

    const navigate = useNavigate(); // Get the navigate function from React Router
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const [identifier, setIdentifier] = useState('');
    const [identifierError, setIdentifierError] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [loading, setLoading] = useState(false); // State to track loading state of the API call
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));





    const handleIdentifierChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setIdentifier(event.target.value as string); // Type assertion to 'string'
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true); // Set loading state to true when the API call is initiated
        try {
            const response = await axiosAPIInstanceProject.post('/login', { identifier, password });
            const token = response.data.data.token;
            localStorage.setItem('accessToken', token);
            setError('');

            if (token) {
                dispatch(fetchUserData());
            }
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response && (error.response.status === 401 || error.response.status === 400)) {
                setError('Invalid E-mail/Phone Number or Password');
            } else if (error.code === 'ERR_CONNECTION_REFUSED') {
                console.error('Server is down:', error.message);
                // Display a message to the user indicating the server is down
                setError('Server is down. Please try again later.');
            }
            else if (error.response && (error.response.status === 403)) {
                // Display a message to the user indicating the server is down
                setError('Account is not active!');
            }
            else if (error.response && (error.response.status === 402)) {
                // Display a message to the user indicating the server is down
                setError('No active subscription availabel');
            }
            else {
                setError('An error occurred. Please try again later.');
            }
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 5000);
        } finally {
            setLoading(false); // Reset loading state to false when the API call is completed
        }
    };


    if (userData && userData.role) {
        const { role, designation, name } = userData;
        localStorage.setItem('role', role); // Store role in local storage
        localStorage.setItem('designation', designation); // Store designation in local storage
        localStorage.setItem('name', name); // Store name in local storage

        // Redirect based on user's role
        switch (role) {
            case 'Plugo_Admin':
                window.location.replace('/plugo/plugo-dashboard');
                break;
            case 'LaMi_Admin':
                window.location.replace('/lami/lami-dashboard');
                break;
            case 'Client_Admin':
                window.location.replace('/client-admin/dashboard');
                break;
            case 'Depo_Admin':
                window.location.replace('/depo-admin/dashboard');
                break;
            case 'LaMi_Courier':
                window.location.replace('/lami-courier/dashboard');
                break;
            default:
                // Handle other roles or unexpected cases
                break;
        }
    }


    const validateIdentifier = (value: string) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d+$/.test(value);
        setIdentifierError(isValid ? '' : 'Invalid identifier format');
        return isValid;
    };

    const areRequiredFieldsEmpty = () => {
        return !identifier || !password;
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ mt: 15 }}>

            <Card sx={{ height: '680px', borderRadius: "20px" }}>
                <CardContent>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            mb: isSmallScreen ? "0px" : "30px",
                            mt: isSmallScreen ? "20px" : "20px",
                            ml: isSmallScreen ? "0px" : "20px",
                            justifyContent: isSmallScreen ? "center" : "left",
                            alignItems: isSmallScreen ? "center" : "left",
                        }}
                    >
                        <img width={155} src="/Qaaro-Logo-White.png" alt="Your Icon" />
                    </Box>
                    <Grid container>
                        {/* Left side with the image */}
                        <Grid item sm={6} xs={5} md={6} lg={7} xl={7} style={{ padding: "0px" }} >

                            {!isSmallScreen && (

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mt: "60px"
                                }}>
                                    <img src="/Qaaro_Login.png" alt="Sign in" style={{ width: '90%', height: '100%', objectFit: 'contain' }} />

                                </Box>
                            )}

                        </Grid>
                        {/* Right side with the existing content */}
                        <Grid item sm={6} xs={12} md={6} lg={5} xl={5} >
                            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexWrap: "wrap" }}>
                                    <Typography component="h1" variant="h1" sx={{ mt: 2, fontWeight: "600", color: "#030303", mb: '10px' }}>
                                        Hello Again!
                                    </Typography>
                                    <Typography variant="h5" sx={{ textAlign: 'center', mb: '40px', color: "#bdbdbd" }}>
                                        Please provide us the following details to resume your journey
                                    </Typography>
                                    {showErrorMessage && error && (
                                        <Box sx={{ mt: "2px", mb: "10px", bgcolor: "#ffede9", width: "100%" }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
                                                <ErrorOutline sx={{ mr: 1 }} />
                                                <Typography variant='body1'>
                                                    {error}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>


                                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                                    <TextField
                                        sx={{
                                            input: {
                                                background: "white"
                                            }
                                        }}
                                        margin="normal"

                                        id="identifier"
                                        label="Email or Phone Number"
                                        name="identifier"
                                        type="text"
                                        autoComplete="identifier"
                                        autoFocus
                                        value={identifier}
                                        onChange={(e) => {
                                            handleIdentifierChange(e);
                                            validateIdentifier(e.target.value);
                                        }}
                                        error={!!identifierError}
                                        helperText={identifierError}
                                    />
                                    <TextField
                                        sx={{
                                            input: {
                                                background: "white"
                                            }
                                        }}
                                        margin="normal"

                                        id="password"
                                        label="Password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'} // Show plain text if showPassword is true
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        InputProps={{
                                            sx: { bgcolor: 'white' }, // Adjust background color
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                                                        edge="end"
                                                        sx={{ '&:hover': { bgcolor: 'transparent' } }} // Remove hover effect
                                                    >
                                                        {showPassword ? <LockOpenOutlined /> : <LockOutlined />} {/* Show unlock icon when password is visible */}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Grid container justifyContent="center" sx={{ mt: 3 }}>
                                        <Button type="submit" variant="contained"
                                            sx={{
                                                width: "100%",
                                                bgcolor: "#C24922",
                                                '&:disabled': {
                                                    backgroundColor: '#f2f2f2',
                                                },
                                            }} disabled={areRequiredFieldsEmpty()}
                                        >
                                            {loading ? <CircularProgress size={24} color="primary" /> : 'Login'}
                                        </Button>
                                    </Grid>
                                </form>
                                <Grid container justifyContent="space-between" sx={{ mt: 4, display: "flex", justifyContent: "center", }}>
                                    <Grid item >
                                        <Box sx={{ display: "flex", gap: "2px" }}>
                                            <Typography>
                                                <span style={{ color: "black" }}>Forgot your password? </span>
                                            </Typography>
                                            <Link to="/forgot-password" style={{ textDecoration: 'none', color: "blue", fontWeight: "500", }} >
                                                Click Here
                                            </Link>
                                        </Box>

                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

        </Container>
    );
};

export default LoginForm;
