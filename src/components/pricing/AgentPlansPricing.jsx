import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Paper,
    Stack,
    Typography,
} from '@mui/material'; 
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';

const VENDOR_SUBSCRIPTION_PLANS_ENDPOINT = '/vendor/subscriptions/plans';
const VENDOR_SUBSCRIPTION_CHECKOUT_ENDPOINT = '/vendor/subscriptions/checkout';

function extractSubscriptionPlans(data) {
    if (!data) return [];
    if (data.data?.subscriptions) return data.data.subscriptions;
    if (data.data?.vendorSubscriptions) return data.data.vendorSubscriptions;
    if (data.data?.items) return data.data.items;
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
}

function parseJsonObject(value) {
    if (!value || typeof value !== 'string') return value;

    try {
        const parsedValue = JSON.parse(value);
        return parsedValue && typeof parsedValue === 'object' ? parsedValue : {};
    } catch {
        return {};
    }
}

function getVendorSubscriptionId(apiPlan) {
    return apiPlan.vendorSubscriptionId
        || apiPlan.vendor_subscription_id
        || apiPlan.subscriptionId
        || apiPlan.subscription_id
        || apiPlan.id
        || apiPlan._id;
}

function getPlanDetails(apiPlan) {
    return apiPlan.subscriptionPlan
        || apiPlan.subscription_plan
        || apiPlan.plan
        || apiPlan.planDetails
        || apiPlan.plan_details
        || apiPlan;
}

function mapSubscriptionPlan(apiPlan) {
    const planDetails = getPlanDetails(apiPlan);
    const displayContent = parseJsonObject(planDetails.displayContent || planDetails.display_content) || {};
    const vendorSubscriptionId = getVendorSubscriptionId(apiPlan);
    const isCurrentPlan = apiPlan.isCurrentPlan === true || apiPlan.is_current_plan === true;

    return {
        id: vendorSubscriptionId,
        vendorSubscriptionId,
        planId: planDetails.id || planDetails._id || planDetails.planId || planDetails.plan_id,
        name: planDetails.name,
        slug: planDetails.slug,
        description: planDetails.description,
        price: formatPrice(planDetails.offerPriceInPaise ?? planDetails.offer_price_in_paise ?? planDetails.salePriceInPaise ?? planDetails.sale_price_in_paise),
        regularPrice: formatPrice(planDetails.salePriceInPaise ?? planDetails.sale_price_in_paise),
        billingLabel: getBillingLabel(planDetails.billingCycle || planDetails.billing_cycle),
        credits: `${planDetails.includedCredits ?? planDetails.included_credits ?? 0} Credits`,
        maxPackages: (planDetails.maxPackages ?? planDetails.max_packages) === -1 ? 'Unlimited' : planDetails.maxPackages ?? planDetails.max_packages,
        summary: planDetails.description,
        badge: displayContent.badgeText || displayContent.badge_text || null,
        ribbonText: displayContent.ribbonText || displayContent.ribbon_text || null,
        accent: displayContent.themeColor || displayContent.theme_color || '#3446f1',
        bg: `${displayContent.themeColor || displayContent.theme_color || '#3446f1'}15`,
        featured: planDetails.isFeatured || planDetails.is_featured || false,
        features: displayContent.features || planDetails.features || [],
        ctaButtonText: displayContent.ctaButtonText || displayContent.cta_button_text || `Choose ${planDetails.name}`,
        buttonLabel: apiPlan.buttonLabel || apiPlan.button_label || displayContent.buttonLabel || displayContent.button_label || null,
        iconUrl: displayContent.iconUrl || displayContent.icon_url || null,
        displayOrder: planDetails.displayOrder ?? planDetails.display_order ?? 0,
        isCurrentPlan,
        action: apiPlan.action || apiPlan.subscriptionAction || apiPlan.subscription_action || null,
        originalData: apiPlan,
    };
}

function getPlanActionLabel(plan) {
    if (plan.buttonLabel) return plan.buttonLabel;
    if (plan.isCurrentPlan) return 'Active Plan';

    switch (String(plan.action || '').toUpperCase()) {
        case 'BUY':
            return 'Buy';
        case 'UPGRADE':
            return 'Upgrade';
        case 'DOWNGRADE':
            return 'Downgrade';
        case 'RENEW':
            return 'Renew';
        default:
            return plan.ctaButtonText || `Buy ${plan.name.replace(' Plan', '')}`;
    }
}

