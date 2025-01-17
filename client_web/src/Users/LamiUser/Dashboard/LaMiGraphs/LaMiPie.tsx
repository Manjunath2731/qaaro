import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../../store';
import {
    Card,
    Box,
    Typography,
    useTheme,
    Divider,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    useMediaQuery
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Label from 'src/components/Label';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { styled } from '@mui/system';
import { fetchGraph3Data } from '../../../../slices/LamiDashboard/PieGraph'; // Import your graph3 slice
import CountUp from 'react-countup';
import EuroSharpIcon from '@mui/icons-material/EuroSharp';

const BoxChartWrapperText = styled(Box)(
    ({ theme }) => `
      position: relative;
      
      .ChartText {
        font-weight: bold;
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

function LamiPie() {
    const { t }: { t: any } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isXLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));


    useEffect(() => {
        dispatch(fetchGraph3Data());
    }, [dispatch]);

    const graph3Data = useSelector((state: any) => state.graph3.data);
    const customColors = ["#4E9CFF",
        theme.palette.warning.main,
        theme.palette.success.main,
        theme.palette.error.main];
    const calculatePercentages = () => {
        const totalAmount = graph3Data?.totalAmount || 0;
        return [
            (graph3Data?.openAmount || 0) / totalAmount * 100,
            (graph3Data?.pendingAmount || 0) / totalAmount * 100,
            (graph3Data?.successAmount || 0) / totalAmount * 100,
            (graph3Data?.lostAmount || 0) / totalAmount * 100,
        ];
    };
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
                    return val.toFixed(0) + '%'; // Display percentage value with two decimal places
                } else if (Array.isArray(val)) {
                    // Assert value as an array of numbers to avoid 'never' type error
                    return (val as number[]).map(num => typeof num === 'number' ? num.toFixed(0) + '%' : num).join(', ');
                } else {
                    return val; // Return as is if not a number or array
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
        labels: [t('open'), t('pending'), t('success'), t('lost')],
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
                    if (typeof value === 'number') {
                        return value.toFixed(0) + '%'; // Display percentage value with two decimal places
                    } else if (Array.isArray(value)) {
                        // Assert value as an array of numbers to avoid 'never' type error
                        return (value as number[]).map(num => typeof num === 'number' ? num.toFixed(0) + '%' : num).join(', ');
                    } else {
                        return value; // Return as is if not a number or array
                    }

                }
            }
        },
        theme: {
            mode: theme.palette.mode
        }
    };

    const chartSeries = calculatePercentages();
    const totalAmount = graph3Data?.totalAmount || 0;

    const chartHeight = isSmallScreen ? 150 : isMediumScreen ? 215 : isLargeScreen ? 190 : isXLargeScreen ? 215 : 250;

    return (
        <Card sx={{ p: 3 }}>
            <CardHeader title={t('ticketDistributionByValue')} sx={{ mt: "-25px" }} />
            <Divider sx={{ mb: "37px" }} />
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Box sx={{ flex: 1, ml: "4px" }}>
                    <BoxChartWrapperText
                        sx={{
                            mt: -0.1,
                            mb: 0,
                        }}
                    >
                        <div className="ChartText">
                            <Typography variant="subtitle1">{t('totalValue')}</Typography>
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{}}>
                                    <EuroSharpIcon sx={{ fontSize: "18px" }} />
                                </Box>
                                <CountUp
                                    start={0}
                                    end={totalAmount}
                                    duration={2.5}
                                    separator=","
                                    decimal="."
                                    prefix=""
                                    suffix=""
                                />
                            </Box>
                        </div>

                        <Chart
                            height={chartHeight}
                            options={chartOptions}
                            series={chartSeries}
                            type="donut"
                        />

                    </BoxChartWrapperText>

                </Box>
                {!isMediumScreen && (
                    <Box sx={{ flex: 1 }}>
                        <TableContainer sx={{ maxWidth: '200px', ml: "30px", mt: "-20px" }}>
                            <Table size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ display: "flex", flexDirection: "column" }}>
                                            <Box>
                                                <ColorDot style={{ backgroundColor: "#4E9CFF" }} />
                                                {t('open')}
                                            </Box>
                                            <Box>
                                                (€{graph3Data?.openAmount})
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ display: "flex", flexDirection: "column" }}>
                                            <Box>
                                                <ColorDot style={{
                                                    backgroundColor: theme.palette.warning.main,
                                                }} />
                                                {t('pending')}
                                            </Box>
                                            <Box>
                                                (€{graph3Data?.pendingAmount})
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ display: "flex", flexDirection: "column" }}>
                                            <Box>
                                                <ColorDot style={{ backgroundColor: theme.palette.success.main }} />
                                                {t('success')}
                                            </Box>
                                            <Box>
                                                (€{graph3Data?.successAmount})
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ display: "flex", flexDirection: "column" }}>
                                            <Box >
                                                <ColorDot style={{
                                                    backgroundColor: theme.palette.error.main,
                                                }} />
                                                {t('lost')}
                                            </Box>
                                            <Box>
                                                (€{graph3Data?.lostAmount})
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

            </Box>
        </Card>
    );
}

export default LamiPie;
