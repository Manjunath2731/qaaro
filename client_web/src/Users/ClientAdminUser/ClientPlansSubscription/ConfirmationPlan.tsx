import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

interface ConfirmationPopupPlanProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmationPopupPlan: React.FC<ConfirmationPopupPlanProps> = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogContent>
                <Typography variant="body1">Are you sure you want to buy this plan?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>No</Button>
                <Button onClick={onConfirm} color="primary">Yes</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationPopupPlan;
