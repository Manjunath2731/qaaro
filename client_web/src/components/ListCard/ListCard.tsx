import React, { FC } from 'react';
import {
    Box, Typography, Avatar, styled, Card, IconButton, useTheme, Tooltip,

} from '@mui/material';
import { useTranslation } from 'react-i18next';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LockOpenIcon from '@mui/icons-material/LockOpen';
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

interface ListCardProps {
    name: string;
    status: 'active' | 'inactive';
    designation: string;
    phone: string;
    email: string;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
    onGenerateClick?: () => void;
    avatar: string; // Add avatar prop of type string

}

const ListCard: FC<ListCardProps> = ({ name, status, designation, phone, email, onEditClick, avatar, onDeleteClick, onGenerateClick }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const getStatusColor = (status) => {
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


                <Box sx={{ ml: 3, width: '100%' }}>
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
                                    <Tooltip title={t("edit")}>
                                        <IconButton
                                            sx={{
                                                '&:hover': {

                                                    color: 'black',
                                                },
                                                color: '#BCC1CB',
                                                padding: '4px', // Adjust padding as needed
                                            }}
                                            onClick={onEditClick}
                                            size="small"
                                        >
                                            <EditIcon sx={{ fontSize: "18px" }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            )}

                            {onGenerateClick && (


                                <Box
                                    sx={{
                                        display: 'inline-block',
                                        borderRadius: '8px',
                                        border: `1px solid #BCC1CB`,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Tooltip title={t("resetPassword")}>
                                        <IconButton
                                            sx={{
                                                '&:hover': {

                                                    color: 'black',
                                                },
                                                color: '#BCC1CB',
                                                padding: '4px', // Adjust padding as needed
                                            }}
                                            onClick={onGenerateClick}
                                            size="small"
                                        >
                                            <LockOpenIcon sx={{ fontSize: "18px" }} />
                                        </IconButton>

                                    </Tooltip>
                                </Box>
                            )}



                            {onDeleteClick && (
                                <Tooltip title={t("delete")}>

                                    <Box
                                        sx={{
                                            display: 'inline-block',
                                            borderRadius: '8px',
                                            border: `1px solid #BCC1CB`,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <IconButton
                                            sx={{
                                                '&:hover': {

                                                    color: 'black',
                                                },
                                                color: '#BCC1CB',
                                                padding: '4px', // Adjust padding as needed
                                            }}
                                            onClick={onDeleteClick}
                                            size="small"
                                        >
                                            <DeleteIcon sx={{ fontSize: "20px" }} />
                                        </IconButton>
                                    </Box>
                                </Tooltip>
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
                        Route No: {designation}
                    </Typography>


                    <Box sx={{
                        display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap',
                        columnGap: { xs: 5, md: 2, xl: 4, lg: 2 },
                        rowGap: { xs: 2 },
                        mt: "-20px"
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

export default ListCard;
