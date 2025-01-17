import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    Typography,
    alpha,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Avatar,
    Table,
    TableContainer,
    styled,
    useTheme,
    CardHeader,
    Divider,
    TablePagination,
    Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../../../store';
import { RootState } from '../../../../store';
import { fetchDashboardTicketCourierData, selectDrivers } from '../../../../slices/LamiDashboard/CourierData';
import { useTranslation } from 'react-i18next';

const TableHeadWrapper = styled(TableHead)(
    ({ theme }) => `
        .MuiTableCell-root {
            text-transform: none;
            font-size: ${theme.typography.pxToRem(15)};
            padding-top: 0;
            padding-bottom: ${theme.spacing(0.1)};
            color: ${theme.colors.alpha.black[100]};
        }
  
        .MuiTableRow-root {
            background: transparent;
        }
    `
);

const TableWrapper = styled(Table)(
    ({ theme }) => `
      .MuiTableCell-root {
          border-bottom: 0;
      }

      .MuiTableRow-root:not(:last-child) {
          border-bottom: 1px solid ${theme.palette.grey[300]}; // Use grey instead of divider
      }
    `
);

const TableCellWrapper = styled(TableCell)(
    ({ theme }) => `
      padding: ${theme.spacing(0.5)}; // Reduced padding
      font-size: ${theme.typography.pxToRem(12)}; // Adjust font size as needed
      border-bottom: 1px solid ${theme.palette.grey[300]}; // Use grey instead of divider
      height: 20px; // Adjust height as needed
      &:hover {
          color: blue;
          cursor: pointer;
          // Add transition for smoother color change
          transition: color 0.3s ease;
      }
    `
);

const StyledCard = styled(Card)(
    ({ theme }) => `
        &::-webkit-scrollbar {
            width: 8px; /* Width of vertical scrollbar */
        }

        &::-webkit-scrollbar-thumb {
            background-color: ${theme.palette.grey[300]}; /* Color of the thumb */
            border-radius: 10px; /* Roundness of the thumb */
        }

        &::-webkit-scrollbar-thumb:hover {
            background-color: ${theme.palette.grey[400]}; /* Color of the thumb on hover */
        }

        &::-webkit-scrollbar-track {
            background-color: ${theme.palette.grey[50]}; /* Color of the track */
            border-radius: 4px; /* Roundness of the track */
        }
    `
);

function DriverList() {
    const { t }: { t: any } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);

    useEffect(() => {
        dispatch(fetchDashboardTicketCourierData());
    }, [dispatch]);

    const drivers = useSelector((state: RootState) => selectDrivers(state));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCellClick = (driverName: string, status: string) => {
        const url = `/lami/ticket-ticket_list?driverName=${encodeURIComponent(driverName)}&status=${encodeURIComponent(status)}`;
        navigate(url);
    };

    return (
        <StyledCard
            sx={{
                '&:hover': {
                    boxShadow: `0 2rem 8rem 0 ${alpha(theme.colors.alpha.black[100], 0.05)}, 
                  0 0.6rem 1.6rem ${alpha(theme.colors.alpha.black[100], 0.15)}, 
                  0 0.2rem 0.2rem ${alpha(theme.colors.alpha.black[100], 0.1)}`
                },
                height: "315px",
                marginBottom: "35px"
            }}
        >
            <CardHeader title={t('courierTracker')} />
            <Divider />
            <Box p={1}>
                <TableContainer>
                    <TableWrapper>
                        <TableHeadWrapper>
                            <TableRow>
                                <TableCell>{t('')}</TableCell>
                                <TableCell align="right">{ }</TableCell>
                                <TableCell align="right">{ }</TableCell>
                            </TableRow>
                        </TableHeadWrapper>
                        <TableBody>
                            {drivers &&
                                drivers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((driver, index) => (
                                        <TableRow key={`${driver.name}-${driver.open}-${driver.closed}-${index}`} hover>
                                            <TableCellWrapper>
                                                <Box display="flex" alignItems="center" sx={{ padding: theme.spacing(0.5), ml: 2 }}>
                                                    <Avatar
                                                        alt={driver.name}
                                                        src={driver.avatar.url}
                                                        sx={{
                                                            width: theme.spacing(4),
                                                            height: theme.spacing(4),
                                                            mr: 1
                                                        }}
                                                    />
                                                    <Box ml={1} sx={{ fontSize: theme.typography.pxToRem(12) }}>
                                                        <Typography color="text.primary" variant="h6" noWrap>
                                                            {driver.name.split(' ')[0]}
                                                        </Typography>
                                                        <Typography variant="subtitle2" noWrap>
                                                            {driver.designation}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCellWrapper>
                                            <TableCellWrapper>
                                                <Box
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                    width="100%"
                                                    sx={{ padding: theme.spacing(0.5) }}
                                                >
                                                    <Box display="flex" flexDirection="column" alignItems="center" onClick={() => handleCellClick(driver.name, 'COURIER')}>
                                                        <Typography variant="subtitle2" component="span" sx={{ color: "blue", fontWeight: "500" }}>
                                                            {t('open')}
                                                        </Typography>
                                                        <Typography variant="body2">{driver.open}</Typography>
                                                    </Box>
                                                    <Box display="flex" flexDirection="column" alignItems="center" onClick={() => handleCellClick(driver.name, 'PRELOCO')}>
                                                        <Typography variant="subtitle2" component="span" sx={{ color: "green", fontWeight: "500" }}>
                                                            {t('return')}
                                                        </Typography>
                                                        <Typography variant="body2">{driver.closed}</Typography>
                                                    </Box>
                                                    <Box display="flex" flexDirection="column" alignItems="center" onClick={() => handleCellClick(driver.name, 'PRELOCO')}>
                                                        <Typography variant="subtitle2" component="span" sx={{ color: "red", fontWeight: "500" }}>
                                                            {t('lost')}
                                                        </Typography>
                                                        <Typography variant="body2">€ {driver.lost}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCellWrapper>
                                        </TableRow>
                                    ))}
                        </TableBody>
                    </TableWrapper>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[3]}
                    component="div"
                    count={drivers?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </StyledCard>
    );
}

export default DriverList;
