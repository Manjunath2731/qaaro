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
    Tooltip,
    IconButton
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'src/store';
import { RootState } from 'src/store';
import PageHeading from 'src/components/PageHeading/PageHeading';
import InvitePopup from '../ServiceInvite/InviteForm';
import { createCourierService } from 'src/slices/ServiceCourier/CreateServiceCourier';
import { fetchClientAdmins } from 'src/slices/ClientAdmin/GetClientAdmin';
import { fetchDepoAdmin } from 'src/slices/DepoClient/GetDepoClient';
import { fetchLamiAdmins } from 'src/slices/getLamySLice';

const CreateServiceCouriers: React.FC = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [address, setAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [language, setLanguage] = useState<'de' | 'en' | 'fr'>('de');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [designation, setDesignation] = useState('');
    const [email, setEmail] = useState(''); // New state variable for email
    const [lamiId, setLamiId] = useState<string>('');
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [selectedDepoId, setSelectedDepoId] = useState<string>('');

    const { admins = [] } = useSelector((state: RootState) => state.lami);
    const { data: clientAdmins = [] } = useSelector((state: any) => state.clientAdminFetch || {});
    const { depoAdmins = [] } = useSelector((state: RootState) => state.depoAdmin);

    useEffect(() => {
        dispatch(fetchClientAdmins());
    }, [dispatch]);

    useEffect(() => {
        if (selectedClientId) {
            dispatch(fetchDepoAdmin({ clientId: selectedClientId }));
        } else {
            setSelectedDepoId(''); // Reset depoId if no client is selected
        }
    }, [selectedClientId, dispatch]);

    useEffect(() => {
        if (selectedClientId && selectedDepoId) {
            dispatch(fetchLamiAdmins({ clientId: selectedClientId, depoAdminId: selectedDepoId }));
        } else {
            dispatch(fetchLamiAdmins({ clientId: '', depoAdminId: '' }));
        }
    }, [selectedClientId, selectedDepoId, dispatch]);

    const resetForm = () => {
        setName('');
        setPhoneNo('');
        setAddress('');
        setZipCode('');
        setState('');
        setCountry('');
        setLanguage('de');
        setStatus('active');
        setDesignation('');
        setEmail(''); // Reset email field
        setLamiId('');
        setSelectedClientId('');
        setSelectedDepoId('');
    };

    const handleOpen = () => {
        resetForm();
        setOpen(true);
    };

    const handleClose = () => {
        resetForm();
        setOpen(false);
    };

    const handleCreateCourierService = async () => {
        try {
            await dispatch(createCourierService({
                lamiId,
                name,
                mobile: Number(phoneNo),
                address,
                designation,
                email, // Include email in the payload
                language,
                state,
                country,
                zipcode: Number(zipCode)
            })).unwrap();

            resetForm();
            handleClose();
            console.log('Courier Service created successfully!');
        } catch (error) {
            console.error('Error occurred while creating Courier Service:', error);
        }
    };

    const areRequiredFieldsEmpty = () => {
        return !name || !phoneNo || !lamiId || !email; // Include email in the validation check
    };

    return (
        <Box>
            <Box>
                <Tooltip title="Create Courier">
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
                <DialogTitle sx={{ fontWeight: "800", fontSize: "20px", mt: "10px" }}>Create Service Couriers</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: "20px", mt: "-3px", fontWeight: "600" }}>
                        Please enter the required details.
                    </DialogContentText>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Select Client</InputLabel>
                        <Select
                            value={selectedClientId}
                            onChange={(e) => setSelectedClientId(e.target.value as string)}
                            label="Select Client"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {/* Filter out clientAdmins where currentSubscription is null */}
                            {clientAdmins
                                ?.filter((client: any) => client.currentSubscription !== null)
                                .map((client: any) => (
                                    <MenuItem key={client.clientAdmin._id} value={client.clientAdmin._id}>
                                        {client.clientAdmin.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense" disabled={!selectedClientId}>
                        <InputLabel>Select Depo</InputLabel>
                        <Select
                            value={selectedDepoId}
                            onChange={(e) => setSelectedDepoId(e.target.value as string)}
                            label="Select Depo"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {depoAdmins?.map((depo) => (
                                <MenuItem key={depo._id} value={depo._id}>
                                    {depo.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense" disabled={!selectedDepoId}>
                        <InputLabel>Select Service Provider</InputLabel>
                        <Select
                            value={lamiId}
                            onChange={(e) => setLamiId(e.target.value as string)}
                            label="Lami Admin"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {admins?.map((admin) => (
                                <MenuItem key={admin._id} value={admin._id}>
                                    {admin.name}
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
                        id="phoneNo"
                        label="Phone Number (Required)"
                        type="text"
                        fullWidth
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="address"
                        label="Address"
                        type="text"
                        fullWidth
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="zipCode"
                        label="Zip Code"
                        type="text"
                        fullWidth
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="state"
                        label="State"
                        type="text"
                        fullWidth
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="country"
                        label="Country"
                        type="text"
                        fullWidth
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="language"
                        label="Language"
                        type="text"
                        fullWidth
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as 'de' | 'en' | 'fr')}
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
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email (Required)"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={handleCreateCourierService}
                        disabled={areRequiredFieldsEmpty()}
                        variant="contained"
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CreateServiceCouriers;
