import React, { useState } from 'react';
import { Box, Select, MenuItem, Typography, useMediaQuery, Theme } from '@mui/material';
import PageHeading from 'src/components/PageHeading/PageHeading';
import { useDispatch, useSelector } from '../../../../../store';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import ReturnToLoco from 'src/components/ReturnToLoco/ReturnLocoPop';
import CourierSelectionPopup from '../AssignConfirmation';
import { assignCourierToTicket } from 'src/slices/Ticket/AssignCourier';
import FinalizeConfirmation from '../LostSuccessConfirmation';
import CourierReturn from './ReturnCourier';
import { reassignCourierToTicket } from 'src/slices/Ticket/Re-AssignCourier';
import SendEmail from './SendEmail';
import AttachInvoice from './AttachInvoice';
import ClaimInsurance from '../ClaimInsuarance';
import InsuranceOk from './InsuOk';
import NoClaim from './NoCLaim';
import InsuranceReject from '../InsuRejec';
import { fetchTicketList } from 'src/slices/Ticket/GetTicketList';
import ContactUser from '../ContactUser';

const Header: React.FC = () => {
    const { t } = useTranslation();
    const { ticketId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const ticketDetails = useSelector((state) => state.ticketDetails.ticketDetails);

    const [selectedAction, setSelectedAction] = useState('');
    const [selectedTicketId, setSelectedTicketId] = useState('');

    const [openReturnToLocoPopup, setOpenReturnToLocoPopup] = useState(false);
    const [openCourierSelection, setOpenCourierSelection] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [openCourierReturn, setOpenCourierReturn] = useState(false);
    const [openAttachInvoice, setOpenAttachInvoice] = useState(false);
    const [openClaimInsuarance, setOpenClaimInsuarance] = useState(false);
    const [openClaimInsuaranceNo, setOpenClaimInsuaranceNo] = useState(false);
    const [openInsureject, setOpenInsureject] = useState(false);
    const [openInsu, setOpenInsu] = useState(false);

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const handleConfirmAction = (action: string) => {
        setSelectedAction(action);
        // Check the selected action and handle accordingly
        if (action === 'markFinalization' && ticketDetails?.status === 'LOCO') {
            setOpenConfirmation(true); // Open Mark Success Lost confirmation
        } else if (action === 'reAssignCourier') {
            setOpenCourierReturn(true); // Open Return To Courier dialog
        } else if (action === 'contactCustomer') {
            // Handle opening Contact Customer dialog
            setOpenContactCustomer(true);
        }
    };

    const handleReturnToLoco = (event: React.MouseEvent<HTMLLIElement>, ticketId: string) => {
        setSelectedTicketId(ticketId);
        setOpenReturnToLocoPopup(true);
    };

    const handleOpenCourierSelection = () => {
        setOpenCourierSelection(true);
    };

    const handleAssignDescription = (courierId: string, description: string) => {
        dispatch(assignCourierToTicket({ ticketId, courierId, description }));
        setOpenCourierSelection(false);
    };

    const handleCloseCourierSelection = () => {
        setOpenCourierSelection(false);
    };

    const handleReAssignCourier = async (description: string) => {
        try {
            const { _id: ticketId, courierdata: { _id: courierId } } = ticketDetails;
            const actionValue = await dispatch(reassignCourierToTicket({ ticketId, courierId, description }));

            if (reassignCourierToTicket.fulfilled.match(actionValue)) {
                setOpenCourierReturn(false);
                navigate(`/lami/ticket-ticket_list`);
                dispatch(fetchTicketList());
            } else {
                console.error('Failed to reassign courier to ticket:', actionValue);
            }
        } catch (error) {
            console.error('Error reassigning courier to ticket:', error);
        }
    };

    const handleCloseFinalizeConfirmation = () => {
        setOpenConfirmation(false);
        setSelectedAction('');
    };

    const [openContactCustomer, setOpenContactCustomer] = useState(false);

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                flexDirection={isSmallScreen ? "column" : "row"}
                alignItems={isSmallScreen ? "flex-start" : "center"}
                mb={2}
            >
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'left', gap: "12px", flexDirection: "column", flexWrap: "wrap" }}>
                        <Box sx={{ fontFamily: "monospace" }}>
                            <PageHeading>{t('ticketDetails')}</PageHeading>
                        </Box>
                        <Box>
                            <Typography variant='h3' sx={{ color: "#b1b1b1" }}>
                                {ticketDetails?.complainNumber}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ display: "flex" }}>
                    <Box display="flex" sx={{ marginTop: "1px", marginRight: "30px" }}>
                        {/* LOCO status actions */}
                        {ticketDetails?.status === 'LOCO' && (
                            <Select
                                value={selectedAction}
                                onChange={(e) => handleConfirmAction(e.target.value)}
                                displayEmpty
                                sx={selectStyles}
                                renderValue={(selected) => selected === '' ? <em>{t('selectAction')}</em> : selected}
                            >
                                <MenuItem value="" disabled><em>{t('selectAction')}</em></MenuItem>
                                {ticketDetails.courierdata === null ? (
                                    <MenuItem value="assignToDriver" onClick={handleOpenCourierSelection}>{t('assignCourier')}</MenuItem>
                                ) : (
                                    <>
                                        <MenuItem value="reAssignCourier" onClick={() => setOpenCourierReturn(true)}>{t('reassignToCourier')}</MenuItem>
                                        <MenuItem value="contactCustomer" onClick={() => setOpenContactCustomer(true)}>{t('contactCustomer')}</MenuItem>
                                    </>
                                )}
                                <MenuItem value="markFinalization">{t('locoSuccessLost')}</MenuItem>
                            </Select>
                        )}

                        {/* PRELOCO status actions */}
                        {ticketDetails?.status === 'PRELOCO' && (
                            <Select
                                value=""
                                displayEmpty
                                sx={selectStyles}
                                renderValue={(selected) => selected === '' ? <em>{t('selectAction')}</em> : selected}
                            >
                                <MenuItem value="" disabled><em>{t('selectAction')}</em></MenuItem>
                                <MenuItem value="returnToLoco" onClick={(event) => handleReturnToLoco(event, ticketId)}>{t('returnToLoco')}</MenuItem>
                                <MenuItem value="reAssignCourier" onClick={() => setOpenCourierReturn(true)}>{t("reassignToCourier")}</MenuItem>
                                <MenuItem value="contactCustomer" onClick={() => setOpenContactCustomer(true)}>{t('contactCustomer')}</MenuItem>
                            </Select>
                        )}

                        {/* NEW status actions */}
                        {ticketDetails?.status === 'NEW' && (
                            <Select
                                value=""
                                displayEmpty
                                sx={selectStyles}
                                renderValue={(selected) => selected === '' ? <em>{t('selectAction')}</em> : selected}
                            >
                                <MenuItem value="" disabled><em>{t('selectAction')}</em></MenuItem>
                                <MenuItem value="returnToLoco" onClick={(event) => handleReturnToLoco(event, ticketId)}>{t('returnToLoco')}</MenuItem>
                                <MenuItem value="assignToDriver" onClick={handleOpenCourierSelection}>{t('assignCourier')}</MenuItem>
                            </Select>
                        )}

                        {/* LOCO LOST status actions */}
                        {ticketDetails?.status === 'LOCO LOST' && (
                            <Select
                                value=""
                                displayEmpty
                                sx={selectStyles}
                                renderValue={(selected) => selected === '' ? <em>{t('selectAction')}</em> : selected}
                            >
                                <MenuItem value="" disabled><em>{t('selectAction')}</em></MenuItem>
                                <MenuItem value="attachInvoice" onClick={() => setOpenAttachInvoice(true)}>{t("attach")} {t("invoice")}</MenuItem>
                            </Select>
                        )}

                        {/* INVOICED status actions */}
                        {ticketDetails?.status === 'INVOICED' && (
                            <Select
                                value=""
                                displayEmpty
                                sx={selectStyles}
                                renderValue={(selected) => selected === '' ? <em>{t('selectAction')}</em> : selected}
                            >
                                <MenuItem value="" disabled><em>{t('selectAction')}</em></MenuItem>
                                <MenuItem value="claimInsuarance" onClick={() => setOpenClaimInsuarance(true)}>{t('claimInsu')}</MenuItem>
                                <MenuItem value="claimInsuarance" onClick={() => setOpenClaimInsuaranceNo(true)}>{t('noInsurance')}</MenuItem>
                            </Select>
                        )}

                        {/* INSURANCE status actions */}
                        {ticketDetails?.status === 'INSURANCE' && (
                            <Select
                                value=""
                                displayEmpty
                                sx={selectStyles}
                                renderValue={(selected) => selected === '' ? <em>{t('selectAction')}</em> : selected}
                            >
                                <MenuItem value="" disabled><em>{t('selectAction')}</em></MenuItem>
                                <MenuItem value="claimInsuarance" onClick={() => setOpenInsureject(true)}>{t('insuApprove')}</MenuItem>
                                <MenuItem value="claimInsuarance" onClick={() => setOpenInsu(true)}>{t('insuReject')}</MenuItem>
                            </Select>
                        )}
                    </Box>
                    <Box sx={{ mt: "10px" }}>
                        <SendEmail />
                    </Box>
                </Box>
            </Box>

            {/* Popups */}
            <ReturnToLoco
                open={openReturnToLocoPopup}
                onClose={() => setOpenReturnToLocoPopup(false)}
                ticketId={selectedTicketId}
            />
            <CourierSelectionPopup
                open={openCourierSelection}
                onClose={handleCloseCourierSelection}
                onSend={handleAssignDescription}
            />
            <FinalizeConfirmation
                open={openConfirmation}
                onClose={handleCloseFinalizeConfirmation}
                ticketId={ticketId}
            />
            <CourierReturn
                open={openCourierReturn}
                onClose={() => setOpenCourierReturn(false)}
                onReAssign={handleReAssignCourier}
            />
            <AttachInvoice
                open={openAttachInvoice}
                onClose={() => setOpenAttachInvoice(false)}
            />
            <ClaimInsurance
                open={openClaimInsuarance}
                onClose={() => setOpenClaimInsuarance(false)}
            />
            <NoClaim
                open={openClaimInsuaranceNo}
                onClose={() => setOpenClaimInsuaranceNo(false)}
            />
            <InsuranceOk
                open={openInsureject}
                onClose={() => setOpenInsureject(false)}
            />
            <InsuranceReject
                open={openInsu}
                onClose={() => setOpenInsu(false)}
            />

            {/* Contact Customer Dialog */}
            <ContactUser open={openContactCustomer} onClose={() => setOpenContactCustomer(false)} />
        </>
    );
};

const selectStyles = {
    '& input': { px: 0, textAlign: 'center', color: 'black' },
    '& .MuiSelect-select': { textAlign: 'center' },
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: 'none',
    pt: '0px',
    pb: '0px',
    pl: '10px',
    pr: '10px',
    border: '1.5px solid #A6C4E7',
    color: '#007bff',
    width: '200px',
    height: '43px',
    '&:focus': {
        backgroundColor: '#ffffff',
        borderColor: '#A6C4E7 !important',
        boxShadow: 'none',
    },
};

export default Header;
