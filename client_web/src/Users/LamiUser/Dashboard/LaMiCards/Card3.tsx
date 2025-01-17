import React from 'react';

import {
    CardContent,
    Avatar,
    Box,
    Typography,
    Card,
    ListItemText,
    styled,
    useTheme
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from '../../../../store';
import { RootState } from '../../../../store/rootReducer'; // Import RootState from your root reducer file
import { fetchDashboardCardData } from 'src/slices/LamiDashboard/LamiCards';
import useMediaQuery from '@mui/material/useMediaQuery';

import BarChartIcon from '@mui/icons-material/BarChart';
import { BiEuro } from "react-icons/bi";



const AvatarSuccess = styled(Avatar)(
    ({ theme }) => `
    background-color: #5EB461;
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

function Card3() {
    const { t }: { t: any } = useTranslation();
    const dispatch = useDispatch();
    const theme = useTheme();

    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    React.useEffect(() => {
        dispatch(fetchDashboardCardData());
    }, []);


    const fetchDashboardData = useSelector((state: RootState) => state.dashboardCard.data);
    const firstCardData = fetchDashboardData?.packagedata;

    return (


        <Card sx={{ pb: "10px" }}>

            <CardContentWrapper>


                <Box>
                    <AvatarSuccess variant="rounded"  >
                        <BarChartIcon fontSize="large" style={{ height: isMediumScreen ? "25px" : "30px" }} />
                    </AvatarSuccess>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignContent: "flex-end", flexWrap: "wrap", mt: "-15px" }}>

                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="overline" sx={{ alignSelf: "end", color: "#989898" }}>
                            {t('lost')}
                        </Typography>
                        <Typography variant="overline" sx={{ mt: "-15px", color: "#989898" }} >
                            {t('value')}
                        </Typography>
                    </Box>

                </Box>

                <Box sx={{ display: "flex", justifyContent: "right" }}>

                    <Box>
                        <BiEuro fontSize={"25px"} style={{ marginTop: "5px" }} />
                    </Box>
                    <Typography sx={{ textAlign: "right" }} variant='h3'>
                        {firstCardData?.packageLost}
                    </Typography>

                </Box>

                {isLargeScreen && (
                    <Box sx={{ display: "flex", gap: "17px" }}>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                            <Box>
                                <ListItemText
                                    primary={firstCardData?.justified}
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
                                    {t('justified')}
                                </Typography>
                                <Typography variant="overline" sx={{ color: "#8c8c8c", mt: "-15px", fontSize: "10px" }}>
                                    {t('tickets')}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "5px", fontSize: "10px" }}>
                            <Box>
                                <ListItemText
                                    primary={firstCardData?.denied}
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
                                    {t('denied')}
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

export default Card3;
