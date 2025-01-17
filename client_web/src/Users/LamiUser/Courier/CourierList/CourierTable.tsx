import React, { FC, useEffect, useState } from 'react';
import {
    Box,
    InputAdornment,
    InputBase,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from '../../../../store';
import { RootState } from '../../../../store/rootReducer';
import { fetchLamiCouriers } from '../../../../slices/LaMiCourierList/CourierGet';
import { deleteLamiCourier } from '../../../../slices/LaMiCourierList/CourierDelete';
import DeleteConfirmationPopup from '../../../../components/DeleteConfirmation/Deletion';
import ListCard from 'src/components/ListCard/ListCard';
// import EditCourierStatusForm from './EditCourier';
import { generateCourierPassword } from 'src/slices/LaMiCourierList/GeneratePassword';
import GenerateConfirmation from 'src/components/DeleteConfirmation/GenerateConfirmation';

interface CourierListTableProps {
    className?: string;
}

const CourierListTable: FC<CourierListTableProps> = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const theme = useTheme();
    const courierDelete = useSelector((state: any) => state.courierDelete.status);

    useEffect(() => {
        dispatch(fetchLamiCouriers());
    }, [dispatch]);

    const { couriers, status } = useSelector((state: RootState) => state.courier);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedCourierId, setSelectedCourierId] = useState('');
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [generateConfirm, setGenerateConfirm] = useState(false);

    const [searchFilter, setSearchFilter] = useState<string>('');

    const [selectedCourierData, setSelectedCourierData] = useState<any>(null); // State to hold selected courier data

    const handleEditClick = (courierId: string, status: 'active' | 'inactive') => {
        // Find the selected courier by ID
        const selectedCourier = couriers.find(courier => courier._id === courierId);
        if (selectedCourier) {
            // Open the edit dialog
            setSelectedCourierData(selectedCourier);
            setEditDialogOpen(true);
        }
    };

    const handleDeleteClick = (courierId: string) => {
        setSelectedCourierId(courierId);
        setDeleteConfirmationOpen(true);
    };

    const handleCloseDeleteConfirmation = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleCloseGenerateConfirmation = () => {
        setGenerateConfirm(false);
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteLamiCourier(selectedCourierId))
            .then(() => {
                dispatch(fetchLamiCouriers());
                setDeleteConfirmationOpen(false);
            });
    };

    const handleGenerate = (courierId: string) => {
        setSelectedCourierId(courierId);
        setGenerateConfirm(true);
    };

    // Responsive breakpoints
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isXLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    const cardWidth = (isLargeScreen || isXLargeScreen) ? 'calc(50%)' : 'calc(100%)';

    return (
        <>
            <Box sx={{ padding: '45px', mb: "-70px", mt: "-130px", mr: "60px", display: 'flex', justifyContent: "right" }}>
                <Box sx={{ width: 'fit-content' }}>
                    <InputBase
                        placeholder={t('nameOrPhone')}
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        name={`search_${Math.random().toString(36).substr(2, 9)}`} // Randomize name attribute
                        id={`search_${Math.random().toString(36).substr(2, 9)}`} // Randomize id attribute
                        sx={{
                            width: '250px',
                            '& input': { px: 0, color: 'black' },
                            '& .MuiInputBase-input': { textAlign: 'center' },
                            backgroundColor: '#ffffff',
                            borderRadius: '20px 20px 20px 20px',
                            boxShadow: 'none',
                            pt: '6px',
                            pb: '6px',
                            pl: '10px',
                            pr: '10px',
                            border: '1.5px solid #A6C4E7',
                            color: '#007bff',
                        }}
                        startAdornment={(
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )}
                    />


                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '40px' }}>
                {status === 'loading' ? (
                    <Box>Loading...</Box>
                ) : status === 'failed' || !couriers || couriers.length === 0 ? (
                    <Box>Error: No data available</Box>
                ) : (
                    couriers
                        .filter(courier =>
                            courier.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            `${courier.mobile}`.includes(searchFilter)
                        )
                        .map((courier, index) => (
                            <Box key={courier._id} sx={{ width: cardWidth }}>
                                <ListCard
                                    name={courier.name}
                                    status={courier.status}
                                    designation={courier.designation}
                                    phone={courier.mobile}
                                    email={courier.email}
                                    onEditClick={() => handleEditClick(courier._id, courier.status)}
                                    onDeleteClick={() => handleDeleteClick(courier._id)}
                                    onGenerateClick={() => handleGenerate(courier._id)}
                                    avatar={courier.avatar.url}
                                />
                            </Box>
                        ))
                )}
            </Box>

            <DeleteConfirmationPopup
                open={deleteConfirmationOpen}
                onClose={handleCloseDeleteConfirmation}
                onConfirm={handleDeleteConfirm}
                status={courierDelete}
            />

            <GenerateConfirmation
                open={generateConfirm}
                onClose={handleCloseGenerateConfirmation}
                onConfirm={() => {
                    dispatch(generateCourierPassword(selectedCourierId))
                        .then(() => {
                            dispatch(fetchLamiCouriers());
                            setGenerateConfirm(false);
                        });
                }}
            />

            {/* {editDialogOpen && selectedCourierData && (
                // <EditCourierStatusForm
                //     open={editDialogOpen}
                //     onClose={() => setEditDialogOpen(false)}
                //     courierData={selectedCourierData}
                // />
            )} */}
        </>
    );
};

export default CourierListTable;
