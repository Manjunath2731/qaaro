import { Box, Card, Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch } from '../../../store';

import { fetchCourierDetails } from 'src/slices/CourierDashboard/CourierDetails';
import { useParams } from 'react-router-dom';
import CourierHeader from './CourierHeader';
import CourierDeadline from './CourierDeadLine';
import CourierAmount from './CourierAmount';
import Documents from './Documents';
import Data from './Data';

function CourierView() {
    const { ticketId } = useParams(); // Get ticketId from URL params
    console.log("ticketID", ticketId)

    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch ticket details when component mounts
        dispatch(fetchCourierDetails(ticketId)); // Pass ticketId to fetchTicketDetails
    }, [ticketId]); // Include ticketId in dependency array

    return (
        <>

            <Box sx={{ margin: "20px", pb: "20px" }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sx={{ mb: "20px" }} >
                        <CourierHeader />
                    </Grid>
                </Grid>


                <Card sx={{ padding: "20px", mt: "-28px" }}>
                    <Grid container spacing={2}>
                        {/* Left Side */}
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Grid container spacing={0.1}  style={{display: "flex", justifyContent: "center"}}>
                                <Grid item xs={12} sm={6} md={12} lg={6} xl={6} sx={{ mt: "25px" }}>
                                    <CourierAmount />
                                </Grid>
                                <Grid item xs={12} sm={6} md={12} lg={6} xl={6} sx={{ mt: "25px" }}>
                                    <CourierDeadline />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} lg={6} xl={12}>
                                <Documents />
                            </Grid>
                        </Grid>

                        {/* Right Side */}
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Data />
                        </Grid>
                    </Grid>

                </Card>

            </Box >
        </>
    );
}

export default CourierView;
