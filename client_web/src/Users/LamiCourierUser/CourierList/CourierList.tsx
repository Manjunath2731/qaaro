import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { fetchCourierTickets } from '../../../slices/CourierDashboard/CourierList';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, useTheme, IconButton, Card, Box, Tooltip, FormControl, Select, MenuItem, InputBase, InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PageHeading from 'src/components/PageHeading/PageHeading';
import { useNavigate } from 'react-router-dom';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import { useTranslation } from 'react-i18next';
import ReturnConfirmation from './ReturnConfirmation'; // Import the ReturnConfirmation popup component
import SearchIcon from '@mui/icons-material/Search';
import useMediaQuery from '@mui/material/useMediaQuery';


const DriverCourierList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();

  const { tickets, status } = useSelector((state: RootState) => state.courierTickets);
  const [openPopup, setOpenPopup] = useState(false); // State to manage the visibility of the popup
  const [selectedTicketId, setSelectedTicketId] = useState<string>(''); // State to store the selected ticketId

  const [complainNumberFilter, setComplainNumberFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(0); // State for page number
  const [rowsPerPage, setRowsPerPage] = useState(10); // Set rows per page to 10 by default
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));


  useEffect(() => {
    dispatch<any>(fetchCourierTickets());
  }, [dispatch]);


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleViewDetails = (ticketId: string) => {
    navigate(`/lami-courier/courier-list-detail-new/${ticketId}`);
  };

  const handleReturnToLami = (ticketId: string) => {
    setSelectedTicketId(ticketId); // Store the selected ticketId
    setOpenPopup(true); // Open the popup when "Return to Lami" is clicked
  };

  const handleClosePopup = () => {
    setOpenPopup(false); // Close the popup
  };

  const handleSendDescription = (description: string) => {
    // Implement logic to send description to the backend
    // You may dispatch an action here or make an API call
    setOpenPopup(false); // Close the popup after sending
  };

  const filteredTickets = tickets.filter(ticket => {
    return (
      ticket.complainNumber.toLowerCase().includes(complainNumberFilter.toLowerCase()) &&
      (statusFilter === '' || ticket.status === statusFilter)
    );
  });

  const getSubStatusBagroundColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return '#b4f4ff';
      case 'COURIER RETURNED':
        return '#fff3b2';
      case 'CUSTOMER ACCEPTED':
        return '#d8ffc2';
      case 'CUSTOMER DENIED':
        return '#ffa191';
      case 'RE-OPEN':
        return '#ffddb2';
      case 'SUCCESS':
        return '#c4ff94';
      case 'LOST':
        return '#ffdad3';


      default:
        return 'inherit';
    }
  };

  return (
    <>
      <Box sx={{
        margin: '30px', display: "flex", flexDirection: { xs: 'column', sm: 'row' }
        , justifyContent: "space-between"
      }}>
        <PageHeading> {t('ticketList')} ({tickets.length}) </PageHeading>
        <Box sx={{
          padding: '20px', display: 'flex', gap: '20px', mb: "-40px", flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'left', sm: 'center' },

        }}>

          <Box sx={{ borderRadius: '0 4px 4px 0', width: 'fit-content' }}>
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
                width: "200px",
                height: "43px",
                '&:focus': {
                  backgroundColor: '#ffffff', // Override focused background color
                  borderColor: '#A6C4E7 !important', // Override focused border color
                  boxShadow: 'none' // Override focused box shadow
                }
              }}
            >
              <MenuItem value="">{t('allStatus')}</MenuItem>
              {/* Add menu items for status */}
              <MenuItem value="OPEN">OPEN</MenuItem>
              <MenuItem value="COURIER RETURNED">COURIER RETURNED</MenuItem>

              <MenuItem value="CUSTOMER ACCEPTED">CUSTOMER ACCEPTED</MenuItem>
              <MenuItem value="CUSTOMER DENIED">CUSTOMER DENIED</MenuItem>
              <MenuItem value="RE-OPEN">RE-OPEN</MenuItem>
            </Select>
          </FormControl>

        </Box>
      </Box>

      <Card sx={{ margin: '20px' }}>
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
              {status === 'loading' && (
                <TableRow>
                  <TableCell colSpan={9}>Loading...</TableCell>
                </TableRow>
              )}
              {status === 'failed' && (
                <TableRow>
                  <TableCell colSpan={9}>Failed to fetch data.</TableCell>
                </TableRow>
              )}
              {status === 'succeeded' && filteredTickets.map((ticket, index) => (
                <TableRow key={ticket._id}>
                  {/* Render appropriate cells based on screen size */}
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
                        <IconButton
                          aria-label="View"
                          onClick={() => handleViewDetails(ticket._id)}
                          sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <Tooltip title={t('returnToLami')} arrow>
                          <IconButton
                            disabled={ticket.status !== 'OPEN' && ticket.status !== 'RE-OPEN'}
                            onClick={() => handleReturnToLami(ticket._id)} // Add onClick event handler
                            sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}
                            size="small"
                          >
                            <TransferWithinAStationIcon fontSize="small" />
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
                          bgcolor={getSubStatusBagroundColor(ticket?.status)}
                          textAlign="center"
                          width={180}
                          borderRadius={0.5}
                          p={0.3}
                          fontSize="small"
                        >
                          {ticket.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="View"
                          onClick={() => handleViewDetails(ticket._id)}
                          sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <Tooltip title={t('returnToLami')} arrow>
                          <IconButton
                            disabled={ticket.status !== 'OPEN' && ticket.status !== 'RE-OPEN'}
                            onClick={() => handleReturnToLami(ticket._id)}
                            sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}
                            size="small"
                          >
                            <TransferWithinAStationIcon fontSize="small" />
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
                      <Tooltip title={ticket?.problem || ''}>

                        <TableCell>
                          {ticket?.problem ? (ticket?.problem.length > 25 ? ticket?.problem.substring(0, 25) + '...' : ticket?.problem) : ''}
                        </TableCell>
                      </Tooltip>

                      <TableCell>{ticket.amountInDispute}</TableCell>
                      <TableCell>{new Date(ticket.deadlineDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</TableCell>
                      <TableCell>
                        <Box
                          bgcolor={getSubStatusBagroundColor(ticket?.status)}
                          textAlign="center"
                          width={180}
                          borderRadius={0.5}
                          p={0.3}
                          fontSize="small"
                        >
                          {ticket.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="View"
                          onClick={() => handleViewDetails(ticket._id)}
                          sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <Tooltip title={t('returnToLami')} arrow>
                          <IconButton
                            disabled={ticket.status !== 'OPEN' && ticket.status !== 'RE-OPEN'}
                            onClick={() => handleReturnToLami(ticket._id)}
                            sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}
                            size="small"
                          >
                            <TransferWithinAStationIcon fontSize="small" />
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
          rowsPerPageOptions={[8]}
          component="div"
          count={filteredTickets.length} // Use the length of the filteredTickets array
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

export default DriverCourierList;
