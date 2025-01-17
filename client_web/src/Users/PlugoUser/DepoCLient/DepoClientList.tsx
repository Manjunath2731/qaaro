import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'src/store';
import {
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tooltip,
    Avatar,
    CircularProgress,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    SelectChangeEvent,
    InputBase,
    InputAdornment,
    TablePagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

import { styled } from '@mui/material/styles';

import { fetchClientAdmins } from 'src/slices/ClientAdmin/GetClientAdmin';
import { fetchDepoAdmin } from 'src/slices/DepoClient/GetDepoClient';
import { deleteDepoAdmin } from 'src/slices/DepoClient/DeleteDepoClient';
import DeleteConfirmationPopup from 'src/components/DeleteConfirmation/Deletion';
import EditDepoList from './EditDepoList';
import StatusLabel from 'src/components/Label/statusLabel';
import { fetchUserData } from 'src/slices/UserData';
import CreateDepoClient from './CreateDepoClient';
import PageHeading from 'src/components/PageHeading/PageHeading';

const DepoClientList = () => {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(undefined);
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [searchFilter, setSearchFilter] = useState<string>('');
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

    const dispatch = useDispatch();
    const clientAdminsList = useSelector((state: any) => state.clientAdminFetch.data);
    const clientAdminsStatus = useSelector((state: any) => state.clientAdminFetch.status);
    const depoAdminsList = useSelector((state: any) => state.depoAdmin.depoAdmins);
    const depoAdminsStatus = useSelector((state: any) => state.depoAdmin.loading);
    const deleteStatusForDepoList = useSelector((state: any) => state.deleteDepoAdmin.status);
    const userData = useSelector((state: any) => state.userData.userData);

    useEffect(() => {
        dispatch(fetchUserData());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchClientAdmins());
        dispatch(fetchDepoAdmin({}));
    }, [dispatch]);

    useEffect(() => {
        if (selectedClientId) {
            dispatch(fetchDepoAdmin({ clientId: selectedClientId }));
        }
    }, [selectedClientId, dispatch]);

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
        if (selectedClient?._id) {
            dispatch(deleteDepoAdmin(selectedClient._id))
                .unwrap()
                .then(() => {
                    dispatch(fetchDepoAdmin({}));
                })
                .finally(() => {
                    setOpenDeleteDialog(false);
                    setSelectedClient(undefined);
                });
        }
    };

    const handleClientFilterChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        setSelectedClientId(value);

        if (value === '') {
            dispatch(fetchDepoAdmin({}));
        }
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when changing rows per page
    };

    const filteredDepoAdmins = depoAdminsList.filter((client: any) =>
        client.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        client.mobile.toString().includes(searchFilter)
    );

    const paginatedDepoAdmins = filteredDepoAdmins.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <>
            <Box sx={{ margin: '30px' }}>
                <PageHeading>Client Depo List</PageHeading>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt:3  }}>
                    <FormControl variant="outlined" sx={{ minWidth: 200, mb: 2, }}>
                        <InputLabel id="client-filter-label">Select Client</InputLabel>
                        <Select
                            labelId="client-filter-label"
                            id="client-filter"
                            value={selectedClientId}
                            onChange={handleClientFilterChange}
                            label="Select Client"
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {clientAdminsList?.map(admin => (
                                <MenuItem key={admin.clientAdmin._id} value={admin.clientAdmin._id}>
                                    {admin.clientAdmin.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ display: "flex", alignItems: "center", gap: '10px' }}>
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
                        <Box>
                            <CreateDepoClient />
                        </Box>
                    </Box>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Avatar</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>HQ Admin</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {depoAdminsStatus === 'loading' ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : paginatedDepoAdmins.length ? (
                                paginatedDepoAdmins.map((client: any) => (
                                    <TableRow key={client._id}>
                                        <TableCell>
                                            <Avatar
                                                alt={`${client.name}'s avatar`}
                                                src={client.avatar?.url || 'https://via.placeholder.com/150'}
                                                sx={{ width: 55, height: 55 }}
                                            />
                                        </TableCell>
                                        <TableCell>{client.name}</TableCell>
                                        <TableCell>{client.mobile}</TableCell>
                                        <TableCell>{client.email}</TableCell>
                                        <TableCell>{client.clientAdminId.name}</TableCell>
                                        <TableCell>{client.company.companyName}</TableCell>
                                        <TableCell>
                                            <StatusLabel color={client.status === 'active' ? 'success' : 'error'}>
                                                {client.status}
                                            </StatusLabel>
                                        </TableCell>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: 'inline-block',
                                                    borderRadius: '8px',
                                                    border: `1px solid #BCC1CB`,
                                                    overflow: 'hidden', mr: 1.5
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
                                                        onClick={() => handleEditClick(client)}
                                                        size="small"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                {/* <Tooltip title="Delete">
                                                    <IconButton
                                                        sx={{
                                                            '&:hover': {
                                                                color: 'black',
                                                            },
                                                            color: '#BCC1CB',
                                                            padding: '4px',
                                                        }}
                                                        onClick={() => handleDeleteClick(client)}
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip> */}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        No Data Available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredDepoAdmins.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>



                {openEditDialog && selectedClient && (
                    <EditDepoList open={openEditDialog} onClose={handleCloseEditDialog} depoAdmin={selectedClient} />
                )}

                {openDeleteDialog && selectedClient && (
                    <DeleteConfirmationPopup
                        open={openDeleteDialog}
                        onClose={handleCloseDeleteDialog}
                        onConfirm={handleConfirmDelete}
                        status={deleteStatusForDepoList}
                    />
                )}
            </Box>
        </>
    );
};

export default DepoClientList;
