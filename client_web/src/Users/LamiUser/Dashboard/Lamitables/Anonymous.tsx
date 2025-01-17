import React, { FC, useEffect, useState } from 'react';
import { Box, Card, CardHeader, IconButton, Table, TableBody, TablePagination, TableCell, TableHead, TableRow, Tooltip, Typography, useTheme, InputBase, InputAdornment, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from '../../../../store';
import { RootState } from '../../../../store/rootReducer';
import { fetchDashboardAnonymousTableData } from 'src/slices/LamiDashboard/Anonymous';
import { useNavigate } from 'react-router-dom';
import MailView from './ViewMail';
import { TbMailUp } from "react-icons/tb";

interface AnonymousTableProps {
    className?: string;
}

const AnonymousTable: FC<AnonymousTableProps> = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: anonymousData, status, error } = useSelector((state: RootState) => state.dashboardAnonymousTable);

    useEffect(() => {
        dispatch(fetchDashboardAnonymousTableData());
    }, [dispatch]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [complainNumberFilter, setComplainNumberFilter] = useState('');
    const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
    const [selectedMailContent, setSelectedMailContent] = useState<string>(''); // Add state for selected mail content
    const [openPopover, setOpenPopover] = useState(false);



    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredData = anonymousData?.filter(row => {
        return (
            row.ticket?.complainNumber?.toLowerCase()?.includes(complainNumberFilter?.toLowerCase())
        );
    }) || [];

    const handleViewDetails = (ticketId: string) => {
        console.log("ticketID,", ticketId);
        console.log("redirecting");
        navigate(`/lami/ticket-ticket_details/${ticketId}`);
    };

    const handleClickMail = (ticketId: string) => {
        setSelectedMailId(ticketId);
        const selectedMail = anonymousData.find(data => data.locoEmail.ticketId === ticketId);
        if (selectedMail) {
            setSelectedMailContent(selectedMail.locoEmail.emailBody); // Set selected mail content
        }
        setOpenPopover(true);
    };

    const handleClosePopover = () => {
        setOpenPopover(false);
    };
    // Function to format date to standard format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Adjust the format according to your needs
    };

    return (
        <>
            <Card sx={{ mb: "35px" }} >
                <Box sx={{ display: "flex", justifyContent: "space-between", margin: "20px" }}>
                    <CardHeader title="LOCO Response" />
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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{ }</TableCell>

                            <TableCell>{t('complainNumber')}</TableCell>
                            <TableCell>{t('amountInDispute')}</TableCell>
                            <TableCell>{t('ReturnedDate')}</TableCell>
                            <TableCell>{t('SendDate')}</TableCell>

                            <TableCell>{t('actions')}</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {status === 'loading' ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">{t('loading')}</TableCell>
                            </TableRow>
                        ) : status === 'failed' ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">{error}</TableCell>
                            </TableRow>
                        ) : (
                            filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                <TableRow key={row.locoEmail?.ticketId}>
                                    <TableCell >
                                        {page * rowsPerPage + index + 1}
                                    </TableCell>
                                    <TableCell>{row.ticket?.complainNumber}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: row.ticket.amountInDispute <= 500 ? "black" : row.ticket.amountInDispute <= 1000 ? "orange" : "red", display: "inline-block", marginRight: "5px" }}></span>
                                            <span >{row.ticket.amountInDispute}</span>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{formatDate(row.ticket?.date)}</TableCell>
                                    <TableCell>{formatDate(row.locoEmail.date)}</TableCell>

                                    <TableCell>
                                        <Tooltip title={t('viewDetails')} arrow>
                                            <IconButton
                                                aria-label="View"
                                                onClick={() => handleViewDetails(row.locoEmail.ticketId)}
                                                sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}

                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('ViewEmail')} arrow>
                                            <IconButton
                                                onClick={() => handleClickMail(row.locoEmail.ticketId)}
                                                sx={{ '&:hover': { background: theme.palette.primary.light, color: 'white' }, color: '#808080', marginRight: '8px' }}
                                            >
                                                <TbMailUp />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[3, 10, 25]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
            <MailView
                open={openPopover}
                onClose={handleClosePopover}
                mailContent={selectedMailContent}
                ticketId={selectedMailId}
            />

        </>
    );
};

export default AnonymousTable;


