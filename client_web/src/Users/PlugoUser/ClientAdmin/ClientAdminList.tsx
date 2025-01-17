import React, { useEffect, useState } from 'react';
import { Box, Card, InputBase, InputAdornment, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import { fetchClientAdmins } from 'src/slices/ClientAdmin/GetClientAdmin'; // Update the path as per your project structure
import { deleteClientAdmin } from 'src/slices/ClientAdmin/DeleteClientAdmin'; // Import the delete thunk
import ClientListCard from './ClientListCard';
import CreateClientList from './CreateClientList';
import EditClientList from './EditClientList';
import DeleteConfirmationPopup from 'src/components/DeleteConfirmation/Deletion';
import SearchIcon from '@mui/icons-material/Search'; // Import the SearchIcon component
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook for localization

const ClientAdminList = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { t } = useTranslation(); // Initialize the translation hook
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(undefined);
    const [searchFilter, setSearchFilter] = useState(''); // State for search filter

    const userData = useSelector((state: any) => state.userData.userData);
    const { data: clientAdmins = [], status = 'idle' } = useSelector((state: any) => state.clientAdminFetch || {});
    const deleteStatusForClientList = useSelector((state: any) => state.deleteClientAdmin.status);

    useEffect(() => {
        if (userData?._id) {
            dispatch(fetchClientAdmins());
        }
    }, [dispatch, userData]);

    useEffect(() => {
        console.log('Client Admins:', clientAdmins);
    }, [clientAdmins]);

    const handleEditClick = (client: any) => {
        setSelectedClient(client);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedClient(undefined);
    };

    const handleDeleteClick = (client: any) => {
        setSelectedClient(client);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedClient(undefined);
    };

    const handleConfirmDelete = async () => {
        if (selectedClient) {
            try {
                // Dispatch the delete action
                await dispatch(deleteClientAdmin(selectedClient._id)).unwrap();
                // Fetch the updated list after successful deletion
                if (userData?._id) {
                    await dispatch(fetchClientAdmins()).unwrap();
                }
            } catch (error) {
                console.error('Failed to delete client admin:', error);
            }
        }
        setOpenDeleteDialog(false);
        setSelectedClient(undefined);
    };

    const filteredClientAdmins = clientAdmins?.filter((client: any) => {
        const clientMobile = client.mobile ? String(client.mobile) : ''; // Handle undefined or null
        return (
            client.name?.toLowerCase()?.includes(searchFilter?.toLowerCase()) ||
            clientMobile.includes(searchFilter)
        );
    });
    

    return (
        <>
        
            <Box>
                <CreateClientList />
            </Box>

            <Box sx={{ padding: '45px', mb: "-70px", mt: "-130px", mr: "80px", display: 'flex', justifyContent: "right" }}>
                <InputBase
                    placeholder={t('nameOrPhone')}
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    sx={{
                        width: '250px',
                        '& input': { px: 0, color: 'black' },
                        '& .MuiInputBase-input': { textAlign: 'center' },
                        backgroundColor: '#ffffff',
                        borderRadius: '20px 20px 20px 20px',
                        boxShadow: 'none',
                        pt: '6px',
                        pb: '6px',
                        pl: '10px',
                        pr: '10px',
                        border: '1.5px solid #A6C4E7',
                        color: '#007bff',
                    }}
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    }
                />
            </Box>

            <Card sx={{ margin: '40px' }}>
                <Box
                    sx={{
                        overflowX: 'auto',
                        display: 'flex',
                        flexDirection: isMediumScreen || isSmallScreen ? 'column' : 'row',
                        flexWrap: 'wrap',
                    }}
                >
                    {status === 'loading' && <p>Loading...</p>}
                    {status === 'succeeded' && filteredClientAdmins.map((client: any) => (
                        <Box
                            key={client._id} // Use unique identifier for key
                            sx={{ width: isMediumScreen || isSmallScreen ? '100%' : 'calc(50% - 0px)' }}
                        >
                            <ClientListCard
                                name={client.clientAdmin.name}
                                status={client.clientAdmin.status}
                                designation={client.clientAdmin.designation}
                                phone={client.clientAdmin.mobile}
                                email={client.clientAdmin.email}
                                avatar={client.clientAdmin.avatar?.url || 'https://via.placeholder.com/150'}
                                onEditClick={() => handleEditClick(client)}
                                onDeleteClick={() => handleDeleteClick(client)}
                            />
                        </Box>
                    ))}

                    {status === 'failed' && <p>Failed to load client admins.</p>}
                </Box>
            </Card>

            <EditClientList open={openEditDialog} onClose={handleCloseEditDialog} client={selectedClient} />

            <DeleteConfirmationPopup
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                status={deleteStatusForClientList} // Pass status to the popup
            />
        </>
    );
};

export default ClientAdminList;
