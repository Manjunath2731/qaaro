import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Button, Divider, Hidden, List, ListItem, ListItemIcon, ListItemText, Popover, Typography } from '@mui/material';
import InboxTwoToneIcon from '@mui/icons-material/InboxTwoTone';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import { useDispatch, useSelector } from '../../../../store'; // Import Redux hooks
import { fetchUserData } from '../../../../slices/UserData'; // Import fetchUserData action

import ChangePassword from 'src/Users/UserBoxPages/ChangePassword';
import ProfilePage from 'src/Users/UserBoxPages/MyProfile'; // Import your ProfilePage component
import axiosAPIInstanceProject from 'src/AxiosInstance/AxiosInstance';
import AccountSetting from 'src/Users/UserBoxPages/AccountSetting';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${theme.palette.secondary.light};
`
);

function HeaderUserbox() {
  const { t } = useTranslation();
  const dispatch = useDispatch(); // Redux dispatch function

  // Redux selector to access user data
  const user = useSelector(state => state.userData.userData);

  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false); // State to control the visibility of My Profile pop-up
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false); // State to control the visibility of ChangePassword pop-up
  const [isAccountSettingsOpen, setAccountSettingsOpen] = useState(false); // State to control the visibility of Account Settings pop-up


  useEffect(() => {
    dispatch(fetchUserData()); // Fetch user data when component mounts
  }, [dispatch]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenChangePassword = () => {
    setChangePasswordOpen(true);
  };

  const handleCloseChangePassword = () => {
    setChangePasswordOpen(false);
  };

  const handleOpenProfile = () => {
    setProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
  };

  const handleOpenAccountSettings = () => {
    setAccountSettingsOpen(true);
  };

  const handleCloseAccountSettings = () => {
    setAccountSettingsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await axiosAPIInstanceProject.post('logout');
      localStorage.removeItem('accessToken');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  const formatUserName = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 1) return names[0];
    return `${names[0]} ${names[names.length - 1].charAt(0)}`;
  };

  const role = localStorage.getItem('role');

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" alt={user?.name} src={user?.avatar?.url} />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{formatUserName(user?.name)}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user?.designation}
            </UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar variant="rounded" alt={user?.name} src={user?.avatar?.url} />
          <UserBoxText>
            <UserBoxLabel variant="body1">{user?.name}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user?.designation}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          {role === 'Plugo_Admin' && (
            <ListItem onClick={handleOpenChangePassword} sx={{ gap: '5px' }} >
              <InboxTwoToneIcon fontSize="small" />
              <ListItemText sx={{ cursor: "pointer" }} primary={t('changePassword')} />
            </ListItem>
          )}
          {role === 'LaMi_Admin' && (
            <>
              <ListItem onClick={handleOpenProfile} sx={{ gap: '5px' }}>

                <AccountBoxTwoToneIcon fontSize="small" />


                <ListItemText sx={{ cursor: "pointer" }} primary={t('myProfile')} />
              </ListItem>
              <ListItem onClick={handleOpenChangePassword} sx={{ gap: '5px' }}  >
                <AccountBoxTwoToneIcon fontSize="small" />
                <ListItemText sx={{ cursor: "pointer" }} primary={t('changePassword')} />
              </ListItem>
              <ListItem
                sx={{ gap: '5px' }}
              >
                <AccountTreeTwoToneIcon fontSize="small" />
                <ListItemText sx={{ cursor: "pointer" }} primary={t('accountSetting')} onClick={handleOpenAccountSettings} />
              </ListItem>
            </>
          )}
          {role === 'LaMi_Courier' && (
            <>
              <ListItem button onClick={handleOpenProfile}>
                <AccountBoxTwoToneIcon fontSize="small" />
                <ListItemText primary={t('myProfile')} />
              </ListItem>
              <ListItem onClick={handleOpenChangePassword} >
                <InboxTwoToneIcon fontSize="small" />
                <ListItemText primary={t('changePassword')} />
              </ListItem>
            </>
          )}
          {role === 'Client_Admin' && (
            <>
              <ListItem onClick={handleOpenProfile} sx={{ gap: '5px' }}>
                <AccountBoxTwoToneIcon fontSize="small" />
                <ListItemText sx={{ cursor: "pointer" }} primary={t('myProfile')} />
              </ListItem>
              <ListItem onClick={handleOpenChangePassword} sx={{ gap: '5px' }}  >
                <AccountBoxTwoToneIcon fontSize="small" />
                <ListItemText sx={{ cursor: "pointer" }} primary={t('changePassword')} />
              </ListItem>
            </>
          )}
          {role === 'Depo_Admin' && (
            <>
              <ListItem onClick={handleOpenProfile} sx={{ gap: '5px' }}>
                <AccountBoxTwoToneIcon fontSize="small" />
                <ListItemText sx={{ cursor: "pointer" }} primary={t('myProfile')} />
              </ListItem>
              <ListItem onClick={handleOpenChangePassword} sx={{ gap: '5px' }}  >
                <AccountBoxTwoToneIcon fontSize="small" />
                <ListItemText sx={{ cursor: "pointer" }} primary={t('changePassword')} />
              </ListItem>
            </>
          )}
        </List>
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button
            sx={{ color: "#C5522D" }}
            component="a"
            href="#"

            fullWidth
            onClick={handleSignOut}
          >
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            {t('signOut')}
          </Button>
        </Box>
      </Popover>
      <ChangePassword open={isChangePasswordOpen} onClose={handleCloseChangePassword} handleClosePopover={handleClose} /> {/* Render the ChangePassword component */}
      <ProfilePage open={isProfileOpen} onClose={handleCloseProfile} /> {/* Render the ProfilePage component */}
      <AccountSetting open={isAccountSettingsOpen} onClose={handleCloseAccountSettings} /> {/* Render the AccountSettingsPopup component */}
    </>
  );
}

export default HeaderUserbox;
