import React, { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../../store';
import {
  Box,
  Card,
  Typography,
  Divider,
  styled,
  useTheme
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Link as RouterLink } from 'react-router-dom'; // Import RouterLink
import Scrollbar from 'src/components/Scrollbar';
import { fetchTrackerDetails } from '../../../../slices/Ticket/TicketTrackerDetails';
import { RootState } from '../../../../store/rootReducer';
import { useTranslation } from 'react-i18next';
import StatusLabel from 'src/components/Label/statusLabel';

function Tracker({ ticketId }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Fetch data from Redux store
  const { trackerDetails } = useSelector((state: RootState) => state.trackerDetails);


  const getStatusLabelColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'primary';
      case 'loco':
        return 'info';
      case 'courier':
        return 'warning';
      case 'preloco':
        return 'secondary';
      case 'locosuccess':
        return 'success';
      case 'locolost':
        return 'error';
      case 'insurance':
        return 'insu';
      case 'invoiced':
        return 'success';
      case 'insuokay':
        return 'success';
      case 'insureject':
        return 'error';
      case 'noinsu':
        return 'error';
      default:
        return 'secondary';
    }
  };


  useEffect(() => {
    // Dispatch fetchTrackerDetails action when component mounts
    dispatch(fetchTrackerDetails(ticketId));
  }, [dispatch]);

  return (
    <Card sx={{ mt: "30px", height: "710px", overflowY: "auto" }}>
      <Box p={1.5} display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography gutterBottom variant="h4">
            {t('complainNumber')}
          </Typography>
          <Typography variant="subtitle2">{trackerDetails?.data?.complainNumber}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box>
        {Object.entries(trackerDetails?.data?.statusDetails || {}).map(([key, value]) => (
          value?.present && (
            <TimelineItem key={key} sx={{ position: 'relative' }}>
              <TimelineOppositeContent sx={{ width: '85px', flex: 'none', fontWeight: "600", ml: "20px" }} color="text.secondary">
                {value?.date ? new Date(value.date).toLocaleDateString() : ''}
              </TimelineOppositeContent>
              <TimelineSeparator sx={{ position: 'relative', ml: "30px" }}>
                <TimelineDot
                  sx={{
                    marginTop: 0,
                    top: theme.spacing(1.2),
                    backgroundColor: getStatusLabelColor(key), // Dynamically set color
                  }}
                  variant="outlined"
                  color="primary"
                />
                <TimelineConnector sx={{ flex: 1 }} />
              </TimelineSeparator>

              <TimelineContent sx={{ pb: 4 }}>
                <StatusLabel color={getStatusLabelColor(key)}>
                  {key.toUpperCase()}
                </StatusLabel>

                <Typography variant="body1" color="text.primary" sx={{ mt: "10px", fontWeight: "550" }}>
                  {value?.description}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          )
        ))}
      </Box>
    </Card>
  );
}

export default Tracker;
