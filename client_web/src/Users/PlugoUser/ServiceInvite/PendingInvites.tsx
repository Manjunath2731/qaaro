import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/store'; // Adjust the import path as necessary
import { fetchInvitations } from '../../../slices/ServiceInviter/GetInviteList';
import { resendInvitation } from '../../../slices/ServiceInviter/Re-sendInvite'; // Import the resendInvitation action
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Link,
    CircularProgress,
    InputBase,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StatusLabel from 'src/components/Label/statusLabel';

interface Invitation {
    _id: string;
    email: string;
    invitationDate: string;
    registrationDate?: string;
    status: string;
    role: string;
}

const PendingInvites: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { invitations, status, error } = useSelector((state: RootState) => state.invitations);

    const [searchFilter, setSearchFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    // State to track resend timestamps and loading states
    const [resendTimestamps, setResendTimestamps] = useState<{ [key: string]: number }>({});
    const [resending, setResending] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchInvitations());
    }, [ ]);

    const handleResendInvite = async (emailId: string) => {
        setResending(emailId);
        await dispatch(resendInvitation(emailId));
        setResending(null);
        // Update resend timestamp
        setResendTimestamps((prev) => ({
            ...prev,
            [emailId]: Date.now()
        }));
        dispatch(fetchInvitations());
    };

    const canResend = (timestamp: number | undefined) => {
        if (!timestamp) return true;
        const currentTime = Date.now();
        return currentTime - timestamp >= 24 * 60 * 60 * 1000; // 24 hours
    };

    const timeSinceSent = (invitationDate: string) => {
        const currentTime = new Date();
        const inviteTime = new Date(invitationDate);
        const diffInMs = currentTime.getTime() - inviteTime.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);
        return diffInHours;
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    const filteredInvitations = invitations.filter((invite) => {
        return (
            (roleFilter === '' || invite.role === roleFilter)
        );
    });

    return (
        <Box sx={{ width: '100%', padding: '16px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '26px' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    Invites List
                </Typography>
            </Box>
            <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Invite Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Registered Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInvitations.length > 0 ? (
                            filteredInvitations.map((invite, index) => (
                                <TableRow key={invite._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{invite.email}</TableCell>
                                    <TableCell>{invite.role}</TableCell>
                                    <TableCell>
                                        {new Date(invite.invitationDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {invite.registrationDate && new Date(invite.registrationDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <StatusLabel color={invite.status === 'success' ? 'success' : 'error'}>
                                            {invite.status}
                                        </StatusLabel>
                                    </TableCell>
                                    <TableCell>
                                        {invite.status === 'pending' ? (
                                            resending === invite._id ? (
                                                <CircularProgress size={24} />
                                            ) : (
                                                <>
                                                    {timeSinceSent(invite.invitationDate) < 24 ? (
                                                        `Sent ${Math.floor(timeSinceSent(invite.invitationDate))} hour(s) ago`
                                                    ) : (
                                                        <span>
                                                            <Link
                                                                href="#"
                                                                color="primary"
                                                                underline="always"
                                                                onClick={() => canResend(resendTimestamps[invite._id]) && handleResendInvite(invite._id)}
                                                                sx={{
                                                                    pointerEvents: canResend(resendTimestamps[invite._id]) ? 'auto' : 'none',
                                                                    color: canResend(resendTimestamps[invite._id]) ? 'primary' : 'text.disabled',
                                                                    fontWeight: "bold"
                                                                }}
                                                            >
                                                                Re-send Invite
                                                            </Link>
                                                        </span>
                                                    )}
                                                </>
                                            )
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PendingInvites;
