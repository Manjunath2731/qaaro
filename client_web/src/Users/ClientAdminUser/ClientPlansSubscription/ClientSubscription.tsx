import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'src/store';
import { Box, Card, Typography, Button, ToggleButtonGroup, ToggleButton, Radio, RadioGroup, FormControlLabel, FormControl, CardContent, CircularProgress, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Lottie from 'react-lottie';
import { RootState } from 'src/store';
import plan from 'src/Animations/plan.json';
import { fetchSubscriptionPlans } from 'src/slices/Plans/GetPlans';
import { createSubscription } from 'src/slices/Plans/BuyPlans';
import { useNavigate } from 'react-router-dom';
import SubscribedPlanCard from '../Dashboard/SubscribedPlanCard';

// Define the Plan type
type Plan = {
    _id: string;
    type: string;
    cost: number;
    period: 'monthly' | 'yearly' | '2yearly';
    band: 'BND1' | 'BND2' | 'BND3';
    // Add any other fields relevant to your Plan structure
};

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: plan,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};

const PlanCard: React.FC<{ plan: Plan, selectedPlan: string, handlePlanChange: (event: React.ChangeEvent<HTMLInputElement>) => void, onOpenDialog: (planId: string) => void }> = ({ plan, selectedPlan, handlePlanChange, onOpenDialog }) => {
    const features = {
        basic: ['2TB additional storage', 'Up to 1GB file size', 'Up to 5 projects'],
        advance: ['10TB additional storage', 'Up to 2GB file size', 'Up to 10 projects'],
        premium: ['20TB additional storage', 'Up to 4GB file size', 'Up to 20 projects'],
    };

    return (
        <Card
            sx={{
                position: 'relative',
                padding: '24px',
                borderRadius: '24px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                minWidth: '300px',
                maxWidth: '350px',
            }}
        >
            {plan.type === 'premium' && (
                <Box sx={{ position: 'absolute', top: 0, left: 0, padding: '8px' }}>
                    <Lottie options={defaultOptions} height={60} width={60} />
                </Box>
            )}
            <CardContent>
                <FormControl component="fieldset">
                    <RadioGroup name="plan" value={selectedPlan} onChange={handlePlanChange}>
                        <FormControlLabel
                            value={plan._id}
                            control={<Radio sx={{
                                color: plan.type === 'basic' ? 'green' : plan.type === 'advance' ? 'violet' : 'blue',
                                '&.Mui-checked': { color: plan.type === 'basic' ? 'green' : plan.type === 'advance' ? 'violet' : 'blue' },
                            }} />}
                            label={
                                <Typography variant="h6" sx={{ color: plan.type === 'basic' ? 'green' : plan.type === 'advance' ? 'violet' : 'blue', fontWeight: 'bold', marginBottom: '8px' }}>
                                    {plan.type === 'basic' ? 'Basic Plan' : plan.type === 'advance' ? 'Standard Plan' : 'Premium Plan'}
                                </Typography>
                            }
                        />
                    </RadioGroup>
                </FormControl>

                <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
                    ${plan.cost}
                </Typography>
                <Box>
                    {features[plan.type as keyof typeof features].map((feature, index) => (
                        <Typography key={index} variant="body2" sx={{ margin: '8px 0', display: 'flex', alignItems: 'center' }}>
                            <AddIcon sx={{ color: 'gold', marginRight: '8px' }} />
                            {feature}
                        </Typography>
                    ))}
                </Box>
                <Button
                    variant="outlined"
                    sx={{ marginTop: '16px', borderColor: 'green', color: 'green' }}
                    onClick={() => onOpenDialog(plan._id)}
                    disabled={selectedPlan !== plan._id} // Disable button if the plan is not selected
                >
                    Apply
                </Button>
            </CardContent>
        </Card>
    );
};


