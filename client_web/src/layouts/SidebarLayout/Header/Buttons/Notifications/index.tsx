import {
  alpha,
  Badge,
  Box,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';

import LanguageSwitcher from 'src/Intel/LanguageSwithcher';
import GoogleMailIcon from 'src/components/AnnonymousMail/MailCount';
import { useSelector, useDispatch } from 'src/store';
import { fetchUserData } from 'src/slices/UserData';
import { useTranslation } from 'react-i18next';
import Label from 'src/components/Label';

function HeaderNotifications() {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.userData.userData);
  const { t } = useTranslation();

  const role = localStorage.getItem('role');
  const connected = userData?.connected; // Assuming `connected` is a boolean in userData

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  return (
    <>
      <Box sx={{ marginRight: "20px", display: "flex", gap: "20px" }}>

        {role === "LaMi_Admin" && (
          <>

            <Box sx={{ mt: "5px",  }}>
              <Label color={connected ? "bigsuccess" : "bigerror"}>

                {connected ? t('connected') : t('disconnected')}
              </Label>
            </Box>



            <GoogleMailIcon />
          </>
        )}
        <LanguageSwitcher />

      </Box>
    </>
  );
}

export default HeaderNotifications;
