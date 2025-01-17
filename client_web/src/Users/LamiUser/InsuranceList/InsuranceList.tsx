import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, InputAdornment, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PageHeading from 'src/components/PageHeading/PageHeading';
import { fetchInsuranceData } from 'src/slices/Insurance';
import { RootState, AppDispatch } from 'src/store';
import InsuranceAmount from './DataShow/InsuranceAmount';
import { useMediaQuery, Theme } from '@mui/material'; // Import useMediaQuery and Theme from @mui/material
import StatusLabel from 'src/components/Label/statusLabel';
import { useTranslation } from 'react-i18next';

const InsuranceList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { insuranceData, status, error } = useSelector((state: RootState) => state.insurance);
    const [complainNumberFilter, setComplainNumberFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const { t } = useTranslation();
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.between("sm", "md"));

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchInsuranceData());
        }
    }, [dispatch, status]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComplainNumberFilter(event.target.value);
    };

    const filteredTickets = insuranceData.filter((item) =>
        (!complainNumberFilter || item.ticketData.complainNumber.includes(complainNumberFilter))
    );

    // Calculate the current page data
    const paginatedTickets = filteredTickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusLabelColor = (status: string) => {
        switch (status) {
            case 'NEW':
                return 'primary';
            case 'LOCO':
                return 'info';
            case 'COURIER':
                return 'warning';
            case 'PRELOCO':
                return 'secondary';
            case 'LOCO SUCCESS':
                return 'success';
            case 'LOCO LOST':
                return 'error';
            case 'INSURANCE':
                return 'black';
            case 'INVOICED':
                return 'success';
            case 'INSUOKAY':
                return 'success';
            case 'INSUREJECT':
                return 'error';
            case 'NOINSU':
                return 'error';
            default:
                return 'secondary';
        }
    };
    return (
        <Box>
            <Box sx={{
                padding: '40px', display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row',
                justifyContent: "space-between"
            }}>
                <Box sx={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                    <PageHeading>{t("insuranceList")} ({filteredTickets.length})</PageHeading>
                    <InsuranceAmount />
                </Box>
                <Box sx={{ borderRadius: '0 4px 4px 0', width: 'fit-content' }}>
                    <InputBase
                        placeholder={t("complainNumber")}
                        value={complainNumberFilter}
                        onChange={handleSearchChange}
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
                        startAdornment={(
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )}
                    />
                </Box>
            </Box>
            <Box sx={{ margin: "20px", mt: "-20px", pb: "50px" }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>{t("complainNumber")}</TableCell>
                                <TableCell>{t("claimNumber")}</TableCell>
                                <TableCell>{t("ourSign")}</TableCell>
                                <TableCell>{t("date")}</TableCell>
                                <TableCell>{t("claim")}</TableCell>
                                <TableCell>{t("deductible")}</TableCell>
                                <TableCell>{t("compensation")}</TableCell>
                                <TableCell>{t("couriers")}</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedTickets.map((item, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {page * rowsPerPage + index + 1}.
                                    </TableCell>
                                    <TableCell>{item.ticketData?.complainNumber}</TableCell>
                                    <TableCell>{item.insurance?.insuClaimNumber}</TableCell>
                                    <TableCell>{item.insurance?.insuOurSign}</TableCell>
                                    <TableCell>{new Date(item.insurance?.insuDate).toLocaleDateString()}</TableCell>
                                    <TableCell>€ {item.insurance?.insuCompensationAmount}</TableCell>
                                    <TableCell>€ {item.insurance?.insuDeductible}</TableCell>
                                    <TableCell>€ {item.insurance?.insuTransferAmount}</TableCell>
                                    <TableCell sx={{ display: "flex", gap: "10px" }}>
                                        {item.courier?.name && (
                                            <Avatar src={item.courier?.avatar?.url} alt={item.courier?.name} sx={{ width: "40px", height: "40px" }} />
                                        )}
                                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                                            <Typography>{item?.courier?.name}</Typography>
                                            {item.courier?.name && (
                                                <Typography>Route: {item.courier?.routeNo}</Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>

                                        <StatusLabel color={getStatusLabelColor(item.ticketData?.status)}>
                                            {item.ticketData?.status}
                                        </StatusLabel>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredTickets.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </Box>
        </Box>
    );
};

export default InsuranceList;
