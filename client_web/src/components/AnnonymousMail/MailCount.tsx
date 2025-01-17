import React from 'react';
import MailIcon from '@mui/icons-material/Mail';
import { Box, Typography } from '@mui/material';
import { RootState, useSelector } from 'src/store';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const GoogleMailIcon: React.FC = () => {
    const fetchDashboardData = useSelector((state: RootState) => state.dashboardCard.data);
    const navigate = useNavigate(); // Get navigate function from react-router-dom

    const count = fetchDashboardData?.annonymous?.count || 0;

    const handleClick = () => {
        navigate('/lami/annonymous-list');
    };

    return (
        <Box position="relative" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <MailIcon style={{ height: "37px", fontSize: "32px" }} />
            {count > 0 && (
                <Box position="absolute" top={-10} left={23} width={20} height={20} borderRadius="50%" display="flex" alignItems="center" justifyContent="center" sx={{ bgcolor: "#ffa500" }}>
                    <Typography sx={{ color: "white", fontWeight: "bold" }} variant="body1">{count}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default GoogleMailIcon;
