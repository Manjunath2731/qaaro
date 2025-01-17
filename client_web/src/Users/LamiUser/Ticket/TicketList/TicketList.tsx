import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../../../store';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
    Tooltip,
    IconButton,
    useTheme,
    MenuItem,
    InputAdornment,
    InputBase,
    FormControl,
    Select,
    Avatar,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import { RootState } from '../../../../store';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PageHeading from 'src/components/PageHeading/PageHeading';
import { fetchTicketList } from '../../../../slices/Ticket/GetTicketList';
import { useNavigate } from 'react-router-dom';
import { assignCourierToTicket } from '../../../../slices/Ticket/AssignCourier';
import { fetchLamiCouriers } from '../../../../slices/LaMiCourierList/CourierGet';

import SearchIcon from '@mui/icons-material/Search';
import ReturnToLoco from 'src/components/ReturnToLoco/ReturnLocoPop';
import { GiReturnArrow } from "react-icons/gi";
import CourierSelectionPopup from '../TicketDetails/AssignConfirmation';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import Label from 'src/components/Label';
import StatusLabel from 'src/components/Label/statusLabel';
interface Ticket {
    _id: string;
    complainNumber: string;
    packageNumber: string;
    claimType: string;
    problem: string;
    amountInDispute: number;
    deadlineDate: string;
    status: string;
    createdAt: string;
    SubStatus: string;
    courierData: {
        name: string;
        routeNo: string;

        avatar: {
            url: string;
        }
    };
    hasPendingInEmail: boolean;
}

interface TicketListTableProps {
    tickets?: Ticket[];
}

