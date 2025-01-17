// Annonymous.js

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'src/store';

import CustomTable from './AnnonymousList';
import { Grid, Box } from '@mui/material';
import { fetchAnonymousTickets } from 'src/slices/Annonymous/TabelList';
import AnnonymousDocs from './AnnonymousDocs';

function Annonymous() {
    const dispatch = useDispatch();
    const [selectedTicket, setSelectedTicket] = useState<any>(null); // Change the type as per your ticket object structure

    useEffect(() => {
        dispatch(fetchAnonymousTickets());
    }, []);

    return (
        <Box p={1} m={1}>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={5} lg={5 } xl={5 }>
                    <CustomTable setSelectedTicket={setSelectedTicket} />
                </Grid>
                <Grid item xs={12} sm={6} md={7} lg={7 } xl={7 }>
                    <AnnonymousDocs selectedTicket={selectedTicket} />
                </Grid>
            </Grid>
        </Box>
    );
}

export default Annonymous;
