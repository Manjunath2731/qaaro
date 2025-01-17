import React from 'react';

import {
    CardContent,
    Avatar,
    Box,
    Typography,
    Card,
    ListItemText,
    styled,
    useTheme,
    Divider
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from '../../../../store';
import { RootState } from '../../../../store/rootReducer'; // Import RootState from your root reducer file
import { fetchDashboardCardData } from 'src/slices/LamiDashboard/LamiCards';
import useMediaQuery from '@mui/material/useMediaQuery';

import MailIcon from '@mui/icons-material/Mail';

const AvatarSuccess = styled(Avatar)(
    ({ theme }) => `
background-color: #161616;
color: ${theme.palette.primary.contrastText};
width: ${theme.spacing(7)};
height: ${theme.spacing(5)};
box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.2);
position: absolute;
z-index: 1;
margin-top: -40px; /* Adjust as needed */
margin-left: calc(50% - ${Number(theme.spacing(7)) / 2}px);

${theme.breakpoints.between('sm', 'md')} {
width: ${theme.spacing(6)};
height: ${theme.spacing(4)};
margin-top: -35px;
margin-left: calc(50% - ${Number(theme.spacing(5)) / 2}px);
}

${theme.breakpoints.down('xs')} {
width: ${theme.spacing(5)};
height: ${theme.spacing(4)};
margin-top: -20px;
margin-left: calc(50% - ${Number(theme.spacing(4)) / 2}px);
}
`
);



const CardContentWrapper = styled(CardContent)(
    ({ theme }) => `
padding: ${theme.spacing(2.5, 1.5, 0.5)};
&:last-child {
padding-bottom: 0;
}
`
);

function TicketCount() {
    const { t }: { t: any } = useTranslation();
    const dispatch = useDispatch();
    const theme = useTheme();

    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    React.useEffect(() => {
        dispatch(fetchDashboardCardData());
    }, []);

    const fetchDashboardData = useSelector((state: RootState) => state.dashboardCard.data);
    const firstCardData = fetchDashboardData?.ticketdata;

    return (
        <Card sx={{ pb: "10px" }}>
            <CardContentWrapper>

                <Box>
                    <AvatarSuccess variant="rounded" >
                        <MailIcon fontSize="large" style={{ height: isMediumScreen ? "25px" : "30px" }} />
                    </AvatarSuccess>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", alignContent: "flex-end", flexWrap: "wrap", mt: "-15px" }}>

                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="overline" sx={{ alignSelf: "end", color: "#989898" }}>
                            {t('open')}
                        </Typography>
                        <Typography variant="overline" sx={{ mt: "-15px", color: "#989898" }} >
                            {t('Tickets')}
                        </Typography>
                    </Box>

                </Box>

                <Box >
                    <Typography sx={{ textAlign: "right" }} variant='h3'>
                        {firstCardData?.open}
                    </Typography>

                </Box>


                {isLargeScreen && (
                    <Box sx={{ display: "flex", gap: "17px" }}>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                            <Box>
                                <ListItemText
                                    primary={firstCardData?.total}
                                    primaryTypographyProps={{
                                        variant: 'h3',
                                        sx: {
                                            mt: "2px", color: "blue", fontWeight: 1000
                                        },
                                        noWrap: true
                                    }}
                                />

                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography variant="overline" sx={{ color: "#8c8c8c", fontSize: "10px" }}>
                                    {t('total')}
                                </Typography>
                                <Typography variant="overline" sx={{ color: "#8c8c8c", mt: "-15px", fontSize: "10px" }}>
                                    {t('tickets')}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "5px", fontSize: "10px" }}>
                            <Box>
                                <ListItemText
                                    primary={firstCardData?.completed}
                                    primaryTypographyProps={{
                                        variant: 'h3',
                                        sx: {
                                            mt: "2px", color: "green", fontWeight: 1000
                                        },
                                        noWrap: true
                                    }}
                                />

                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography variant="overline" sx={{ color: "#8c8c8c", fontSize: "10px" }}>
                                    {t('completed')}
                                </Typography>
                                <Typography variant="overline" sx={{ color: "#8c8c8c", mt: "-15px", fontSize: "10px" }}>
                                    {t('tickets')}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                )}



            </CardContentWrapper>
        </Card>
    );
}

export default TicketCount;