const TicketListTable: FC<TicketListTableProps> = ({ tickets }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();
    const ticketState = useSelector((state: any) => state.tickets);
    const { status: courierStatus, couriers } = useSelector((state: RootState) => state.courier);

    const navigate = useNavigate();
    const { ticketId } = useParams();
    const { search } = useLocation(); // Get location object
    const queryParams = new URLSearchParams(search); // Parse query parameters

    const [openCourierPopup, setOpenCourierPopup] = useState(false);
    const [complainNumberFilter, setComplainNumberFilter] = useState<string>(queryParams.get('driverName') || ''); // Set initial value from query parameter
    const [statusFilter, setStatusFilter] = useState<string>(queryParams.get('status') || ''); // Set initial value from query parameter
    const [subStatusFilter, setSubStatusFilter] = useState<string>('');
    const [page, setPage] = useState(0); // State for page number
    const [rowsPerPage, setRowsPerPage] = useState(10); // Set rows per page to 10 by default
    const [openReturnToLocoPopup, setOpenReturnToLocoPopup] = useState(false); // State to manage visibility of Popup
    const [selectedTicketId, setSelectedTicketId] = useState('');



    const [openCourierSelection, setOpenCourierSelection] = useState(false); // State to control CourierSelectionPopup visibility
    const [openPopup, setOpenPopup] = useState(false);



    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Inside filteredTickets definition
    const filteredTickets = ticketState.tickets.filter(ticket => {


        return (
            (ticket.complainNumber.toLowerCase().includes(complainNumberFilter.toLowerCase()) ||
                (ticket.courierData && ticket.courierData.name && ticket.courierData.name.toLowerCase().includes(complainNumberFilter.toLowerCase()))) &&
            (statusFilter === '' || ticket.status === statusFilter) &&
            (subStatusFilter === '' || ticket.SubStatus === subStatusFilter)
        );
    });



    const slicedTickets = filteredTickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    useEffect(() => {
        dispatch(fetchTicketList());
        dispatch(fetchLamiCouriers());
    }, [dispatch]);

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



    const formatDeadlineDate = (dateString: string) => {
        const deadlineDate = new Date(dateString);
        return deadlineDate.toLocaleDateString();
    };

    const handleReturnToLoco = (ticketId: string) => {
        setOpenReturnToLocoPopup(true);
        setSelectedTicketId(ticketId); // Assuming you have a state to store the selected ticketId
    };

    const handleAssignCourier = (ticketId: string) => {
        setSelectedTicketId(ticketId); // Set the selected ticketId
        setOpenCourierSelection(true);
    };

    const handleOpenCourierSelection = () => {
        setOpenCourierSelection(true);
    };

    const handleAssignDescription = (courierId: string, description: string) => {
        dispatch(assignCourierToTicket({ ticketId: selectedTicketId, courierId, description }));
        setOpenPopup(false);

    };
    const handleCloseCourierSelection = () => {
        setOpenCourierSelection(false);
    };



    const handleViewDetails = (ticketId: string) => {
        navigate(`/lami/ticket-ticket_details_new/${ticketId}`);
    };

    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isXLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));


    return (
        <>
            <Box sx={{ margin: '40px', display: "flex", justifyContent: "space-between" }}>
                <PageHeading>{t('ticketList')} ({filteredTickets?.length})</PageHeading>
                <Box sx={{ padding: '20px', display: 'flex', gap: '20px', mb: "-80px" }}>

                    <Box sx={{ borderRadius: '0 4px 4px 0', width: 'fit-content' }}>
                        <InputBase
                            placeholder={t('searchByComplainNumber')}
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






                    <FormControl variant="outlined" margin="dense" sx={{ mt: "-2px" }}>
                        <Select
                            value={statusFilter}
                            displayEmpty
                            onChange={(e) => setStatusFilter(e.target.value as string)}

                            sx={{
                                '& input': { px: 0, textAlign: 'center', color: "black" },
                                '& .MuiSelect-select': { textAlign: 'center' },
                                backgroundColor: '#ffffff',
                                borderRadius: '20px 20px 20px 20px',
                                boxShadow: 'none',
                                pt: '0px',
                                pb: '0px',
                                pl: '10px',
                                pr: '10px',
                                border: '1.5px solid #A6C4E7',
                                color: '#007bff',
                                width: "160px",
                                height: "43px",
                                '&:focus': {
                                    backgroundColor: '#ffffff', // Override focused background color
                                    borderColor: '#A6C4E7 !important', // Override focused border color
                                    boxShadow: 'none' // Override focused box shadow
                                }
                            }}
                            startAdornment={(
                                <InputAdornment position="end">

                                </InputAdornment>
                            )}
                        >
                            <MenuItem value="">{t('allStatus')}</MenuItem>

                            <MenuItem value="NEW">NEW</MenuItem>
                            <MenuItem value="LOCO">LOCO</MenuItem>
                            <MenuItem value="COURIER">COURIER</MenuItem>
                            <MenuItem value="PRELOCO">PRELOCO</MenuItem>
                            <MenuItem value="LOCO SUCCESS">LOCO SUCCESS</MenuItem>
                            <MenuItem value="LOCO LOST">LOCO LOST</MenuItem>
                            <MenuItem value="INSURANCE">INSURANCE</MenuItem>
                            <MenuItem value="INVOICED">INVOICED</MenuItem>
                            <MenuItem value="INSUOKAY">INSUOKAY</MenuItem>
                            <MenuItem value="INSUREJECT">INSUREJECT</MenuItem>
                            <MenuItem value="NOINSU">NOINSU</MenuItem>


                        </Select>
                    </FormControl>

                </Box>
            </Box>

            <Box sx={{ pb: "30px" }}>
                <Card sx={{ margin: '15px', overflowX: 'auto', mb: "30px" }} >


                    <Box >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mail</TableCell>
                                    <TableCell>{t('complainNumber')}</TableCell>
                                    {!(isMediumScreen || isLargeScreen) && <TableCell>{t('packageNumber')}</TableCell>}
                                    {!(isMediumScreen || isLargeScreen) && <TableCell>{t('claimType')}</TableCell>}
                                    {!(isMediumScreen) && <TableCell>{t('amountInDispute')}</TableCell>}

                                    {!(isMediumScreen || isLargeScreen) && <TableCell>{t('importDate')}</TableCell>}
                                    <TableCell>{t('deadLineDate')}</TableCell>
                                    <TableCell>{t('courierName')}</TableCell>
                                    <TableCell>{t('status')}</TableCell>
                                    <TableCell>{t('actions')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ticketState.status === 'loading' ? (
                                    <TableRow>
                                        <TableCell colSpan={isXLargeScreen ? 9 : 6}>Loading...</TableCell>
                                    </TableRow>
                                ) : ticketState.status === 'failed' || !ticketState.tickets || ticketState.tickets.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={isXLargeScreen ? 9 : 6}>Error: No data available</TableCell>
                                    </TableRow>
                                ) : (
                                    slicedTickets.map((ticket: Ticket, index: number) => (
                                        <TableRow key={index} hover>
                                            <TableCell>
                                                {(ticket.hasPendingInEmail) && (
                                                    <Box>
                                                        <MarkEmailReadOutlinedIcon sx={{ fontSize: "18px", color: "green" }} />
                                                    </Box>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div>{ticket.complainNumber.slice(0, ticket.complainNumber.length / 2)}</div>
                                                <div>{ticket.complainNumber.slice(ticket.complainNumber.length / 2)}</div>

                                            </TableCell>
                                            {!(isMediumScreen || isLargeScreen) && <TableCell>{ticket.packageNumber}</TableCell>}
                                            {!(isMediumScreen || isLargeScreen) && <TableCell>{ticket.claimType}</TableCell>}
                                            {!(isMediumScreen) && <TableCell>{ticket.amountInDispute}</TableCell>}

                                            {!(isMediumScreen || isLargeScreen) && <TableCell>{formatDeadlineDate(ticket.createdAt)}</TableCell>}
                                            <TableCell>{formatDeadlineDate(ticket.deadlineDate)}</TableCell>
                                            <TableCell sx={{ display: "flex", gap: "15px" }}>
                                                {ticket.courierData.name && (
                                                    <Avatar src={ticket?.courierData?.avatar?.url} sx={{ width: "40px", height: "40px" }} />
                                                )}
                                                <Box>
                                                    {ticket.courierData?.name}
                                                    {ticket.courierData?.routeNo && (
                                                        <Typography>Route: {ticket.courierData?.routeNo}</Typography>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <StatusLabel color={getStatusLabelColor(ticket.status)}>
                                                    {ticket.status}
                                                </StatusLabel>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={t('viewDetails')} arrow>
                                                    <IconButton
                                                        onClick={() => handleViewDetails(ticket._id)}
                                                        sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={t('returnToLoco')} arrow>
                                                    <IconButton
                                                        onClick={() => handleReturnToLoco(ticket._id)}
                                                        disabled={ticket.status !== 'PRELOCO' && ticket.status !== 'NEW'}
                                                        sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}
                                                        size="small"
                                                    >
                                                        <GiReturnArrow fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={t('assignCourier')} arrow>
                                                    <IconButton
                                                        onClick={() => handleAssignCourier(ticket._id)}
                                                        disabled={ticket.status !== 'NEW'}
                                                        sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}
                                                        size="small"
                                                    >
                                                        <LocalShippingIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>


                    </Box>
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
            </Box>




            <ReturnToLoco
                open={openReturnToLocoPopup}
                onClose={() => setOpenReturnToLocoPopup(false)}
                ticketId={selectedTicketId} // Pass the ticketId to the ReturnToLoco component

            />


            <CourierSelectionPopup open={openCourierSelection} onClose={handleCloseCourierSelection}
                onSend={handleAssignDescription}

            />


        </>
    );
};

export default TicketListTable;