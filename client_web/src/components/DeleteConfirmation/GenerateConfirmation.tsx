import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { RootState, useSelector } from 'src/store';

const GenerateConfirmation = ({ open, onClose, onConfirm }) => {
    const { t } = useTranslation();

    const generate = useSelector((state: RootState) => state.generatePassword.status); // Use RootState



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
                    <NotInterestedIcon sx={{ fontSize: "50px", color: "blue" }} />

                    <Typography sx={{ fontWeight: "bold", fontSize: "20px", mt: "10px", mb: "20px" }}>
                    {t("confirmationNeeded")}

                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: '500', fontSize: "20px" }}>{t('Are you sure to re-set the courier password?')}</Typography>

                </DialogTitle>
                <DialogActions >
                    <Button variant='outlined' onClick={onClose} color="primary">
                        {t('no')}
                    </Button>
                    <Button onClick={onConfirm} variant="contained">
                        {generate === 'loading' ? <CircularProgress color='inherit' size="1rem" /> : t('yes')}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog >
    );
};

export default GenerateConfirmation;
