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
import { useTranslation } from 'react-i18next';
import { ErrorOutline } from '@mui/icons-material';
import { useDispatch, useSelector } from 'src/store';
import { AppDispatch, RootState } from 'src/store'; // Assuming you have store setup
import { updateCourier } from 'src/slices/ServiceCourier/EditServiceCourier';
import { fetchGetCouriers } from 'src/slices/ServiceCourier/GetServiceCouriers';
import { fetchLamiAdmins } from 'src/slices/getLamySLice';

interface EditServiceCouriersProps {
    open: boolean;
    onClose: () => void;
    client?: {
        _id: string;
        name: string;
        address: string;
        status: 'active' | 'inactive';
        designation: string;
        plugoAdminId: {
            _id: string; // Change this to _id to match the expected format
            name: string;
        };
    };
}

const EditServiceCouriers: React.FC<EditServiceCouriersProps> = ({ open, onClose, client }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { admins = [], error } = useSelector((state: RootState) => state.lami);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [designation, setDesignation] = useState('');
    const [lamiId, setLamiId] = useState<string>('');
    const [showErrorMessage, setShowErrorMessage] = useState(false); // State to control visibility of error message box

    useEffect(() => {
        if (client) {
            setName(client.name);
            setAddress(client.address);
            setStatus(client.status);
            setDesignation(client.designation);
            setLamiId(client.plugoAdminId?.name || '');
        }

        // Fetch the list of service providers (Lami Admins)
        dispatch(fetchLamiAdmins({}));
    }, [client, dispatch]);

    const handleEditClient = () => {
        if (client?._id) {
            dispatch(updateCourier({
                courierId: client._id,
                updateData: { name, address, status, designation, lamiId }
            }))
                .unwrap()
                .then(() => {
                    dispatch(fetchGetCouriers({})).unwrap();
                    onClose();
                })
                .catch(() => {
                    setShowErrorMessage(true);
                });
        }
    };

    const areRequiredFieldsEmpty = () => {
        return !name || !address || !status || !designation || !lamiId;
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontWeight: "800", fontSize: "20px", mt: "10px" }}>
                {t('Edit Service Couriers')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: "20px", mt: "-3px", fontWeight: "600" }}>
                    {t('pleaseUpdate')}
                </DialogContentText>
                {showErrorMessage && (
                    <Box sx={{ mt: "10px", mb: "10px", bgcolor: "#ffede9" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
                            <ErrorOutline sx={{ mr: 1 }} />
                            <Typography variant='body1'>
                                {t('updateFailed')} {/* Add error message transformation logic if needed */}
                            </Typography>
                        </Box>
                    </Box>
                )}
                <FormControl fullWidth margin="dense">
                    <InputLabel>{t('Change Service Provider')}</InputLabel>
                    <Select
                        value={lamiId}
                        onChange={(e) => setLamiId(e.target.value as string)}
                        label={t('Change Service Provider')}
                    >
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
                    id="designation"
                    label={t('Route No.')}
                    type="text"
                    fullWidth
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
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
                <Button onClick={onClose} color="primary">
                    {t('cancel')}
                </Button>
                <Button onClick={handleEditClient} color="primary" variant="contained"
                    disabled={areRequiredFieldsEmpty()}
                >
                    {t('update')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditServiceCouriers;
