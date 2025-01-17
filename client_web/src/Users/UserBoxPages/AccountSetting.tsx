import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Divider, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import { RootState } from '../../store';
import { addAccountDetails } from '../../slices/AccountSetting/AddDetails';
import { changeConnectionStatus, getAccountDetails } from '../../slices/AccountSetting/GetDetails';
import { changeConnectionStatusDeliberately, fetchConnectionStatus } from '../../slices/AccountSetting/MailConnection';
import { updateAccountDetails } from '../../slices/AccountSetting/UpdateDetails';
import { ErrorOutline } from '@mui/icons-material';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import { fetchUserData } from '../../slices/UserData';
import { useTranslation } from 'react-i18next';
import { changeItemStatus } from '../../slices/AccountSetting/ChangeConnection';

interface AccountSettingProps {
  open: boolean;
  onClose: () => void;
  clientId?: string;
}

const AccountSetting: React.FC<AccountSettingProps> = ({ open, onClose, clientId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const accountDetails = useSelector((state: RootState) => state.getAccountDetails.data);
  const isConnected = useSelector((state: RootState) => state.connection.isConnected);
  const errorMessage = useSelector((state: RootState) => state.updateDetails.error);
  const account = useSelector((state: RootState) => state.updateDetails.status);
  const userData = useSelector((state: any) => state.userData?.userData?._id);
  const userRole = localStorage.getItem('role');

  const [emailUser, setEmailUser] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailHost, setEmailHost] = useState('');
  const [emailPort, setEmailPort] = useState('');
  const [emailTemplateHtml, setEmailTemplateHtml] = useState('');
  const [emailSignatureFile, setEmailSignatureFile] = useState(null);
  const [isFlagConnected, setIsFlagConnected] = useState(accountDetails ? accountDetails.emailServer.connected : false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionTested, setConnectionTested] = useState(false);

  useEffect(() => {
    if (open) {
      dispatch(fetchUserData());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (userData) {
      dispatch(getAccountDetails(userRole === 'Plugo_Admin' ? clientId : userData));
    }
  }, [userData, userRole, clientId, dispatch]);

  useEffect(() => {
    if (accountDetails) {
      setEmailUser(accountDetails.emailServer.user || '');
      setEmailPassword(accountDetails.emailServer.password || '');
      setEmailHost(accountDetails.emailServer.host || '');
      setEmailPort(accountDetails.emailServer.port ? String(accountDetails.emailServer.port) : '');
      setEmailTemplateHtml(accountDetails.emailTemplate || '');
      setEmailSignatureFile(accountDetails.emailSignatureUrl || null);
      setIsFlagConnected(accountDetails.connected);
    }
  }, [accountDetails]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          const base64String = event.target.result.split(",")[1];
          setEmailSignatureFile(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const action = accountDetails ? updateAccountDetails : addAccountDetails;
    dispatch(
      action({
        userId: userRole === 'Plugo_Admin' ? clientId : userData,
        emailServer: {
          user: emailUser,
          password: emailPassword,
          host: emailHost,
          port: parseInt(emailPort, 10),
        },
        connected: isConnected,
        emailSignature: emailSignatureFile || '',
        emailTemplateHtml,
      })
    );
    dispatch(fetchUserData());

    onClose();
  };

  const handleConnect = () => {
    setIsLoading(true);

    const credentials = {
      user: emailUser,
      password: emailPassword,
      host: emailHost,
      port: parseInt(emailPort, 10),
    };

    dispatch(fetchConnectionStatus(credentials))
      .then((response) => {
        if (response.payload.connection) {
          setSuccessMessage(response.payload.success);
          setIsFlagConnected(true);
          setConnectionTested(true);

        }
      })
      .catch((error) => {
        console.error('Error occurred while connecting:', error);
        setShowErrorMessage(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChangeConnection = () => {
    dispatch(changeItemStatus({ lamiId: userRole === 'Plugo_Admin' ? clientId : userData }))
      .then((response: any) => {
        if (response.payload.message === 'deactivate') {
          setIsFlagConnected(false);
          setConnectionTested(false);
          dispatch(fetchUserData());

        }
      })
      .catch((error) => {
        console.error('Error occurred while changing connection status:', error);
      });
  };

  const areRequiredFieldsEmpty = () => {
    return !emailUser || !emailPassword || !emailHost || !emailPort;
  };

  useEffect(() => {
    if (account === 'failed') {
      setShowErrorMessage(true);
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [account]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const transformErrorMessage = (errorMessage: string): string => {
    switch (errorMessage) {
      case 'connection fail':
        return 'Connection failed. Please try again after some time.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle fontSize={"22px"} fontWeight={600}>{t("accountSetting")}</DialogTitle>
      <DialogTitle sx={{ fontWeight: "200", mt: "-29px" }}>{t("pleaseProvideBelowDetails")}</DialogTitle>

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
        {successMessage && (
          <Box sx={{ mt: "10px", mb: "10px", bgcolor: "#feffbe" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'black', padding: '5px' }}>
              <CloudOffIcon sx={{ mr: 1 }} />
              <Typography variant='body1'>
                {successMessage}
              </Typography>
            </Box>
          </Box>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            fullWidth
            margin="normal"
            label={t("emailUser")}
            variant="outlined"
            value={emailUser}
            onChange={(e) => setEmailUser(e.target.value)}
            InputProps={{ sx: { borderRadius: '5px' } }}
            disabled={isFlagConnected}
          />
          <TextField
            fullWidth
            margin="normal"
            label={t("emailPassword")}
            variant="outlined"
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
            InputProps={{ sx: { borderRadius: '5px' } }}
            disabled={isFlagConnected}
          />
          <TextField
            fullWidth
            margin="normal"
            label={t("emailHost")}
            variant="outlined"
            value={emailHost}
            onChange={(e) => setEmailHost(e.target.value)}
            InputProps={{ sx: { borderRadius: '5px' } }}
            disabled={isFlagConnected}
          />
          <TextField
            fullWidth
            margin="normal"
            label={t("emailPort")}
            variant="outlined"
            value={emailPort}
            onChange={(e) => setEmailPort(e.target.value)}
            InputProps={{ sx: { borderRadius: '5px' } }}
            disabled={isFlagConnected}
          />
        </Box>
        <Box>
          {isFlagConnected && (
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'green' }}>{t("connectionTestedSuccessfully")}</Typography>
              <Button onClick={handleChangeConnection}>{t("change")}</Button>
            </Box>
          )}
          {!isFlagConnected && !connectionTested && (
            <Button
              variant="outlined"
              onClick={isLoading ? undefined : handleConnect}
              disabled={isLoading}
              sx={{ color: 'green' }}
            >
              {isLoading ? 'Testing Connection...' : 'Test Connection'}
            </Button>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />
        <TextField
          multiline
          fullWidth
          margin="normal"
          label={t("emailTemplate")}
          variant="outlined"
          rows={5}
          value={emailTemplateHtml}
          onChange={(e) => setEmailTemplateHtml(e.target.value)}
          InputProps={{ sx: { borderRadius: '5px' } }}
        />
        <Box sx={{ display: 'flex', alignItems: 'left', mt: "20px", flexDirection: "column", gap: "10px" }}>
          <Typography
            component="span"
            variant="subtitle1"
            sx={{ fontWeight: 'bold', cursor: 'pointer', color: 'blue' }}
          >
            {t("uplaodEmailSign")}
          </Typography>
          <input type="file" onChange={handleFileChange} />
        </Box>
      </DialogContent>
      <DialogActions >
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button onClick={handleSubmit} variant='contained' color="primary" disabled={areRequiredFieldsEmpty() || (!isFlagConnected && !isConnected)}>
          {accountDetails ? t('update') : t('create')} {/* Render Update or Create button based on existing data */}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountSetting;
