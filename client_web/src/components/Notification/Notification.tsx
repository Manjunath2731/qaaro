import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Notification = ({ open, onClose, message, severity }) => {
  console.log('Notification component rendering...'); // Add console log to check if the component renders

  const verticalPosition = 'top'; // Set to 'top' or 'bottom' based on your preference
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: verticalPosition, horizontal: 'center' }}
      sx={{ transform: verticalPosition === 'top' ? 'translateY(50%)' : 'translateY(-50%)' }} // Adjust position to center vertically
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
