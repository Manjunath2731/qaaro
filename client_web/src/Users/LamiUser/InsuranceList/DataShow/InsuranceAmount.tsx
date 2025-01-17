import { Typography, Box, Grid, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EuroSharpIcon from '@mui/icons-material/EuroSharp';
import { RootState, useSelector } from 'src/store';
import { useEffect } from 'react';
import { useDispatch } from 'src/store';
import { fetchinsuranceAmount } from 'src/slices/InsuranceAmount';

const DividerVertialPrimary = styled(Box)(
    ({ theme }) => `
    height: 60%;
    width: 6px;
    left: -3px;
    border-radius: 50px;
    position: absolute;
    top: 20%;
    background: ${theme.colors.primary.main};
  `
);

const DividerVertialSuccess = styled(Box)(
    ({ theme }) => `
    height: 60%;
    width: 6px;
    left: -3px;
    border-radius: 50px;
    position: absolute;
    top: 20%;
    background: ${theme.colors.success.main};
  `
);

const DividerVertialWarning = styled(Box)(
    ({ theme }) => `
    height: 60%;
    width: 6px;
    left: -3px;
    border-radius: 50px;
    position: absolute;
    top: 20%;
    background: ${theme.colors.warning.main};
  `
);

function InsuranceAmount() {
    const { t }: { t: any } = useTranslation();
    const dispatch = useDispatch();

    const { insuranceAmount, status, error } = useSelector((state: RootState) => state.insuranceAmount);
    console.log("insuranceAmount", insuranceAmount)

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchinsuranceAmount());
        }
    }, [dispatch, status]);

    return (
        <Grid container spacing={8}>
            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                <Box
                    sx={{
                        overflow: 'visible',
                        position: 'relative',
                        p: 2,
                        width: "260px"
                    }}
                >
                    <DividerVertialPrimary />
                    <Typography
                        color="text.primary"
                        component="a"
                        variant="h4"
                        fontWeight="normal"
                    >
                        {t("totalClaim")}
                    </Typography>
                    <Box mt={1.5} display="flex" alignItems="center">
                        <EuroSharpIcon /> <Typography variant='h3' sx={{ fontWeight: "bold" }}>{insuranceAmount?.insuCompensationAmount}</Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                <Box
                    sx={{
                        overflow: 'visible',
                        position: 'relative',
                        p: 2
                    }}
                >
                    <DividerVertialWarning />
                    <Typography
                        color="text.primary"
                        component="a"
                        variant="h4"
                        fontWeight="normal"
                    >
                       {t("totalDeductible")}
                    </Typography>
                    <Box mt={1.5} display="flex" alignItems="center">
                        <EuroSharpIcon /> <Typography variant='h3' sx={{ fontWeight: "bold" }}>{insuranceAmount?.insuDeductible}</Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                <Box
                    sx={{
                        overflow: 'visible',
                        position: 'relative',
                        p: 2
                    }}
                >
                    <DividerVertialSuccess />
                    <Typography
                        color="text.primary"
                        component="a"
                        variant="h4"
                        fontWeight="normal"
                    >
                        {t("totalCompenstation")}
                    </Typography>
                    <Box mt={1.5} display="flex" alignItems="center">
                        <EuroSharpIcon /> <Typography variant='h3' sx={{ fontWeight: "bold" }}>{insuranceAmount?.insuTransferAmount}</Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default InsuranceAmount;
