import { Box, Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../../../store';
import { useParams } from 'react-router-dom';
import AmontCard from './Amount';
import DueDate from './DueDate';
import CourierAvatar from './CourierAvatar';
import TabComponent from './Item';
import Header from './Header';
import RandomNamesCard from './MailTable';
import { fetchTicketDetails } from 'src/slices/Ticket/TicketDetails';
import { fetchTicketEmailList } from 'src/slices/Ticket/EmailList';
import { useMediaQuery, Theme } from '@mui/material';

function View() {
    const { ticketId } = useParams();
    const dispatch = useDispatch();
    const ticketDetails = useSelector((state) => state.ticketDetails.ticketDetails);
    const status = useSelector((state) => state.ticketDetails.status);
    const error = useSelector((state) => state.ticketDetails.error);

    useEffect(() => {
        dispatch(fetchTicketDetails(ticketId));
        dispatch(fetchTicketEmailList(ticketId));
    }, [ticketId, dispatch]);

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    return (
        <Box sx={{ margin: "40px" }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sx={{ mb: "20px" }}>
                    <Header />
                </Grid>
            </Grid>

            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={4}>
                            <AmontCard />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <DueDate />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <CourierAvatar />
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>


            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
                            {status === 'loading' && <div>Loading...</div>}
                            {status === 'failed' && <div>Error: {error}</div>}
                            {status === 'succeeded' && <Box sx={{ width: '100%' }}><TabComponent ticketDetails={ticketDetails} status={status} error={error} /></Box>}                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                            {!isSmallScreen && (
                                <RandomNamesCard />
                            )}
                        </Grid>

                    </Grid>
                </Grid>

            </Grid>


        </Box >
    );
}

export default View;
