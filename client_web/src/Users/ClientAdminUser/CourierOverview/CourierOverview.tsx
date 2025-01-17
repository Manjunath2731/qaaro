import React, { useEffect, useState } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar,
    FormControl, InputLabel, Select, MenuItem, TablePagination, InputBase, InputAdornment, Checkbox, Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';

import { fetchGetCouriers } from 'src/slices/ServiceCourier/GetServiceCouriers';
import { fetchDepoAdmin } from 'src/slices/DepoClient/GetDepoClient';
import { fetchLamiAdmins } from 'src/slices/getLamySLice';
import PageHeading from 'src/components/PageHeading/PageHeading';
import HistoryDetails from 'src/Users/LamiUser/Courier/CourierHistory/HistoryDetails';

const CourierOverview: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: any) => state.userData.userData);

    const [selectedDepoId, setSelectedDepoId] = useState('');
    const [selectedServiceProviderId, setSelectedServiceProviderId] = useState('');
    const [searchFilter, setSearchFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [selectedCourierId, setSelectedCourierId] = useState<string>(''); // Initialize with an empty string

    const { data: couriers = [] } = useSelector((state: RootState) => state.getCouriers);
    const { depoAdmins = [] } = useSelector((state: RootState) => state.depoAdmin);
    const { admins = [] } = useSelector((state: RootState) => state.lami);

    useEffect(() => {
        if (userData && userData._id) {
            dispatch(fetchDepoAdmin({ clientId: userData._id }));

        }
    }, [userData, dispatch]);

    useEffect(() => {
        if (selectedDepoId) {
            dispatch(fetchLamiAdmins({ depoAdminId: selectedDepoId }));
        } else {
            // Reset service providers if no depo is selected
            dispatch(fetchLamiAdmins({ depoAdminId: '' }));
        }
    }, [selectedDepoId, userData, dispatch]);

    useEffect(() => {
        if (selectedDepoId && selectedServiceProviderId) {
            dispatch(fetchGetCouriers({
                clientId: userData._id,
                depoAdminId: selectedDepoId,
                lamiId: selectedServiceProviderId,
            }));
        } else {
            // Reset couriers if any required filter is not selected
            dispatch(fetchGetCouriers({ clientId: '', depoAdminId: '', lamiId: '' }));
        }
    }, [selectedDepoId, selectedServiceProviderId, userData, dispatch]);


    useEffect(() => {
        // Automatically select the first courier when data is loaded
        if (couriers.length > 0 && !selectedCourierId) {
            setSelectedCourierId(couriers[0]._id);
        }
    }, [couriers, selectedCourierId]);

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
            (!selectedDepoId || courier.depoAdminId._id === selectedDepoId) &&
            (!selectedServiceProviderId || courier.plugoAdminId._id === selectedServiceProviderId)
    );

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
            <Box sx={{ margin: "30px" }}>
                <PageHeading>Couriers List</PageHeading>

                <Box sx={{ display: 'flex', gap: '30px', marginBottom: '20px', justifyContent: 'space-between', mt: 3 }}>
                    <Box sx={{ display: 'flex', gap: '20px' }}>

                        {userData?.role !== "Depo_Admin" && (
                            <>
                                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                                    <InputLabel id="depo-select-label">Select Depo</InputLabel>
                                    <Select
                                        labelId="depo-select-label"
                                        value={selectedDepoId}
                                        onChange={(e) => setSelectedDepoId(e.target.value)}
                                        label="Select Depo"
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
                                        disabled={!selectedDepoId} // Disable if no depo is selected
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
                            </>

                        )}

                    </Box>

                    <Box sx={{ display: "flex" }}>
                        <Box sx={{ width: 'fit-content', mr: "20px" }}>
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
                    </Box>
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
                                        <TableCell>Route No.</TableCell>
                                        <TableCell>Depo Admin</TableCell>
                                        <TableCell>SP Admin</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredCouriers.length ? (
                                        filteredCouriers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((courier: any) => (
                                            <TableRow key={courier._id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedCourierId === courier._id} // Check if current courier is selected
                                                        onChange={() => handleCheckboxChange(courier._id)} // Pass courierId to handleCheckboxChange
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Avatar src={courier.avatar} />
                                                </TableCell>
                                                <TableCell>{courier?.name}</TableCell>
                                                <TableCell>{courier.designation}</TableCell>
                                                <TableCell>{courier.depoAdminId?.name}</TableCell>
                                                <TableCell>{courier.plugoAdminId?.name}</TableCell>
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

                    </Grid>



                    <Grid item xs={12} lg={4} md={6} xl={4}>
                        <HistoryDetails courierId={selectedCourierId} />
                    </Grid>
                </Grid>


            </Box>
        </>
    );
};

export default CourierOverview;
