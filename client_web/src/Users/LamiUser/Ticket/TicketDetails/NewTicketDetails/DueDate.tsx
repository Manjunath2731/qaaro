

import {
    Typography, Box, Card

} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from '../../../../../store';
import { AiFillEuroCircle } from "react-icons/ai";
import { MdDateRange } from "react-icons/md";

import Label from 'src/components/Label';

function DueDate() {
    const { t }: { t: any } = useTranslation();



    const ticketDetails = useSelector((state) => state.ticketDetails.ticketDetails);

    const deadlineDateFormatted = formatDate(ticketDetails?.deadlineDate);
    const currentDate = new Date();

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
            return <span >{Math.abs(diffInDays)} </span>;
        } else if (diffInDays >= 1 && diffInDays <= 3) {
            return <span >{diffInDays}  </span>;
        } else if (diffInDays >= 4 && diffInDays <= 10) {
            return <span >{diffInDays} </span>;
        } else {
            return <span >{diffInDays} </span>;
        }
    };
    const calculatedays = (deadlineDate: Date) => {
        const currentDate = new Date(); // Ensure currentDate is defined here or passed as a parameter
        const diffInTime = deadlineDate.getTime() - currentDate.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

        if (diffInDays < 0) {
            return t("overDue");
        } else if (diffInDays >= 1 && diffInDays <= 3) {
            return t("upcoming");
        } else if (diffInDays >= 4 && diffInDays <= 10) {
            return t("upcoming");
        } else {
            return t("upcoming");
        }
    };


    return (
        <>


            <Card
                sx={{
                    p: 2
                }}
            >

                <Box display="flex" justifyContent={"space-between"} alignItems="center">
                    <Typography
                        variant="h5"
                        sx={{
                            pl: 1, color: "#B1B1B1", fontSize: "18px"
                        }}
                        noWrap
                    >
                        {t("deadLineDate")}
                    </Typography>
                    <MdDateRange fontSize={"30px"} color='#419AEF' />
                </Box>

                <Box display="flex" justifyContent={"left"} alignItems="center" gap={"15px"} paddingTop={0.5}>
                    <Box sx={{ mt: "6px", ml: 1 }}>
                        <Typography sx={{ fontSize: "21px", fontWeight: "bold" }}>
                            {deadlineDateFormatted}

                        </Typography>
                    </Box>

                    <Box
                        sx={{

                        }}
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                    >
                        <Typography variant='h3'>


                            <Box
                                sx={{
                                    fontWeight: 'normal'
                                }}
                            >
                                {calculatedays(new Date(ticketDetails?.deadlineDate)) == t("overDue") && (
                                    <Label color="error">
                                        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", fontWeight: "bold" }}>
                                            {calculatedays(new Date(ticketDetails?.deadlineDate))}
                                        </Box>
                                    </Label>
                                )}

                                {calculatedays(new Date(ticketDetails?.deadlineDate)) == t("upcoming") && (
                                    <Label color="success">
                                        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", fontWeight: "bold" }}>
                                            {calculatedays(new Date(ticketDetails?.deadlineDate))}
                                        </Box>
                                    </Label>
                                )}





                            </Box>

                        </Typography>


                    </Box>
                </Box>

            </Card>

        </>
    );
}

export default DueDate;

