import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from '../../store';
import { RootState } from '../../store/rootReducer';
import { resetPassword } from '../../slices/ChangePassword';
import { useNavigate } from 'react-router-dom';
import { ErrorOutline, Visibility, VisibilityOff } from '@mui/icons-material';

const ChangePassword = ({ open, onClose, handleClosePopover }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const errorMessage = useSelector((state: RootState) => state.passwordReset.error);
  const passwordStatus = useSelector((state: RootState) => state.passwordReset.status);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false); // New state to track if confirm password field has been touched

  const handleToggleShowPassword = (setter) => () => {
    setter(prev => !prev);
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordsMatch(true);
    setConfirmTouched(false); // Reset the confirmTouched state
    onClose();
  };

  const handleSave = async () => {
    try {
      const response = await dispatch(resetPassword({ currentPassword, newPassword }));
      if (response.meta.requestStatus === 'fulfilled') {
        handleClose();
        handleClosePopover();
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  const areRequiredFieldsEmpty = () => {
    return !currentPassword || !newPassword || !confirmNewPassword;
  };

  const transformErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      case 'Incorrect current password':
        return 'Please check the current Password. This one does not match';
      default:
        return 'An Unexpected error occurred. Please try again';
    }
  };

  const validatePasswordsMatch = (newPassword, confirmNewPassword) => {
    const match = newPassword.trim() === confirmNewPassword.trim();
    setPasswordsMatch(match);
  };

  useEffect(() => {
    if (passwordStatus === 'failed') {
      setShowErrorMessage(true);
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [passwordStatus]);

  useEffect(() => {
    if (confirmTouched) {
      validatePasswordsMatch(newPassword, confirmNewPassword);
    }
  }, [newPassword, confirmNewPassword, confirmTouched]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ fontWeight: "600", fontSize: "20px" }}>{t('changePassword')}</DialogTitle>
      <DialogTitle sx={{ fontWeight: "200", mt: "-29px" }}>{t('pleaseProvideBelowDetails')}</DialogTitle>
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
          key="current-password-input"
          margin="normal"
          fullWidth
          id="current-password"
          label={t('currentPassword')}
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle current password visibility"
                  onClick={handleToggleShowPassword(setShowCurrentPassword)}
                  edge="end"
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          autoComplete="new-password" // Prevent browser autofill
        />
        <TextField
          key="new-password-input"
          margin="normal"
          fullWidth
          id="new-password"
          label={t('newPassword')}
          type="password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            if (!e.target.value) {
              setConfirmTouched(false);
              setConfirmNewPassword('');
              setPasswordsMatch(true);
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle new password visibility"
                  onClick={handleToggleShowPassword(setShowNewPassword)}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          autoComplete="new-password" // Prevent browser autofill
        />
        <TextField
          key="confirm-new-password-input"
          margin="normal"
          fullWidth
          id="confirm-new-password"
          label={t('confirmNewPassword')}
          type="password"
          value={confirmNewPassword}
          onChange={(e) => {
            setConfirmNewPassword(e.target.value);
            setConfirmTouched(true);
          }}
          error={confirmTouched && !passwordsMatch}
          helperText={confirmTouched && !passwordsMatch && t('Password Does Not Match')}
          disabled={!newPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm new password visibility"
                  onClick={handleToggleShowPassword(setShowConfirmNewPassword)}
                  edge="end"
                >
                  {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          autoComplete="new-password" // Prevent browser autofill
        />
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={handleClose} color="primary">
          {t('cancel')}
        </Button>
        <Button
          variant='contained'
          onClick={handleSave}
          color="primary"
          disabled={areRequiredFieldsEmpty() || !passwordsMatch}
        >
          {passwordStatus === 'loading' ? <CircularProgress color='inherit' size="1rem" /> : t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePassword;
