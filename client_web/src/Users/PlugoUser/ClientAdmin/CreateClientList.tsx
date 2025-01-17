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
    Typography,
    CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Add as AddIcon } from '@mui/icons-material';
import { ErrorOutline } from '@mui/icons-material';
import { useDispatch, useSelector } from 'src/store';
import { createClientAdmin } from 'src/slices/ClientAdmin/CreateClientAdmin';
import PageHeading from 'src/components/PageHeading/PageHeading';
import InvitePopup from '../ServiceInvite/InviteForm';
import { fetchClientAdmins } from 'src/slices/ClientAdmin/GetClientAdmin';

const CreateClientList: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const userData = useSelector((state: any) => state.userData.userData);
    const adminStatus = useSelector((state: any) => state.clientAdminCreation.status); // Use RootState
    const errorMessage = useSelector((state: any) => state.clientAdminCreation.error); // Get error message from Redux store

    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [address, setAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [language, setLanguage] = useState<'English' | 'German' | 'French'>('English');
    const [designation, setDesignation] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const resetForm = () => {
        console.log('Resetting form...');
        setName('');
        setEmail('');
        setCompanyName('');
        setPhoneNo('');
        setAddress('');
        setZipCode('');
        setState('');
        setCountry('');
        setLanguage('English');
        setDesignation('');
    };

    const handleOpen = () => {
        console.log('Opening dialog...');
        resetForm();
        setOpen(true);
    };

    const handleClose = () => {
        console.log('Closing dialog...');
        resetForm();
        setOpen(false);
    };

    const handleCreateMember = async () => {
        try {
            console.log('Creating member...');
            const languageCode = language === 'English' ? 'en' : language === 'German' ? 'de' : 'fr';

            await dispatch(createClientAdmin({
                name,
                email,
                mobile: phoneNo,
                address,
                company: companyName,
                language: languageCode,
                designation,
                state,
                country,
                zipcode: parseInt(zipCode, 10),
            })).unwrap();

            await dispatch(fetchClientAdmins()).unwrap();

            resetForm();
            handleClose();
            console.log('Admin created and client admins fetched successfully!');
        } catch (error) {
            console.error("Error occurred:", error);
            setShowErrorMessage(true);
        }
    };

    const validateEmail = (value: string) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setEmailError(isValid ? '' : 'Invalid email format');
        return isValid;
    };

    const areRequiredFieldsEmpty = () => {
        return !name || !email || !companyName || !language;
    };

    const transformErrorMessage = (errorMessage: string): string => {
        switch (errorMessage) {
            case 'phone_duplicate':
                return 'Please check your Phone No. This one is already in use !';
            case 'email_duplicate':
                return 'Please check your E-mail.This one is already in use !';
            default:
                return 'Something went wrong. Please try again.';
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
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", margin: "40px", marginTop: "40px" }}>
                <PageHeading>{t('Client List')}</PageHeading>
                <Box sx={{ display: "flex", gap: "20px" }}>
                   
                    <Box>
                        <Tooltip title="createLami">
                            <Button variant="contained"
                                onClick={handleOpen}
                                sx={{
                                    border: '1.emailError5px solid #A6C4E7',
                                    borderRadius: '50%',
                                    minWidth: 0,
                                    width: '50px',
                                    height: '50px',
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    '&:hover': {
                                        backgroundColor: '#fff',
                                    }
                                }}
                            >
                                <IconButton disableRipple>
                                    <AddIcon />
                                </IconButton>
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ fontWeight: "800", fontSize: "20px", mt: "10px" }}>{t('Create Client')}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: "20px", mt: "-3px", fontWeight: "600" }}>
                        {t('pleaseEnterText')}
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
                        label="Name (Required)"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label={t('emailReq')}
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
                        id="companyName"
                        label={t('companyNameReq')}
                        type="text"
                        fullWidth
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="phoneNo"
                        label={t('phoneNoReq')}
                        type="text"
                        fullWidth
                        value={phoneNo}
                        onChange={(e) => {
                            setPhoneNo(e.target.value);
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
                        id="zipCode"
                        label={t('zipCode')}
                        type="text"
                        fullWidth
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
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
                        label={t('country')}
                        type="text"
                        fullWidth
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="designation"
                        label="Designation"
                        type="text"
                        fullWidth
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>{t('language')}</InputLabel>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {t('cancel')}
                    </Button>
                    <Button onClick={() => {
                        console.log("Create button clicked");
                        handleCreateMember();
                    }}
                        color="primary" variant='contained'
                        disabled={areRequiredFieldsEmpty()}
                    >
                    {adminStatus === 'loading' ? <CircularProgress color='inherit' size="1rem" /> : t('create')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CreateClientList;
