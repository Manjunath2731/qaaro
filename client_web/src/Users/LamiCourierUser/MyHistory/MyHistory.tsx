import React from 'react';
import { Box, Grid } from '@mui/material';
import TicketCard from './Card/TotalTickets';
import OverallStatus from './Graphs/LineGraph';
import Consultations from './Graphs/PieChart';
import OpenTicketList from './Table/OpenList';
import Completion from './Card/OnTimeComp';
import Lastdays from './Card/Last3days';
import LostPackage from './Card/LostPackage';

const MyHistory = () => {
  return (
    <Box sx={{ margin: "20px" }}>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={3}>
          <TicketCard />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Completion />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LostPackage />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Lastdays />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: "5px" }}>
        <Grid item xs={12} lg={7}>
          <OverallStatus />
        </Grid>
        <Grid item xs={12} lg={5}>
          <Consultations />
        </Grid>
      </Grid>

      <Grid container sx={{ mt: "10px" }} >
        <Grid item xs={12} lg={12}>
          <OpenTicketList />
        </Grid>

      </Grid>


    </Box>
  );
};

export default MyHistory;
