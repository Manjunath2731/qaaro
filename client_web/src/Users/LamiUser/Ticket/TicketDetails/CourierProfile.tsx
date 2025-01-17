import React from 'react';
import { makeStyles, createStyles } from '@mui/styles';
import { Card, Typography, Divider, Box, Dialog, DialogContent, Avatar, IconButton, CardContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

interface CourierProfileProps {
    ticketDetails: any;
    onClose: () => void;
}

const CourierProfile: React.FC<CourierProfileProps> = ({ onClose, ticketDetails }) => {
    const classes = useStyles();

    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="sm">
            <DialogContent style={{ maxHeight: '600px', position: 'relative' }}>
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose} style={{marginLeft:"500px"}}>
                    <CloseIcon />
                </IconButton>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
                    {ticketDetails.courierdata?.avatar?.url && (
                        <Avatar alt={ticketDetails.courierdata?.name} src={ticketDetails.courierdata.avatar?.url} className={classes.avatar} />
                    )}
                    <Box>
                        <Typography variant="h6" component="div" className={classes.bold}>
                            {ticketDetails.courierdata?.name?.toUpperCase()}
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: '40px', color: 'black', height: '2px', mt: '40px' }} />
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="h5" component="div" className={classes.bold}>
                            Company Details
                        </Typography>
                        <Box sx={{ display: "flex", gap: "150px" }}>
                            <Box>
                                <Typography variant="subtitle1">{ticketDetails.courierdata?.company}</Typography>
                                <Typography variant="subtitle1">   {ticketDetails.courierdata?.designation}</Typography>
                            </Box>
                            <Box sx={{ mt: "-20px" }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                    < Box className={ticketDetails.courierdata?.status === 'active' ? classes.greenBackground : classes.redBackground}>
                                        Status: {ticketDetails.courierdata?.status.toUpperCase()}
                                    </Box>

                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="h5" component="div" className={classes.bold}>
                            Personal Details
                        </Typography>
                        <Typography>{ticketDetails.courierdata?.email}</Typography>
                        <Typography>{ticketDetails.courierdata?.mobile}</Typography>
                    </CardContent>
                </Card>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="h5" component="div" className={classes.bold}>
                            Address Details
                        </Typography>
                        <Typography>{ticketDetails.courierdata?.address}</Typography>
                        <Typography>
                            {ticketDetails.courierdata?.country}, {ticketDetails.courierdata?.zipcode}, {ticketDetails.courierdata?.state}
                        </Typography>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default CourierProfile;
