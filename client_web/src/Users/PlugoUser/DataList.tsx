import React, { FC, useEffect, useState } from 'react';
import {
    Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, InputBase,
    InputAdornment, Avatar, Tooltip, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from '../../store';
import { fetchLamiAdmins } from '../../slices/getLamySLice';
import { deleteLamiAdmin } from '../../slices/deleteLamiSlice';
import EditMemberDialog from './EditList';
import DeleteConfirmationPopup from '../../components/DeleteConfirmation/Deletion';
import StatusLabel from 'src/components/Label/statusLabel';
import AccountSetting from '../UserBoxPages/AccountSetting';
import SearchIcon from '@mui/icons-material/Search';
import { fetchClientAdmins } from 'src/slices/ClientAdmin/GetClientAdmin';
import { fetchDepoAdmin } from 'src/slices/DepoClient/GetDepoClient';
import PageHeading from 'src/components/PageHeading/PageHeading';
import CreateMemberPage from './CreateForms';

interface Client {
    _id: string;
    name: string;
    company: string;
    mobile: string;
    email: string;
    address: string;
    status: 'active' | 'inactive';
    avatar: string;
    designation: string;
}

interface Admin {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    address: string;
    company: {
        companyName: string;
    }
    clientAdminId: {
        name: string;
    }
    depoAdminId: {
        name: string;
    }
    status: string;
    designation: string;
    avatar: {
        publicId: string;
        url: string;
        _id: string;
    };
}

interface ClientListTableProps {
    className?: string;
}

const ActionButton = ({ onClick, icon, tooltip }: { onClick: () => void, icon: React.ReactNode, tooltip: string }) => (
    <Box
        sx={{
            display: 'inline-block',
            borderRadius: '8px',
            border: `1px solid #BCC1CB`,
            overflow: 'hidden',
            marginRight: "5px",
            '&:hover': {
                border: `1px solid #A6C4E7`,
            },
        }}
    >
        <Tooltip title={tooltip}>
            <IconButton
                sx={{
                    '&:hover': {
                        backgroundColor: '#f0f0f0',
                        color: '#000000',
                    },
                    color: '#BCC1CB',
                    padding: '6px',
                    borderRadius: '4px',
                }}
                onClick={onClick}
                size="small"
                aria-label={tooltip}
            >
                {icon}
            </IconButton>
        </Tooltip>
    </Box>
);

const ClientListTable: FC<ClientListTableProps> = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();
    const deleteStatusForDepoList = useSelector((state: any) => state.deleteLamiAdmin.status);

    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
    const [openAccountSetting, setOpenAccountSetting] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | undefined>(undefined);
    const [accountSettingTargetId, setAccountSettingTargetId] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchFilter, setSearchFilter] = useState<string>('');
    const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);
    const [selectedDepoAdminId, setSelectedDepoAdminId] = useState<string | undefined>(undefined);

    useEffect(() => {
        dispatch(fetchClientAdmins());
        dispatch(fetchDepoAdmin({}));
        dispatch(fetchLamiAdmins({}));
    }, [dispatch]);

    useEffect(() => {
        if (selectedClientId || selectedDepoAdminId) {
            dispatch(fetchLamiAdmins({ clientId: selectedClientId, depoAdminId: selectedDepoAdminId }));
        }
    }, [selectedClientId, selectedDepoAdminId, dispatch]);

    const { data: clientAdmins = [] } = useSelector((state: any) => state.clientAdminFetch || {});
    const { depoAdmins } = useSelector((state: RootState) => state.depoAdmin);
    const { status, admins = [], error } = useSelector((state: RootState) => state.lami);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteClick = (lamiAdminId: string) => {
        setDeleteTargetId(lamiAdminId);
        setOpenDeleteConfirmation(true);
    };

    const handleDeleteConfirmation = () => {
        if (deleteTargetId) {
            dispatch(deleteLamiAdmin(deleteTargetId))
                .then(() => {
                    dispatch(fetchLamiAdmins({ clientId: selectedClientId, depoAdminId: selectedDepoAdminId }));
                })
                .catch((error) => {
                    console.error('Error deleting client:', error);
                })
                .finally(() => {
                    setOpenDeleteConfirmation(false);
                });
        }
    };

    const handleEditClick = (admin: Admin) => {
        const client: Client = {
            _id: admin._id,
            name: admin.name,
            company: admin.company.companyName,
            mobile: admin.mobile,
            email: admin.email,
            address: admin.address,
            status: admin.status === 'active' ? 'active' : 'inactive',
            avatar: admin.avatar.url,
            designation: admin.designation,
        };
        setSelectedClient(client);
        setOpenEditDialog(true);
    };

    const handleAccountSettingClick = (lamiAdminId: string) => {
        setAccountSettingTargetId(lamiAdminId);
        setOpenAccountSetting(true);
    };

    const handleAllOptionClick = () => {
        setSelectedClientId(undefined);
        setSelectedDepoAdminId(undefined);
        dispatch(fetchLamiAdmins({}));
    };

    return (
        <>
            <Box sx={{ margin: "30px" }}>
                <PageHeading>{t('Service Provider List')}</PageHeading>
            </Box>

            <Box sx={{ margin: '30px', mt: '40px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: '20px' }}>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel id="select-client-admin-label">Select Client</InputLabel>
                            <Select
                                labelId="select-client-admin-label"
                                value={selectedClientId || ''}
                                onChange={(event) => {
                                    const clientId = event.target.value as string;
                                    setSelectedClientId(clientId);
                                    setSelectedDepoAdminId(undefined); // Reset Depo selection when client changes
                                    if (clientId) {
                                        dispatch(fetchDepoAdmin({ clientId }));
                                    } else {
                                        handleAllOptionClick(); // Reset Depo Admins if no client is selected
                                    }
                                }}
                                displayEmpty
                                placeholder="Select Client"
                                renderValue={(value) =>
                                    value === '' ? 'Select Client' : value === 'all' ? 'All' : value
                                }
                            >
                                <MenuItem value="">{t('All')}</MenuItem>
                                {clientAdmins?.map(admin => (
                                    <MenuItem key={admin.clientAdmin._id} value={admin.clientAdmin._id}>
                                        {admin.clientAdmin.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel id="select-depo-admin-label">Select Depo</InputLabel>
                            <Select
                                labelId="select-depo-admin-label"
                                disabled={!selectedClientId} // Disable if no client is selected

                                value={selectedDepoAdminId || ''}
                                onChange={(event) => {
                                    const depoAdminId = event.target.value as string;
                                    setSelectedDepoAdminId(depoAdminId);
                                }}
                                displayEmpty
                                placeholder="Select Depo"
                                renderValue={(value) =>
                                    value === '' ? 'Select Depo' : value === 'all' ? 'All' : value
                                }
                            >
                                <MenuItem value="">{t('All')}</MenuItem>
                                {depoAdmins.map((admin) => (
                                    <MenuItem key={admin._id} value={admin._id}>
                                        {admin.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: "5px" }}>
                        <Box sx={{ width: 'fit-content' }}>
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
                        <Box>
                            <CreateMemberPage />

                        </Box>
                    </Box>
                </Box>

                <TableContainer component={Paper}>

                    <Table >
                        <TableHead >
                            <TableRow>
                                <TableCell>{t('S.No')}</TableCell>
                                <TableCell>{t('Profile')}</TableCell>
                                <TableCell>{t('Name')}</TableCell>
                                <TableCell>{t('Email')}</TableCell>
                                <TableCell>{t('Mobile')}</TableCell>
                                <TableCell>{t('Company')}</TableCell>
                                <TableCell>{t('Designation')}</TableCell>
                                <TableCell>{t('HQ Admin')}</TableCell>
                                <TableCell>{t('Depo Admin')}</TableCell>
                                <TableCell>{t('Status')}</TableCell>
                                <TableCell>{t('Action')}</TableCell>
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
                                    failed to load data
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
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell>
                                            <Avatar alt={admin.name} src={admin.avatar.url} />
                                        </TableCell>
                                        <TableCell>{admin.name}</TableCell>
                                        <TableCell>{admin.email}</TableCell>
                                        <TableCell>{admin.mobile}</TableCell>
                                        <TableCell>{admin.company.companyName}</TableCell>
                                        <TableCell>{admin.designation}</TableCell>
                                        <TableCell>{admin.clientAdminId?.name || t('N/A')}</TableCell>
                                        <TableCell>{admin.depoAdminId?.name || t('N/A')}</TableCell>
                                        <TableCell>
                                            <StatusLabel color={admin.status === 'active' ? 'success' : 'error'}>
                                                {admin.status}
                                            </StatusLabel>
                                        </TableCell>
                                        <TableCell sx={{ display: "flex", gap: "10px" }}>
                                            <ActionButton
                                                onClick={() => handleEditClick(admin)}
                                                icon={<EditIcon />}
                                                tooltip="Edit"
                                            />
                                            {/* <ActionButton
                                                onClick={() => handleDeleteClick(admin._id)}
                                                icon={<DeleteIcon />}
                                                tooltip="Delete"
                                            /> */}
                                            <ActionButton
                                                onClick={() => handleAccountSettingClick(admin._id)}
                                                icon={<SettingsIcon />}
                                                tooltip="Account Settings"
                                            />
                                        </TableCell>
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

                {openDeleteConfirmation && (
                    <DeleteConfirmationPopup
                        open={openDeleteConfirmation}
                        onClose={() => setOpenDeleteConfirmation(false)}
                        onConfirm={handleDeleteConfirmation}
                        status={deleteStatusForDepoList}
                    />
                )}

                {openEditDialog && selectedClient && (
                    <EditMemberDialog
                        open={openEditDialog}
                        onClose={() => setOpenEditDialog(false)}
                        client={selectedClient}
                    />
                )}

                {openAccountSetting && accountSettingTargetId && (
                    <AccountSetting
                        open={openAccountSetting}
                        onClose={() => setOpenAccountSetting(false)}
                        clientId={accountSettingTargetId}
                    />
                )}
            </Box>
        </>
    );
};

export default ClientListTable;