const ClientSubscription: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { plans, status } = useSelector((state: RootState) => state.subscription);
    const [selectedDuration, setSelectedDuration] = useState<string>('monthly');
    const [selectedCourierOption, setSelectedCourierOption] = useState<string>('BND1');
    const [selectedPlan, setSelectedPlan] = useState<string>('');
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedPlanId, setSelectedPlanId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        dispatch(fetchSubscriptionPlans());
    }, [dispatch]);

    const filteredPlans = plans.filter(plan =>
        plan.period === selectedDuration && plan.band === selectedCourierOption
    ) as Plan[];

    const handleDurationChange = (event: React.MouseEvent<HTMLElement>, newDuration: string | null) => {
        if (newDuration !== null) {
            setSelectedDuration(newDuration);
        }
    };

    const handleCourierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedCourierOption((event.target as HTMLInputElement).value);
    };

    const handlePlanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPlan((event.target as HTMLInputElement).value);
        // Set the selected plan ID when the plan changes
        const selectedPlan = plans.find(plan => plan._id === (event.target as HTMLInputElement).value);
        if (selectedPlan) {
            setSelectedPlanId(selectedPlan._id);
        }
    };

    const handleOpenDialog = (planId: string) => {
        setSelectedPlanId(planId);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleConfirm = () => {
        setLoading(true);
        dispatch(createSubscription({ planId: selectedPlanId, type: 'NEW' }))
            .then(() => {
                setLoading(false);
                dispatch(fetchSubscriptionPlans());

            })
            .catch(() => {
                setLoading(false);
                // Optionally handle error case
            });
        setDialogOpen(false);
    };

    return (
        <>
            <Box sx={{
                padding: '32px',
                borderRadius: '20px',
                maxWidth: '1300px',
                margin: 'auto',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                marginTop: "30px",
                textAlign: 'center',
            }}>
                <SubscribedPlanCard />

            </Box>

            <Card sx={{
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                padding: '32px',
                borderRadius: '32px',
                backgroundColor: '#fff',
                maxWidth: '1300px',
                margin: 'auto',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                marginTop: "20px",
                textAlign: 'center',
            }}>


                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '16px' }}>
                    <ToggleButtonGroup
                        value={selectedDuration}
                        exclusive
                        onChange={handleDurationChange}
                        sx={{ marginBottom: '24px' }}
                    >
                        <ToggleButton value="monthly" sx={{ borderRadius: '20px', padding: '8px 16px' }}>
                            Monthly
                        </ToggleButton>
                        <ToggleButton value="yearly" sx={{ borderRadius: '20px', padding: '8px 16px' }}>
                            Yearly
                        </ToggleButton>
                        <ToggleButton value="2yearly" sx={{ borderRadius: '20px', padding: '8px 16px' }}>
                            2-Yearly
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <FormControl component="fieldset" sx={{ marginBottom: '24px' }}>
                        <RadioGroup row name="courierOptions" value={selectedCourierOption} onChange={handleCourierChange}>
                            <FormControlLabel value="BND1" control={<Radio />} label="1000 Couriers" />
                            <FormControlLabel value="BND2" control={<Radio />} label="10000 Couriers" />
                            <FormControlLabel value="BND3" control={<Radio />} label="20000 Couriers" />
                        </RadioGroup>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {filteredPlans.map((plan) => (
                            <PlanCard
                                key={plan._id}
                                plan={plan}
                                selectedPlan={selectedPlan}
                                handlePlanChange={handlePlanChange}
                                onOpenDialog={handleOpenDialog}
                            />
                        ))}
                    </Box>
                </Box>

                <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                    <DialogTitle>Confirm Subscription</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2">
                            Are you sure you want to subscribe to this plan?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' onClick={handleCloseDialog}>Cancel</Button>
                        <Button
                            onClick={handleConfirm}
                            variant="contained"
                            color="primary"
                        >
                            {loading ? <CircularProgress size={24} /> : 'Confirm'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </>
    );
};

export default ClientSubscription;
