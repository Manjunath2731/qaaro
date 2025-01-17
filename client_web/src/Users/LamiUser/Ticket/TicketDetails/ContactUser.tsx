import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'src/store'; // Assuming 'src/store' is correctly configured with Redux
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, CircularProgress, Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { sendCustomerEmail } from 'src/slices/CustomerContact/CustomerEmail';
import { useParams } from 'react-router-dom'; // Assuming you are using React Router for routing
import GppBadIcon from '@mui/icons-material/GppBad';
import { useTranslation } from 'react-i18next';
import { fetchLanguages } from 'src/slices/GetLanguage';

// Define props interface
interface ContactUserProps {
  open: boolean;
  onClose: () => void;
}

// Define component
const ContactUser: React.FC<ContactUserProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const ticketDetails = useSelector((state: any) => state.ticketDetails.ticketDetails); // Adjust state type as per your Redux setup
  const languages = useSelector((state: any) => state.languages.languages); // Get languages from the Redux state
  const loadingLanguages = useSelector((state: any) => state.languages.loading); // Get languages loading state

  const { ticketId } = useParams<{ ticketId: string }>(); // Extract ticketId from params
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Dispatch the fetchLanguages thunk when the component mounts
    dispatch(fetchLanguages());
  }, [dispatch]);

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    const isValid = /\S+@\S+\.\S+/.test(e.target.value);
    setValidEmail(isValid);
  };

  // Handle language change
  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    setLanguage(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Dispatch sendCustomerEmail with email, ticketId, and language
      await dispatch(sendCustomerEmail({ email, ticketId, language }));
      onClose(); // Close dialog on successful submission
    } catch (error) {
      console.error('Error sending customer email:', error);
    } finally {
      setLoading(false);
    }
  };

  const fileName = ticketDetails?.attachment?.files?.map((file: string) => file.split('/').pop());
  const requiredSubstring = "Empfangsbestaetigung";

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      {fileName?.some(name => name.includes(requiredSubstring)) ? (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{t("contactCustomer")}</Typography>
            <Select
              value={language}
              onChange={handleLanguageChange}
              size="small"
              disabled={loadingLanguages} // Disable while loading languages
            >
              {languages.map((lang: any) => (
                <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
              ))}
            </Select>
          </DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1" gutterBottom>
              E-mail
            </Typography>
            <TextField
              id="email"
              variant="outlined"
              fullWidth
              size="small"
              placeholder={t("enteruremail")}
              margin="dense"
              value={email}
              onChange={handleEmailChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary" variant="outlined" disabled={loading}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSubmit} color="primary" variant="contained" disabled={!validEmail || loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : t('send')}
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', color: "red", justifyContent: "center" }}>
              <GppBadIcon sx={{ fontSize: "45px" }} />
            </Box>
          </DialogTitle>
          <DialogContent sx={{ width: "100%", textAlign: 'center' }}>
            <Typography variant="h4">
              File required for signature is missing.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant='outlined' onClick={handleCancel} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ContactUser;
