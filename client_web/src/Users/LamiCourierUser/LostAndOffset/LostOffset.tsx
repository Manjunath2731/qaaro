import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'src/store';
import {
    Box, Divider, styled, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, Card, useMediaQuery, useTheme
} from '@mui/material';
import { RootState } from 'src/store';
import { fetchTicketAmount } from 'src/slices/LaMiCourierList/PaymentHostory';
import { fetchUserData } from 'src/slices/UserData';
import StatusLabel from 'src/components/Label/statusLabel';

const StyledTable = styled(Table)(({ theme }) => ({
    borderRight: `2px solid ${theme.palette.divider}`,
}));

const LostOffset: React.FC = () => {
    const dispatch = useDispatch();
    const { status, offset, lostdata } = useSelector((state: RootState) => state.ticketAmount);
    const userData = useSelector((state: RootState) => state.userData.userData);

    useEffect(() => {
        if (userData && userData._id && localStorage.getItem('role') === 'LaMi_Courier') {
            dispatch(fetchTicketAmount(userData._id));
        }
    }, [userData, dispatch]);

    const totalLostAmount = lostdata.reduce((total, item) => total + (item.lostAmount || 0), 0);
    const totalPaidAmount = offset.reduce((total, item) => total + (item.paidAmount || 0), 0);
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

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const flexDirection = isSmallScreen || isMediumScreen ? 'column' : 'row';

    return (
        <Card sx={{ margin: "20px", mt: "40px" }}>
            <Box sx={{ padding: "10px", margin: "10px" }}>
                <Typography variant='h3'>
                    {userData?.name}
                </Typography>
                <Typography sx={{ fontSize: "20px" }}>
                    Route No ({userData?.designation})
                </Typography>
            </Box>
            <Divider sx={{ mt: "-10px" }} />

            <Box sx={{ padding: "10px" }}>
                <Box display="flex" sx={{ flexDirection: `${flexDirection}` }} gap={"40px"}>
                    <Box sx={{
                        width: isMediumScreen || isSmallScreen ? "100%" : "50%",
                    }}  >
                        <h2 style={{ paddingLeft: "10px" }}>Lost Value Details</h2>
                        <TableContainer style={{ maxHeight: 480, overflowY: 'auto' }}>
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
                                        <TableCell>#</TableCell>
                                        <TableCell>Complain Number</TableCell>
                                        {!isSmallScreen && <TableCell>Status</TableCell>}
                                        <TableCell>Lost Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lostdata.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                {isSmallScreen ? (
                                                    <div>
                                                        <div>{item.complainNumber.slice(0, item.complainNumber.length / 2)}</div>
                                                        <div>{item.complainNumber.slice(item.complainNumber.length / 2)}</div>
                                                    </div>
                                                ) : (
                                                    item.complainNumber
                                                )}
                                            </TableCell>
                                            {!isSmallScreen && (
                                                <TableCell>
                                                    <StatusLabel color={getStatusLabelColor(item.status)}>
                                                        {item.status}
                                                    </StatusLabel>
                                                </TableCell>
                                            )}
                                            <TableCell style={{ color: 'red' }}>€ {item.lostAmount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </StyledTable>
                        </TableContainer>
                    </Box>
                    <Box sx={{
                        width: isMediumScreen || isSmallScreen ? "100%" : "50%",
                    }}>
                        <h2>Offset Details</h2>
                        <TableContainer style={{ maxHeight: 480, overflowY: 'auto' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Paid Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {offset.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                                            <TableCell style={{ color: 'green' }}>€ {item.paidAmount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
                <Divider sx={{ mt: 2 }} />

                <Box mt={2}>
                    <Box display="flex" flexDirection="column" justifyContent="right" gap={"10px"} alignItems={"flex-end"}>
                        <Box sx={{ display: "flex", gap: "10px" }}>
                            <Typography variant='h4'>Total Lost: </Typography>
                            <Typography variant='h4'>€ {totalLostAmount}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: "10px" }}>
                            <Typography variant='h4'>Total Offset:</Typography>
                            <Typography variant='h4'>€ {totalPaidAmount}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: "10px", mb: "20px" }}>
                            <Typography variant='h4'>Net Lost: </Typography>
                            <Typography variant='h4'>€ {netLostAmount}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default LostOffset;
