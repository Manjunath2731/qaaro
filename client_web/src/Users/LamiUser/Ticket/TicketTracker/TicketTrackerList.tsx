import React, { FC, useEffect, useState } from 'react';
import {
    Box,
    Card,
    Checkbox,
    Grid,
    IconButton,
    InputAdornment,
    InputBase,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from '../../../../store';
import { fetchTicketTracker } from '../../../../slices/Ticket/TicketTrackerList';
import PageHeading from 'src/components/PageHeading/PageHeading';
import { useNavigate } from 'react-router-dom';

import Tracker from './Deliver';
import { fetchTrackerDetails } from 'src/slices/Ticket/TicketTrackerDetails';
import { useTranslation } from 'react-i18next';
import StatusLabel from 'src/components/Label/statusLabel';

const TicketTracker: FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation()
    const [complainNumberFilter, setComplainNumberFilter] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    const tickets = useSelector((state: any) => state.ticketTracker.tickets);
    const loading = useSelector((state: any) => state.ticketTracker.loading);

    useEffect(() => {
        dispatch(fetchTicketTracker());
    }, [dispatch]);

    useEffect(() => {
        if (tickets.length > 0) {
            setSelectedTicketId(tickets[0].ticketId);
            dispatch(fetchTrackerDetails(tickets[0].ticketId));
        }
    }, [tickets, dispatch]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 8));
        setPage(0);
    };

    const handleCheckboxChange = (ticketId: string) => {
        setSelectedTicketId(ticketId === selectedTicketId ? null : ticketId);
        dispatch(fetchTrackerDetails(ticketId));
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
                return 'insu';
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

    const isMediumScreenOrBelow = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Box sx={{ margin: "20px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ margin: '20px' }}>
                        <PageHeading>{t('ticketTracker')}</PageHeading>
                    </Box>

                    <Box sx={{ width: 'fit-content', mt: "18px" }}>
                        <InputBase
                            placeholder={t('complainNumber')}
                            value={complainNumberFilter}
                            onChange={(e) => setComplainNumberFilter(e.target.value)}
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
                <Grid container spacing={2}>
                    <Grid item xs={5} lg={5} md={5} xl={5}>
                        <Card sx={{ mt: "30px", overflowX: "auto" }}>
                            <Box>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell>{t('complainNumber')}</TableCell>
                                            {!isMediumScreenOrBelow && <TableCell>{t('status')}</TableCell>}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={isMediumScreenOrBelow ? 2 : 3}>
                                                    <Box display="flex" justifyContent="left" alignItems="center">
                                                        <Box ml={1}>Loading...</Box>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            tickets
                                                ?.filter((ticket: any) => ticket?.complaintNumber?.includes(complainNumberFilter))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((ticket: any) => (
                                                    <TableRow key={ticket.ticketId} hover>
                                                        <TableCell>
                                                            <Checkbox checked={selectedTicketId === ticket.ticketId} onChange={() => handleCheckboxChange(ticket.ticketId)} />
                                                        </TableCell>
                                                        <TableCell>
                                                            {isMediumScreenOrBelow ? (
                                                                <>
                                                                    <div>{ticket.complaintNumber.slice(0, Math.ceil(ticket.complaintNumber.length / 2))}</div>
                                                                    <div>{ticket.complaintNumber.slice(Math.ceil(ticket.complaintNumber.length / 2))}</div>
                                                                </>
                                                            ) : (
                                                                ticket.complaintNumber
                                                            )}
                                                        </TableCell>
                                                        {!isMediumScreenOrBelow && (
                                                            <TableCell>
                                                                <StatusLabel color={getStatusLabelColor(ticket.status)}>
                                                                    {ticket.status}
                                                                </StatusLabel>
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                ))
                                        )}
                                    </TableBody>
                                </Table>
                            </Box>
                            <TablePagination
                                rowsPerPageOptions={[8]}
                                component="div"
                                count={tickets?.filter((ticket: any) => ticket?.complaintNumber?.includes(complainNumberFilter)).length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Card>
                    </Grid>
                    <Grid item xs={7} lg={7} md={7} xl={7}>
                        {selectedTicketId && <Tracker ticketId={selectedTicketId} />}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default TicketTracker;
