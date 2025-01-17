import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../../../store';
import { RootState } from '../../../../store/rootReducer';
import { fetchLamiCouriers } from '../../../../slices/LaMiCourierList/CourierGet';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Avatar, TextField, Box, InputAdornment, IconButton, TablePagination, InputBase, CircularProgress } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import SearchIcon from '@mui/icons-material/Search';
import { fetchTicketList } from 'src/slices/Ticket/GetTicketList';

interface CourierSelectionPopupProps {
    open: boolean;
    onClose: () => void;
    onSend: (courierIds: string[]) => void; // Function to handle sending description
}

const CourierSelectionPopup2: React.FC<CourierSelectionPopupProps> = ({ open, onClose, onSend }) => {
    const [selectedCouriers, setSelectedCouriers] = useState<string[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [page, setPage] = useState(0); // State for page number
    const [rowsPerPage, setRowsPerPage] = useState(5); // Set rows per page to 5 by default
    const [sending, setSending] = useState(false); // State to track sending status
    const dispatch = useDispatch();
    const { couriers, status } = useSelector((state: RootState) => state.courier);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchLamiCouriers());
        }
    }, [status]);

    useEffect(() => {
        // Reset page to 0 whenever the open state changes
        setPage(0);
    }, [open]);

    const handleAssign = () => {
        setSending(true); // Set sending state to true when assigning starts
        console.log('Assigned couriers:', selectedCouriers);
        onSend(selectedCouriers); // Call onSend with selected courier IDs
        setSelectedCouriers([]);

        // Assuming the onSend function is asynchronous and completes after a while
        setTimeout(() => {
            setSending(false); // Reset sending state to false after assigning is complete
            onClose(); // Close the dialog after assignment
            dispatch(fetchTicketList());
        }, 2000); // Adjust the time according to your actual scenario
    };

    const handleCancel = () => {
        console.log('Assignment cancelled');
        onClose(); // Close the dialog when cancelled
        setSelectedCouriers([]);
    };

    const handleCheckboxChange = (courierId: string) => {
        if (selectedCouriers.includes(courierId)) {
            // If the checkbox is already selected, deselect it
            setSelectedCouriers([]);
        } else {
            // If a new checkbox is selected, deselect all others and select the new one
            setSelectedCouriers([courierId]);
        }
    };

    const filteredCouriers = couriers.filter(courier =>
        courier.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 5));
        setPage(0);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontSize: "22px", fontWeight: 600 }}>
                Select Your Courier11111111
            </DialogTitle>
            <DialogContent>
                <Box sx={{ borderRadius: '0 4px 4px 0', width: 'fit-content' }}>
                    <InputBase
                        placeholder='Courier'
                        value={searchKeyword}
                        onChange={handleSearchChange}
                        sx={{
                            width: '260px',
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
                                <TableCell>Avatar</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Select</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCouriers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((courier) => (
                                <TableRow key={courier._id}>
                                    <TableCell align="right">
                                        <Avatar alt={courier.name} src={courier.avatar.url} />
                                    </TableCell>
                                    <TableCell>{courier.name}</TableCell>
                                    <TableCell align="right">
                                        <Checkbox
                                            checked={selectedCouriers.includes(courier._id)}
                                            onChange={() => handleCheckboxChange(courier._id)}
                                            icon={<RadioButtonUncheckedIcon />}
                                            checkedIcon={<RadioButtonCheckedIcon />}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredCouriers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button variant='contained' onClick={handleAssign} disabled={selectedCouriers.length === 0 || sending}>
                    {sending ? <CircularProgress color='inherit' size="1rem" /> : 'Assign'} {/* Show "Assigning..." or "Assign" based on the sending state */}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CourierSelectionPopup2;
