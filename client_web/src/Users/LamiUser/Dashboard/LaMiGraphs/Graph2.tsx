import { useRef, useState, useEffect } from 'react';
import {
  Button,
  Card,
  Box,
  CardContent,
  CardHeader,
  Menu,
  MenuItem,
  Typography,
  Divider,
  styled,
  useTheme,
  Grid
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';

import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useDispatch, useSelector } from '../../../../store';
import { RootState } from '../../../../store/rootReducer'; // Adjust the path to your root state file
import { fetchGraph2Data } from '../../../../slices/LamiDashboard/OpenVsComp'; // Adjust the path to your graph2 slice file

const DotPrimaryLight = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    background: #ffdbe1;
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
);

const DotPrimary = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    background: #e63571;
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
);
const customColors = ['#e63571', '#ffdbe1']; // Example custom colors

function Graph2() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGraph2Data('days')); // Initial fetch for days period
  }, [dispatch]);

  const graph2Data = useSelector((state: RootState) => state.graph2.data);
  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false);
  const [period, setPeriod] = useState<string>(t('Last 8 Days'));

  const periods = [
    {
      value: 'days',
      text: t('Last 8 Days')
    },
    {
      value: 'month',
      text: t('Last 8 Months')
    },
    {
      value: 'year',
      text: t('Last 8 Years')
    }
  ];

  const actionRef1 = useRef<any>(null);

  const handlePeriodChange = (value: string, text: string) => {
    setPeriod(text);
    setOpenMenuPeriod(false);
    dispatch(fetchGraph2Data(value));
  };

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      type: 'bar',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 7,
        columnWidth: '50%'
      }
    },
    colors: customColors,
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      width: 3,
      colors: ['transparent']
    },
    legend: {
      show: false
    },
    xaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: true
      },
      categories: graph2Data ? graph2Data.map(item => item.date) : []
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toString(); // Convert number to string
        }
      }


    },
    grid: {
      strokeDashArray: 6,
      borderColor: theme.palette.divider
    }
  };

  const chartData = graph2Data
    ? [
      {
        name: t('Assigned'),
        data: graph2Data.map(item => item.assignedCount)
      },
      {
        name: t('Completed'),
        data: graph2Data.map(item => item.completedCount)
      }
    ]
    : [];

  return (
    <Card>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <CardHeader title={t('ticketWithCourier')} />

        <Button
          size="small"
          variant="outlined"
          ref={actionRef1}
          onClick={() => setOpenMenuPeriod(true)}
          endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
          sx={{ width: "140px", height: "33px", margin: "5px", mt: "10px" }}
        >
          {period}
        </Button>
      </Box>
      <Divider />
      <CardContent>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: "-30px" }}>
          <Typography
            variant="body2"
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
            <DotPrimaryLight />
            {t('Completed')}
          </Typography>
        </Box>
        <Menu
          disableScrollLock
          anchorEl={actionRef1.current}
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
              onClick={() => handlePeriodChange(_period.value, _period.text)}
            >
              {_period.text}
            </MenuItem>
          ))}
        </Menu>

        <Box
          sx={{
            pt: 5,
            px: { lg: 2 },
            mb: "-25px"
          }}
        >
          <Chart
            options={chartOptions}
            series={chartData}
            type="bar"
            height={220}
          />
        </Box>

      </CardContent>
    </Card >
  );
}

export default Graph2;
