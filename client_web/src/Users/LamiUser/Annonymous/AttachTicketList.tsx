import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'src/store';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Typography, CircularProgress, Box, InputBase, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchTicketList } from 'src/slices/Ticket/GetTicketList';
import { attachToTicket } from 'src/slices/Annonymous/AttachToTicket';
import { fetchAnonymousTickets } from 'src/slices/Annonymous/TabelList';
import { useTranslation } from 'react-i18next';

interface Ticket {
    _id: number; // Change from 'id' to '_id'
    complainNumber: string;
}

interface AttachTicketListProps {
    open: boolean;
    onClose: () => void;
    annomymousId: string;
}

const AttachTicketList: React.FC<AttachTicketListProps> = ({ open, onClose, annomymousId }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const tickets = useSelector((state: any) => state.tickets.tickets);
    const status = useSelector((state: any) => state.tickets.status);
    const attchStatus = useSelector((state: any) => state.attachToTicket.status);

    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
    const [complainNumberFilter, setComplainNumberFilter] = useState('');

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTicketList());
        }
    }, [dispatch, status]);

    const handleCheckboxChange = (ticketId: number) => {
        setSelectedTicketId(ticketId === selectedTicketId ? null : ticketId); // Unselect if already selected
    };

    const handleAttachButtonClick = () => {
        console.log("BUTTON CLICKED")
        if (selectedTicketId !== null) {
            dispatch(attachToTicket({ anonymousId: annomymousId, ticketId: String(selectedTicketId) }));
        }
        onClose();
        dispatch(fetchAnonymousTickets());
    };

    const filteredTickets = tickets.filter((ticket: Ticket) =>
        ticket.complainNumber.toLowerCase().includes(complainNumberFilter.toLowerCase())
    );

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography variant="h6">{t("attach")} Ticket</Typography>
                <Typography variant="body2" color="textSecondary">{t("pleaseProvideBelowDetails")}</Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', justifyContent: 'left', mb: 2 }}>
                    <InputBase
                        placeholder="Search"
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
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>{t("complainNumber")}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTickets.map((ticket: Ticket, index: number) => (
                                <TableRow key={ticket._id}> {/* Change from 'id' to '_id' */}
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{ticket.complainNumber}</TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedTicketId === ticket._id}
                                            onChange={() => handleCheckboxChange(ticket._id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={onClose}>{t("cancel")}</Button>
                <Button variant='contained' color="primary" onClick={handleAttachButtonClick}>
                    {attchStatus === 'loading' ? <CircularProgress color='inherit' size="1rem" /> : t('attach')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AttachTicketList;
