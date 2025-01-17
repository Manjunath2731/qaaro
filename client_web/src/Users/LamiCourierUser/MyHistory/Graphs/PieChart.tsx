import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../../../store';
import { Card, Box, useTheme, Divider, CardHeader, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../../store/rootReducer';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { styled } from '@mui/system';
import { fetchGraphSecondData } from '../../../../slices/CourierDashboard/PieValue';
import useMediaQuery from '@mui/material/useMediaQuery';
import EuroIcon from '@mui/icons-material/Euro';
import CountUp from 'react-countup';
import EuroSharpIcon from '@mui/icons-material/EuroSharp';

const BoxChartWrapperText = styled(Box)(
    ({ theme }) => `
      position: relative;
     
      
      .ChartText {
        font-weight: bold;
        font-size:20px;
        position: absolute;
        height: 100px;
        width: 100px;
        top: 50%;
        left: 50%;
        margin: -65px 0 0 -50px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
  `
);

const ColorDot = styled('div')(({ theme }) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '8px',
}));

function Consultations() {
    const { t }: { t: any } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);


    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    useEffect(() => {
        dispatch(fetchGraphSecondData());
    }, [dispatch]);

    const graphSecondData = useSelector((state: RootState) => state.graphSecond.data);
    console.log("response value", graphSecondData);

    const total = graphSecondData?.total || 0;
    const percentages = [
        (graphSecondData?.open || 0) / total * 100,
        (graphSecondData?.returned || 0) / total * 100,
        (graphSecondData?.success || 0) / total * 100,
        (graphSecondData?.lost || 0) / total * 100,
    ];

    const customColors = ['#4e9cff',
        theme.palette.warning.main,
        theme.palette.success.main,
        theme.palette.error.main,
    ];

    const chartOptions: ApexOptions = {
        chart: {
            background: 'transparent',
            selection: {
                enabled: false
            },
            stacked: false,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                    size: '65%'
                }
            }
        },
        colors: customColors,
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                if (typeof val === 'number') {
                    return val.toFixed(2) + '%';
                } else if (Array.isArray(val)) {
                    return val.map(num => typeof num === 'number' ? num.toFixed(2) + '%' : num).join(', ');
                } else {
                    return val;
                }
            },
            style: {
                colors: [theme.colors.alpha.trueWhite[100]]
            },
            background: {
                enabled: true,
                foreColor: theme.colors.alpha.trueWhite[100],
                padding: 8,
                borderRadius: 4,
                borderWidth: 0,
                opacity: 0.3,
                dropShadow: {
                    enabled: true,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: theme.colors.alpha.black[70],
                    opacity: 0.5
                }
            },
            dropShadow: {
                enabled: true,
                top: 1,
                left: 1,
                blur: 1,
                color: theme.colors.alpha.black[50],
                opacity: 0.5
            }
        },
        fill: {
            opacity: 1
        },
        labels: [t('LaMi Returned'), t('Customer Accepted'), t('Customer Denied'), t('Package Lost')],
        legend: {
            labels: {
                colors: theme.colors.alpha.trueWhite[100]
            },
            show: false
        },
        stroke: {
            width: 0
        },
        tooltip: {
            followCursor: true,
            x: {
                show: true
            },
            y: {
                formatter: (value) => {
                    return value + ' %';
                }
            }
        },
        theme: {
            mode: theme.palette.mode
        }
    };

    const chartSize = isSmallScreen ? 200 : isMediumScreen ? 300 : 259;

    const chartSeries = percentages;



    return (
        <Card sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <CardHeader title={t('completedTickets')} sx={{ mt: "-23px" }} />
                <Box sx={{ display: "flex", gap: "5px" }} >



                    <Typography
                        variant="h4"
                        gutterBottom
                    
                    >
                        Net Lost:
                    </Typography>
                    <EuroIcon sx={{ mt: "-1px" }} fontSize='small' />
                    <Typography variant="h4" color="red" gutterBottom>
                        {graphSecondData?.amount?.netLost}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: "10px" }} />
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '100%',
                        margin: 'auto',
                    }}
                >
                    <BoxChartWrapperText
                        sx={{
                            
                            mb: 0,
                        }}
                    >
                        <div className="ChartText">

                            <Typography variant="subtitle1">{t('Total Value')}</Typography>
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{mt:"2px"}}>
                                    <EuroSharpIcon sx={{fontSize:"20px"}} />

                                </Box>
                                <CountUp
                                    start={0}
                                    end={total}
                                    duration={2.5}
                                    separator=","
                                    decimal="."
                                    prefix=""
                                    suffix=""
                                />
                            </Box>
                        </div>

                        <Chart
                            options={chartOptions}
                            series={chartSeries}
                            type="donut"
                            width={chartSize}
                            height={chartSize}
                        />

                    </BoxChartWrapperText>

                </Box>
                <Box sx={{ flex: 1 }}>
                    <TableContainer sx={{ maxWidth: '220px', ml: "19px" }}>
                        <Table size="small">
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <ColorDot style={{ backgroundColor: customColors[0] }} />
                                        {t('Open')} ({graphSecondData?.open ?? 0})
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <ColorDot style={{ backgroundColor: customColors[1] }} />
                                        {t('Returned')} ({graphSecondData?.returned})
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <ColorDot style={{ backgroundColor: customColors[2] }} />
                                        {t('Success')} ({graphSecondData?.success ?? 0})
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <ColorDot style={{ backgroundColor: customColors[3] }} />
                                        {t('Lost')} ({graphSecondData?.lost ?? 0})
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>

        </Card>
    );
}

export default Consultations;
