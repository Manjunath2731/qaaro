import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/store'; // Assuming you're using react-redux for Redux integration

import { checkLinkStatus } from 'src/slices/CustomerContact/LinkStatus';
import { RootState } from 'src/store/rootReducer';

const CustomerForm1 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ticketId, linkId } = useParams<{ ticketId: string; linkId: string }>();

  const linkStatus = useSelector((state: RootState) => state.linkStatus); // Assuming RootState is correctly defined

  const [pkgReceiveDate, setPkgReceiveDate] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [currentDate, setCurrentDate] = useState(null);
  const [place, setPlace] = useState('');

  console.log("LINKID VALUE", ticketId);

  useEffect(() => {
    if (linkId) {
      dispatch(checkLinkStatus({ linkId }));
    }
  }, [dispatch, linkId]);

  const handleFormSubmit = () => {
    console.log("Submit button clicked");

    if (pkgReceiveDate && customerName && currentDate && place) {
      const formData = {
        pkgReceiveDate: pkgReceiveDate.toISOString(),
        customerName,
        currentDate: currentDate.toISOString(),
        place,
      };

      try {
        navigate('/customer-form-view', {
          state: {
            ...formData,
            ticketId, // Include ticketId in the state object
            linkId,
          },
        });
      } catch (error) {
        console.error("Navigation error:", error);
      }
    } else {
      console.log('Please fill in all fields.');
    }
  };

  const handlePkgReceiveDateChange = (date) => {
    setPkgReceiveDate(date);
  };

  const handleCurrentDateChange = (date) => {
    setCurrentDate(date);
  };

  const handleCustomerNameChange = (event) => {
    setCustomerName(event.target.value);
  };

  const handlePlaceChange = (event) => {
    setPlace(event.target.value);
  };
  const handleCloseWindow = () => {
    // Close the current window or tab
    window.close();
  };

  // Render based on link status
  if (linkStatus.status === 'loading') {
    return <Typography>Loading...</Typography>;
  }

  if (!linkStatus.data?.active) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'rgb(255, 255, 255)' }}>
        <div style={{ textAlign: 'center' }}>
          <Box>
            <img
              src="/link.jpg" // Replace with the correct path to your image
              alt="Logo"
              style={{ height: '30vh', maxWidth: '100%', marginBottom: '20px' }}
            />
          </Box>

          <Typography variant="h3" gutterBottom>
            Der Link ist abgelaufen.
          </Typography>
          <Typography variant="h5" color={"grey"} paragraph>
            Dieser Link ist abgelaufen. Sie müssen einen neuen Link anfordern, um auf den Inhalt zuzugreifen.
          </Typography>
          <Button
            variant="contained"
            color="error" // Change to appropriate MUI color if needed
            style={{ marginTop: '20px' }}
            onClick={handleCloseWindow} // Call handleCloseWindow function on click
          >
            Schließen
          </Button>
        </div>
      </div>




    );
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={12} sm={12} md={8} lg={6} xl={4}>
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <Typography variant="h3" gutterBottom>
            Empfangsbestätigiung Kunde
          </Typography>
          <Typography sx={{ fontSize: "15px", mb: "20px" }} gutterBottom>
            Bitte füllen Sie die folgenden Angaben aus, um fortzufahren
          </Typography>
          <Card
            variant="outlined"
            style={{ maxWidth: '90%', marginBottom: '10px', margin: '0 auto' }}
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: 'bold', textAlign: 'left' }}
                  >
                    Paketempfangsdatum
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={pkgReceiveDate}
                      onChange={handlePkgReceiveDateChange}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: 'bold', textAlign: 'left' }}
                  >
                    Kunden Vorname Nachname
                  </Typography>
                  <TextField
                    fullWidth
                    value={customerName}
                    onChange={handleCustomerNameChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: 'bold', textAlign: 'left' }}
                  >
                    Aktuelles Datum
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={currentDate}
                      onChange={handleCurrentDateChange}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: 'bold', textAlign: 'left' }}
                  >
                    Place
                  </Typography>
                  <TextField
                    fullWidth
                    value={place}
                    onChange={handlePlaceChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    sx={{ mt: "10px" }}
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={handleFormSubmit}
                    disabled={
                      !(pkgReceiveDate && customerName && currentDate && place)
                    }
                  >
                    Nächster Schritt: Überprüfen & Signieren
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      </Grid>
    </Grid>
  );
};

export default CustomerForm1;
