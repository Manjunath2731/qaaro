import { useEffect } from 'react';
import { useRef, useState } from 'react';
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
import type { ApexOptions } from 'apexcharts';
import { fetchGraph1Data } from '../../../../slices/LamiDashboard/Graph1';

const DotOpen = styled('span')(({ theme }) => `
    border-radius: 22px;
    background: #7DB6FF; // Change to the color of the 'Open' series
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`);

const DotLoco = styled('span')(({ theme }) => `
    border-radius: 22px;
    background: #90f542; // Change to the color of the 'LOCO' series
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`);

const DotLost = styled('span')(({ theme }) => `
    border-radius: 22px;
    background: #FFDBE1; // Change to the color of the 'LOCO Lost' series
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`);

const DotSuccess = styled('span')(({ theme }) => `
    border-radius: 22px;
    background: #d7d7d7; // Change to the color of the 'LOCO Success' series
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`);

const Graph1 = () => {
    const { t }: { t: any } = useTranslation();
    const dispatch = useDispatch();
    const theme = useTheme();
    const graph1Data = useSelector((state: any) => state.graph1.data);
    const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false);
    const [period, setPeriod] = useState<string>(''); // Set initial period to an empty string


    


    const periods = [
        {
            value: 'days',
            text: t('Last 8 Days') // Change the text accordingly
        },
        {
            value: 'months',
            text: t('Last 8 Months') // Change the text accordingly
        },
        {
            value: 'years',
            text: t('Last 8 Years') // Change the text accordingly
        },
    ];

    useEffect(() => {
        console.log('graph1Data:', graph1Data); // Log the graph1Data
        // Fetch data for the initial period when the component mounts
        setPeriod('Last 8 Days'); // Set initial period to 'days'
        dispatch(fetchGraph1Data('days')); // Fetch data for 'days' initially
    }, []);


    const handlePeriodChange = (selectedPeriod: string) => {
        // Find the selected period object from the periods array
        const selectedPeriodObj = periods.find(period => period.value === selectedPeriod);
        if (selectedPeriodObj) {
            // Update the period state with the text of the selected period object
            setPeriod(selectedPeriodObj.text);
        }
        setOpenMenuPeriod(false);
        dispatch(fetchGraph1Data(selectedPeriod));
    };
    

    const statusSeries = [
        {
            name: 'Open',
            data: graph1Data?.map((item: any) => ({ x: item.date, y: item.open }))
        },
        {
            name: 'LOCO',
            type: 'line',
            data: graph1Data?.map((item: any) => ({ x: item.date, y: item.loco }))
        },
        {
            name: 'LOCO Lost',
            data: graph1Data?.map((item: any) => ({ x: item.date, y: item.lost }))
        },
        {
            name: 'LOCO Success',
            type: 'line',
            data: graph1Data?.map((item: any) => ({ x: item.date, y: item.success }))
        }
    ];


    const StatusOptions: ApexOptions = {
        stroke: {
            width: 3
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
            shape: 'circle',
            size: 6,
            strokeWidth: 3,
            strokeOpacity: 1,
            strokeColors: theme.colors.alpha.white[100],
            colors: [
                '#7DB6FF', //  (Open)
                '#90f542', // (LOCO)
                '#d7d7d7', //  (LOCO Success)
                '#FFDBE1' //  (LOCO Lost)
            ],
        },
        colors: [
            '#7DB6FF', //  (Open)
            '#90f542', // (LOCO)
            '#d7d7d7', //  (LOCO Success)
            '#FFDBE1' //  (LOCO Lost)
        ],
        fill: {
            opacity: 1
        },
        labels: [], // Empty labels array
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

    const actionRef1 = useRef<any>(null);
    return (
        <Card
            sx={{
                height: '90%'
            }}
        >
            <CardHeader
                action={
                    <>
                        <Button
                            
                            size="small"
                            variant="outlined"
                            onClick={() => setOpenMenuPeriod(true)}
                            endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
                            ref={actionRef1}

                        >
                            {period}
                        </Button>



                    </>
                }
                title={t('ticketDistribution')}
            />
            <Divider />
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="right" gap="10px">
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',

                        }}
                    >
                        <DotOpen />
                        {t('Open')}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <DotLoco />
                        {t('Loco')}
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
                        {t('Lost')}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <DotLost />
                        {t('Success')}
                    </Typography>

                </Box>
                <Menu
                    disableScrollLock
                    anchorEl={actionRef1?.current}
                    onClose={() => setOpenMenuPeriod(false)}
                    open={openPeriod}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                    }}
                >
                    {periods.map((_period) => (
                        <MenuItem
                            key={_period.value}
                            onClick={() => handlePeriodChange(_period.value)} // Connect onClick event to handlePeriodChange
                        >
                            {_period.text}
                        </MenuItem>
                    ))}
                </Menu>
                <Box>

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

export default Graph1;
