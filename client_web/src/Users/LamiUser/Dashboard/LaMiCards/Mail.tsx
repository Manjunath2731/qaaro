import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from '../../../../store';
import { fetchMailData } from '../../../../slices/Mail';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, LinearProgress, Typography } from '@mui/material';
import { fetchDashboardCardData } from 'src/slices/LamiDashboard/LamiCards';
import { fetchGraph1Data } from 'src/slices/LamiDashboard/Graph1';
import { fetchGraph2Data } from 'src/slices/LamiDashboard/OpenVsComp';
import { fetchGraph3Data } from 'src/slices/LamiDashboard/PieGraph';
import { fetchDashboardTicketTableData } from 'src/slices/LamiDashboard/LamiTicketTable';
import { fetchDashboardTicketCourierData } from 'src/slices/LamiDashboard/CourierData';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { useTranslation } from 'react-i18next';

const Mail = () => {
    const dispatch = useDispatch();
    const [isSyncing, setIsSyncing] = useState(false);
    const [open, setOpen] = useState(false); // State for controlling the popup
    const { status, error, data } = useSelector((state) => state.mail);
    const { t } = useTranslation();

    const handleSyncMail = () => {
        setOpen(true);
        setIsSyncing(true);
        dispatch(fetchMailData())
            .then(() => {
                setIsSyncing(false);
                setTimeout(() => {
                    setOpen(false);
                    dispatch(fetchDashboardCardData());
                    dispatch(fetchGraph1Data('days'));
                    dispatch(fetchGraph2Data('days'));
                    dispatch(fetchGraph3Data());
                    dispatch(fetchDashboardTicketTableData());
                    dispatch(fetchDashboardTicketCourierData());
                }, 5000); // Close the popup after 5 seconds

            })
            .catch((error) => {
                console.error("Error occurred during mail synchronization:", error);
                setIsSyncing(false);
            });
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ mt: "20px" }}>
            <Box
                sx={{ mt: "-20px", textDecoration: 'underline', cursor: 'pointer', color: "blue" }}
                onClick={handleSyncMail}
            >
                {t("synchronize")}
            </Box>

            {/* Popup */}
            <Dialog open={open} onClose={handleClose} maxWidth={false} >
                <DialogContent sx={{ width: "650px" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Box sx={{ mb: "10px" }}>
                            <DownloadForOfflineIcon sx={{ color: "#419AEF", fontSize: "50px" }} />

                        </Box>
                        <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>E-mail Synchronization</Typography>
                        <Box sx={{ mb: '20px', flexWrap: "wrap" }}>
                            {isSyncing && <p>E-Mail Synchronization In Progress. Please Wait...</p>}
                            {!isSyncing && status === 'failed' && <p style={{ color: "red" }}>Please Try Again later</p>}
                            {!isSyncing && status === 'succeeded' && <p>E-Mail Synchronization In Progress. Please wait for the pop-up window to be closed...</p>}
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                        {(isSyncing || status === 'succeeded') && <LinearProgress sx={{ width: '100%' }} />}
                    </Box>

                </DialogContent>
                <DialogActions>
                    {!isSyncing && status === 'failed' && <Button onClick={handleClose} color="primary">
                        Close
                    </Button>}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Mail;
