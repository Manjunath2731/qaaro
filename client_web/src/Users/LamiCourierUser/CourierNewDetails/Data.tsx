import { Box, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'src/store';

const Data = () => {

    const { t } = useTranslation();


    const { courierDetails, status, error } = useSelector((state) => state.courierDetails);

    const deadlineDateFormatted = formatDate(courierDetails?.deadlineDate);


    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
    }

    const getSubStatusBagroundColor = (SubStatus: string) => {
        switch (SubStatus) {
            case 'OPEN':
                return '#b4f4ff';
            case 'COURIER RETURNED':
                return '#fff3b2';
            case 'CUSTOMER ACCEPTED':
                return '#d8ffc2';
            case 'CUSTOMER DENIED':
                return '#ffa191';
            case 'RE-OPEN':
                return '#ffddb2';
            case 'SUCCESS':
                return '#c4ff94';
            case 'LOST':
                return '#ffdad3';

            default:
                return 'inherit';
        }
    };
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "right" }}>
                <Box>

                </Box>

                <Typography
                    bgcolor={getSubStatusBagroundColor(courierDetails?.status)}

                    textAlign="center"
                    width={205}
                    borderRadius={0.5}
                    p={0.3}
                    sx={{ fontWeight: 'bold', color: 'black', margin: "20px" }}>
                    {courierDetails?.status}
                </Typography>

            </Box>
            <Box p={2} mb={1}>
                <Typography sx={{ fontWeight: "bold" }}>{t('complainNumber')}: {courierDetails?.complainNumber}</Typography>
                <Typography sx={{ fontWeight: "bold" }}>{t('claimType')}: {courierDetails?.claimType}</Typography>
                <Typography sx={{ fontWeight: "bold" }}>{t('problem')}: {courierDetails?.problem} </Typography>
                <Typography sx={{ fontWeight: "bold" }}>{t('amountInDispute')}: {courierDetails?.amountInDispute} (rechargable amount and amount in dispute may vary) </Typography>
                <Typography sx={{ fontWeight: "bold" }}>{t('dpdReferenceNumber')}: {courierDetails?.dpdReferenceNumber}</Typography>
            </Box>

            <Box p={2} mb={1}>
                <Typography sx={{ fontWeight: "bold" }} variant='h5'>Package contents products:</Typography>
                <Typography >{t('item')}: {courierDetails?.packageDetails?.item}</Typography>
                <Typography >{t('category')}: {courierDetails?.packageDetails?.category}</Typography>
                <Typography >{t('amount')}: {courierDetails?.packageDetails?.amount}</Typography>
                <Typography >{t('manufacture')}: {courierDetails?.packageDetails?.manufacturer}</Typography>
                <Typography >{t('article')}: {courierDetails?.packageDetails?.article}</Typography>
                <Typography >{t('furtherInformation')}: {courierDetails?.packageDetails?.furtherInformation}</Typography>
                <Typography >{t('serialNumber')}: {courierDetails?.packageDetails?.serialNumber}</Typography>
                <Typography >{t('ean')}: {courierDetails?.packageDetails?.ean}</Typography>
                <Typography >{t('id')}: {courierDetails?.packageDetails?.id}</Typography>

            </Box>

            <Box p={2} mb={1}>
                <Typography sx={{ fontWeight: "bold" }} variant='h5'>{t('recipientDetails')}</Typography>
                <Typography >{courierDetails?.recipientDetails?.name}</Typography>
                <Typography >{courierDetails?.recipientDetails?.address}</Typography>
            </Box>


            <Box p={2} >
                <Typography sx={{ fontWeight: "bold" }} variant='h5'>{t('parcelLabelAddress')}</Typography>
                <Typography >{courierDetails?.recipientDetails?.name}</Typography>
                <Typography >{courierDetails?.recipientDetails?.address}</Typography>
            </Box>
            <Box p={2} mb={1}>
                <Typography sx={{ fontWeight: 'bold' }} variant="h5">{t('LaMi Note')}</Typography>
                <Typography sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{courierDetails?.description}</Typography>
            </Box>



            <Box p={2} mt={"10px"}>
                <Typography >Please clarify the situation by <span style={{ fontWeight: "bold" }}>{deadlineDateFormatted} </span>at the latest</Typography>

            </Box >






        </>
    )
}

export default Data;
