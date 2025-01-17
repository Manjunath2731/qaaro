import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../../../store';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    IconButton,
    Card,
    CardHeader,
    Typography,
    InputBase,
    InputAdornment,
    Box,
    Tooltip,
    useTheme,
    Divider,
    useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import { GiReturnArrow } from "react-icons/gi";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { fetchDashboardTicketTableData } from '../../../../slices/LamiDashboard/LamiTicketTable'; // Import your slice action
import ReturnToLoco from 'src/components/ReturnToLoco/ReturnLocoPop';

import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';

const NewTickets = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();

    const { data: tickets, status } = useSelector((state) => state.dashboardTicketTable); // Connect to Redux state

    const [complainNumberFilter, setComplainNumberFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(0); // Set initial page to 0
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openReturnToLocoPopup, setOpenReturnToLocoPopup] = useState(false); // State to manage visibility of Popup
    const [selectedTicketId, setSelectedTicketId] = useState('');


    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    useEffect(() => {
        dispatch(fetchDashboardTicketTableData());
    }, [dispatch]);

    const currentDate = new Date();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 5));
        setPage(0);
    };

    const handleReturnToLoco = (ticketId: string) => {
        setOpenReturnToLocoPopup(true);
        setSelectedTicketId(ticketId); // Assuming you have a state to store the selected ticketId
    };

    const handleViewDetails = (ticketId: string) => {
        navigate(`/lami/ticket-ticket_details_new/${ticketId}`);
    };

    const renderTableRows = () => {
        if (status === 'loading') {
            return <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>;
        }

        if (status === 'failed') {
            return <TableRow><TableCell colSpan={6}>Failed to fetch data</TableCell></TableRow>;
        }
        if (tickets.length === 0) {
            return <TableRow><TableCell colSpan={6}>{t("NoTicketsAvailable")}</TableCell></TableRow>;
        }

        return tickets
            .filter(ticket => (
                ticket.complainNumber.toLowerCase().includes(complainNumberFilter.toLowerCase()) &&
                (statusFilter === '' || ticket.status === statusFilter)
            ))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((ticket, index) => (
                <TableRow key={ticket._id}>

                    <TableCell> {(ticket.hasPendingInEmail) && (
                        <Box>
                            <MarkEmailReadOutlinedIcon sx={{ fontSize: "18px", color: "green" }} />

                        </Box>

                    )}</TableCell>
                    <TableCell>{ticket.complainNumber}</TableCell>
                    <TableCell>{ticket.packageNumber}</TableCell>
                    {(isLargeScreen) && <TableCell>{ticket.claimType}</TableCell>}

                    <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: ticket.amountInDispute <= 500 ? "#419AEF" : ticket.amountInDispute <= 1000 ? "orange" : "red", display: "inline-block", marginRight: "5px" }}></span>
                            <span >{ticket.amountInDispute}</span>
                        </Box>
                    </TableCell>
                    {(isLargeScreen) && <TableCell>                            {new Date(ticket?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>}

                    <TableCell>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            {new Date(ticket.deadlineDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            {calculateDaysDifference(new Date(ticket.deadlineDate))}
                        </Box>
                    </TableCell>
                    <TableCell>
                        <Tooltip title={t('viewDetails')}>
                            <IconButton aria-label="View"
                                onClick={() => handleViewDetails(ticket._id)}
                                sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}
                            >
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('returnToLoco')} arrow>
                            <IconButton
                                onClick={() => handleReturnToLoco(ticket._id)}
                                sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}
                            >
                                <GiReturnArrow />
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                </TableRow>
            ));
    };



    const calculateDaysDifference = (deadlineDate: Date) => {
        const diffInTime = deadlineDate.getTime() - currentDate.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

        if (diffInDays < 0) {
            return <span style={{ color: 'red' }}>{Math.abs(diffInDays)} days passed</span>;
        } else if (diffInDays >= 1 && diffInDays <= 3) {
            return <span style={{ color: 'red' }}>{diffInDays} days due</span>;
        } else if (diffInDays >= 4 && diffInDays <= 10) {
            return <span style={{ color: 'orange' }}>{diffInDays} days due</span>;
        } else {
            return <span style={{ color: 'blue' }}>{diffInDays} days due</span>;
        }
    };

    return (
        <>
            <Card sx={{ mb: "20px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", margin: "20px" }}>
                    <Typography variant="h4" sx={{ textAlign: 'left', mt: '10px', ml: "8px" }}>{t('newTickets')} ({tickets.length})</Typography>
                    <InputBase
                        placeholder={t('complainNumber')}
                        value={complainNumberFilter}
                        onChange={(e) => setComplainNumberFilter(e.target.value)}
                        sx={{
                            width: '200px',
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
                <Divider />

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{ }</TableCell>

                                <TableCell>{t('complainNumber')}</TableCell>
                                <TableCell>{t('packageNumber')}</TableCell>
                                {isLargeScreen && <TableCell>{t('claimType')}</TableCell>}

                                <TableCell>{t('amountInDispute')}</TableCell>
                                {isLargeScreen && <TableCell>{t('importDate')}</TableCell>}

                                <TableCell>{t('deadLineDate')}</TableCell>
                                <TableCell>{t('actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderTableRows()}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* Pagination */}
                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={tickets.length} // Use tickets length for count
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>

            <ReturnToLoco
                open={openReturnToLocoPopup}
                onClose={() => setOpenReturnToLocoPopup(false)}
                ticketId={selectedTicketId} // Pass the ticketId to the ReturnToLoco component

            />
        </>
    );
};

export default NewTickets;
