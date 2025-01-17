import React, { useEffect, useState } from 'react';
import {
    Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, Avatar,
    FormControl, InputLabel, Select, MenuItem, TablePagination, InputBase, InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';
import DeleteConfirmationPopup from 'src/components/DeleteConfirmation/Deletion';
import StatusLabel from 'src/components/Label/statusLabel';
import CreateServiceCouriers from './CreateServicesCourier';
import EditServiceCouriers from './EditServicesCourier';
import { fetchGetCouriers } from 'src/slices/ServiceCourier/GetServiceCouriers';
import { fetchClientAdmins } from 'src/slices/ClientAdmin/GetClientAdmin';
import { fetchDepoAdmin } from 'src/slices/DepoClient/GetDepoClient';
import { fetchLamiAdmins } from 'src/slices/getLamySLice';
import PageHeading from 'src/components/PageHeading/PageHeading';

const ServiceCourierList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(undefined);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedDepoId, setSelectedDepoId] = useState('');
    const [selectedServiceProviderId, setSelectedServiceProviderId] = useState('');
    const [searchFilter, setSearchFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    const { data: couriers = [], status, error } = useSelector((state: RootState) => state.getCouriers);
    const { data: clientAdmins = [] } = useSelector((state: any) => state.clientAdminFetch || {});
    const { depoAdmins = [] } = useSelector((state: RootState) => state.depoAdmin);
    const { admins = [] } = useSelector((state: RootState) => state.lami);
    const deleteStatusForDepoList = useSelector((state: RootState) => state.deleteLamiAdmin.status);

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
            // Reset service providers if either clientId or depoId is not selected
            dispatch(fetchLamiAdmins({ clientId: '', depoAdminId: '' }));
        }
    }, [selectedClientId, selectedDepoId, dispatch]);

    useEffect(() => {
        if (selectedClientId && selectedDepoId && selectedServiceProviderId) {
            dispatch(fetchGetCouriers({
                clientId: selectedClientId,
                depoAdminId: selectedDepoId,
                lamiId: selectedServiceProviderId,
            }));
        } else {
            // Reset couriers if any required filter is not selected
            dispatch(fetchGetCouriers({ clientId: '', depoAdminId: '', lamiId: '' }));
        }
    }, [selectedClientId, selectedDepoId, selectedServiceProviderId, dispatch]);

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

    const handleConfirmDelete = () => {
        console.log('Delete confirmed for', selectedClient.name);
        setOpenDeleteDialog(false);
        setSelectedClient(undefined);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredCouriers = couriers.filter(
        (courier: any) =>
            (courier.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
                courier.mobile?.toString().includes(searchFilter)) &&
            (!selectedClientId || courier.clientAdminId._id === selectedClientId) &&
            (!selectedDepoId || courier.depoAdminId._id === selectedDepoId) &&
            (!selectedServiceProviderId || courier.plugoAdminId._id === selectedServiceProviderId)
    );

    return (
        <Box sx={{ margin: "30px" }}>
            <PageHeading>Couriers List</PageHeading>

            <Box sx={{ display: 'flex', gap: '30px', marginBottom: '20px', justifyContent: 'space-between', mt: 3 }}>
                <Box sx={{ display: 'flex', gap: '20px' }}>
                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                        <InputLabel id="client-select-label">Select Client</InputLabel>
                        <Select
                            labelId="client-select-label"
                            value={selectedClientId}
                            onChange={(e) => setSelectedClientId(e.target.value)}
                            label="Select Client"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {clientAdmins?.map((client: any) => (
                                <MenuItem key={client.clientAdmin._id} value={client.clientAdmin._id}>
                                    {client.clientAdmin.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                        <InputLabel id="depo-select-label">Select Depo</InputLabel>
                        <Select
                            labelId="depo-select-label"
                            value={selectedDepoId}
                            onChange={(e) => setSelectedDepoId(e.target.value)}
                            label="Select Depo"
                            disabled={!selectedClientId} // Disable if no client is selected
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {depoAdmins?.map((depo: any) => (
                                <MenuItem key={depo._id} value={depo._id}>
                                    {depo.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                        <InputLabel id="service-provider-select-label">Select Service Provider</InputLabel>
                        <Select
                            labelId="service-provider-select-label"
                            value={selectedServiceProviderId}
                            onChange={(e) => setSelectedServiceProviderId(e.target.value)}
                            label="Select Service Provider"
                            disabled={!selectedClientId || !selectedDepoId} // Disable if no client or depo is selected
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {admins?.map((provider: any) => (
                                <MenuItem key={provider._id} value={provider._id}>
                                    {provider.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: "flex", gap: "10px" }}>
                    <Box sx={{ width: 'fit-content' }}>
                        <InputBase
                            placeholder="Search by name or phone"
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            sx={{
                                width: '250px',
                                '& input': { px: 0, color: 'black' },
                                '& .MuiInputBase-input': { textAlign: 'center' },
                                backgroundColor: '#ffffff',
                                borderRadius: '20px',
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
                    <Box>
                        <CreateServiceCouriers />
                    </Box>

                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Avatar</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Route No.</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>HQ Admin</TableCell>
                            <TableCell>Depo Admin</TableCell>
                            <TableCell>SP Admin</TableCell>

                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCouriers.length ? (
                            filteredCouriers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((courier: any) => (
                                <TableRow key={courier._id}>
                                    <TableCell>
                                        <Avatar src={courier.avatar} />
                                    </TableCell>
                                    <TableCell>{courier.name}</TableCell>
                                    <TableCell>{courier.designation}</TableCell>
                                    <TableCell>{courier.mobile}</TableCell>
                                    <TableCell>{courier.email}</TableCell>
                                    <TableCell>{courier.clientAdminId.name}</TableCell>
                                    <TableCell>{courier.depoAdminId.name}</TableCell>
                                    <TableCell>{courier.plugoAdminId.name}</TableCell>

                                    <TableCell>
                                        <StatusLabel color={courier.status === 'active' ? 'success' : 'error'}>
                                            {courier.status}
                                        </StatusLabel>
                                    </TableCell>

                                    <TableCell sx={{ display: "flex", gap: "10px" }}>
                                        <Box
                                            sx={{
                                                display: 'inline-block',
                                                borderRadius: '8px',
                                                border: "1px solid #BCC1CB",
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    sx={{
                                                        '&:hover': {
                                                            color: 'black',
                                                        },
                                                        color: '#BCC1CB',
                                                        padding: '4px',
                                                    }}
                                                    onClick={() => handleEditClick(courier)} size="small"
                                                >
                                                    <EditIcon sx={{ fontSize: "18px" }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        {/* <Box
                                            sx={{
                                                display: 'inline-block',
                                                borderRadius: '8px',
                                                border: 1px solid #BCC1CB,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    sx={{
                                                        '&:hover': {
                                                            color: 'black',
                                                        },
                                                        color: '#BCC1CB',
                                                        padding: '4px',
                                                    }}
                                                    onClick={() => handleDeleteClick(courier)}
                                                    size="small"
                                                >
                                                    <DeleteIcon sx={{ fontSize: "18px" }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box> */}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No couriers found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    rowsPerPageOptions={[6, 12, 24]}
                    component="div"
                    count={filteredCouriers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <EditServiceCouriers open={openEditDialog} onClose={handleCloseEditDialog} client={selectedClient} />
            <DeleteConfirmationPopup
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                status={deleteStatusForDepoList}
            />
        </Box>
    );
};

export default ServiceCourierList;
