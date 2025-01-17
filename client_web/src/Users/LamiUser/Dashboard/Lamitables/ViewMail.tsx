import React, { FC, useState } from 'react';
import { useDispatch } from '../../../../store';
import { Box, Dialog, DialogTitle, DialogContent, Typography, Checkbox, Button } from '@mui/material';
import { finalizeTicket } from 'src/slices/Ticket/Finalization';
import { fetchDashboardAnonymousTableData } from 'src/slices/LamiDashboard/Anonymous';

interface MailViewProps {
    open: boolean;
    onClose: () => void;
    mailContent: string;
    ticketId: string | null;
}

const MailView: FC<MailViewProps> = ({ open, onClose, mailContent, ticketId }) => {
    const dispatch = useDispatch();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleCheckboxChange = (value: string) => {
        setSelectedOption(value === selectedOption ? null : value);
    };

    // const handleSubmit = () => {
    //     if (selectedOption) {
    //         const status = selectedOption === 'success' ? 'locosuccess' : 'locolost';
    //         dispatch(finalizeTicket({ ticketId, status }));
    //         onClose(); // Close the dialog after submitting
    //         dispatch(fetchDashboardAnonymousTableData());
    //     }
    // };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Email Content</DialogTitle>
            <DialogContent>
                <Typography dangerouslySetInnerHTML={{ __html: mailContent }}></Typography>
            </DialogContent>
            <Box display="flex" alignItems="center" mt={2}>
                <Checkbox
                    checked={selectedOption === 'success'}
                    onChange={() => handleCheckboxChange('success')}
                    sx={{
                        color: 'primary.main', // Change checkbox color
                        '&.Mui-checked': {
                            color: 'primary.main', // Change checked color
                        },
                    }}
                />
                <Typography variant="body1">Mark Success</Typography>
                <Box ml={4} sx={{ display: "flex", flexDirection: "row", alignItems: 'center' }}>
                    <Checkbox
                        checked={selectedOption === 'denied'}
                        onChange={() => handleCheckboxChange('denied')}
                        sx={{
                            color: 'error.main', // Change checkbox color
                            '&.Mui-checked': {
                                color: 'error.main', // Change checked color
                            },
                        }}
                    />
                    <Typography variant="body1" sx={{ mt: "1px" }}>Mark Lost</Typography>
                </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={2} mb={2} pr={2}>
                <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    color="primary"
                    // onClick={handleSubmit}
                    disabled={!selectedOption}
                    style={{ marginLeft: '8px' }}
                >
                    Submit
                </Button>
            </Box>
        </Dialog>
    );
};

export default MailView;
