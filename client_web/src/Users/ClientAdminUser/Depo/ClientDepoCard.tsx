import React, { FC } from 'react';
import {
    Box, Typography, Avatar, styled, Card, IconButton, useTheme, Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const CardWrapper = styled(Card)(
    ({ theme }) => `
        transition: ${theme.transitions.create(['box-shadow'])};
        position: relative;
        border-radius: 0px;
        z-index: 5;
        width: 100%;
        height: 100%;
        border: 0.2px solid #cedbef;
        `
);

interface ClientDepoCardProps {
    name: string;
    status: 'active' | 'inactive';
    designation: string;
    phone: string;
    email: string;
    avatar: string;
    onEditClick?: () => void;
}

const ClientDepoCard: FC<ClientDepoCardProps> = ({ name, status, designation, phone, email, avatar, onEditClick }) => {
    const theme = useTheme();

    const getStatusColor = (status: 'active' | 'inactive') => {
        return status === 'active' ? '#419AEF' : '#f44336';
    };

    return (
        <CardWrapper sx={{ height: '100%' }}>
            <Box
                sx={{
                    paddingLeft: '35px',
                    paddingTop: '25px',
                    paddingBottom: '26px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <Avatar src={avatar} sx={{ width: "85px", height: "85px", mt: "13px" }} />
                <Box sx={{ ml: 5, width: '100%' }}>
                    <Box
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: 2, mt: "20px" }}>
                            <Typography variant="h5" sx={{ textTransform: 'uppercase' }}>{name}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", mr: "20px", gap: "20px" }}>
                            <Box sx={{
                                textTransform: 'uppercase', bgcolor: getStatusColor(status),
                                color: "white", padding: "3px", fontSize: "12px", fontWeight: "600",
                                borderRadius: '20px 20px 20px 20px',
                                boxShadow: 'none',
                                pt: '4px',
                                pb: '2px',
                                pl: '15px',
                                pr: '15px',
                                border: '1.5px solid #A6C4E7',
                            }}>
                                {status}
                            </Box>
                            {onEditClick && (
                                <Box
                                    sx={{
                                        display: 'inline-block',
                                        borderRadius: '8px',
                                        border: `1px solid #BCC1CB`,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Tooltip title="Edit">
                                        <IconButton
                                            sx={{
                                                '&:hover': {
                                                    color: 'black',
                                                },
                                                color: '#BCC1CB',
                                                padding: '4px',
                                            }}
                                            onClick={onEditClick}
                                            size="small"
                                        >
                                            <EditIcon sx={{ fontSize: "18px" }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            )}
                        </Box>
                    </Box>
                    <Typography variant="subtitle1" sx={{
                        marginTop: '4px',
                        marginBottom: "30px",
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        maxWidth: { xs: '400px', md: '250px', lg: '260px', xl: '400px', }
                    }}>
                        Designation:  {designation}
                    </Typography>
                    <Box sx={{
                        display: 'flex', flexDirection: 'row', mt: 1, justifyContent: 'flex-start', flexWrap: 'wrap',
                        columnGap: { xs: 5, md: 2, xl: 4, lg: 2 },
                        rowGap: { xs: 2 },
                        marginTop: "-20px"
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Box sx={{
                                height: 25,
                                width: 25,
                                borderRadius: '50%',
                                marginRight: 1,
                                color: "white",
                                bgcolor: "#D9D9D9",
                                padding: "3px",
                                fontSize: "small",
                            }}>
                                <PhoneIcon fontSize='small' />
                            </Box>
                            <Typography variant="subtitle1" sx={{ ml: 1 }}>
                                {phone}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', color: "#D9D9D9" }}>
                            <EmailIcon sx={{ fontSize: "28px" }} />
                            <Typography variant="subtitle1" sx={{ ml: 1, fontSize: '0.9em' }}>
                                {email}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </CardWrapper>
    );
};

export default ClientDepoCard;
