import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'src/store';
import { RootState } from 'src/store';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';

import { createSubscription } from 'src/slices/Plans/BuyPlans';
import { fetchSubscriptionDetails } from 'src/slices/Plans/PlanDetails';

// Define styles
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: '#000000',
  borderRadius: theme.spacing(2),
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'stretch', // Ensures all sections stretch to the same height
  position: 'relative',
}));

const Section = styled(Box)(({ theme }) => ({
  flex: '1',
  marginRight: theme.spacing(2),
  border: '1px solid #E0E0E0', // Lighter gray border for a cleaner look
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
  backgroundColor: '#FFFFFF', // Ensure the background is white for consistency
  '&:last-child': {
    marginRight: 0,
  },
}));


const CurrentPlanHeader = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  color: '#000000',
}));

const PlanName = styled(Typography)(({ theme }) => ({
  color: '#008000',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  textAlign: 'left',
  marginRight: theme.spacing(2),
}));

const RenewButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF6522',
  color: 'white',
  borderRadius: '50px',
  ml: "20px",
  '&:hover': {
    backgroundColor: '#a7f467',
    color: 'black'
  },
}));

const DateLabel = styled(Typography)(({ theme }) => ({
  color: '#000000',
  fontWeight: 'bold',
}));

const DateValue = styled(Typography)(({ theme }) => ({
  color: '#FFA500',
  fontWeight: 'bold',
}));

const ExpiryBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFA500',
  color: '#FFFFFF',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1),
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '0.9rem',
}));

const RemainingCountBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: '#FFA500',
  fontSize: '1.5rem',
  fontWeight: 'bold',
}));

const SubscribedPlanCard: React.FC = () => {
  const dispatch = useDispatch();
  const { subscriptionDetails, status, message, pendingCount } = useSelector(
    (state: RootState) => state.detailsSubscription
  );

  const [expiryCountdown, setExpiryCountdown] = useState<string>('');
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSubscriptionDetails());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (subscriptionDetails?.length > 0) {
      const subscription = subscriptionDetails[0];
      const endDate = new Date(subscription.endDate);
      const now = new Date();
      const timeDiff = endDate.getTime() - now.getTime();

      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        setExpiryCountdown(`${days} days `);
      } else {
        setExpiryCountdown('Expired');
      }
    }
  }, [subscriptionDetails, pendingCount]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error loading subscription details.</div>;

  const hasActiveSubscription = subscriptionDetails?.length > 0 && !message?.includes("No active subscription");
  const subscription = hasActiveSubscription ? subscriptionDetails[0] : null;

  // Format dates to DD-MMM-YY format
  const formatDate = (dateStr: string): string => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: '2-digit' };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateStr));
  };

  const planCode = subscription?.planId?.type.toUpperCase() || 'N/A';
  const startDate = subscription?.startDate ? formatDate(subscription.startDate) : 'N/A';
  const endDate = subscription?.endDate ? formatDate(subscription.endDate) : 'N/A';
  const remainingCount = subscription?.availableCount || 0;

  const handleRenewClick = () => {
    setDialogOpen(true);
  };

  const handleConfirmRenew = () => {
    dispatch(createSubscription({ planId: subscription?._id, type: 'RENEW' }));
    setDialogOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <StyledCard>
        <Section>
          <CurrentPlanHeader>My Current Plan</CurrentPlanHeader>
          <Box display="flex" alignItems="center" justifyContent={"space-between"}>
            <PlanName>{hasActiveSubscription ? planCode : 'No Active Plan Available'}</PlanName>
            {hasActiveSubscription && (
              <RenewButton variant="contained" onClick={handleRenewClick}>
                Renew Plan
              </RenewButton>
            )}
            {pendingCount && pendingCount > 0 && (
              <Alert severity="info">Your request is waiting approval of the admin</Alert>

            )}
          </Box>
        </Section>
        {hasActiveSubscription && (
          <>
            <Section>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap="10px" >
                    <DateLabel>Start:</DateLabel>
                    <Box sx={{ flexGrow: 0 }} />
                    <DateValue>{startDate}</DateValue>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="left" gap="10px">
                    <DateLabel>End:</DateLabel>
                    <Box sx={{ flexGrow: 0 }} />
                    <DateValue>{endDate}</DateValue>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: "20px" }} display="flex" alignItems="center" justifyContent="space-around">
                    <Typography variant="h5">Expires in:</Typography>
                    <ExpiryBox>{expiryCountdown}</ExpiryBox>
                  </Box>
                </Grid>
              </Grid>
            </Section>
            <Section>
              <CurrentPlanHeader>Remaining Count</CurrentPlanHeader>
              <RemainingCountBox>{remainingCount}</RemainingCountBox>
            </Section>
          </>
        )}
      </StyledCard>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Plan Renewal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to renew your plan "{planCode}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmRenew} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubscribedPlanCard;