function canPurchasePlan(plan) {
    return plan.isCurrentPlan !== true;
}

function formatPrice(priceInPaise) {
    if (!priceInPaise) return '0';
    return (priceInPaise / 100).toLocaleString('en-IN');
}

function getBillingLabel(billingCycle) {
    switch (billingCycle) {
        case 'MONTHLY': return '/month';
        case 'YEARLY': return '/year';
        case 'LIFETIME': return '/lifetime';
        default: return '';
    }
}

function sortSubscriptionPlans(plans) {
    return [...plans].sort((a, b) => a.displayOrder - b.displayOrder);
}

function getApiErrorMessage(error, fallback) {
    if (error.response) {
        return error.response.data?.message || error.response.data?.error || error.response.statusText || fallback;
    }
    if (error.request) {
        return 'No response from server. Please check your network connection.';
    }
    return error.message || fallback;
}

// Single place that calls the plans endpoint and returns ready-to-render plans.
// isCurrentPlan on each mapped plan comes straight from the API's isCurrentPlan field.
async function fetchSubscriptionPlans() {
    const response = await MainApi.get(VENDOR_SUBSCRIPTION_PLANS_ENDPOINT);
    const extractedPlans = extractSubscriptionPlans(response?.data);
    const mappedPlans = extractedPlans.map(mapSubscriptionPlan);
    return sortSubscriptionPlans(mappedPlans);
}

async function purchaseSubscriptionPlan(planId) {
    const response = await MainApi.post(VENDOR_SUBSCRIPTION_CHECKOUT_ENDPOINT, {
        planId,
        autoRenew: false,
    });
    return response.data;
}

