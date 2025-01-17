// OverallStatus.js

import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from '../../../../store';
import {
    Button,
    Card,
    Box,
    CardContent,
    CardHeader,
    Typography,
    Divider,
    Menu,
    MenuItem,
    useTheme,
    styled
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import Chart from 'react-apexcharts';
import { fetchGraphData } from '../../../../slices/CourierDashboard/AssignVsComp';
import { ApexOptions } from 'apexcharts';

// Define DotSuccess and DotPrimary components using styled
const DotSuccess = styled('span')(
    ({ theme }) => `
    border-radius: 22px;
    background: ${theme.colors.success.main};
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
);

const DotPrimary = styled('span')(
    ({ theme }) => `
    border-radius: 22px;
    background: ${theme.colors.primary.main};
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
);

function OverallStatus() {
    const dispatch = useDispatch();
    const { t }: { t: any } = useTranslation();
    const actionRef1 = useRef<any>(null);
    const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false);
    const theme = useTheme();
    const graphData = useSelector((state) => state.graph.data);

    const periods = [
        {
            value: 'days',
            text: t('Last 12 days')
        },
        {
            value: 'month',
            text: t('Last 12 Months')
        },
        {
            value: 'year',
            text: t('Last 12 Years')
        }
    ];

    const [period, setPeriod] = useState<string>(periods[0].value); // Default to 'days'

    useEffect(() => {
        dispatch(fetchGraphData(period)); // Fetch graph data based on the selected period
    }, [dispatch, period]);

    const statusSeries = [
        {
            name: 'Assigned Tickets',
            data: graphData.map(([label, data]) => data.assigned)
        },
        {
            name: 'Completed Ticket',
            type: 'line',
            data: graphData.map(([label, data]) => data.completed)
        }
    ];

    const xLabels = graphData.map(([label]) => label);

    const StatusOptions: ApexOptions = {
        stroke: {
            width: [3, 3] // Specify separate stroke widths for each series
        },
        theme: {
            mode: theme.palette.mode
        },
        chart: {
            background: 'transparent',
            toolbar: {
                show: false
            }
        },
        markers: {
            hover: {
                sizeOffset: 2
            },
            shape: 'circle', // Change the marker shape to 'circle'
            size: 6,
            strokeWidth: 3,
            strokeOpacity: 1,
            strokeColors: theme.colors.alpha.white[100],
            colors: [theme.colors.primary.main, theme.colors.success.main]
        },
        fill: {
            opacity: 1
        },
        labels: xLabels,
        dataLabels: {
            enabled: false
        },
        grid: {
            strokeDashArray: 5,
            borderColor: theme.palette.divider
        },
        legend: {
            show: false
        },
        xaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            labels: {
                style: {
                    colors: theme.palette.text.secondary
                }
            }
        },
        yaxis: {
            tickAmount: 6,
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            labels: {
                show: false
            }

        }
    };

    return (
        <Card>
            <CardHeader
                action={
                    <>
                        <Button
                            size="small"
                            variant="outlined"
                            ref={actionRef1}
                            onClick={() => setOpenMenuPeriod(true)}
                            endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
                        >
                            {periods.find(p => p.value === period)?.text} {/* Display selected period text */}
                        </Button>
                        <Menu
                            disableScrollLock
                            anchorEl={actionRef1.current}
                            onClose={() => setOpenMenuPeriod(false)}
                            open={openPeriod}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                        >
                            {periods.map((_period) => (
                                <MenuItem
                                    key={_period.value}
                                    onClick={() => {
                                        setPeriod(_period.value); // Set the selected period
                                        setOpenMenuPeriod(false);
                                    }}
                                >
                                    {_period.text}
                                </MenuItem>
                            ))}
                        </Menu>
                    </>
                }
                title={t('ticketsAssignedCompleted')}
            />
            <Divider />
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="flex-end">
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mr: 2
                        }}
                    >
                        <DotPrimary />
                        {t('Assigned')}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <DotSuccess />
                        {t('Completed')}
                    </Typography>
                </Box>
                <Box sx={{ mt: "-39px" }}
                >
                    <Chart
                        options={StatusOptions}
                        series={statusSeries}
                        type="line"
                        height={243}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}

export default OverallStatus;
