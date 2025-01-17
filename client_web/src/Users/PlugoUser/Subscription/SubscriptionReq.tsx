import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'src/store';
import { RootState } from 'src/store';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Box,
    IconButton,
    Tooltip,
    Button
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { fetchSubscriptionRequest } from 'src/slices/Plans/SubscriptionReq';
import { approveSubscriptionRequest } from 'src/slices/Plans/ApprovePlan';
import { rejectSubscriptionRequest } from 'src/slices/Plans/RejectPlan';
import StatusLabel from 'src/components/Label/statusLabel';
import PageHeading from 'src/components/PageHeading/PageHeading';

const SubscriptionReq = () => {
    const dispatch = useDispatch();
    const { subscriptionDetails, status, error } = useSelector(
        (state: RootState) => state.subscriptionRequest
    );

    const [openDialog, setOpenDialog] = useState(false);
    const [currentAction, setCurrentAction] = useState<'approve' | 'reject' | null>(null);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchSubscriptionRequest());
    }, [dispatch]);

    const handleDialogOpen = (action: 'approve' | 'reject', requestId: string) => {
        setCurrentAction(action);
        setSelectedRequestId(requestId);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setCurrentAction(null);
        setSelectedRequestId(null);
    };

    const handleConfirm = () => {
        if (currentAction === 'approve' && selectedRequestId) {
            dispatch(approveSubscriptionRequest(selectedRequestId));
        } else if (currentAction === 'reject' && selectedRequestId) {
            dispatch(rejectSubscriptionRequest(selectedRequestId));
        }
        handleDialogClose();
    };

    const getStatusColor = (status: string): 'error' | 'warning' | 'success' | 'primary' => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'rejected':
                return 'error';
            case 'approved':
                return 'success';
            default:
                return 'primary'; // You can choose a default color from the allowed types
        }
    };

    return (
        <>
            <Box sx={{ margin: "30px" }}>
                <Box sx={{ mb: "20px" }}>
                    <PageHeading >Subscription Request</PageHeading>

                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>

                                <TableCell>Client Name</TableCell>
                                <TableCell>Request Type</TableCell>
                                <TableCell> Plan Type</TableCell>
                                <TableCell>Period</TableCell>
                                <TableCell>User Limit</TableCell>

                                <TableCell>Cost</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {status === 'loading' ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subscriptionDetails.map((detail, index) => (
                                    <TableRow key={detail._id}>
                                        <TableCell >
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>{detail.clientId?.[0]?.name}</TableCell> {/* Access the first clientId */}
                                        <TableCell>{detail.requestType}</TableCell> {/* Access the first planId */}
                                        <TableCell>{detail.planId?.[0]?.type}</TableCell>
                                        <TableCell>{detail.planId?.[0]?.period}</TableCell>
                                        <TableCell>{detail.planId?.[0]?.userLimit}</TableCell>

                                        <TableCell>{detail.planId?.[0]?.cost}</TableCell>
                                        <TableCell>
                                            <StatusLabel color={getStatusColor(detail.status)}>
                                                {detail.status}
                                            </StatusLabel>
                                        </TableCell>
                                        <TableCell>
                                            {detail.status === 'pending' && (
                                                <>
                                                    <Tooltip title="Approve">
                                                        <IconButton
                                                            color="success"
                                                            onClick={() => handleDialogOpen('approve', detail._id)}
                                                        >
                                                            <CheckCircleIcon sx={{ fontSize: "30px" }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Reject">
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleDialogOpen('reject', detail._id)}
                                                        >
                                                            <CancelIcon sx={{ fontSize: "30px" }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                            {status === 'failed' && (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        {error}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Confirmation Dialog */}
                    <Dialog open={openDialog} onClose={handleDialogClose}>
                        <DialogTitle sx={{ fontSize: "30px", fontWeight: "bold" }}>
                            Confirm {currentAction === 'approve' ? 'Approval' : 'Rejection'}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to {currentAction} this subscription request?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button variant='outlined' onClick={handleDialogClose} color="primary">
                                No
                            </Button>
                            <Button variant='contained' onClick={handleConfirm} color="primary" autoFocus>
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </TableContainer>
            </Box>
        </>
    );
};

export default SubscriptionReq;
