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
    TablePagination,
    Grid,
    Checkbox
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';


import { fetchClientAdmins } from 'src/slices/ClientAdmin/GetClientAdmin';
import { fetchDepoAdmin } from 'src/slices/DepoClient/GetDepoClient';
import { deleteDepoAdmin } from 'src/slices/DepoClient/DeleteDepoClient';
import StatusLabel from 'src/components/Label/statusLabel';
import { fetchUserData } from 'src/slices/UserData';
import PageHeading from 'src/components/PageHeading/PageHeading';
import DepoPieChart from './DepoPieChart';

const DepoOverview = () => {


    const [searchFilter, setSearchFilter] = useState<string>('');
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
    const [selectedCourierId, setSelectedCourierId] = useState<string>(''); // Initialize with an empty string

    const dispatch = useDispatch();
    const depoAdminsList = useSelector((state: any) => state.depoAdmin.depoAdmins);
    const depoAdminsStatus = useSelector((state: any) => state.depoAdmin.loading);
    const userData = useSelector((state: any) => state.userData.userData);

    useEffect(() => {
        dispatch(fetchUserData());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchDepoAdmin({ clientId: userData?._id }));
    }, [dispatch]);



    useEffect(() => {
        // Set the first courier as selected when admins data is available
        if (depoAdminsList.length > 0) {
            setSelectedCourierId(depoAdminsList[0]._id);
        }
    }, [depoAdminsList]);



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

    const handleCheckboxChange = (courierId: string) => {
        setSelectedCourierId(prevSelectedCourierId => {
            // If the clicked courier is already selected, deselect it
            if (prevSelectedCourierId === courierId) {
                return '';
            } else {
                // Otherwise, select the clicked courier
                return courierId;
            }
        });
    };

    return (
        <>
            <Box sx={{ margin: '30px' }}>
                <PageHeading>Client Depo List</PageHeading>


                <Box sx={{ display: "flex", justifyContent: "right", mb: "20px" , mr: "20px"  }}>
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

                </Box>


                <Grid container spacing={0.5}>
                    <Grid item xs={12} lg={8} md={6} xl={8}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>

                                        <TableCell>Avatar</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Phone</TableCell>
                                        <TableCell>Email</TableCell>
                                        
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
                                                    <Checkbox
                                                        checked={selectedCourierId === client._id} // Check if current courier is selected
                                                        onChange={() => handleCheckboxChange(client._id)} // Pass courierId to handleCheckboxChange
                                                    />
                                                </TableCell>
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

                    </Grid>

                    <Grid item xs={12} lg={4} md={6} xl={4}>
                        <DepoPieChart depoAdminId={selectedCourierId} />
                    </Grid>
                </Grid >
            </Box >
        </>
    );
};

export default DepoOverview;
