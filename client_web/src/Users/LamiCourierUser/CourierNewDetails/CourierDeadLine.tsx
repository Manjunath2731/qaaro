import React, { useState, useEffect } from 'react';
import type { ApexOptions } from 'apexcharts';

import {
    Typography, Box, Card, styled, useTheme, CardContent
} from '@mui/material';
import { useTranslation } from 'react-i18next';
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
        font-size: ${theme.typography.pxToRem(15)};
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

function CourierDeadline() {
    const { t }: { t: any } = useTranslation();
    const theme = useTheme(); // Moved inside the component function


    const { courierDetails, status, error } = useSelector((state) => state.courierDetails);

    const deadlineDateFormatted = formatDate(courierDetails?.deadlineDate);
    const currentDate = new Date();

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

    const chartSeries = [100];

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
    }

    const calculateDaysDifference = (deadlineDate: Date) => {
        const diffInTime = deadlineDate.getTime() - currentDate.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

        if (diffInDays < 0) {
            return <span style={{ color: 'red' }}>{Math.abs(diffInDays)} </span>;
        } else if (diffInDays >= 1 && diffInDays <= 3) {
            return <span style={{ color: 'red' }}>{diffInDays}  </span>;
        } else if (diffInDays >= 4 && diffInDays <= 10) {
            return <span style={{ color: 'orange' }}>{diffInDays} </span>;
        } else {
            return <span style={{ color: 'blue' }}>{diffInDays} </span>;
        }
    };

    const calculatedays = (deadlineDate: Date) => {
        const diffInTime = deadlineDate.getTime() - currentDate.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

        if (diffInDays < 0) {
            return <span > Days Passed</span>;
        } else if (diffInDays >= 1 && diffInDays <= 3) {
            return <span >  Days Due </span>;
        } else if (diffInDays >= 4 && diffInDays <= 10) {
            return <span> Days Due </span>;
        } else {
            return <span > Days Due </span>;
        }
    };

    return (
        <Box sx={{ width: "260px", height: "236px", borderRadius: "20px", border: "1px solid #d7d7d7" }}>
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

                                <Box sx={{ fontSize: "28px" }}>
                                    {calculateDaysDifference(new Date(courierDetails?.deadlineDate))}

                                </Box>
                                <Box sx={{ mt: "2px", fontSize: "13px" }}>
                                    {calculatedays(new Date(courierDetails?.deadlineDate))}

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
                    <Typography sx={{ mt: "-15px", fontWeight: "bold" }} >{t('Deadline Date')} ({deadlineDateFormatted})</Typography>

                </Box>
            </CardContent>
        </Box>
    );
}

export default CourierDeadline;
