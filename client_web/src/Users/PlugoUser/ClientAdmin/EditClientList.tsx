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
import { RootState } from 'src/store';
import { updateClientAdmin } from 'src/slices/ClientAdmin/EditClientAdmin'; // Adjust the import path accordingly
import { fetchClientAdmins } from 'src/slices/ClientAdmin/GetClientAdmin';

interface EditClientListProps {
    open: boolean;
    onClose: () => void;
    client?: {
        clientAdmin: {
            _id: string;
            name: string;
            company: {
                companyName: string;
            };
            address: string;
            designation: string;
            status: string; // Add status field to clientAdmin
        };
    };
}


const EditClientList: React.FC<EditClientListProps> = ({ open, onClose, client }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [company, setCompany] = useState('');
    const [designation, setDesignation] = useState('');
    const [status, setStatus] = useState(''); // State for status
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const updateStatus = useSelector((state: RootState) => state.updateClientAdmin.status);
    const errorMessage = useSelector((state: any) => state.clientAdminCreation.error); // Get error message from Redux store
    const userData = useSelector((state: any) => state.userData.userData);

    useEffect(() => {
        if (client) {
            setName(client.clientAdmin.name);
            setAddress(client.clientAdmin.address);
            setCompany(client.clientAdmin.company.companyName);
            setDesignation(client.clientAdmin.designation);
            setStatus(client.clientAdmin.status); // Set status from client
        }
    }, [client]);

    const handleEditClient = async () => {
        if (client && client.clientAdmin._id) {
            try {
                await dispatch(updateClientAdmin({
                    clientId: client.clientAdmin._id,
                    updateData: {
                        name,
                        address,
                        company,
                        designation,
                        status // Include status in the update data
                    }
                })).unwrap();

                await dispatch(fetchClientAdmins()).unwrap();

                onClose();
            } catch (error) {
                console.error("Error occurred while updating client admin:", error);
                setShowErrorMessage(true);
            }
        }
    };

    const areRequiredFieldsEmpty = () => {
        return !name || !company;
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontWeight: "800", fontSize: "20px", mt: "10px" }}>{t('Edit Client')}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: "20px", mt: "-3px", fontWeight: "600" }}>{t('pleaseUpdate')}</DialogContentText>
                {showErrorMessage && (
                    <Box sx={{ mt: "10px", mb: "10px", bgcolor: "#ffede9" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
                            <ErrorOutline sx={{ mr: 1 }} />
                            <Typography variant='body1'>
                                {errorMessage}
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
                <TextField
                    margin="dense"
                    id="designation"
                    label={t('designationLami')}
                    type="text"
                    fullWidth
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="status-label">{t('status')}</InputLabel>
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
                    {t('cancel')}
                </Button>
                <Button onClick={handleEditClient} color="primary" variant="contained"
                    disabled={areRequiredFieldsEmpty()}
                >
                    {updateStatus === 'loading' ? <CircularProgress color='inherit' size="1rem" /> : t('update')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditClientList;
