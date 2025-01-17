import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Box, Avatar, IconButton, Grid, MenuItem, Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector, useDispatch } from 'src/store';
import { fetchUserData } from '../../slices/UserData';
import { updateUser, UpdateUserPayload } from '../../slices/UpdateProfile';
import { fetchLanguages } from '../../slices/GetLanguage';
import { RootState } from '../../store/rootReducer';
import { ErrorOutline } from '@mui/icons-material';

const ProfilePage = ({ open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.userData.userData);
  const languages = useSelector((state: any) => state.languages.languages);

  const adminStatus = useSelector((state: RootState) => state.userUpdate.status);
  const errorMessage = useSelector((state: RootState) => state.userUpdate.error);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('');
  const [language, setLanguage] = useState('');
  const [designation, setDesignation] = useState('');
  const [zipCode, setZipCode] = useState<number>(0);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    dispatch(fetchUserData());
    dispatch(fetchLanguages());
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      setInitialValues(userData);
    }
  }, [userData]);

  const setInitialValues = (data) => {
    setName(data.name || '');
    setEmail(data.email || '');
    setMobile(Number(data.mobile) || 0);
    setAddress(data.address || '');
    setRole(data.role || '');
    setCompany(data.company.companyName || '');
    setStatus(data.status || '');
    setLanguage(data.language || '');
    setDesignation(data.designation || '');
    setAvatar(data.avatar?.url || '');
    setAvatarPreview(data.avatar?.url || '');
    setZipCode(Number(data.zipcode) || 0);
    setCountry(data.country || '');
    setState(data.state || '');
  };

  const handleClose = () => {
    setInitialValues(userData);
    onClose();
  };

  const handleSave = async () => {
    const payload: UpdateUserPayload = {
      name,
      email,
      mobile,
      address,
      status,
      language,
      designation,
      state,
      country,
      zipcode: zipCode,
      avatar: avatar
    };

    try {
      const actionResult = await dispatch(updateUser(payload));
      if (updateUser.fulfilled.match(actionResult)) {
        dispatch(fetchUserData());
        onClose();
      }
    } catch (error) {
      // Handle error
    }
  };

  const handleEditAvatar = () => {
    document.getElementById('avatar-input').click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(file);
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  useEffect(() => {
    if (adminStatus === 'failed') {
      setShowErrorMessage(true);
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [adminStatus]);

  const transformErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      case 'phone_duplicate':
        return 'Please check your Phone No. This one is already in use!';
      default:
        return 'An unexpected error occurred. Please try again';
    }
  };

  const areRequiredFieldsEmpty = () => {
    return !mobile || !language;
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontWeight: "600", fontSize: "20px" }}>{t('myProfile')}</DialogTitle>
        <DialogTitle sx={{ fontWeight: "200", mt: "-29px" }}>{t('pleaseProvideBelowDetails')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'left', flexDirection: 'row', marginBottom: 2, gap: "15px" }}>
            <Avatar src={avatarPreview || userData?.avatar?.url} alt={name} sx={{ width: 80, height: 80, marginBottom: 2 }} />
            <input
              type="file"
              id="avatar-input"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            <Box sx={{ mt: "17px", cursor: "pointer" }} color="primary" aria-label="edit avatar" onClick={handleEditAvatar}>
              <EditIcon />
            </Box>
          </Box>
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                fullWidth
                id="name"
                label={t('Name')}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label={t('E-mail')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
              <TextField
                margin="normal"
                fullWidth
                id="mobile"
                label={t('phone')}
                type="text"
                value={mobile === null ? '' : mobile}
                onChange={(e) => {
                  const mobileValue = e.target.value.trim();
                  if (mobileValue === '') {
                    setMobile(null);
                  } else {
                    const parsedValue = parseInt(mobileValue, 10);
                    setMobile(isNaN(parsedValue) ? null : parsedValue);
                  }
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                id="address"
                label={t('address')}
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <TextField
                margin="normal"
                fullWidth
                id="role"
                label={t('role')}
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled
              />
              <TextField
                margin="normal"
                fullWidth
                id="company"
                label={t('Company')}
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                fullWidth
                id="status"
                label={t('status')}
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled
              />
              <TextField
                select
                margin="normal"
                fullWidth
                id="language"
                label={t('language')}
                value={language}
                onChange={handleLanguageChange}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang._id} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="normal"
                fullWidth
                id="designation"
                label={t('designation')}
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
              <TextField
                margin="normal"
                fullWidth
                id="zipCode"
                label={t('zipCode')}
                type="text"
                value={zipCode.toString()}
                onChange={(e) => setZipCode(parseInt(e.target.value) || 0)}
                disabled
              />
              <TextField
                margin="normal"
                fullWidth
                id="country"
                label={t('country')}
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <TextField
                margin="normal"
                fullWidth
                id="state"
                label={t('state')}
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant='contained'
            disabled={areRequiredFieldsEmpty()}
          >
            {adminStatus === 'loading' ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfilePage;
