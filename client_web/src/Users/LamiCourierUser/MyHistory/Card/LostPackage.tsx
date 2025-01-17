
import React from 'react';
import {
    Typography,
    Box,
    Card,
    CardContent,

} from '@mui/material';

import { useTranslation } from 'react-i18next';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';

import { useSelector, useDispatch } from '../../../../store';
import { RootState } from '../../../../store/rootReducer'; // Import RootState from your root reducer file
import { fetchTicketSummary } from '../../../../slices/CourierDashboard/GetCardsNo'; // Import fetchTicketSummary action



function LostPackage() {
    const { t }: { t: any } = useTranslation();

    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(fetchTicketSummary());
    }, []);

    const ticketSummaryData = useSelector((state: RootState) => state.ticketSummary.data);
    const thirdCardData = ticketSummaryData?.thirdcard;


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
                            {t('justifeid')}
                        </Typography>
                        <Typography
                            sx={{
                                ml: 1
                            }}
                            variant="h4"
                            color="blue"
                            component="div"
                        >
                            {thirdCardData?.justified}
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
                            {t('denied')}
                        </Typography>

                        <Typography
                            sx={{
                                ml: 1
                            }}
                            variant="h4"
                            color="red"
                            component="div"
                        >
                            {thirdCardData?.denied}
                        </Typography>

                    </Box>

                </Box>
                {/* <Box sx={{ mt: "5px" }}>


                    <Divider></Divider>
                </Box> */}
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                        py: 2,
                        justifyContent: 'center'
                    }}
                >
                    <EuroSymbolIcon />

                    <Typography variant="h1" color="text.primary" sx={{ fontSize: "55px" }}>
                        {thirdCardData?.packageLost}
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
                    {t('packageLost')}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default LostPackage;
