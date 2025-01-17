import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, useTheme, useMediaQuery, Box, Divider } from '@mui/material';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { useSelector, useDispatch } from 'src/store';
import { fetchTicketEmailList } from 'src/slices/Ticket/EmailList';
import AttachView from './AttchMailView';
import AttachemnetsView from './AttachementView';
import { updateTicketEmail } from 'src/slices/Ticket/EmailStatusReader';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

const RandomDatesCard: React.FC = () => {
    const dispatch = useDispatch();
    const emails = useSelector((state: any) => state.uniqueTickets.data);
    const { ticketId } = useParams(); // Get ticketId from URL params
    const { t } = useTranslation();

    // State for handling popover and selected mail
    const [openPopover, setOpenPopover] = useState(false);
    const [selectedMailContent, setSelectedMailContent] = useState<string>('');
    const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
    const [selectedAttachements, setSelectedAttachements] = useState<{ files: string[]; _id: string }>({
        files: [],
        _id: ''
    });
    const [selectedAttachType, setSelectedAttachType] = useState<string | null>(null);

    const [selectedAttachId, setSelectedAttachId] = useState<string | null>(null);
    const [openPopoverAttach, setOpenPopoverAttach] = useState(false);

    const handleClosePopover = () => {
        setOpenPopover(false);
        setOpenPopoverAttach(false); // Also close the attachment dialog
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleClickMail = (_id: string, ticketId: string) => {
        setSelectedMailId(ticketId);
        const selectedMailData = emails.find(data => data._id === _id);
        setSelectedMailContent(selectedMailData?.emailBody || '');
        setOpenPopover(true);

        // Dispatch action to update ticket email with the clicked _id
        dispatch(updateTicketEmail(_id))
            .then(() => {
                dispatch(fetchTicketEmailList(ticketId));
                console.log('Ticket email updated successfully');
            })
            .catch((error: any) => {
                console.error('Error updating ticket email:', error);
            });
    };

    const handleClickAttachement = (_id: string, ticketId: string) => {
        setSelectedAttachId(ticketId);
        const selectedMail = emails.find(data => data._id === _id);
        if (selectedMail) {
            setSelectedAttachements(selectedMail?.attachment);
            setSelectedAttachType(selectedMail.type); // Set the type in the state
        }
        setOpenPopoverAttach(true);
    };

    // Filter emails based on type
    const emailsIn = emails.filter(email => email.type === 'IN' || !email.type); // Includes 'IN', undefined, and null
    const emailsOut = emails.filter(email => email.type === 'OUT');
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

    return (
        <>
            <Card variant="outlined" sx={{ height: "480px", overflowY: 'auto', mt: "28px", mb: "20px" }}>
                <CardContent>



                    <Box sx={{ display: 'flex', flexDirection: isMediumScreen ? 'row' : 'column' }}>
                        <Box sx={{ flex: 1,}}>
                            <TableContainer style={{ maxHeight: 300, overflowY: 'auto', marginBottom: "20px", }}>
                                <Typography variant="h4" gutterBottom  >
                                    {t('emailsRecieved')} ({emailsIn.length})
                                </Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell>{t('importDate')}</TableCell>
                                            <TableCell>{t('actions')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {emailsIn.map((email, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}.</TableCell>
                                                <TableCell>{formatDate(email?.emailDate)}</TableCell>
                                                <TableCell>
                                                    {email?.status === 'pending' ? (
                                                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#E63571", display: "inline-block", marginRight: "5px" }}></span>
                                                    ) : (
                                                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#989898", display: "inline-block", marginRight: "5px" }}></span>
                                                    )}
                                                    <IconButton aria-label="mail" sx={{ color: "#808080" }} onClick={() => handleClickMail(email._id, email.ticketId)}>
                                                        <MarkEmailReadOutlinedIcon />
                                                    </IconButton>
                                                    <IconButton aria-label="view" onClick={() => handleClickAttachement(email._id, email.ticketId)}>
                                                        <AttachFileOutlinedIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                        {/* <Divider sx={{ borderBottom: '2px solid black', mb: "10px" }} orientation={isMediumScreen ? 'vertical' : 'horizontal'} flexItem /> */}

                        <Box sx={{ flex: 1, }}>
                            <TableContainer style={{ maxHeight: 300, overflowY: 'auto' }}>
                                <Typography variant="h4" gutterBottom >
                                    {t('emailsSent')} ({emailsOut.length})
                                </Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell>{t('sentDate')}</TableCell>
                                            <TableCell>{t('actions')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {emailsOut.map((email, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}.</TableCell>
                                                <TableCell>{formatDate(email?.emailDate)}</TableCell>
                                                <TableCell>
                                                    {email?.status === 'pending' ? (
                                                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#E63571", display: "inline-block", marginRight: "5px" }}></span>
                                                    ) : (
                                                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#989898", display: "inline-block", marginRight: "5px" }}></span>
                                                    )}
                                                    <IconButton aria-label="mail" sx={{ color: "#808080" }} onClick={() => handleClickMail(email._id, email.ticketId)}>
                                                        <MarkEmailReadOutlinedIcon />
                                                    </IconButton>
                                                    <IconButton aria-label="view" onClick={() => handleClickAttachement(email._id, email.ticketId)}>
                                                        <AttachFileOutlinedIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <AttachView
                open={openPopover}
                onClose={handleClosePopover}
                mailContent={selectedMailContent}
                ticketId={selectedMailId}
            />

            <AttachemnetsView
                open={openPopoverAttach}
                onClose={handleClosePopover}
                Value={selectedAttachements}
                ticketId={selectedAttachId}
                type={selectedAttachType} // Pass the type as a prop

            />
        </>
    );
};

export default RandomDatesCard;
