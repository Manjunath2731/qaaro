
import {
    Typography, Box, Card,

} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CountUp from 'react-countup';
import { useSelector } from '../../../../../store';
import EuroSharpIcon from '@mui/icons-material/EuroSharp';
import { FcMoneyTransfer } from "react-icons/fc";



function AmontCard() {
    const { t }: { t: any } = useTranslation();

    const ticketDetails = useSelector((state) => state.ticketDetails.ticketDetails);


    const totalValue = ticketDetails?.amountInDispute;

    return (
        <>


            <Card
                sx={{
                    p: 2
                }}
            >

                <Box display="flex" justifyContent={"space-between"}>
                    <Box sx={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                        <Typography

                            sx={{
                                pl: 1, color: "#B1B1B1", fontSize: "18px"
                            }}
                            noWrap
                        >
                            {t("disputeAmount")}
                        </Typography>
                        <Box
                            sx={{ display: "flex", gap: "3px" }}

                        >
                            <EuroSharpIcon sx={{ fontSize: "20px", mt: "7px", ml: 1 }} />

                            <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                                <CountUp
                                    start={0}

                                    end={totalValue}
                                    duration={2.5}
                                    separator=","

                                    decimals={1} // Set decimals prop to 2 for two decimal places

                                    prefix=""
                                    suffix=""
                                />

                            </Typography>


                        </Box>
                    </Box>

                    <Box>
                        <FcMoneyTransfer fontSize={"30px"} color='#E63571' />

                    </Box>


                </Box>


            </Card>

        </>
    );
}

export default AmontCard;

