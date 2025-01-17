import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'src/store';
import { RootState } from 'src/store'; // Adjust the path as needed
import ClientDepoCard from './ClientDepoCard'; // Adjust the path as needed
import { Box, CircularProgress, Typography, InputBase, InputAdornment } from '@mui/material';
import { fetchDepoAdmin } from 'src/slices/DepoClient/GetDepoClient';
import EditDepoList from 'src/Users/PlugoUser/DepoCLient/EditDepoList';
import PageHeading from 'src/components/PageHeading/PageHeading';
import CreateClientDepo from './CreateClientDepoList';
import InvitePopup from 'src/Users/PlugoUser/ServiceInvite/InviteForm';
import SearchIcon from '@mui/icons-material/Search';

const ClientDepoList = () => {
    const dispatch = useDispatch();
    const { depoAdmins, loading, error } = useSelector((state: RootState) => state.depoAdmin);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedDepoAdmin, setSelectedDepoAdmin] = useState(null);
    const [searchFilter, setSearchFilter] = useState('');

    useEffect(() => {
        dispatch(fetchDepoAdmin({}));
    }, [dispatch]);

    const handleEditClick = (admin) => {
        setSelectedDepoAdmin(admin);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedDepoAdmin(null);
    };

    // Filtered list based on search input
    const filteredDepoAdmins = depoAdmins.filter(
        (admin) =>
            admin.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
            admin.mobile.toString().includes(searchFilter)
    );

    return (
        <>
            <Box sx={{ margin: "30px" }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <PageHeading>Client Depo List</PageHeading>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 ,mr:5}}>
                        <InputBase
                            placeholder="Search by name or phone"
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            sx={{
                                width: '250px',
                                height: '40px',
                                '& input': { px: 0, color: 'black' },
                                backgroundColor: '#ffffff',
                                borderRadius: '20px',
                                border: '1.5px solid #A6C4E7',
                                color: '#007bff',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '4px 8px',
                            }}
                            startAdornment={
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            }
                        />
                        <InvitePopup />

                        <CreateClientDepo />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {loading ? (
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        filteredDepoAdmins.map((admin) => (
                            <Box key={admin._id} sx={{ width: '48%' }}>
                                <ClientDepoCard
                                    name={admin.name}
                                    status={admin.status === "active" || admin.status === "inactive" ? admin.status : "inactive"} // Ensure correct type
                                    designation={admin.designation}
                                    phone={admin.mobile.toString()}
                                    email={admin.email}
                                    avatar={admin.avatar?.url}
                                    onEditClick={() => handleEditClick(admin)}
                                />
                            </Box>
                        ))
                    )}

                    {selectedDepoAdmin && (
                        <EditDepoList
                            open={openEditDialog}
                            onClose={handleCloseEditDialog}
                            depoAdmin={selectedDepoAdmin}
                        />
                    )}
                </Box>
            </Box>
        </>
    );
};

export default ClientDepoList;
