import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from '../../../../store';
import { RootState } from '../../../../store/rootReducer'; // Import RootState from your root reducer file
import { fetchTicketSummary } from '../../../../slices/CourierDashboard/GetCardsNo'; // Import fetchTicketSummary action

function TicketCard() {
    const { t }: { t: any } = useTranslation();

    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(fetchTicketSummary());
    }, []);

    const ticketSummaryData = useSelector((state: RootState) => state.ticketSummary.data);
    const firstCardData = ticketSummaryData?.fitstcard;

    return (
        <Card>
            <CardContent>
                <Box display="flex" flexDirection="row" alignItems="right" justifyContent="space-between">

                    <Box display={'flex'} flexDirection={'column'}>

                        <Typography
                            sx={{
                                ml: 1
                            }}
                            variant="h5"
                            color="#a4a4a4"
                            component="div"
                        >
                            {t('toatalTickets')}

                        </Typography>
                        <Typography
                            sx={{
                                ml: 1
                            }}
                            variant="h4"
                            color="blue"
                            component="div"
                        >
                            {firstCardData?.total}
                        </Typography>

                    </Box>
                    <Box display={'flex'} flexDirection={'column'}>
                        <Typography
                            sx={{
                                ml: 1
                            }}
                            variant="h5"
                            color="#a4a4a4"
                            component="div"
                        >
                            {t('completed')}
                        </Typography>

                        <Typography
                            sx={{
                                ml: 1
                            }}
                            variant="h4"
                            color="#57CA22"
                            component="div"
                        >
                            {firstCardData?.closed}
                        </Typography>

                    </Box>

                </Box>

                <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                        py: 2,
                        justifyContent: 'center'
                    }}
                >
                    <Typography variant="h1" color="text.primary" sx={{ fontSize: "55px" }}>
                        {firstCardData?.opened || 0}
                    </Typography>
                </Box>
                <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                    component="div"
                    fontWeight="bold"
                    sx={{ mt: "-10px" }}
                >
                    {t('openTickets')}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default TicketCard;
