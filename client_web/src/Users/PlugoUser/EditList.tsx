import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from '../../store';
import { updateLamiAdmin } from '../../slices/updateLaMislice';
import { fetchLamiAdmins } from 'src/slices/getLamySLice';
import { RootState } from '../../store/rootReducer'; // Import RootState type
import { useTranslation } from 'react-i18next';
import { ErrorOutline } from '@mui/icons-material';
import { fetchDepoAdmin } from 'src/slices/DepoClient/GetDepoClient';

interface Client {
    _id: string;
    name: string;
    company: string;
    mobile: string;
    email: string;
    address: string;
    status: 'active' | 'inactive';
    avatar: string;
    designation: string;
}

interface DepoAdmin {
    _id: string;
    name: string;
}

interface EditMemberDialogProps {
    open: boolean;
    onClose: () => void;
    client?: Client;
}

const EditMemberDialog: React.FC<EditMemberDialogProps> = ({ open, onClose, client }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const errorMessage = useSelector((state: RootState) => state.management.error);
    const updateLamiAdminCase = useSelector((state: RootState) => state.management.status);
    const depoAdminsList = useSelector((state: any) => state.depoAdmin.depoAdmins);
    const userData = useSelector((state: any) => state.userData.userData);

    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [company, setCompany] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [designation, setDesignation] = useState('');
    const [selectedDepoAdminId, setSelectedDepoAdminId] = useState<string>(''); // New state for selected depo admin ID
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        if (client) {
            setName(client.name);
            setMobile(client.mobile);
            setAddress(client.address);
            setCompany(client.company);
            setStatus(client.status);
            setDesignation(client.designation);
        }
    }, [client]);

    useEffect(() => {
        dispatch(fetchDepoAdmin({}));
    }, [dispatch]);

    const handleEditMember = async () => {
        try {
            console.log('Updating member...');

            // Dispatch API call to update admin
            const actionResult = await dispatch(updateLamiAdmin({
                lamiAdminId: client._id,
                depoAdminId: selectedDepoAdminId, // Include depoAdminId
                updatedData: { name, mobile, address, company, status, designation }
            }));

            if (updateLamiAdmin.fulfilled.match(actionResult)) {
                dispatch(fetchLamiAdmins({}));
                setName('');
                setMobile('');
                setAddress('');
                setCompany('');
                setStatus('active');
                setDesignation('');
                setSelectedDepoAdminId(''); // Clear selected depo admin ID
                onClose();
            }
        } catch (error) {
            console.error("Error occurred while updating Admin:", error);
        }
    };

    const areRequiredFieldsEmpty = () => {
        if (userData.role === "Depo_Admin") {
            return !name || !company || !mobile || !status

        }
        return !name || !company || !mobile || !status || !selectedDepoAdminId;
    };

    const transformErrorMessage = (errorMessage: string): string => {
        switch (errorMessage) {
            case 'phone_duplicate':
                return 'Please check your Phone No. This one is already in use!';
            default:
                return 'Something went wrong. Please try again.';
        }
    };

    useEffect(() => {
        if (updateLamiAdminCase === 'failed') {
            setShowErrorMessage(true);
            const timer = setTimeout(() => {
                setShowErrorMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [updateLamiAdminCase]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontWeight: "800", fontSize: "20px", mt: "10px" }}>{t('Edit Service Provider')}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: "20px", mt: "-3px", fontWeight: "600" }}>{t('pleaseUpdate')}</DialogContentText>
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
                    id="mobile"
                    label={t('phoneNoReq')}
                    type="text"
                    fullWidth
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
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
                    id="company"
                    label={t('companyNameReq')}
                    type="text"
                    fullWidth
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                />
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
                <TextField
                    margin="dense"
                    id="designation"
                    label={t('designationLami')}
                    type="text"
                    fullWidth
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                />
                {userData.role !== "Depo_Admin" && (
                    <FormControl fullWidth margin="dense">
                        <InputLabel>{t('selectDepotAdmin')}</InputLabel>
                        <Select
                            value={selectedDepoAdminId}
                            onChange={(e) => setSelectedDepoAdminId(e.target.value as string)}
                            label={t('selectDepotAdmin')}
                        >
                            {depoAdminsList.map((depoAdmin) => (
                                <MenuItem key={depoAdmin._id} value={depoAdmin._id}>
                                    {depoAdmin.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                )}

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {t('cancel')}
                </Button>
                <Button onClick={handleEditMember} color="primary" variant="contained"
                    disabled={areRequiredFieldsEmpty()}
                >
                    {updateLamiAdminCase === 'loading' ? <CircularProgress color='inherit' size="1rem" /> : t('update')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditMemberDialog;
