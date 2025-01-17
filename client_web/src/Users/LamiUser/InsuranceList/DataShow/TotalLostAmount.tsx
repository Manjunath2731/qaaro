import {
    Grid,
    Box,
    Card,
    Typography,
    Avatar,
    CardActionArea,
    alpha,
    styled,
    useTheme
} from '@mui/material';

import { useTranslation } from 'react-i18next';

import { fetchinsuranceAmount } from 'src/slices/InsuranceAmount';
import { RootState, useDispatch, useSelector } from 'src/store';
import { useEffect } from 'react';
import EuroSharpIcon from '@mui/icons-material/EuroSharp';
const CardBorderBottom = styled(Card)(
    () => `
      border-bottom: transparent 5px solid;
    `
);

const CardActionAreaWrapper = styled(CardActionArea)(
    ({ theme }) => `
  
          .MuiTouchRipple-root {
            opacity: .2;
          }
    
          .MuiCardActionArea-focusHighlight {
            background: ${theme.colors.primary.main};
          }
    
          &:hover {
            .MuiCardActionArea-focusHighlight {
              opacity: .03;
            }
          }
    `
);

function LostValueAmount() {
    const { t }: { t: any } = useTranslation();
    const dispatch = useDispatch();

    const { insuranceAmount, status, error } = useSelector((state: RootState) => state.insuranceAmount);
    console.log("insuranceAmount", insuranceAmount)

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchinsuranceAmount());
        }
    }, [status]);
    const theme = useTheme();

    return (
        <Grid container spacing={4}>

            <Grid item xs={12} md={12}>
                <CardBorderBottom
                    sx={{
                        borderBottomColor: `${theme.colors.success.main}`,
                        boxShadow: `
                      0 0.47rem 2.2rem ${alpha(theme.colors.success.main, 0.04)}, 
                      0 0.94rem 1.4rem ${alpha(theme.colors.success.main, 0.04)}, 
                      0 0.25rem 0.54rem ${alpha(
                            theme.colors.success.main,
                            0.06
                        )}, 
                      0 0.13rem 0.19rem ${alpha(theme.colors.success.main, 0.04)}`
                    }}
                >
                    <CardActionAreaWrapper
                        sx={{
                            p: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Box display="flex">
                            <Avatar
                                variant="rounded"
                                sx={{
                                    width: `${theme.spacing(5.5)}`,
                                    height: `${theme.spacing(5.5)}`,
                                    background: `${theme.colors.primary.main}`,
                                    color: `${theme.palette.getContrastText(
                                        theme.colors.primary.dark
                                    )}`
                                }}
                            >
                                <EuroSharpIcon />
                            </Avatar>
                            <Box ml={2}>
                                <Typography gutterBottom component="div" variant="caption" color={"red"}>
                                    {t('total')}        {t('lost')}  {t('amountInDispute')}

                                </Typography>
                                <Typography variant="h3">{insuranceAmount?.finalLostAmmount}</Typography>

                            </Box>
                        </Box>
                    </CardActionAreaWrapper>
                </CardBorderBottom>
            </Grid>
        </Grid>
    );
}

export default LostValueAmount;
