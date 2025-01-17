import { Box, Grid } from "@mui/material";
import TicketCount from "./LaMiCards/TicketCount";
import Card4 from "./LaMiCards/Card4";
import Card3 from "./LaMiCards/Card3";
import Card2 from "./LaMiCards/Card2";
import Graph1 from "./LaMiGraphs/Graph1";
import Graph2 from "./LaMiGraphs/Graph2";
import LamiPie from "./LaMiGraphs/LaMiPie";
import NewTickets from "./Lamitables/NewTickets";
import Annonymous from "./Lamitables/Anonymous";
import DriverList from "./Lamitables/DriverList";
import Mail from "./LaMiCards/Mail";

const Dashboard = () => {
  return (
    <Box sx={{ margin: "25px", position: 'relative' }}>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          m: '5px',
          mt: "-35px"
        }}
      >
        <Mail />
      </Box>

      <Box sx={{ mt: '80px' }}> {/* Adjust the space between Mail and other components */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3} md={3} xl={3} lg={3}>
            <TicketCount />
          </Grid>
          <Grid item xs={12} sm={3} md={3} xl={3} lg={3}>
            <Card2 />
          </Grid>
          <Grid item xs={12} sm={3} md={3} xl={3} lg={3}>
            <Card3 />
          </Grid>
          <Grid item xs={12} sm={3} md={3} xl={3} lg={3}>
            <Card4 />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: "2px" }}>

          <Grid item xs={12} sm={5} md={5} xl={6} lg={6}>
            <LamiPie />
          </Grid>
          <Grid item xs={12} sm={7} md={7} lg={6} xl={6}>
            <DriverList />
          </Grid>
          {/* <Grid item xs={12} sm={6} xl={4} lg={12}>
            <Graph1 />
          </Grid>
          <Grid item xs={12} xl={4} lg={12}>
            <Graph2 />
          </Grid> */}

        </Grid>

        <Grid container spacing={1} sx={{mt:"-15px"}}>
            <Grid item xs={12} sm={12} lg={12} xl={12}>
              <NewTickets />
            </Grid>

          </Grid>

      </Box>

    </Box>
  );
};

export default Dashboard;
