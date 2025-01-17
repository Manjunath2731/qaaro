import React, { useEffect, useState } from 'react';
import { useDispatch } from '../../../store';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { returnToLami } from '../../../slices/CourierDashboard/ReturnTo'; // Import the returnToLami async thunk action creator
import { ErrorOutline } from '@mui/icons-material';
import { RootState } from '../../../store/rootReducer'; // Import RootState type
import { useSelector } from 'react-redux';
import { fetchCourierTickets } from 'src/slices/CourierDashboard/CourierList';

interface ReturnConfirmationProps {
  open: boolean;
  onClose: () => void;
  onSend: (description: string) => void;
  ticketId: string; // Add ticketId prop
}

const ReturnConfirmation: React.FC<ReturnConfirmationProps> = ({ open, onClose, onSend, ticketId }) => {
  const dispatch = useDispatch();

  const lami = useSelector((state: RootState) => state.returnToLami.status); // Use RootState
  const errorMessage = useSelector((state: RootState) => state.returnToLami.error); // Get error message from Redux store

  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // State to store selected files
  const [showErrorMessage, setShowErrorMessage] = useState(false); // State to control visibility of error message box
  const [fileLimitExceeded, setFileLimitExceeded] = useState(false); // New state for file limit message

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (selectedFiles.length + files.length > 5) {
        setFileLimitExceeded(true);
        return;
      }
      setSelectedFiles([...selectedFiles, ...files]);
      setFileLimitExceeded(false); // Reset the file limit exceeded message
    }
  };

  const handleSend = () => {
    dispatch(returnToLami({ ticketId: ticketId, description: description, files: selectedFiles }))
      .then(() => {
        dispatch(fetchCourierTickets());
        onSend(description);
        setDescription('');
        setSelectedFiles([]);
        onClose();
      })
      .catch((error) => {
        // Handle error if necessary
        console.error('Failed to send description and files:', error);
      });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDescription = e.target.value;
    if (inputDescription.length <= 400) { // Check if the input description length is less than or equal to 400
      setDescription(inputDescription);
    }
  };

  useEffect(() => {
    if (lami === 'failed') {
      setShowErrorMessage(true);
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lami]);

  const transformErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  const handleClose = () => {
    setDescription('');
    setSelectedFiles([]);
    setFileLimitExceeded(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Typography variant='h3'>Return To LaMi</Typography>
      </DialogTitle>
      <DialogTitle sx={{ mt: "-25px" }}>
        <Typography variant='h6'>Please provide below details</Typography>
      </DialogTitle>

      <DialogContent>
        {showErrorMessage && (
          <Box sx={{ mt: "10px", mb: "10px", bgcolor: "#ffede9" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
              <ErrorOutline sx={{ mr: 1 }} />
              <Typography variant='body1'>
                {transformErrorMessage(errorMessage)}
              </Typography>
            </Box>
          </Box>
        )}
        <TextField
          label="Required"
          margin='dense'
          autoFocus
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={description}
          onChange={handleDescriptionChange} // Use the handleDescriptionChange function for onChange
          placeholder="Type here..."
        />
        <input
          id="file-upload" // Add an id to the input element
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          multiple // Allow selecting multiple files
        />
        <label htmlFor="file-upload"> {/* Match htmlFor with id of input */}
          <Typography component="span" style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
            Attach File
          </Typography>
          <Typography variant="body1" gutterBottom style={{ color: 'grey', marginTop: '5px' }}>
            Maximum 5 files allowed
          </Typography>
        </label>
      
        {selectedFiles.length > 0 && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Attached Files:</Typography>
            {selectedFiles.map((file, index) => (
              <Typography key={index}>{file.name}</Typography>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSend} color="primary" variant="contained" disabled={!description}>
          {lami === 'loading' ? <CircularProgress color='inherit' size="1rem" /> : 'Send'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnConfirmation;
