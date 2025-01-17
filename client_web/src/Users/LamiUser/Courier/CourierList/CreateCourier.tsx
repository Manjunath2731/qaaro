import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Add as AddIcon } from '@mui/icons-material';
import { RootState } from '../../../../store/rootReducer'; // Import RootState type
import { ErrorOutline } from '@mui/icons-material';

import { useDispatch, useSelector } from '../../../../store';
import { createLamiCourier } from '../../../../slices/LaMiCourierList/CourierCreate';
import { fetchLamiCouriers } from 'src/slices/LaMiCourierList/CourierGet';
import PageHeading from 'src/components/PageHeading/PageHeading';
import { fetchUserData } from 'src/slices/UserData';

const CreateCourierPage: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userData = useSelector((state: any) => state.userData.userData);


    const adminStatus = useSelector((state: RootState) => state.courierCreation.status); // Use RootState
    const errorMessage = useSelector((state: RootState) => state.courierCreation.error); // Get error message from Redux store
    const { couriers } = useSelector((state: RootState) => state.courier);


    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const [mobile, setMobile] = useState('');

    const [address, setAddress] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [designation, setDesignation] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [showErrorMessage, setShowErrorMessage] = useState(false); // State to control visibility of error message box

    const resetForm = () => {
        setName('');
        setEmail('');
        setMobile('');
        setAddress('');
        setStatus('active');
        setDesignation('');
        setState('');
        setCountry('');
        setZipcode('');
    };

    const handleOpen = () => {
        resetForm();
        setOpen(true);
    };

    const handleClose = () => {
        resetForm();
        setOpen(false);
    };

    const handleCreateCourier = async () => {
        setLoading(true);
        try {
            const payload: any = {
                name,
                mobile,
                address,
                status,
                designation,
                state,
                country,
                email,
                zipcode: parseInt(zipcode),
            };



            const actionResult = await dispatch(createLamiCourier(payload));
            if (createLamiCourier.fulfilled.match(actionResult)) {
                await dispatch(fetchLamiCouriers()); // Fetch updated data after successful creation
                dispatch(fetchUserData());

                handleClose();
                console.log('Admin created successfully!');
            }

        } catch (error) {
            setError(error.message || 'An error occurred while creating the courier.');
        } finally {
            setLoading(false);
        }
    };


    //FORM VALIDTAION CONDITIONS
    const areRequiredFieldsEmpty = () => {
        return !name || !mobile || !status || !designation;
    };

    const validateEmail = (value: string) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setEmailError(isValid ? '' : 'Invalid email format');
        return isValid;
    };



    const transformErrorMessage = (errorMessage: string): string => {
        switch (errorMessage) {
            case 'email_duplicate':
                return 'Please check the email address. This one is already in use !';
            case 'phone_duplicate':
                return 'Please check your Phone No. This one is already in use !'
            default:
                return 'Something went wrong. Please try again.';
        }
    };

    useEffect(() => {
        dispatch(fetchUserData());


    }, []);

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
        <Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", margin: "40px", marginTop: "40px" }}>
                <PageHeading>{t('courierList')} ({couriers?.length})</PageHeading>

                <Tooltip
                    title={
                        userData?.availableUser > 0
                            ? `${t('create')} ${t('couriers')}`
                            : 'Your have reached your creation  limit'
                    }
                >
                    <span> {/* This span wraps the Button to ensure the Tooltip works when the Button is disabled */}
                        <Button
                            variant="contained"
                            onClick={handleOpen}
                            disabled={userData?.availableUser <= 0} // Disable button when availableUser is not greater than zero
                            sx={{
                                border: '1.5px solid #A6C4E7',
                                borderRadius: '50%', // Make button circular
                                minWidth: 0, // Set minimum width to 0 to prevent text from appearing
                                width: '50px', // Set width to desired size
                                height: '50px', // Set height to desired size
                                backgroundColor: '#fff', // Set background color to white
                                color: '#000', // Set text color to black
                                '&:hover': {
                                    backgroundColor: '#fff', // Set background color on hover
                                },
                            }}
                        >
                            <IconButton disableRipple>
                                <AddIcon />
                            </IconButton>
                        </Button>
                    </span>
                </Tooltip>



            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ fontWeight: "800", fontSize: "20px", mt: "10px" }}>
                    {t('create')} {t('couriers')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: "20px", mt: "-3px", fontWeight: "600" }}>
                        {t('pleaseProvideBelowDetails')}
                    </DialogContentText>
                    {showErrorMessage && (
                        <Box sx={{ mt: "10px", mb: "10px", bgcolor: "#ffede9" }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
                                <ErrorOutline sx={{ mr: 1 }} />
                                <Typography variant='body1'>
                                    {transformErrorMessage(errorMessage)}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={`${t('Name')} ${t('required')}`}
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        id="designation"
                        label={`${t('Route No.')} ${t('required')}`}
                        type="text"
                        fullWidth
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label={`${t('E-mail')} ${t('required')}`}
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            validateEmail(e.target.value);
                        }}
                        error={!!emailError}
                        helperText={emailError}
                    />
                    <TextField
                        margin="dense"
                        id="mobile"
                        label={`${t('phone')} ${t('required')}`}
                        type="text"
                        fullWidth
                        value={mobile}
                        onChange={(e) => {
                            setMobile(e.target.value);
                        }}

                    />


                    <TextField
                        margin="dense"
                        id="address"
                        label={t('address')}
                        type="text"
                        fullWidth
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="state"
                        label={t('state')}
                        type="text"
                        fullWidth
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="country"
                        label={t('Country')}
                        type="text"
                        fullWidth
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="zipcode"
                        label={t('zipCode')}
                        type="text"
                        fullWidth
                        value={zipcode}
                        onChange={(e) => setZipcode(e.target.value)}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>{t('status')}</InputLabel>
                        <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                            label="Status"
                        >
                            <MenuItem value="active">{t('active')}</MenuItem>
                            <MenuItem value="inactive">{t('inactive')}</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant='outlined' color="primary">
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleCreateCourier}
                        color="primary"
                        variant='contained'
                        disabled={areRequiredFieldsEmpty()}
                    >
                        {t('create')}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box >
    );
};

export default CreateCourierPage;
