// import React, { useEffect, useState } from 'react';
// import { Box, SelectChangeEvent, Typography } from '@mui/material';
// import {
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogContentText,
//     DialogTitle,
//     FormControl,
//     InputLabel,
//     MenuItem,
//     Select,
//     TextField,
// } from '@mui/material';
// import { useTranslation } from 'react-i18next';
// import { RootState } from '../../../../store/rootReducer'; // Import RootState type
// import { useSelector, useDispatch } from '../../../../store';
// import { ErrorOutline } from '@mui/icons-material';
// import { updateLamiCourier } from 'src/slices/LaMiCourierList/CourierUpdate'; // Import the updateLamiCourier thunk
// import { fetchLamiCouriers } from 'src/slices/LaMiCourierList/CourierGet';

// interface EditCourierStatusFormProps {
//     open: boolean;
//     onClose: () => void;
//     courierData: any;
// }

// const EditCourierStatusForm: React.FC<EditCourierStatusFormProps> = ({ open, onClose, courierData }) => {
//     const { t } = useTranslation();
//     const dispatch = useDispatch(); // Get the dispatch function

//     const adminStatus = useSelector((state: RootState) => state.courierUpdate.status); // Use RootState
//     const errorMessage = useSelector((state: RootState) => state.courierUpdate.error); // Get error message from Redux store

//     const [status, setStatus] = useState<'active' | 'inactive'>(courierData.status); // Initialize status with courierData
//     const [name, setName] = useState<string>(courierData.name); // Initialize name with courierData
//     const [mobile, setMobile] = useState<number>(courierData.mobile); // Initialize mobile with courierData
//     const [address, setAddress] = useState<string>(courierData.address); // Initialize address with courierData
//     const [designation, setDesignation] = useState<string>(courierData.designation); // Initialize designation with courierData

//     const [showErrorMessage, setShowErrorMessage] = useState(false); // State to control visibility of error message box

//     const handleStatusChange = (event: SelectChangeEvent<'active' | 'inactive'>) => {
//         setStatus(event.target.value as 'active' | 'inactive');
//     };

//     const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setName(event.target.value);
//     };
//     const handleMobileChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const newValue: string = event.target.value;
//         if (newValue === '' || !isNaN(parseInt(newValue, 10))) {
//             if (newValue === '') {
//                 setMobile('' as any); // Temporarily cast the empty string to any type
//             } else {
//                 setMobile(parseInt(newValue, 10)); // Parse and set the state with the parsed integer
//             }
//         }
//     };








//     const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setAddress(event.target.value);
//     };

//     const handleDesignationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setDesignation(event.target.value);
//     };

//     const handleSubmit = async () => {
//         // Dispatch the updateLamiCourier thunk action with the payload data
//         const actionResult = await dispatch(updateLamiCourier({ lamiCourierId: courierData._id, payload: { name, mobile, address, status, designation } }));

//         if (updateLamiCourier.fulfilled.match(actionResult)) {
//             dispatch(fetchLamiCouriers())
//             onClose()

//         }



//     };

//     //FORM VALIDATION 
//     const areRequiredFieldsEmpty = () => {
//         return !name || !designation || !mobile || !status;
//     };



//     const transformErrorMessage = (errorMessage: string): string => {
//         switch (errorMessage) {
//             case 'phone_duplicate':
//                 return 'Please check your Phone No. This one is already in use !'
//             default:
//                 return 'Something went wrong. Please try again.';
//         }
//     };

//     useEffect(() => {
//         if (adminStatus === 'failed') {
//             setShowErrorMessage(true);
//             const timer = setTimeout(() => {
//                 setShowErrorMessage(false);
//             }, 5000);
//             return () => clearTimeout(timer);
//         }
//     }, [adminStatus]);

//     return (
//         <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
//             <DialogTitle sx={{ fontWeight: "800", fontSize: "20px" }}>{t('edit')} {t('couriers')} Status</DialogTitle>
//             <DialogContent>
//                 <DialogContentText sx={{ mb: "10px", fontWeight: "600" }}>
//                     {t('pleaseProvideBelowDetails')}:
//                 </DialogContentText>

//                 {showErrorMessage && (
//                     <Box sx={{ mt: "10px", mb: "10px", bgcolor: "#ffede9" }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', color: 'red', padding: '5px' }}>
//                             <ErrorOutline sx={{ mr: 1 }} />
//                             <Typography variant='body1'>
//                                 {transformErrorMessage(errorMessage)}
//                             </Typography>
//                         </Box>
//                     </Box>
//                 )}

//                 <TextField
//                     margin="dense"
//                     fullWidth
//                     id="name"
//                     label={t('Name')}
//                     type="text"
//                     value={name}
//                     onChange={handleNameChange}
//                 />
//                 <TextField
//                     margin="dense"
//                     fullWidth
//                     id="designation"
//                     label={t('Route No.')}
//                     type="text"
//                     value={designation}
//                     onChange={handleDesignationChange}
//                 />
//                 <TextField
//                     margin="dense"
//                     fullWidth
//                     id="mobile"
//                     label={t('phone')}
//                     type="number"
//                     value={mobile}
//                     onChange={(e) => {
//                         handleMobileChange(e); // Corrected line
//                     }}

//                 />
//                 <TextField
//                     margin="dense"
//                     fullWidth
//                     id="address"
//                     label={t('address')}
//                     type="text"
//                     value={address}
//                     onChange={handleAddressChange}
//                 />

//                 <FormControl fullWidth margin="dense" variant="outlined">
//                     <InputLabel id="status-label">{t('statustt')}</InputLabel>
//                     <Select
//                         labelId="status-label"
//                         value={status}
//                         onChange={handleStatusChange}
//                         label={t('statustt')}
//                     >
//                         <MenuItem value="active">{t('active')}</MenuItem>
//                         <MenuItem value="inactive">{t('inactive')}</MenuItem>
//                     </Select>
//                 </FormControl>
//             </DialogContent>
//             <DialogActions>
//                 <Button variant='outlined' onClick={onClose}>
//                     {t('cancel')}
//                 </Button>
//                 <Button onClick={handleSubmit} variant='contained' color="primary"
//                     disabled={areRequiredFieldsEmpty()}
//                 >{t('send')}</Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// export default EditCourierStatusForm;
