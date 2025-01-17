import {
    Box,
    Typography,
    Divider,
    LinearProgress,
    Avatar,
    useTheme,
    styled,
    Card,
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Button,
    Tooltip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useSelector, useDispatch } from '../../../../store';
import { RootState } from '../../../../store/rootReducer';
import { fetchCourierHistoryDetails } from 'src/slices/Ticket/CourierHistoryDetails';
import { useEffect, useState } from 'react';
import EuroSharpIcon from '@mui/icons-material/EuroSharp';
import CountUp from 'react-countup';
import EuroIcon from '@mui/icons-material/Euro';
import DataPanel from './DataPannel';
import OffsetForm from './OffsetForm';
import { Link } from 'react-router-dom';

const BoxChartWrapperText = styled(Box)(
    ({ theme }) => `
      position: relative;
      width: 220px;
      height: 220px;
      
      .ChartText {
        color: ${theme.colors.alpha.black[100]};
        font-weight: bold;
        position: absolute;
        height: 100px;
        width: 100px;
        font-size: ${theme.typography.pxToRem(18)};
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

const LinearProgressWrapper = styled(LinearProgress)(
    ({ theme }) => `
        flex-grow: 1;
        height: 10px;
        
        &.MuiLinearProgress-root {
          background-color: ${theme.colors.alpha.black[10]};
        }
        
        .MuiLinearProgress-bar {
          border-radius: ${theme.general.borderRadiusXl};
        }
  `
);

interface HistoryDetailsProps {
    courierId: string;
}

const HistoryDetails: React.FC<HistoryDetailsProps> = ({ courierId }) => {

    console.log("COURIERID", courierId)

    const { t }: { t: any } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();

    const userData = useSelector((state: any) => state.userData.userData);

    useEffect(() => {
        dispatch(fetchCourierHistoryDetails(courierId));
    }, [dispatch, courierId]);

    const courierHistoryDetails = useSelector((state: RootState) => state.courierHistoryDetails.details);

    const ensureNumber = (value: any) => typeof value === 'number' ? value : parseFloat(value) || 0;

    const total = ensureNumber(courierHistoryDetails?.value?.total);
    const open = ensureNumber(courierHistoryDetails?.value?.open);
    const success = ensureNumber(courierHistoryDetails?.value?.success);
    const lost = ensureNumber(courierHistoryDetails?.value?.lost);
    const returnedCount = ensureNumber(courierHistoryDetails?.value?.returned);

    console.log("Values - Total:", total, "Open:", open, "Success:", success, "Lost:", lost, "Returned:", returnedCount);

    const openCount = ensureNumber(courierHistoryDetails?.count?.open);
    const returned = ensureNumber(courierHistoryDetails?.count?.returned);
    const customerAccepted = ensureNumber(courierHistoryDetails?.count?.customerAccepted);
    const customerDenied = ensureNumber(courierHistoryDetails?.count?.customerDenied);
    const totalCount = ensureNumber(courierHistoryDetails?.count?.total);

    const netLost = ensureNumber(courierHistoryDetails?.amount?.netLost);

    const [isOpen, setIsOpen] = useState(false);
    const [isOffsetOpen, setIsOffsetOpen] = useState(false);

    const openValue = total !== 0 ? Number(((open / total) * 100).toFixed(2)) : 0;
    const successValue = total !== 0 ? Number(((success / total) * 100).toFixed(2)) : 0;
    const lostValue = total !== 0 ? Number(((lost / total) * 100).toFixed(2)) : 0;
    const returnedValue = total !== 0 ? Number(((returnedCount / total) * 100).toFixed(2)) : 0;

    console.log("Chart Values - Open:", openValue, "Success:", successValue, "Lost:", lostValue, "Returned:", returnedValue);

    const openProgress = totalCount !== 0 ? Number(((openCount / totalCount) * 100).toFixed(2)) : 0;
    const returnedProgress = totalCount !== 0 ? Number(((returned / totalCount) * 100).toFixed(2)) : 0;
    const customerAcceptedProgress = totalCount !== 0 ? Number(((customerAccepted / totalCount) * 100).toFixed(2)) : 0;
    const customerDeniedProgress = totalCount !== 0 ? Number(((customerDenied / totalCount) * 100).toFixed(2)) : 0;

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };
    const handleOffsetOpen = () => {
        setIsOffsetOpen(true);
    };

    const handleOffsetClose = () => {
        setIsOffsetOpen(false);
    };

    const chartOptions: ApexOptions = {
        chart: {
            background: 'transparent',
            stacked: false,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%'
                }
            }
        },
        colors: [
            '#4e9cff',
            theme.palette.success.main,
            theme.palette.error.main,
            theme.palette.warning.main
        ],
        dataLabels: {
            enabled: true,
            formatter: function (val: string | number | number[], opts?: any): string | number {
                if (typeof val === 'number') {
                    return Number(val.toFixed(2)); // Ensure to return a number, formatted to two decimal places
                } else if (typeof val === 'string') {
                    return val; // Return string values as is
                } else if (Array.isArray(val)) {
                    // Handle array case as per your specific requirement
                    // Here, I'm assuming you might want to return the first element of the array
                    return val.length > 0 ? val[0] : 0;
                }
                return val; // Return val as is for any other unexpected type
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
        labels: [t('Open'), t('Success'), t('Lost'), t('Returned')],
        legend: {
            labels: {
                colors: theme.colors.alpha.trueWhite[100]
            },
            show: false
        },
        stroke: {
            width: 0
        },
        theme: {
            mode: theme.palette.mode
        }
    };

    const chartSeries = [openValue, successValue, lostValue, returnedValue];

    return (
        <Card sx={{ ml: "20px", mr: "20px" }}>

            <Box p={{ xs: 2, md: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box >
                        <Typography variant="h4" sx={{ textTransform: 'uppercase' }} gutterBottom>
                            {courierHistoryDetails?.name}
                        </Typography>
                        <Typography variant="subtitle2">
                            Route No:  {courierHistoryDetails?.routeNo}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "left", gap: "5px" }} >
                        <Box sx={{ display: "flex", gap: "5px" }}>

                            <Tooltip title='View Full Details'>


                                <Typography
                                    variant="h4"
                                    gutterBottom
                                    onClick={handleOpen}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                            color: 'blue',
                                        },
                                    }}
                                >
                                    {t('netLost')}
                                </Typography>
                            </Tooltip>
                            <EuroIcon sx={{ mt: "-1px" }} fontSize='small' />
                            <Typography variant="h4" color="red" gutterBottom>
                                {netLost}
                            </Typography>
                        </Box>

                        {userData?.role === "LaMi_Admin" && (
                            <Typography
                                variant='h5'
                                sx={{ color: "blue", cursor: "grab", alignSelf: "flex-end" }}
                                onClick={handleOffsetOpen}
                            >
                                {t('setOffset')}
                            </Typography>
                        )}





                    </Box>

                </Box>



                <Divider
                    sx={{
                        my: 1
                    }}
                />


                <Typography variant="h4" sx={{ mt: "20px" }} gutterBottom>
                    {t('ticketsbyValue')}
                </Typography>
                <Box sx={{ display: "flex", mb: "-10px", justifyContent: "center" }}>
                    <BoxChartWrapperText
                        sx={{
                            mt: 2,
                            mb: 0,
                            display: "flex", justifyContent: "center"
                        }}
                    >
                        <div className="ChartText">

                            <Typography variant="subtitle1">{t('totalValue')}</Typography>
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ mt: "2px" }}>
                                    <EuroSharpIcon sx={{ fontSize: "19px" }} />

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

                            height={'100%'}
                            width={'100%'}
                            options={chartOptions}
                            series={chartSeries}
                            type="donut"
                        />

                    </BoxChartWrapperText>
                    <Box sx={{ flex: 1, mt: "20px", display: "flex", justifyContent: "center" }}>
                        <TableContainer sx={{ ml: "5px" }}>
                            <Table size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ display: "flex", flexDirection: "column" }}>
                                            <Box>
                                                <ColorDot style={{ backgroundColor: '#4e9cff' }} />
                                                {t('open')}
                                            </Box>
                                            <Box>
                                                ( € {open.toFixed(2)})

                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ display: "flex", flexDirection: "column" }}>
                                            <Box>
                                                <ColorDot style={{
                                                    backgroundColor: theme.palette.warning.main,
                                                }} />
                                                {t('returned')}
                                            </Box>
                                            <Box>
                                                ( € {returnedCount.toFixed(2)})

                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ display: "flex", flexDirection: "column" }}>
                                            <Box>
                                                <ColorDot style={{
                                                    backgroundColor: theme.palette.success.main
                                                }} />
                                                {t('success')}
                                            </Box>
                                            <Box>
                                                ( € {success.toFixed(2)})

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
                                                ( € {lost.toFixed(2)})

                                            </Box>
                                        </TableCell>
                                    </TableRow>

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>

                <Divider
                    sx={{
                        my: 1, mt: 2
                    }}
                />

                <Typography variant="h4" sx={{ mt: "20px" }} gutterBottom>
                    {t('ticketbyCount')} ({totalCount})
                </Typography>

                <Box py={2}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h5">
                            {t('open')}{' '}
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="span"
                            >
                                ({openCount})
                            </Typography>
                        </Typography>
                        <Typography variant="h5">{openProgress || 0}%</Typography>
                    </Box>
                    <LinearProgressWrapper
                        value={openProgress}
                        color="primary"
                        variant="determinate"
                    />
                </Box>
                <Box py={2}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h5">
                            {t('returnedBySelf')}{' '}
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="span"
                            >
                                ({returned})
                            </Typography>
                        </Typography>
                        <Typography variant="h5">{returnedProgress || 0}%</Typography>
                    </Box>
                    <LinearProgressWrapper
                        value={returnedProgress}
                        color="primary"
                        variant="determinate"
                    />
                </Box>
                <Box pt={2}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h5">
                            {t('customerAccepted')}{' '}
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="span"
                            >
                                ({customerAccepted})
                            </Typography>
                        </Typography>
                        <Typography variant="h5">{customerAcceptedProgress || 0}%</Typography>
                    </Box>
                    <LinearProgressWrapper
                        value={customerAcceptedProgress}
                        color="primary"
                        variant="determinate"
                    />
                </Box>

                <Box pt={2}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h5">
                            {t('customerDenied')}{' '}
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="span"
                            >
                                ({customerDenied})
                            </Typography>
                        </Typography>
                        <Typography variant="h5">{customerDeniedProgress || 0}%</Typography>
                    </Box>
                    <LinearProgressWrapper
                        value={customerDeniedProgress}
                        color="primary"
                        variant="determinate"
                    />
                </Box>
            </Box>
            <DataPanel open={isOpen} onClose={handleClose} courierId={courierId} name={courierHistoryDetails?.name} route={courierHistoryDetails?.routeNo} />
            <OffsetForm open={isOffsetOpen} onClose={handleOffsetClose} courierId={courierId} />

        </Card>
    );
}

export default HistoryDetails;
