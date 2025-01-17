import React, { useState, useEffect, useTransition } from 'react';
import { useSelector, useDispatch } from '../../../../store';
import { RootState } from '../../../../store/rootReducer';
import { fetchLamiCouriers } from '../../../../slices/LaMiCourierList/CourierGet';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Avatar, InputBase, InputAdornment, IconButton, TablePagination, CircularProgress, TextField } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import SearchIcon from '@mui/icons-material/Search';
import { fetchTicketList } from 'src/slices/Ticket/GetTicketList';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface CourierSelectionPopupProps {
    open: boolean;
    onClose: () => void;
    onSend: (courierId: string, description: string) => void; // Updated to include description
}

const CourierSelectionPopup: React.FC<CourierSelectionPopupProps> = ({ open, onClose, onSend }) => {
    const [selectedCourier, setSelectedCourier] = useState<string[]>([]);
    const [selectedCourierDescription, setSelectedCourierDescription] = useState<{ [key: string]: string }>({}); // Initialize with an empty object
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sending, setSending] = useState(false);

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { couriers, status } = useSelector((state: RootState) => state.courier);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchLamiCouriers());
        }
    }, [dispatch, status]);

    useEffect(() => {
        setPage(0);
    }, [open]);

    const handleAssign = () => {
        setSending(true);
        const selectedCourierIds = selectedCourier.join(',');
        onSend(selectedCourierIds, selectedCourierDescription[selectedCourier[0]] || ''); // Pass description to onSend function
        setSelectedCourier([]);
        setSelectedCourierDescription({});

        setTimeout(() => {
            setSending(false);
            onClose();
            dispatch(fetchTicketList());

            navigate(`/lami/ticket-ticket_list`);
        }, 2000);
    };

    const handleCancel = () => {
        onClose();
        setSelectedCourier([]);
        setSelectedCourierDescription({});
    };

    const handleCheckboxChange = (courierId: string) => {
        if (selectedCourier.includes(courierId)) {
            setSelectedCourier([]);
            setSelectedCourierDescription({});
        } else {
            setSelectedCourier([courierId]);
            setSelectedCourierDescription({ [courierId]: selectedCourierDescription[courierId] || '' }); // Maintain existing description
        }
    };

    const handleDescriptionChange = (courierId: string, description: string) => {
        setSelectedCourierDescription({ ...selectedCourierDescription, [courierId]: description });
    };

    const filteredCouriers = couriers.filter(courier =>
        courier.name.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        courier.status !== 'inactive'
    );


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value);
    };

    return (
        <Dialog open={open} onClose={onClose} >
            <DialogTitle sx={{ fontSize: "22px", fontWeight: 600 }}>
                {t("selectCourier")}
            </DialogTitle>
            <DialogContent>
                <InputBase
                    placeholder={t("courier")}
                    value={searchKeyword}
                    onChange={handleSearchChange}
                    sx={{
                        width: '160px',
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

                    endAdornment={
                        <IconButton onClick={() => setSearchKeyword('')} size="small">
                            <SearchIcon />
                        </IconButton>
                    }
                    fullWidth
                />
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("profile")}</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">{t("select")}</TableCell>
                                <TableCell>{t("description")}</TableCell> {/* Added description column header */}
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
                                            checked={selectedCourier.includes(courier._id)}
                                            onChange={() => handleCheckboxChange(courier._id)}
                                            icon={<RadioButtonUncheckedIcon />}
                                            checkedIcon={<RadioButtonCheckedIcon />}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {/* Description field */}
                                        <TextField
                                            value={selectedCourierDescription[courier._id] || ''}
                                            onChange={(e) => handleDescriptionChange(courier._id, e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            placeholder={t("enterDesc")}
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
                <Button variant='outlined' onClick={handleCancel}>{t("cancel")}</Button>
                <Button variant='contained' onClick={handleAssign} disabled={selectedCourier.length === 0 || sending}>
                    {sending ? <CircularProgress color='inherit' size="1rem" /> : t("assign")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CourierSelectionPopup;