export default function AgentPlansPricing() {
    const [plans, setPlans] = useState([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);
    const [purchasingPlanId, setPurchasingPlanId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            setIsLoadingPlans(true);
            setError(null);
            try {
                const sortedPlans = await fetchSubscriptionPlans();
                if (isMounted) setPlans(sortedPlans);
            } catch (err) {
                if (isMounted) {
                    setError(getApiErrorMessage(err, 'Failed to load subscription plans'));
                    setPlans([]);
                }
            } finally {
                if (isMounted) setIsLoadingPlans(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleBuyPlan = async (plan) => {
        const checkoutPlanId = plan?.planId || plan?.id;
        if (!checkoutPlanId || purchasingPlanId || !canPurchasePlan(plan)) return;

        setPurchasingPlanId(plan.id);

        try {
            const response = await purchaseSubscriptionPlan(checkoutPlanId);
            await Swal.fire({
                icon: 'success',
                title: 'Subscription activated',
                text: response?.message || `You have successfully subscribed to ${plan.name}.`,
                confirmButtonText: 'OK',
            });

            // Re-fetch so isCurrentPlan reflects the newly purchased plan.
            const refreshedPlans = await fetchSubscriptionPlans();
            setPlans(refreshedPlans);
        } catch (err) {
            await Swal.fire({
                icon: 'error',
                title: 'Purchase failed',
                text: getApiErrorMessage(err, 'Failed to purchase the selected plan.'),
                confirmButtonText: 'OK',
            });
        } finally {
            setPurchasingPlanId(null);
        }
    };

    return (
        <Box sx={{ width: '100%', minHeight: 'calc(100dvh - 112px)', bgcolor: '#f6f7fb', p: 0 }}>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 2,
                    border: '1px solid #e6eaf0',
                    boxShadow: '0 2px 8px rgba(31,45,61,0.06)',
                    bgcolor: '#fff',
                    p: { xs: 1.25, md: 1.5 },
                }}
            >
                <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" spacing={1.25} sx={{ mb: 2, width: '100%' }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ color: '#172b4d', fontSize: { xs: 18, md: 20 }, fontWeight: 600, lineHeight: 1.2 }}>
                            Pricing Plans
                        </Typography>
                        <Typography sx={{ color: '#667085', fontSize: 13, mt: 0.5 }}>
                            Choose a package credit plan that helps you create and promote packages on the marketplace.
                        </Typography>
                    </Box>
                    <Chip label="Packages Credits" sx={{ alignSelf: 'flex-end', ml: { md: 'auto' }, bgcolor: '#eef0ff', color: '#3446f1', fontWeight: 700 }} />
                </Stack>

                {error && (
                    <Paper sx={{ p: 2, mb: 2, bgcolor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 1 }}>
                        <Typography sx={{ color: '#dc2626', fontSize: 14 }}>
                            Error loading plans: {error}
                        </Typography>
                        <Button size="small" onClick={() => window.location.reload()} sx={{ mt: 1 }}>
                            Retry
                        </Button>
                    </Paper>
                )}

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                        gap: { xs: 1.25, md: 1.5 },
                        alignItems: { xs: 'stretch', md: 'center' },
                        pt: { xs: 1, md: 2 },
                    }}
                >
                    {isLoadingPlans && (
                        <Paper elevation={0} sx={{ gridColumn: '1 / -1', p: { xs: 3, md: 4 }, borderRadius: 2, border: '1px solid #e6eaf0', bgcolor: '#fff' }}>
                            <Stack spacing={1.25} alignItems="center" justifyContent="center">
                                <CircularProgress size={34} thickness={4} sx={{ color: '#3446f1' }} />
                                <Typography sx={{ color: '#667085', fontSize: 14, fontWeight: 700 }}>
                                    Loading subscription plans...
                                </Typography>
                            </Stack>
                        </Paper>
                    )}

                    {!isLoadingPlans && !plans.length && !error && (
                        <Paper elevation={0} sx={{ gridColumn: '1 / -1', p: { xs: 3, md: 4 }, borderRadius: 2, border: '1px dashed #d0d5dd', bgcolor: '#fff', textAlign: 'center' }}>
                            <Typography sx={{ color: '#667085', fontSize: 14, fontWeight: 700 }}>
                                No subscription plans available.
                            </Typography>
                        </Paper>
                    )}

                    {!isLoadingPlans && plans.map((plan) => {
                        const isPurchasingThisPlan = purchasingPlanId === plan.id;
                        const isCurrentPlan = plan.isCurrentPlan;
                        const canBuyThisPlan = canPurchasePlan(plan);
                        const isButtonDisabled = isCurrentPlan || isPurchasingThisPlan;

                        return (
                            <Paper
                                key={plan.id}
                                elevation={0}
                                sx={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                    border: plan.featured ? `2px solid ${plan.accent}` : '1px solid #e6eaf0',
                                    bgcolor: plan.featured ? '#f9fafb' : '#fff',
                                    minHeight: plan.featured ? { xs: 385, md: 410 } : { xs: 360, md: 382 },
                                    transform: { xs: 'none', md: plan.featured ? 'translateY(-10px)' : 'none' },
                                    boxShadow: plan.featured ? '0 22px 48px rgba(31,45,61,0.18)' : '0 8px 20px rgba(31,45,61,0.06)',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <Box sx={{ height: plan.featured ? 8 : 6, bgcolor: plan.accent }} />

                                {plan.featured && plan.ribbonText && (
                                    <Box sx={{ position: 'absolute', top: 14, right: -36, width: 140, py: 0.45, bgcolor: plan.accent, color: '#fff', textAlign: 'center', transform: 'rotate(35deg)', fontSize: 11, fontWeight: 800 }}>
                                        {plan.ribbonText}
                                    </Box>
                                )}

                                <Stack spacing={1.35} sx={{ p: { xs: 1.6, md: plan.featured ? 1.9 : 1.65 }, height: '100%' }}>
                                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.25}>
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                                            <Box sx={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: '50%',
                                                bgcolor: plan.bg,
                                                color: plan.accent,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                boxShadow: `inset 0 0 0 1px ${plan.accent}22`,
                                            }}>
                                                {plan.iconUrl ? (
                                                    <Box component="img" src={plan.iconUrl} alt={`${plan.name} icon`} sx={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                                                ) : (
                                                    <WorkspacePremiumIcon sx={{ fontSize: 24 }} />
                                                )}
                                            </Box>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography sx={{ color: '#172b4d', fontSize: { xs: 16, md: 17 }, fontWeight: 700, lineHeight: 1.2 }}>
                                                    {plan.name}
                                                </Typography>
                                                <Typography sx={{ color: '#667085', fontSize: 12 }}>{plan.credits}</Typography>
                                            </Box>
                                        </Stack>

                                        {/* Single light-green "Active" tag — this is the only current-plan indicator. */}
                                        {isCurrentPlan ? (
                                            <Chip
                                                label="Active"
                                                size="small"
                                                sx={{
                                                    height: 22,
                                                    bgcolor: '#e6f7ec',
                                                    color: '#1f9d55',
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    flexShrink: 0,
                                                    border: '1px solid #b8e6cc',
                                                }}
                                            />
                                        ) : plan.badge ? (
                                            <Chip
                                                label={plan.badge}
                                                size="small"
                                                sx={{ height: 22, bgcolor: plan.bg, color: plan.accent, fontSize: 11, fontWeight: 700, flexShrink: 0 }}
                                            />
                                        ) : null}
                                    </Stack>

                                    <Typography sx={{ color: '#667085', fontSize: 13, lineHeight: 1.45, minHeight: 38 }}>
                                        {plan.summary}
                                    </Typography>

                                    <Box sx={{
                                        py: { xs: 1.1, md: plan.featured ? 1.35 : 1.2 },
                                        px: 1.25,
                                        borderRadius: 1.5,
                                        bgcolor: plan.featured ? '#fff' : '#f8fafc',
                                        border: `1px solid ${plan.featured ? `${plan.accent}33` : '#eef1f4'}`,
                                    }}>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 0.7 }}>
                                            <Typography sx={{ color: '#667085', fontSize: 12, fontWeight: 600 }}>Sale price</Typography>
                                            <Typography sx={{ color: '#98a2b3', fontSize: 13, fontWeight: 700, textDecoration: 'line-through' }}>
                                                Rs. {plan.regularPrice}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={1}>
                                            <Typography sx={{ color: '#667085', fontSize: 12, fontWeight: 600, pb: 0.35 }}>Offer price</Typography>
                                            <Box sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.5 }}>
                                                <Typography sx={{ color: '#111827', fontSize: { xs: 22, md: plan.featured ? 27 : 25 }, fontWeight: 700, lineHeight: 1 }}>
                                                    Rs. {plan.price}
                                                </Typography>
                                                <Typography sx={{ color: '#667085', fontSize: 12, fontWeight: 600 }}>{plan.billingLabel}</Typography>
                                            </Box>
                                        </Stack>
                                    </Box>

                                    <Stack spacing={1.15} sx={{ flex: 1 }}>
                                        {plan.features.map((feature) => (
                                            <Stack key={feature.text} direction="row" spacing={1} alignItems="center">
                                                <CheckCircleIcon sx={{
                                                    color: feature.included ? plan.accent : '#98a2b3',
                                                    fontSize: 18,
                                                    flexShrink: 0,
                                                }} />
                                                <Typography sx={{
                                                    color: feature.included ? '#344054' : '#98a2b3',
                                                    fontSize: 13,
                                                    fontWeight: 500,
                                                    textDecoration: feature.included ? 'none' : 'line-through',
                                                }}>
                                                    {feature.text}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>

                                    <Button
                                        fullWidth
                                        variant={isCurrentPlan ? 'outlined' : (plan.featured ? 'contained' : 'outlined')}
                                        disabled={isButtonDisabled}
                                        onClick={() => handleBuyPlan(plan)}
                                        startIcon={isPurchasingThisPlan ? <CircularProgress size={16} color="inherit" /> : null}
                                        sx={{
                                            mt: 'auto',
                                            height: 42,
                                            borderColor: isCurrentPlan ? '#b8e6cc' : plan.accent,
                                            bgcolor: isCurrentPlan ? '#f5f6f8' : (plan.featured ? plan.accent : '#fff'),
                                            color: isCurrentPlan ? '#98a2b3' : (plan.featured ? '#fff' : plan.accent),
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            cursor: canBuyThisPlan ? 'pointer' : 'not-allowed',
                                            opacity: canBuyThisPlan ? 1 : 0.8,
                                            '&:hover': {
                                                borderColor: isCurrentPlan ? '#b8e6cc' : plan.accent,
                                                bgcolor: isCurrentPlan ? '#f5f6f8' : (plan.featured ? plan.accent : plan.bg),
                                            },
                                        }}
                                    >
                                        {isPurchasingThisPlan
                                            ? 'Processing...'
                                            : getPlanActionLabel(plan)}
                                    </Button>
                                </Stack>
                            </Paper>
                        );
                    })}
                </Box>
            </Paper>
        </Box>
    );
}
