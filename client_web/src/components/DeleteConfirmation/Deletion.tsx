import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import deleteAnimatio from 'src/Animations/deleteAnimatio.json';

interface DeleteConfirmationPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Add status as a prop
}

const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({ open, onClose, onConfirm, status }) => {
  const { t } = useTranslation();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: deleteAnimatio,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Box>
        <DialogTitle sx={{
          width: "500px",
          fontWeight: "bold",
          fontSize: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: "10px"
        }}>
          <Lottie options={defaultOptions} height={100} width={100} />
          <Typography sx={{ fontWeight: "bold", fontSize: "20px", mt: "10px", mb: "20px" }}>
            {t("confirmationNeeded")}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: '500', fontSize: "20px" }}>{t('Are you sure you want to delete this client?')}</Typography>
        </DialogTitle>
        <DialogActions sx={{ justifyContent: "center", alignItems: "center" }}>
          <Button variant='outlined' onClick={onClose} color="primary">
            {t('cancel')}
          </Button>
          <Button onClick={onConfirm} variant="contained">
            {status === 'loading' ? <CircularProgress color='inherit' size="1rem" /> : t('Confirm')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default DeleteConfirmationPopup;
