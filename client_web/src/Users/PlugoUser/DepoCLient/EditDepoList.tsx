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
import { RootState } from 'src/store'; // Update with the correct path
import { updateDepoAdmin } from 'src/slices/DepoClient/EditDepoCLient';
import { fetchDepoAdmin } from 'src/slices/DepoClient/GetDepoClient';

interface EditDepoListProps {
    open: boolean;
    onClose: () => void;
    depoAdmin?: {
        _id: string;
        name: string;
        address: string;
        designation: string;
        status: string; // Add status field to depoAdmin
    };
    selectedClientId?: string;
}

const EditDepoList: React.FC<EditDepoListProps> = ({ open, onClose, depoAdmin, selectedClientId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const updateDepoAdminStatus = useSelector((state: RootState) => state.updateDepoAdmin.status);
    const errorMessage = useSelector((state: RootState) => state.updateDepoAdmin.error);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [designation, setDesignation] = useState('');
    const [status, setStatus] = useState(''); // State for status
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        if (depoAdmin) {
            setName(depoAdmin.name);
            setAddress(depoAdmin.address);
            setDesignation(depoAdmin.designation);
            setStatus(depoAdmin.status); // Set status from depoAdmin
        }
    }, [depoAdmin]);

    const handleEditDepo = async () => {
        if (depoAdmin && depoAdmin._id) {
            try {
                await dispatch(updateDepoAdmin({
                    depoAdminId: depoAdmin._id,
                    updateData: {
                        name,
                        address,
                        designation,
                        status // Include status in the update data
                    },
                })).unwrap();

                // Fetch all depo admins
                dispatch(fetchDepoAdmin({}));

                // Fetch depo admins for the selected client (if any)
                if (selectedClientId) {
                    dispatch(fetchDepoAdmin({ clientId: selectedClientId }));
                }

                onClose(); // Close the dialog if update is successful
            } catch (err) {
                setShowErrorMessage(true);
                console.error("Error occurred while updating Depo Admin:", err);
            }
        }
    };

    const areRequiredFieldsEmpty = () => {
        return !name || !address || !designation || !status;
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontWeight: "800", fontSize: "20px", mt: "10px" }}>{t('Edit Depo Admin')}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: "20px", mt: "-3px", fontWeight: "600" }}>{t('Please update the details')}</DialogContentText>
                {showErrorMessage && (
                    <Box sx={{ mt: "10px", mb: "10px", bgcolor: "#ffede9" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
                            <ErrorOutline sx={{ mr: 1 }} />
                            <Typography variant='body1'>
                                {errorMessage || 'An error occurred while updating the Depo Admin.'}
                            </Typography>
                        </Box>
                    </Box>
                )}
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label={t('Name (Required)')}
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="address"
                    label={t('Address (Required)')}
                    type="text"
                    fullWidth
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="designation"
                    label={t('Designation (Required)')}
                    type="text"
                    fullWidth
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="status-label">{t('Status')}</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <MenuItem value="active">{t('Active')}</MenuItem>
                        <MenuItem value="inactive">{t('Inactive')}</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {t('Cancel')}
                </Button>
                <Button onClick={handleEditDepo} color="primary" variant="contained" disabled={areRequiredFieldsEmpty() || status === 'loading'}>
                    {updateDepoAdminStatus === 'loading' ? <CircularProgress size={24} /> : t('Update')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDepoList;
