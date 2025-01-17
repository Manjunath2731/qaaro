import React from 'react';
import type { ApexOptions } from 'apexcharts';

import {
    Typography, Box, Card, styled, useTheme,

    CardContent
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CountUp from 'react-countup';
import Chart from 'react-apexcharts';
import { useSelector } from 'src/store';


const BoxChartWrapperText = styled(Box)(
    ({ theme }) => `
      position: relative;
      width: 190px;
      height: 190px;
      
      .ChartText {
        color: ${theme.colors.alpha.black[100]};
        font-weight: bold;
        position: absolute;
        height: 100px;
        width: 100px;
        font-size: ${theme.typography.pxToRem(23)};
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

function CourierAmount() {
    const { t }: { t: any } = useTranslation();
    const theme = useTheme();
    const open = 100;
    const total = 100;

    const { courierDetails, status, error } = useSelector((state) => state.courierDetails);


    const totalValue = courierDetails?.amountInDispute;
    const openValue = Number(((open / total) * 100).toFixed(2));



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
                    size: '75%'
                }
            }
        },
        colors: [
            '#d7d7d7',

        ],
        dataLabels: {
            enabled: false,


        },
        fill: {
            opacity: 1
        },
        legend: {

            show: false
        },
        stroke: {
            width: 0
        },
        theme: {
            mode: theme.palette.mode
        },
        tooltip: {
            enabled: false // Disable tooltips on hover
        }
    };

    const chartSeries = [openValue];


    return (
        <Box sx={{ width: "260px", height: "236px", borderRadius: "20px", border: "1px solid #d7d7d7", display: "flex", justifyContent: "center" }}>
            <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <BoxChartWrapperText
                        sx={{
                            mt: -0.75,
                            mb: 0,
                        }}
                    >
                        <div className="ChartText">
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                                <CountUp
                                    start={0}
                                    end={totalValue}
                                    duration={2.5}
                                    separator=","
                                    decimals={1} // Set decimals prop to 2 for two decimal places

                                    prefix=""
                                    suffix=""
                                />
                                <Box sx={{ mt: "3px" }}>
                                    <Typography sx={{ fontWeight: "bold" }}>Euro</Typography>

                                </Box>
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
                    <Typography sx={{ mt: "-15px", fontWeight: "bold" }} >{t('Dispute Amount')}</Typography>


                </Box>
            </CardContent>
        </Box>
    );
}

export default CourierAmount;
