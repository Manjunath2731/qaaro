import React from 'react';
import { makeStyles, createStyles } from '@mui/styles';
import { Card, Typography, Divider, Box, Dialog, DialogContent, Avatar, IconButton, CardContent, CardHeader, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() =>
    createStyles({
        card: {
            margin: 'auto',
            backgroundColor: '#f5f5f5',
            marginBottom: '16px',
            boxShadow: 'none',
            borderRadius: '0',
            padding: '16px',
        },
        avatar: {
            width: '100px',
            height: '100px',
            marginRight: '16px',
        },
        bold: {
            fontWeight: 'bold',
        },
        greenBackground: {
            backgroundColor: '#c4ff94',
            color: 'black',
            padding: '4px 8px',
            width: '125px',
            borderRadius: '20px 20px 20px 20px',
            boxShadow: 'none',
            paddingTop: '6px',
            paddingBottom: '6px',
            paddingLeft: '10px',
            paddingRight: '15px',
            display: 'inline-block',
        },
        redBackground: {
            backgroundColor: '#d7d7d7',
            color: 'black',
            padding: '4px 8px',
            width: '120px',
            borderRadius: '20px 20px 20px 20px',
            boxShadow: 'none',
            paddingTop: '6px',
            paddingBottom: '6px',
            paddingLeft: '10px',
            paddingRight: '10px',

            display: 'inline-block',
        },
        closeButton: {
            position: 'absolute',
            top: '8px',
            left: '8px',
        },
    })
);

interface LocoProfileProps {
    ticketDetails: any;
    onClose: () => void;
}

const LocoProfile: React.FC<LocoProfileProps> = ({ onClose, ticketDetails }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="sm">
            <DialogContent style={{ maxHeight: '600px', position: 'relative' }}>
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose} sx={{ marginLeft: "500px" }}>
                    <CloseIcon />
                </IconButton>
                <Card>
                    <CardHeader title={t('locoContactsDetails')} />
                    <Divider />

                    <Box p={2}>

                        <Box mb={6.5}>
                            <Grid container spacing={3}>
                                <Grid item xs={4}>
                                    <Typography>{t('name')} :</Typography>
                                    <Typography sx={{ fontWeight: "bold" }}>{ticketDetails?.locoContacts?.name}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>{t('email')} :</Typography>
                                    <Typography sx={{ fontWeight: "bold" }}> {ticketDetails?.locoContacts?.email}</Typography>
                                </Grid>

                            </Grid>
                            <Grid item xs={4}>
                                <Typography>{t('address')} :</Typography>
                                <Typography sx={{ fontWeight: "bold" }}>  {ticketDetails?.locoContacts?.address}</Typography>
                            </Grid>
                        </Box>

                    </Box>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default LocoProfile;
