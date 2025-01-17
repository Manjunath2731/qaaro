import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'src/store';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, IconButton, Paper, Box, TablePagination, Tooltip } from '@mui/material';
import { Delete, ArchiveTwoTone } from '@mui/icons-material';
import PageHeading from 'src/components/PageHeading/PageHeading';
import { RootState } from 'src/store'; // Assuming RootState is defined in your store
import { deleteAnonymousTicket } from 'src/slices/Annonymous/DeleteList';
import DeleteConfirmationPopup from 'src/components/DeleteConfirmation/Deletion';
import DriveFileRenameOutlineTwoToneIcon from '@mui/icons-material/DriveFileRenameOutlineTwoTone';
import { fetchAnonymousTickets } from 'src/slices/Annonymous/TabelList';
import PopupForm from './CreateNewTicket';
import AttachTicketList from './AttachTicketList'; // Import AttachTicketList component
import { useTranslation } from 'react-i18next';

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
    return `${day}-${month}-${year}`;
};

const CustomTable: React.FC<{ setSelectedTicket: Function }> = ({ setSelectedTicket }) => {

    const { t } = useTranslation();
    const tickets = useSelector((state: RootState) => state.anonymousTickets.tickets);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState<any>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8); // Initial rows per page
    const dispatch = useDispatch();
    const deleteAnonymousTickets = useSelector((state: any) => state.deleteClientAdmin.status);

    const [openPopup, setOpenPopup] = useState(false);
    const [openAttachTicketList, setOpenAttachTicketList] = useState(false); // State for opening AttachTicketList
    const [selectedTicketForAttachment, setSelectedTicketForAttachment] = useState<any>(null); // State to hold the selected ticket for attachment
    const [selectedTicketForNewTicket, setSelectedTicketForNewTicket] = useState<string | null>(null); // State to hold the selected ticket for the new ticket

    // Initialize selectedTicketId with the ID of the first ticket when component mounts or tickets change
    useEffect(() => {
        if (tickets.length > 0) {
            setSelectedTicketId(tickets[0]._id);
            setSelectedTicket(tickets[0]); // Set selected ticket to the first ticket
        }
    }, [tickets]);

    const handleCheckboxClick = (ticket: any) => {
        setSelectedTicket(ticket);
        setSelectedTicketId(ticket._id);
    };

    const handleDeleteIconClick = (ticket: any) => {
        setTicketToDelete(ticket);
        setOpenDeleteConfirmation(true);
    };

    const handleAttachIconClick = (ticket: any) => {
        setSelectedTicketForAttachment(ticket);
        setOpenAttachTicketList(true); // Open AttachTicketList when clicking on Attach Icon
    };

    const handleCreateNewTicket = (ticketId: string) => {
        setSelectedTicketForNewTicket(ticketId);
        setOpenPopup(true); // Open PopupForm with ticketId
    };

    const handleConfirmDelete = () => {
        if (ticketToDelete) {
            dispatch(deleteAnonymousTicket(ticketToDelete._id));
        }
        setOpenDeleteConfirmation(false);
        dispatch(fetchAnonymousTickets());
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page changes
    };

    return (
        <>
            <Box>
                <Box mb={4}>
                    <PageHeading>
                        {t('annonymousMails')}
                        ({tickets?.length})</PageHeading>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>
                                    {t('importDate')}
                                </TableCell>
                                <TableCell>{t("actions")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ticket) => (
                                <TableRow key={ticket._id}>
                                    <TableCell>
                                        <Checkbox
                                            onChange={() => handleCheckboxClick(ticket)}
                                            checked={selectedTicketId === ticket._id}
                                        />
                                    </TableCell>
                                    <TableCell>{formatDate(ticket.emailDate)}</TableCell>
                                    <TableCell>
                                        <Tooltip title={t('delete')}
                                        >
                                            <IconButton aria-label="delete" sx={{ color: "#808080" }} onClick={() => handleDeleteIconClick(ticket)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('attachToTicket')}
                                        >
                                            <IconButton sx={{ color: "#808080" }} aria-label="attach" onClick={() => handleAttachIconClick(ticket)}>
                                                <ArchiveTwoTone />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('createNewTicket')}
                                        >
                                            <IconButton aria-label="new" onClick={() => handleCreateNewTicket(ticket._id)}>
                                                <DriveFileRenameOutlineTwoToneIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>


                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[8, 10, 25]}
                        component="div"
                        count={tickets.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </Box>
            <DeleteConfirmationPopup
                open={openDeleteConfirmation}
                onClose={() => setOpenDeleteConfirmation(false)}
                onConfirm={handleConfirmDelete}
                status={deleteAnonymousTickets}
            />
            <PopupForm open={openPopup} onClose={() => setOpenPopup(false)} anonymousId={selectedTicketForNewTicket} />
            <AttachTicketList
                open={openAttachTicketList}
                onClose={() => setOpenAttachTicketList(false)}
                annomymousId={selectedTicketForAttachment?._id} // Fix the typo here
            />
        </>
    );
};

export default CustomTable;
