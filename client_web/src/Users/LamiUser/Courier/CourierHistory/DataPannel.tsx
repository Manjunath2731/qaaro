import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'src/store';
import {
    Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell,
    TableHead, TableRow, Button, Box, Divider, styled, TableContainer, Typography
} from '@mui/material';
import { RootState } from 'src/store';
import { fetchTicketAmount } from 'src/slices/LaMiCourierList/PaymentHostory';
import { fetchUserData } from 'src/slices/UserData';
import StatusLabel from 'src/components/Label/statusLabel';
import { useTranslation } from 'react-i18next';

const StyledTable = styled(Table)(({ theme }) => ({
    borderRight: `2px solid ${theme.palette.divider}`,
}));

const DataPanel: React.FC<{ open?: boolean, onClose: () => void, courierId?: string, name?: string, route?: string }> = ({ open, onClose, courierId, name, route }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { status, offset, lostdata } = useSelector((state: RootState) => state.ticketAmount);
    const userData = useSelector((state: RootState) => state.userData.userData); // Select user data from the state

    useEffect(() => {
        if (open) {
            const role = localStorage.getItem('role');
            if (role === 'LaMi_Courier') {
                dispatch(fetchUserData());
            } else {
                dispatch(fetchTicketAmount(courierId));
            }
        }
    }, [open, courierId, dispatch]);

    useEffect(() => {
        if (userData && userData._id && localStorage.getItem('role') === 'LaMi_Courier') {
            dispatch(fetchTicketAmount(userData._id));
        }
    }, [userData, dispatch]);

    // Calculate total lost amount
    const totalLostAmount = lostdata.reduce((total, item) => total + (item.lostAmount || 0), 0);

    // Calculate total paid amount
    const totalPaidAmount = offset.reduce((total, item) => total + (item.paidAmount || 0), 0);

    // Calculate net lost amount
    const netLostAmount = totalLostAmount - totalPaidAmount;

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
                return 'black';
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

    const role = localStorage.getItem('role');

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <Box sx={{ padding: "20px", margin: "10px" }}>
                {role !== 'LaMi_Courier' ? (
                    <>
                        <Typography variant='h3'>
                            {name}
                        </Typography>
                        <Typography sx={{ fontSize: "20px" }}>
                            Route No ({route})
                        </Typography>
                    </>
                ) : (
                    <>
                        <Typography variant='h3'>
                            {userData?.name}
                        </Typography>
                        <Typography sx={{ fontSize: "20px" }}>
                            Route No ({userData?.designation})
                        </Typography>
                    </>
                )}
            </Box>
            <Divider sx={{ mt: "-10px" }} />

            <DialogContent>
                <Box display="flex" flexDirection={"row"} gap={"40px"}>
                    <Box width={"67%"} >
                        <h2>{t("lostValueDetails")}</h2>
                        <TableContainer style={{ maxHeight: 350, overflowY: 'auto' }}>
                            <style>
                                {`
                            ::-webkit-scrollbar {
                                width: 12px;
                                border-radius: 10px;
                            }

                            ::-webkit-scrollbar-track {
                                background: white;
                            }

                            ::-webkit-scrollbar-thumb {
                                background-color: #dedede;
                                border-radius: 20px;
                                border: 3px solid #e2edff;
                            }
                        `}
                            </style>
                            <StyledTable>
                                <TableHead>
                                    <TableRow>
                                        <TableCell >
                                            #
                                        </TableCell>
                                        <TableCell>{t("complainNumber")}</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>{t("lost")} {t("amount")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lostdata.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell >
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>{item.complainNumber}</TableCell>
                                            <TableCell>
                                                <StatusLabel color={getStatusLabelColor(item.status)}>
                                                    {item.status}
                                                </StatusLabel>
                                            </TableCell>
                                            <TableCell style={{ color: 'red' }}> € {item.lostAmount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </StyledTable>
                        </TableContainer>
                    </Box>
                    <Box width={"50%"}>
                        <h2>{t("offsetDetails")}</h2>
                        <TableContainer style={{ maxHeight: 350, overflowY: 'auto' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell >
                                            #
                                        </TableCell>
                                        <TableCell>{t("date")}</TableCell>
                                        <TableCell>{t("paidAmount")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {offset.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell >
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                                            <TableCell style={{ color: 'green' }}>€ {item.paidAmount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
                <Divider sx={{ mt: 2, backgroundColor: '#000', height: '2px' }} />

                <Box mt={2} >
                    <Box display="flex" flexDirection="column" justifyContent="right" gap={"10px"} alignItems={"flex-end"}>
                        <Box sx={{ display: "flex", gap: "10px" }}>
                            <Typography variant='h4'>{t("total")} {t("lost")}: </Typography>
                            <Typography variant='h4'>€ {totalLostAmount}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: "10px" }}>
                            <Typography variant='h4'>{t("total")} {t("offset")}:</Typography>
                            <Typography variant='h4'>€ {totalPaidAmount}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: "10px" }}>
                            <Typography variant='h4'>{t("netLost")}: </Typography>
                            <Typography variant='h4'>€ {netLostAmount}</Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <Box display="flex" justifyContent="flex-end" padding="16px">
                <Button variant="outlined" onClick={onClose}>Close</Button>
            </Box>
        </Dialog>
    );
};

export default DataPanel;
