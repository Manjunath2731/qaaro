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
    CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from '../../store';
import { createAdmin, CreateAdminParams } from '../../slices/ClientList';
import { RootState } from '../../store/rootReducer';
import { Add as AddIcon } from '@mui/icons-material';
import { ErrorOutline } from '@mui/icons-material';
import { fetchClientAdmins } from 'src/slices/ClientAdmin/GetClientAdmin';
import { fetchDepoAdmin, DepoAdminResponse } from 'src/slices/DepoClient/GetDepoClient';
import { fetchLamiAdmins } from 'src/slices/getLamySLice';

const CreateMemberPage: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const adminStatus = useSelector((state: RootState) => state.admin.status);
    const errorMessage = useSelector((state: RootState) => state.admin.error);
    const userData = useSelector((state: any) => state.userData.userData);

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

    // New states for client and depo menu
    const [clientId, setClientId] = useState<string>('');
    const [depoId, setDepoId] = useState<string>('');
    const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
    const [depos, setDepos] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        // Fetch client list on component mount
        dispatch(fetchClientAdmins())
            .unwrap()
            .then((data) => {
                console.log('Fetched clients:', data); // Debugging log
                setClients(data.map((client) => ({
                    id: client.clientAdmin._id,
                    name: client.clientAdmin.name
                })));
            })
            .catch((error) => {
                console.error("Failed to fetch clients:", error); // Debugging log
            });
    }, [dispatch]);

    useEffect(() => {
        // Fetch depo list when clientId changes
        if (clientId) {
            dispatch(fetchDepoAdmin({ clientId }))
                .unwrap()
                .then((data: DepoAdminResponse) => {
                    const transformedDepos = data.data.map(depo => ({
                        id: depo._id,
                        name: depo.name
                    }));
                    console.log('Fetched depos:', transformedDepos); // Debugging log
                    setDepos(transformedDepos);
                })
                .catch((error) => {
                    console.error("Failed to fetch depo admins:", error);
                });
        } else {
            // Clear depo list if no client is selected
            setDepos([]);
        }
    }, [clientId, dispatch]);

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
        setDesignation('');
        setClientId('');
        setDepoId('');
    };

    const handleOpen = () => {
        resetForm();
        setOpen(true);
    };

    const handleClose = () => {
        resetForm();
        setOpen(false);
    };

    const handleCreateMember = async () => {
        try {
            const actionResult = await dispatch(createAdmin({
                clientId,
                depoAdminId: depoId,
                name,
                email,
                mobile: parseInt(phoneNo, 10),
                address,
                company: companyName,
                language,
                designation,
                state,
                country,
                zipcode: parseInt(zipCode, 10),
                adminData: { // Add this field
                    name,
                    email,
                    mobile: parseInt(phoneNo, 10),
                    address,
                    company: companyName,
                    status: '', // Include status if required
                    language,
                    designation,
                    state,
                    country,
                    zipcode: parseInt(zipCode, 10),
                }
            } as CreateAdminParams)); // Cast to CreateAdminParams if necessary

            if (createAdmin.fulfilled.match(actionResult)) {
                dispatch(fetchLamiAdmins({}));
                resetForm();
                handleClose();
                console.log('Admin created successfully!');
            }
        } catch (error) {
            console.error("Error occurred while creating Admin:", error);
        }
    };


    const validateEmail = (value: string) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setEmailError(isValid ? '' : 'Invalid email format');
        return isValid;
    };

    const areRequiredFieldsEmpty = () => {
        if (userData?.role === "Depo_Admin") {
            return !name || !email || !companyName || !language;
        }
        return !name || !email || !companyName || !language || !clientId || !depoId;
    };


    const transformErrorMessage = (errorMessage: string): string => {
        switch (errorMessage) {
            case 'phone_duplicate':
                return 'Please check your Phone No. This one is already in use !';
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
            <Box>
                <Tooltip title="Create Admin">
                    <Button variant="contained"
                        onClick={handleOpen}
                        sx={{
                            border: '1.5px solid #A6C4E7',
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
                <DialogTitle sx={{ fontWeight: "800", fontSize: "20px", mt: "10px" }}>{t('Create Service Provider')}</DialogTitle>
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

                    {userData?.role !== "Depo_Admin" && (
                        <>

                            <FormControl fullWidth margin="dense">
                                <InputLabel>Client</InputLabel>
                                <Select
                                    value={clientId}
                                    onChange={(e) => setClientId(e.target.value as string)}
                                >
                                    {clients.map((client) => (
                                        <MenuItem key={client.id} value={client.id}>
                                            {client.name}
                                        </MenuItem>
                                    ))}


                                </Select>

                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <InputLabel>Depo</InputLabel>
                                <Select
                                    value={depoId}
                                    onChange={(e) => setDepoId(e.target.value as string)}
                                    disabled={!clientId} // Disable if clientId is not selected
                                >
                                    {depos.map((depo) => (
                                        <MenuItem key={depo.id} value={depo.id}>
                                            {depo.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>


                    )}



                    <TextField
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
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
                        label="Company Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="phoneNo"
                        label="Phone No"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="address"
                        label="Address"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="zipCode"
                        label="Zip Code"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="state"
                        label="State"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="country"
                        label="Country"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Language</InputLabel>
                        <Select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as 'English' | 'German' | 'French')}
                        >
                            <MenuItem value='English'>English</MenuItem>
                            <MenuItem value='German'>German</MenuItem>
                            <MenuItem value='French'>French</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        id="designation"
                        label="Designation"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('Cancel')}</Button>
                    <Button
                        onClick={handleCreateMember}
                        disabled={areRequiredFieldsEmpty() || adminStatus === 'loading'}
                    >
                        {adminStatus === 'loading' ? <CircularProgress size={24} /> : t('Create')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CreateMemberPage;
