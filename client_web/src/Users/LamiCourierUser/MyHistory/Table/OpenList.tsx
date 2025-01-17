import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from '../../../../store'; // Import useSelector and useDispatch
import { fetchTicketOpened } from '../../../../slices/CourierDashboard/OpenTickets'; // Import fetchTicketOpened action from your slice
import { RootState } from '../../../../store/rootReducer'; // Import RootState from your root reducer file
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme, IconButton, Card, Box, Tooltip, FormControl, Select, MenuItem, InputBase, InputAdornment, Typography, TablePagination } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import ReturnConfirmation from '../../CourierList/ReturnConfirmation';
import { useNavigate } from 'react-router-dom';
import { fetchTicketSummary } from 'src/slices/CourierDashboard/GetCardsNo';
import { fetchGraphData } from 'src/slices/CourierDashboard/AssignVsComp';
import { fetchGraphSecondData } from 'src/slices/CourierDashboard/PieValue';
import { GiReturnArrow } from "react-icons/gi";
import useMediaQuery from '@mui/material/useMediaQuery';


const OpenTicketList: React.FC = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch(); // Get dispatch function from Redux
    const navigate = useNavigate();

    const [openPopup, setOpenPopup] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<string>('');
    const [complainNumberFilter, setComplainNumberFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [page, setPage] = useState(0); // State for page number
    const [rowsPerPage, setRowsPerPage] = useState(10); // Set rows per page to 10 by default

    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));


    useEffect(() => {
        dispatch(fetchTicketOpened()); // Dispatch fetchTicketOpened action when component mounts
    }, [dispatch]); // Dispatch only once when component mounts

    const ticketOpenedData = useSelector((state: RootState) => state.ticketOpened.data); // Get ticket opened data from Redux state


    const handleViewDetails = (ticketId: string) => {
        navigate(`/lami-courier/courier-list-detail-new/${ticketId}`);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleReturnToLami = (ticketId: string) => {
        setSelectedTicketId(ticketId); // Store the selected ticketId
        setOpenPopup(true); // Open the popup when "Return to Lami" is clicked
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        //DISPATCHING ALL THE COMPPONENTS TO GET LATEST DATA
        dispatch(fetchTicketSummary());
        dispatch(fetchTicketOpened());
        dispatch(fetchGraphData('days')); // Assuming 'days' is the default period value
        dispatch(fetchGraphSecondData());

    };

    const handleSendDescription = (description: string) => {
        setOpenPopup(false);
    };

    const filteredTickets = ticketOpenedData?.filter(ticket => {
        return (
            ticket.complainNumber.toLowerCase().includes(complainNumberFilter.toLowerCase()) &&
            (statusFilter === '' || ticket.status === statusFilter)
        );
    }) || [];

    const slicedTickets = filteredTickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


    return (
        <>
            <Card sx={{ mt: "10px", mb: "30px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", margin: "20px" }}>
                    <Typography variant="h4" sx={{ textAlign: 'left', mt: '10px', ml: "8px" }}>{t('openTickets')} ({ticketOpenedData?.length})</Typography>
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
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {isSmallScreen && (
                                    <>
                                        <TableCell></TableCell>

                                        <TableCell>{t('complainNumber')}</TableCell>
                                        <TableCell>{t('actions')}</TableCell>
                                    </>
                                )}

                                {isMediumScreen && (
                                    <>
                                        <TableCell></TableCell>

                                        <TableCell>{t('complainNumber')}</TableCell>
                                        <TableCell>{t('amountInDispute')}</TableCell>
                                        <TableCell>{t('status')}</TableCell>
                                        <TableCell>{t('actions')}</TableCell>
                                    </>
                                )}
                                {isLargeScreen && (
                                    <>
                                        <TableCell></TableCell>

                                        <TableCell>{t('complainNumber')}</TableCell>
                                        <TableCell>{t('packageNumber')}</TableCell>
                                        <TableCell>{t('claimType')}</TableCell>
                                        <TableCell>{t('problem')}</TableCell>
                                        <TableCell>{t('amountInDispute')}</TableCell>
                                        <TableCell>{t('deadLineDate')}</TableCell>
                                        <TableCell>{t('status')}</TableCell>
                                        <TableCell>{t('actions')}</TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {slicedTickets.map((ticket, index) => (
                                <TableRow key={ticket.complainNumber}>
                                    {isSmallScreen && (
                                        <>
                                            <TableCell >
                                                {page * rowsPerPage + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div>{ticket.complainNumber.slice(0, ticket.complainNumber.length / 2)}</div>
                                                <div>{ticket.complainNumber.slice(ticket.complainNumber.length / 2)}</div>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton aria-label="View"
                                                    onClick={() => handleViewDetails(ticket.id)}
                                                    sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}

                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                                <Tooltip title={t('returnToLami')} arrow>
                                                    <IconButton
                                                        onClick={() => handleReturnToLami(ticket.id)}
                                                        sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}
                                                        size="small"
                                                    >
                                                        <GiReturnArrow fontSize="medium" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </>


                                    )}
                                    {isMediumScreen && (

                                        <>
                                            <TableCell >
                                                {page * rowsPerPage + index + 1}
                                            </TableCell>
                                            <TableCell>{ticket.complainNumber}</TableCell>

                                            <TableCell>{ticket.amountInDispute}</TableCell>
                                            <TableCell>
                                                <Box
                                                    bgcolor="#b4f4ff"
                                                    textAlign="center"
                                                    width={105}
                                                    borderRadius={0.5}
                                                    p={0.3}
                                                >
                                                    {ticket.status}

                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton aria-label="View"
                                                    onClick={() => handleViewDetails(ticket.id)}
                                                    sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}

                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                                <Tooltip title={t('returnToLami')} arrow>
                                                    <IconButton
                                                        onClick={() => handleReturnToLami(ticket.id)}
                                                        sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}
                                                        size="small"
                                                    >
                                                        <GiReturnArrow fontSize="medium" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </>
                                    )}
                                    {isLargeScreen && (

                                        <>
                                            <TableCell >
                                                {page * rowsPerPage + index + 1}
                                            </TableCell>
                                            <TableCell>{ticket.complainNumber}</TableCell>
                                            <TableCell>{ticket.packageNumber}</TableCell>
                                            <TableCell>{ticket.claimType}</TableCell>
                                            <TableCell>{ticket.problem}</TableCell>
                                            <TableCell>{ticket.amountInDispute}</TableCell>
                                            <TableCell>{new Date(ticket.deadlineDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}</TableCell>
                                            <TableCell>
                                                <Box
                                                    bgcolor="#b4f4ff"
                                                    textAlign="center"
                                                    width={105}
                                                    borderRadius={0.5}
                                                    p={0.3}
                                                >
                                                    {ticket.status}

                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton aria-label="View"
                                                    onClick={() => handleViewDetails(ticket.id)}
                                                    sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}

                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                                <Tooltip title={t('returnToLami')} arrow>
                                                    <IconButton
                                                        onClick={() => handleReturnToLami(ticket.id)}
                                                        sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}
                                                        size="small"
                                                    >
                                                        <GiReturnArrow fontSize="medium" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </>
                                    )}

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredTickets.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
            <ReturnConfirmation open={openPopup} onClose={handleClosePopup} onSend={handleSendDescription} ticketId={selectedTicketId} />
        </>
    );
};

export default OpenTicketList;

