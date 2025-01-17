import React, { FC, useEffect, useState } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, InputBase,
    InputAdornment, Avatar, Select, MenuItem, FormControl, InputLabel, Grid, Checkbox
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { RootState, useDispatch, useSelector } from 'src/store';
import { fetchDepoAdmin } from 'src/slices/DepoClient/GetDepoClient';
import PageHeading from 'src/components/PageHeading/PageHeading';
import { fetchLamiAdmins } from 'src/slices/getLamySLice';
import { useTranslation } from 'react-i18next';
import SpPieChart from './SpPieChart';

interface ClientListTableProps {
    className?: string;
}

const SpOverview: FC<ClientListTableProps> = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchFilter, setSearchFilter] = useState<string>('');
    const [selectedDepoAdminId, setSelectedDepoAdminId] = useState<string | undefined>(undefined);
    const [selectedCourierId, setSelectedCourierId] = useState<string>(''); // Initialize with an empty string

    const userData = useSelector((state: any) => state.userData.userData);
    const { depoAdmins } = useSelector((state: RootState) => state.depoAdmin);
    const { status, admins = [], error } = useSelector((state: RootState) => state.lami);

    useEffect(() => {
        if (userData && userData._id) {
            dispatch(fetchDepoAdmin({ clientId: userData._id }));
        }
    }, [dispatch, userData]);

    useEffect(() => {
        dispatch(fetchLamiAdmins({ }));
        if (selectedDepoAdminId) {
            dispatch(fetchLamiAdmins({ depoAdminId: selectedDepoAdminId }));
        }
    }, [selectedDepoAdminId, dispatch]);

    useEffect(() => {
        // Set the first courier as selected when admins data is available
        if (admins.length > 0) {
            setSelectedCourierId(admins[0]._id);
        }
    }, [admins]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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
                <PageHeading>{t('Service Provider List')}</PageHeading>
            </Box>

            <Box sx={{ margin: '30px', mt: '40px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: '20px' }}>
                        {userData?.role !== "Depo_Admin" && (

                            <>
                                <FormControl sx={{ minWidth: 200 }}>
                                    <InputLabel id="select-depo-admin-label">Select Depo</InputLabel>
                                    <Select
                                        labelId="select-depo-admin-label"
                                        value={selectedDepoAdminId || ''}
                                        onChange={(event) => {
                                            const depoAdminId = event.target.value as string;
                                            setSelectedDepoAdminId(depoAdminId);
                                        }}
                                        displayEmpty
                                        placeholder="Select Depo"
                                        renderValue={(value) => {
                                            if (value === '') {
                                                return 'Select Depo';
                                            }
                                            if (value === 'all') {
                                                return 'All';
                                            }
                                            const selectedAdmin = depoAdmins.find((admin) => admin._id === value);
                                            return selectedAdmin ? selectedAdmin.name : '';
                                        }}
                                    >
                                        <MenuItem value="">{t('All')}</MenuItem>
                                        {depoAdmins.map((admin) => (
                                            <MenuItem key={admin._id} value={admin._id}>
                                                {admin.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        )}

                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: "5px" }}>
                        <Box sx={{ width: 'fit-content', mr: "20px" }}>
                            <InputBase
                                placeholder={t('nameOrPhone')}
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
                                        <TableCell>{t('#')}</TableCell>
                                        <TableCell>{t('Avatar')}</TableCell>
                                        <TableCell>{t('Name')}</TableCell>
                                        <TableCell>{t('Email')}</TableCell>
                                        <TableCell>{t('Mobile')}</TableCell>
                                        <TableCell>{t('Depo Admin')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {status === 'loading' && (
                                        <Box sx={{ textAlign: 'center', py: 3 }}>
                                            Loading...
                                        </Box>
                                    )}
                                    {status === 'succeeded' && admins.length === 0 && (
                                        <Box sx={{ textAlign: 'center', py: 3 }}>
                                            No data to show
                                        </Box>
                                    )}
                                    {status === 'failed' && (
                                        <Box sx={{ textAlign: 'center', py: 3 }}>
                                            Failed to load data
                                        </Box>
                                    )}
                                    {admins
                                        .filter((admin) =>
                                            admin.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                                            admin.email.toLowerCase().includes(searchFilter.toLowerCase())
                                        )
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((admin, index) => (
                                            <TableRow key={admin._id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedCourierId === admin._id} // Check if current courier is selected
                                                        onChange={() => handleCheckboxChange(admin._id)} // Pass courierId to handleCheckboxChange
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Avatar alt={admin.name} src={admin.avatar.url} />
                                                </TableCell>
                                                <TableCell>{admin.name}</TableCell>
                                                <TableCell>{admin.email}</TableCell>
                                                <TableCell>{admin.mobile}</TableCell>
                                                <TableCell>{admin.depoAdminId?.name || t('N/A')}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>

                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={admins.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    </Grid>

                    <Grid item xs={12} lg={4} md={6} xl={4}>
                        <SpPieChart lamiId={selectedCourierId} />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default SpOverview;
