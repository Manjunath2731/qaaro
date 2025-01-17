import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'src/store';
import { makeStyles } from '@mui/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import { fetchLanguages } from 'src/slices/GetLanguage';
import { fetchUserData } from 'src/slices/UserData'; // Import the fetchUserData thunk

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  formControl: {
    padding: '8px',
    paddingBottom: '8px',
    '& input': {
      px: 0,
      textAlign: 'left',
      color: 'black',
    },
    '& .MuiSelect-select': {
      textAlign: 'left',
    },
    backgroundColor: '#ffffff',
    borderRadius: '120px',
    boxShadow: 'none',
    color: '#007bff',
    width: '130px',
    height: '30px',
    '&:focus': {
      backgroundColor: '#ffffff',
      borderColor: '#A6C4E7 !important',
      boxShadow: 'none',
    },
  },
}));

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const languages = useSelector((state) => state.languages.languages); // Get languages from the Redux state
  const loadingLanguages = useSelector((state) => state.languages.loading); // Get languages loading state
  const userData = useSelector((state) => state.userData.userData); // Get user data from the Redux state
  const loadingUserData = useSelector((state) => state.userData.loading); // Get user data loading state
  const classes = useStyles();

  const [defaultLanguage, setDefaultLanguage] = useState('en'); // Default to English initially

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Fetch languages and user data when the component mounts
  useEffect(() => {
    dispatch(fetchLanguages());
    dispatch(fetchUserData());
  }, [dispatch]);

  // Set default language once user data is fetched
  useEffect(() => {
    if (userData && userData.language) {
      setDefaultLanguage(userData.language);
      changeLanguage(userData.language); // Change i18n language to the user's language
    }
  }, [userData]);

  return (
    <Box sx={{ mt: '4px' }}>
      <FormControl>
        <Select
          className={classes.formControl}
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
          disabled={loadingLanguages || loadingUserData} // Disable while loading languages or user data
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSwitcher;
