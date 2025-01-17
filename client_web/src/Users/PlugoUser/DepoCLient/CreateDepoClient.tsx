import React, { useState } from 'react';
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
    CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Add as AddIcon } from '@mui/icons-material';
import { ErrorOutline } from '@mui/icons-material';
import { useDispatch, useSelector } from 'src/store';
import { RootState } from 'src/store';
import { fetchClientAdmins } from 'src/slices/ClientAdmin/GetClientAdmin';
import { createDepoAdmin } from 'src/slices/DepoClient/CreateDepoClient';
import PageHeading from 'src/components/PageHeading/PageHeading';
import { fetchDepoAdmin } from 'src/slices/DepoClient/GetDepoClient';

const CreateDepoClient: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

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
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [designation, setDesignation] = useState('');
    const [clientId, setClientId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [creationError, setCreationError] = useState<string | null>(null);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const { data: clientAdmins = [] } = useSelector((state: RootState) => state.clientAdminFetch);
    const userData = useSelector((state: RootState) => state.userData.userData);

    const resetForm = () => {
        setName('');
        setEmail('');
        setCompanyName('');
        setPhoneNo('');
        setAddress('');
        setZipCode('');
        setState('');
        setCountry('');
        setLanguage('English');
        setStatus('active');
        setDesignation('');
        setClientId('');
    };

    const handleOpen = () => {
        if (userData?._id) {
            dispatch(fetchClientAdmins());
        }
        resetForm();
        setOpen(true);
    };

    const handleClose = () => {
        resetForm();
        setOpen(false);
    };

    const handleCreateMember = async () => {
        setLoading(true);
        try {
            await dispatch(createDepoAdmin({
                clientId,
                payload: {
                    name,
                    email,
                    mobile: phoneNo,
                    address,
                    company: companyName,
                    language,
                    designation,
                    state,
                    country,
                    zipcode: parseInt(zipCode)
                }
            })).unwrap();

            // Fetch all depo admins
            dispatch(fetchDepoAdmin({}));

            // Fetch depo admins for the selected client
            // dispatch(fetchDepoAdmin({ clientId }));

            resetForm();
            handleClose();
            console.log('Admin created successfully!');
        } catch (error) {
            setCreationError((error as { message: string }).message);
            console.error("Error occurred while creating Admin:", error);
        } finally {
            setLoading(false);
        }
    };


    const validateEmail = (value: string) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setEmailError(isValid ? '' : 'Invalid email format');
        return isValid;
    };

    const areRequiredFieldsEmpty = () => {
        return !name || !email || !companyName || !language || !status || !clientId;
    };

    const transformErrorMessage = (errorMessage: string): string => {
        switch (errorMessage) {
            case 'phone_duplicate':
                return 'Please check your Phone No. This one is already in use !';
            default:
                return 'Something went wrong. Please try again.';
        }
    };

    return (
        <Box>
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

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ fontWeight: "800", fontSize: "20px", mt: "10px" }}>{t('Create Depo CLient')}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: "20px", mt: "-3px", fontWeight: "600" }}>
                        {t('pleaseEnterText')}
                    </DialogContentText>
                    {showErrorMessage && (
                        <Box sx={{ mt: "10px", mb: "10px", bgcolor: "#ffede9" }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
                                <ErrorOutline sx={{ mr: 1 }} />
                                <Typography variant='body1'>
                                    {transformErrorMessage('')}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Select Your Admin</InputLabel>
                        <Select
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value as string)}
                            label="Select Your Admin"
                        >
                            {clientAdmins?.map(admin => (
                                <MenuItem key={admin.clientAdmin._id} value={admin.clientAdmin._id}>
                                    {admin.clientAdmin.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                        onChange={(e) => setPhoneNo(e.target.value)}
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
                            label={t('language')}
                        >
                            <MenuItem value="English">English</MenuItem>
                            <MenuItem value="German">German</MenuItem>
                            <MenuItem value="French">French</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>{t('status')}</InputLabel>
                        <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                            label={t('status')}
                        >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {t('Cancel')}
                    </Button>
                    <Button onClick={handleCreateMember} color="primary" disabled={areRequiredFieldsEmpty()}>
                        {loading ? <CircularProgress size={24} /> : t('Submit')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CreateDepoClient;
