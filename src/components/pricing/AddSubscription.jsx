import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    GlobalStyles,
    MenuItem,
    Paper,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';

const SUBSCRIPTION_PLANS_ENDPOINT = '/api/v1/super-admin/subscription-plans';
const PUBLIC_SUBSCRIPTION_PLANS_ENDPOINT = '/api/v1/subscription-plans';

const billingCycleDays = {
    MONTHLY: 30,
    QUARTERLY: 90,
    HALF_YEARLY: 180,
    YEARLY: 365,
};

const billingCycleLabels = {
    MONTHLY: '/ 1 month',
    QUARTERLY: '/ 3 months',
    HALF_YEARLY: '/ 6 months',
    YEARLY: '/ 1 year',
};

const billingCycleOptions = Object.keys(billingCycleDays);

const clearBodyScrollPadding = () => {
    if (typeof document === 'undefined') return;

    const resetPadding = () => {
        document.body.style.setProperty('padding-right', '0px', 'important');
        document.documentElement.style.setProperty('padding-right', '0px', 'important');
        document.querySelectorAll('.mui-fixed').forEach((element) => {
            element.style.setProperty('padding-right', '0px', 'important');
        });
    };

    resetPadding();
    window.requestAnimationFrame(resetPadding);
    window.setTimeout(resetPadding, 60);
};

const selectMenuProps = {
    disableScrollLock: true,
    disablePortal: true,
    keepMounted: true,
    TransitionProps: {
        onEnter: clearBodyScrollPadding,
        onEntered: clearBodyScrollPadding,
        onExit: clearBodyScrollPadding,
        onExited: clearBodyScrollPadding,
    },
    PaperProps: {
        sx: { maxHeight: 260 },
    },
};

function getApiErrorMessage(error, fallback) {
    return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
}

function getApiMessage(payload, fallback) {
    return payload?.message || payload?.msg || payload?.data?.message || fallback;
}

const toNumber = (value, fallback = 0) => {
    if (value === '' || value === null || value === undefined) return fallback;
    const parsedValue = Number(value);
    return Number.isNaN(parsedValue) ? fallback : parsedValue;
};

const createFeature = (text = '', included = true) => ({
    id: `${Date.now()}-${Math.random()}`,
    text,
    included,
});

const sanitizeUnsignedNumber = (value) => value.replace(/\D/g, '');
const sanitizeMaxPackages = (value) => {
    const normalizedValue = value.replace(/[^\d-]/g, '');
    if (normalizedValue.startsWith('-')) {
        return '-1';
    }
    return normalizedValue.replace(/\D/g, '');
};

const createCard = (overrides = {}) => ({
    id: `${Date.now()}-${Math.random()}`,
    name: '',
    description: '',
    salePriceInPaise: '0',
    offerPriceInPaise: '0',
    billingCycle: 'MONTHLY',
    durationDays: '30',
    trialDays: '0',
    includedCredits: '0',
    maxPackages: '0',
    directLeadPriceCredits: '0',
    priorityWeight: '0',
    isFeatured: false,
    displayOrder: '1',
    isActive: true,
    badgeText: '',
    ribbonText: '',
    iconUrl: '',
    themeColor: '#8B4513',
    ctaButtonText: '',
    softColor: '#fff7ed',
    features: [createFeature()],
    ...overrides,
});

const getPlanId = (card) => card?.planId || card?.backendId || card?._id || null;
const getApiPlanId = (plan) => plan?.planId || plan?.backendId || plan?._id || plan?.id || null;
const stringifyValue = (value, fallback = '') => String(value ?? fallback);
const parseJsonObject = (value) => {
    if (!value || typeof value !== 'string') return value;

    try {
        const parsedValue = JSON.parse(value);
        return parsedValue && typeof parsedValue === 'object' ? parsedValue : {};
    } catch {
        return {};
    }
};

const extractPlanList = (payload = {}) => {
    const candidates = [
        payload?.data?.plans,
        payload?.data?.subscriptionPlans,
        payload?.data?.subscription_plans,
        payload?.data?.data?.plans,
        payload?.data?.data?.subscriptionPlans,
        payload?.data?.data?.subscription_plans,
        payload?.data?.data?.items,
        payload?.data?.data?.docs,
        payload?.data?.data?.rows,
        payload?.data?.data,
        payload?.data?.items,
        payload?.data?.docs,
        payload?.data?.rows,
        payload?.data,
        payload?.plans,
        payload?.subscriptionPlans,
        payload?.subscription_plans,
        payload?.items,
        payload,
    ];

    return candidates.find(Array.isArray) || [];
};

const extractPlanFromPayload = (payload = {}) => {
    const candidates = [
        payload?.data?.plan,
        payload?.data?.subscriptionPlan,
        payload?.data?.subscription_plan,
        payload?.data,
        payload?.plan,
        payload?.subscriptionPlan,
        payload?.subscription_plan,
        payload,
    ];

    return candidates.find((candidate) => candidate && typeof candidate === 'object' && !Array.isArray(candidate));
};

const normalizeApiFeatures = (features = []) => {
    const normalizedFeatures = parseJsonObject(features);
    const featureList = Array.isArray(normalizedFeatures) ? normalizedFeatures : features;
    if (!Array.isArray(featureList) || !featureList.length) return [createFeature()];

    return featureList.map((feature) => {
        if (typeof feature === 'string') return createFeature(feature);

        return createFeature(
            feature?.text || feature?.name || feature?.label || '',
            feature?.included ?? feature?.isIncluded ?? true
        );
    });
};

const mapApiPlanToCard = (plan = {}, index = 0) => {
    const displayContent = parseJsonObject(plan.displayContent || plan.display_content) || {};
    const backendId = getApiPlanId(plan) || '';
    const billingCycle = billingCycleOptions.includes(plan.billingCycle) ? plan.billingCycle : 'MONTHLY';

    return createCard({
        id: backendId ? `plan-${backendId}` : `${Date.now()}-${index}-${Math.random()}`,
        planId: backendId,
        backendId,
        name: plan.name ?? '',
        description: plan.description ?? '',
        salePriceInPaise: stringifyValue(plan.salePriceInPaise ?? plan.sale_price_in_paise, '0'),
        offerPriceInPaise: stringifyValue(plan.offerPriceInPaise ?? plan.offer_price_in_paise, '0'),
        billingCycle,
        durationDays: stringifyValue(plan.durationDays ?? plan.duration_days, billingCycleDays[billingCycle]),
        trialDays: stringifyValue(plan.trialDays ?? plan.trial_days, '0'),
        includedCredits: stringifyValue(plan.includedCredits ?? plan.included_credits, '0'),
        maxPackages: stringifyValue(plan.maxPackages ?? plan.max_packages, '0'),
        directLeadPriceCredits: stringifyValue(plan.directLeadPriceCredits ?? plan.direct_lead_price_credits, '0'),
        priorityWeight: stringifyValue(plan.priorityWeight ?? plan.priority_weight, '0'),
        isFeatured: Boolean(plan.isFeatured ?? plan.is_featured),
        displayOrder: stringifyValue(plan.displayOrder ?? plan.display_order, index + 1),
        isActive: plan.isActive ?? plan.is_active ?? true,
        badgeText: displayContent.badgeText ?? displayContent.badge_text ?? plan.badgeText ?? '',
        ribbonText: displayContent.ribbonText ?? displayContent.ribbon_text ?? plan.ribbonText ?? '',
        iconUrl: displayContent.iconUrl ?? displayContent.icon_url ?? plan.iconUrl ?? '',
        themeColor: displayContent.themeColor ?? displayContent.theme_color ?? plan.themeColor ?? '#8B4513',
        ctaButtonText: displayContent.ctaButtonText ?? displayContent.cta_button_text ?? plan.ctaButtonText ?? 'Choose Plan',
        softColor: displayContent.softColor ?? displayContent.soft_color ?? plan.softColor ?? '#fff7ed',
        features: normalizeApiFeatures(displayContent.features || plan.features),
    });
};

const normalizeFeatures = (features = []) => (
    features
        .filter((feature) => feature.text.trim())
        .map((feature) => ({
            text: feature.text,
            included: Boolean(feature.included),
        }))
);

const getCardPayload = (card) => ({
    name: card.name,
    description: card.description,
    salePriceInPaise: toNumber(card.salePriceInPaise),
    offerPriceInPaise: toNumber(card.offerPriceInPaise),
    billingCycle: card.billingCycle,
    durationDays: toNumber(card.durationDays),
    trialDays: toNumber(card.trialDays),
    includedCredits: toNumber(card.includedCredits),
    maxPackages: toNumber(card.maxPackages),
    directLeadPriceCredits: toNumber(card.directLeadPriceCredits),
    priorityWeight: toNumber(card.priorityWeight),
    isFeatured: Boolean(card.isFeatured),
    displayOrder: toNumber(card.displayOrder),
    isActive: Boolean(card.isActive),
    displayContent: {
        badgeText: card.badgeText,
        ribbonText: card.ribbonText?.trim() || null,
        iconUrl: card.iconUrl,
        themeColor: card.themeColor,
        ctaButtonText: card.ctaButtonText,
        features: normalizeFeatures(card.features),
    },
    rules: {},
});

const areValuesEqual = (firstValue, secondValue) => JSON.stringify(firstValue) === JSON.stringify(secondValue);

const getChangedCardPayload = (card, originalCard) => {
    const currentPayload = getCardPayload(card);
    if (!originalCard) return currentPayload;

    const originalPayload = getCardPayload(originalCard);
    return Object.entries(currentPayload).reduce((payload, [field, value]) => {
        if (!areValuesEqual(value, originalPayload[field])) {
            payload[field] = value;
        }
        return payload;
    }, {});
};

const snapshotCards = (cards) => (
    cards.reduce((snapshot, card) => ({
        ...snapshot,
        [card.id]: JSON.parse(JSON.stringify(card)),
    }), {})
);

const initialCards = [];

export default function AddSubscription() {
    const [cards, setCards] = useState(initialCards);
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);
    const [savingCardId, setSavingCardId] = useState('');
    const [deletingCardId, setDeletingCardId] = useState('');
    const originalCardsRef = useRef(snapshotCards(initialCards));

    useEffect(() => {
        let isMounted = true;

        const loadSubscriptionPlans = async () => {
            setIsLoadingPlans(true);

            try {
                const response = await MainApi.get(PUBLIC_SUBSCRIPTION_PLANS_ENDPOINT);
                const fetchedCards = extractPlanList(response?.data)
                    .map(mapApiPlanToCard)
                    .sort((firstCard, secondCard) => toNumber(firstCard.displayOrder) - toNumber(secondCard.displayOrder));

                if (!isMounted) return;

                setCards(fetchedCards);
                originalCardsRef.current = snapshotCards(fetchedCards);
            } catch (error) {
                if (!isMounted) return;

                await Swal.fire({
                    icon: 'error',
                    title: 'Unable to Load Plans',
                    text: getApiErrorMessage(error, 'Something went wrong while loading subscription plans.'),
                    confirmButtonColor: '#3446f1',
                });
            } finally {
                if (isMounted) setIsLoadingPlans(false);
            }
        };

        loadSubscriptionPlans();

        return () => {
            isMounted = false;
        };
    }, []);

    const updateCard = (cardId, field, value) => {
        setCards((current) => current.map((card) => (
            card.id === cardId ? {
                ...card,
                [field]: value,
                ...(field === 'billingCycle' ? { durationDays: String(billingCycleDays[value] || '') } : {}),
            } : card
        )));
    };

    const updateFeature = (cardId, featureId, field, value) => {
        setCards((current) => current.map((card) => {
            if (card.id !== cardId) return card;
            return {
                ...card,
                features: card.features.map((feature) => (
                    feature.id === featureId ? { ...feature, [field]: value } : feature
                )),
            };
        }));
    };

    const addCard = () => {
        setCards((current) => [
            ...current,
            createCard({
                displayOrder: String(current.length + 1),
            }),
        ]);
    };

    const removeCardLocally = (cardId) => {
        setCards((current) => current.filter((card) => card.id !== cardId));
        delete originalCardsRef.current[cardId];
    };

    const deleteCard = async (card) => {
        const planId = getPlanId(card);
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Delete subscription plan?',
            text: `This will remove ${card.name || 'this plan'}.`,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d92d20',
        });

        if (!result.isConfirmed) return;

        setDeletingCardId(card.id);

        try {
            if (planId) {
                await MainApi.delete(`${SUBSCRIPTION_PLANS_ENDPOINT}/${planId}`);
            }
            removeCardLocally(card.id);
            await Swal.fire({
                icon: 'success',
                title: planId ? 'Plan Deleted' : 'Plan Removed',
                text: planId ? 'Subscription plan deleted successfully.' : 'Unsaved subscription plan removed successfully.',
                confirmButtonColor: '#3446f1',
            });
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Unable to Delete',
                text: getApiErrorMessage(error, 'Something went wrong while deleting subscription plan.'),
                confirmButtonColor: '#3446f1',
            });
        } finally {
            setDeletingCardId('');
        }
    };

    const addFeature = (cardId) => {
        setCards((current) => current.map((card) => (
            card.id === cardId ? { ...card, features: [...card.features, createFeature()] } : card
        )));
    };

    const removeFeature = (cardId, featureId) => {
        setCards((current) => current.map((card) => {
            if (card.id !== cardId || card.features.length === 1) return card;
            return { ...card, features: card.features.filter((feature) => feature.id !== featureId) };
        }));
    };

    const handleIconUpload = (cardId, event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            updateCard(cardId, 'iconUrl', String(reader.result || ''));
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const saveCardChanges = async (card) => {
        const planId = getPlanId(card);
        const isExistingPlan = Boolean(planId);
        const originalCard = originalCardsRef.current[card.id];
        const changedPayload = isExistingPlan ? getChangedCardPayload(card, originalCard) : getCardPayload(card);

        if (isExistingPlan && !Object.keys(changedPayload).length) {
            await Swal.fire({
                icon: 'info',
                title: 'No Changes',
                text: 'There are no changes to save for this plan.',
                confirmButtonColor: '#3446f1',
            });
            return;
        }

        setSavingCardId(card.id);

        try {
            const response = isExistingPlan
                ? await MainApi.patch(`${SUBSCRIPTION_PLANS_ENDPOINT}/${planId}`, changedPayload)
                : await MainApi.post(SUBSCRIPTION_PLANS_ENDPOINT, changedPayload);
            const responsePlan = extractPlanFromPayload(response?.data);
            const responsePlanId = getApiPlanId(responsePlan);
            const savedCard = responsePlanId
                ? { ...card, id: card.id, planId: responsePlanId, backendId: responsePlanId }
                : { ...card };

            setCards((current) => current.map((currentCard) => (
                currentCard.id === card.id ? savedCard : currentCard
            )));
            originalCardsRef.current[card.id] = JSON.parse(JSON.stringify(savedCard));

            await Swal.fire({
                icon: 'success',
                title: isExistingPlan ? 'Plan Updated' : 'Plan Created',
                text: getApiMessage(response?.data || {}, isExistingPlan ? 'Subscription plan updated successfully.' : 'Subscription plan created successfully.'),
                confirmButtonColor: '#3446f1',
            });
            console.log(isExistingPlan ? 'Subscription plan update payload:' : 'Subscription plan create payload:', changedPayload);
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: isExistingPlan ? 'Unable to Update' : 'Unable to Create',
                text: getApiErrorMessage(error, isExistingPlan ? 'Something went wrong while updating subscription plan.' : 'Something went wrong while creating subscription plan.'),
                confirmButtonColor: '#3446f1',
            });
        } finally {
            setSavingCardId('');
        }
    };

    return (
        <Box sx={{ width: '100%', bgcolor: '#f6f7fb', p: 0 }}>
            <GlobalStyles
                styles={{
                    'html, body, .mui-fixed': {
                        paddingRight: '0px !important',
                    },
                }}
            />
            <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #e6eaf0', bgcolor: '#fff', p: { xs: 1.25, md: 1.5 }, boxShadow: '0 2px 8px rgba(31,45,61,0.06)' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
                    <Box>
                        <Typography sx={{ color: '#172b4d', fontSize: { xs: 19, md: 22 }, fontWeight: 700 }}>
                            Add Subscription
                        </Typography>
                        <Typography sx={{ color: '#667085', fontSize: 13, mt: 0.35 }}>
                            {isLoadingPlans ? 'Loading subscription plans...' : 'Create and update subscription cards dynamically.'}
                        </Typography>
                    </Box>
                </Stack>

                <Box>
                    <Stack spacing={2}>
                        {isLoadingPlans && (
                            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, border: '1px solid #e6eaf0', bgcolor: '#fcfcfd' }}>
                                <Stack spacing={1.25} alignItems="center" justifyContent="center">
                                    <CircularProgress size={34} thickness={4} sx={{ color: '#f79f03' }} />
                                    <Typography sx={{ color: '#667085', fontSize: 14, fontWeight: 700 }}>
                                        Loading subscription plans...
                                    </Typography>
                                </Stack>
                            </Paper>
                        )}
                        {!isLoadingPlans && !cards.length && (
                            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px dashed #d0d5dd', bgcolor: '#fcfcfd', textAlign: 'center' }}>
                                <Typography sx={{ color: '#172b4d', fontSize: 16, fontWeight: 700 }}>
                                    No subscription plans found
                                </Typography>
                                <Typography sx={{ color: '#667085', fontSize: 13, mt: 0.5 }}>
                                    Add a card to create the first subscription plan.
                                </Typography>
                            </Paper>
                        )}
                        {cards.map((card, cardIndex) => (
                            <Paper key={card.id} elevation={0} sx={{ p: { xs: 1.5, md: 2 }, borderRadius: 2, border: '1px solid #e6eaf0', bgcolor: '#fff' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, minHeight: 38, width: '100%', overflowX: 'auto' }}>
                                    <Typography sx={{ color: '#172b4d', fontSize: 16, fontWeight: 700, lineHeight: 1, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', height: 34 }}>
                                        Subscription Card {cardIndex + 1}
                                    </Typography>
                                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, height: 38, flexShrink: 0 }}>
                                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35, height: 34, flexShrink: 0 }}>
                                            <Switch size="small" checked={card.isActive} onChange={(event) => updateCard(card.id, 'isActive', event.target.checked)} sx={{ m: 0 }} />
                                            <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1 }}>
                                                {card.isActive ? 'Active' : 'Inactive'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35, height: 34, flexShrink: 0 }}>
                                            <Switch size="small" checked={card.isFeatured} onChange={(event) => updateCard(card.id, 'isFeatured', event.target.checked)} sx={{ m: 0 }} />
                                            <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1 }}>
                                                Featured
                                            </Typography>
                                        </Box>
                                        <Button startIcon={<DeleteIcon />} variant="outlined" color="error" onClick={() => deleteCard(card)} disabled={isLoadingPlans || savingCardId === card.id || deletingCardId === card.id} sx={{ height: 34, textTransform: 'none', fontWeight: 700 }}>
                                            {deletingCardId === card.id ? 'Deleting...' : 'Remove'}
                                        </Button>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' }, gap: 1.5 }}>
                                    <TextField label="Plan Name" size="small" value={card.name} onChange={(event) => updateCard(card.id, 'name', event.target.value)} fullWidth />
                                    <TextField label="Badge Text" size="small" value={card.badgeText} onChange={(event) => updateCard(card.id, 'badgeText', event.target.value)} fullWidth />
                                    <TextField label="CTA Button Text" size="small" value={card.ctaButtonText} onChange={(event) => updateCard(card.id, 'ctaButtonText', event.target.value)} fullWidth />
                                    <Box sx={{ display: 'grid', gridTemplateColumns: card.iconUrl ? 'minmax(0, 1fr) auto' : 'minmax(0, 1fr)', alignItems: 'center', gap: 1, minWidth: 0 }}>
                                        <Box component="input" type="file" accept="image/*" onChange={(event) => handleIconUpload(card.id, event)} sx={{ width: '100%', height: 40, border: '1px solid #c4c4c4', borderRadius: 1, color: '#344054', fontSize: 12, px: 1, py: 0.85, bgcolor: '#fff', boxSizing: 'border-box', '&::file-selector-button': { height: 25, mr: 1, border: '1px solid #d0d5dd', borderRadius: 0.75, bgcolor: '#f8fafc', color: '#344054', fontWeight: 700, cursor: 'pointer' } }} />
                                        {card.iconUrl && (
                                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                                                <Box component="img" src={card.iconUrl} alt={`${card.name || 'Plan'} icon`} sx={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e6eaf0' }} />
                                                <Button color="error" variant="text" onClick={() => updateCard(card.id, 'iconUrl', '')} sx={{ minWidth: 0, px: 0.5, textTransform: 'none', fontSize: 12, fontWeight: 700 }}>
                                                    Remove
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                    <TextField label="Description" size="small" value={card.description} onChange={(event) => updateCard(card.id, 'description', event.target.value)} fullWidth sx={{ gridColumn: { md: '1 / 3' } }} />
                                    <TextField label="Sale Price In Paise" size="small" value={card.salePriceInPaise} onChange={(event) => updateCard(card.id, 'salePriceInPaise', sanitizeUnsignedNumber(event.target.value))} fullWidth />
                                    <TextField label="Offer Price In Paise" size="small" value={card.offerPriceInPaise} onChange={(event) => updateCard(card.id, 'offerPriceInPaise', sanitizeUnsignedNumber(event.target.value))} fullWidth />
                                    <TextField label="Billing Cycle" size="small" select value={card.billingCycle} onChange={(event) => updateCard(card.id, 'billingCycle', event.target.value)} SelectProps={{ MenuProps: selectMenuProps, onOpen: clearBodyScrollPadding, onClose: clearBodyScrollPadding }} fullWidth>
                                        {billingCycleOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField label="Duration Days" size="small" value={card.durationDays} onChange={(event) => updateCard(card.id, 'durationDays', sanitizeUnsignedNumber(event.target.value))} fullWidth />
                                    <TextField label="Trial Days" size="small" value={card.trialDays} onChange={(event) => updateCard(card.id, 'trialDays', sanitizeUnsignedNumber(event.target.value))} fullWidth />
                                    <TextField label="Included Credits" size="small" value={card.includedCredits} onChange={(event) => updateCard(card.id, 'includedCredits', sanitizeUnsignedNumber(event.target.value))} fullWidth />
                                    <TextField label="Max Packages (-1 Unlimited)" size="small" value={card.maxPackages} onChange={(event) => updateCard(card.id, 'maxPackages', sanitizeMaxPackages(event.target.value))} fullWidth />
                                    <TextField label="Lead Price Credits" size="small" value={card.directLeadPriceCredits} onChange={(event) => updateCard(card.id, 'directLeadPriceCredits', sanitizeUnsignedNumber(event.target.value))} fullWidth />
                                    <TextField label="Priority Weight" size="small" value={card.priorityWeight} onChange={(event) => updateCard(card.id, 'priorityWeight', sanitizeUnsignedNumber(event.target.value))} fullWidth />
                                    <TextField label="Display Order" size="small" value={card.displayOrder} onChange={(event) => updateCard(card.id, 'displayOrder', sanitizeUnsignedNumber(event.target.value))} fullWidth />
                                    <TextField label="Theme Color" size="small" type="color" value={card.themeColor} onChange={(event) => updateCard(card.id, 'themeColor', event.target.value)} fullWidth />
                                    <TextField label="Soft Color" size="small" type="color" value={card.softColor} onChange={(event) => updateCard(card.id, 'softColor', event.target.value)} fullWidth />
                                    <TextField label="Ribbon Text" size="small" value={card.ribbonText} onChange={(event) => updateCard(card.id, 'ribbonText', event.target.value)} fullWidth />
                                </Box>

                                <Box sx={{ mt: 2 }}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                        <Typography sx={{ color: '#172b4d', fontSize: 15, fontWeight: 700 }}>
                                            Key Features
                                        </Typography>
                                    </Stack>
                                    <Stack spacing={1}>
                                        {card.features.map((feature, featureIndex) => (
                                            <Stack key={feature.id} direction="row" spacing={1} alignItems="center">
                                                <TextField label={`Feature ${featureIndex + 1}`} size="small" value={feature.text} onChange={(event) => updateFeature(card.id, feature.id, 'text', event.target.value)} fullWidth />
                                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35, flexShrink: 0 }}>
                                                    <Switch size="small" checked={feature.included} onChange={(event) => updateFeature(card.id, feature.id, 'included', event.target.checked)} sx={{ m: 0 }} />
                                                    <Typography sx={{ color: '#344054', fontSize: 12, fontWeight: 700 }}>
                                                        Included
                                                    </Typography>
                                                </Box>
                                                <Button variant="outlined" color="error" onClick={() => removeFeature(card.id, feature.id)} disabled={card.features.length === 1} sx={{ minWidth: 42, height: 38, px: 0 }}>
                                                    <DeleteIcon sx={{ fontSize: 19 }} />
                                                </Button>
                                            </Stack>
                                        ))}
                                    </Stack>
                                    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
                                        <Button startIcon={<AddIcon />} variant="outlined" onClick={() => addFeature(card.id)} sx={{ height: 32, textTransform: 'none', fontWeight: 700 }}>
                                            Add Feature
                                        </Button>
                                    </Stack>
                                </Box>

                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
                                    <Button variant="contained" onClick={() => saveCardChanges(card)} disabled={isLoadingPlans || savingCardId === card.id || deletingCardId === card.id} sx={{ height: 38, px: 2.5, ml: 'auto', bgcolor: '#f79f03', color: '#111827', textTransform: 'none', fontWeight: 800, boxShadow: 'none', '&:hover': { bgcolor: '#df8f02', boxShadow: 'none' } }}>
                                        {savingCardId === card.id ? 'Saving...' : getPlanId(card) ? 'Save changes' : 'Save plan'}
                                    </Button>
                                </Box>
                            </Paper>
                        ))}
                    </Stack>

                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button startIcon={<AddIcon />} variant="outlined" onClick={addCard} disabled={isLoadingPlans} sx={{ height: 40, textTransform: 'none', fontWeight: 800 }}>
                            Add Card
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Paper elevation={0} sx={{ mt: 2, borderRadius: 2, border: '1px solid #e6eaf0', bgcolor: '#fff', p: { xs: 1.5, md: 2 }, boxShadow: '0 2px 8px rgba(31,45,61,0.06)' }}>
                <Typography sx={{ color: '#172b4d', fontSize: { xs: 20, md: 24 }, fontWeight: 700, lineHeight: 1.2, mb: 2 }}>
                    Subscription Card Preview
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2, alignItems: { xs: 'stretch', md: 'center' }, pt: { xs: 0.5, md: 1.5 } }}>
                    {isLoadingPlans && (
                        <Paper elevation={0} sx={{ gridColumn: '1 / -1', p: { xs: 3, md: 4 }, borderRadius: 2, border: '1px solid #e6eaf0', bgcolor: '#fcfcfd' }}>
                            <Stack spacing={1.25} alignItems="center" justifyContent="center">
                                <CircularProgress size={34} thickness={4} sx={{ color: '#f79f03' }} />
                                <Typography sx={{ color: '#667085', fontSize: 14, fontWeight: 700 }}>
                                    Preparing subscription preview...
                                </Typography>
                            </Stack>
                        </Paper>
                    )}
                    {!isLoadingPlans && !cards.length && (
                        <Paper elevation={0} sx={{ gridColumn: '1 / -1', p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px dashed #d0d5dd', bgcolor: '#fcfcfd', textAlign: 'center' }}>
                            <Typography sx={{ color: '#667085', fontSize: 14, fontWeight: 600 }}>
                                No subscription preview available.
                            </Typography>
                        </Paper>
                    )}
                    {cards.map((card) => (
                            <Paper key={card.id} elevation={0} sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2, border: card.isFeatured ? `2px solid ${card.themeColor}` : '1px solid #e6eaf0', bgcolor: card.isFeatured ? '#f9fafb' : '#fff', minHeight: 390, opacity: card.isActive ? 1 : 0.58, filter: card.isActive ? 'none' : 'grayscale(0.35)', transform: { xs: 'none', md: card.isFeatured ? 'translateY(-10px)' : 'none' }, boxShadow: card.isFeatured ? '0 22px 48px rgba(31,45,61,0.18)' : '0 8px 20px rgba(31,45,61,0.06)' }}>
                                <Box sx={{ height: card.isFeatured ? 8 : 6, bgcolor: card.themeColor }} />
                                {!card.isActive && (
                                    <Chip label="Inactive" size="small" sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2, bgcolor: '#fee2e2', color: '#b42318', fontWeight: 800 }} />
                                )}
                                {card.isFeatured && card.ribbonText && (
                                    <Box sx={{ position: 'absolute', top: 14, right: -36, width: 140, py: 0.45, bgcolor: card.themeColor, color: '#fff', textAlign: 'center', transform: 'rotate(35deg)', fontSize: 11, fontWeight: 800 }}>
                                        {card.ribbonText}
                                    </Box>
                                )}
                                <Stack spacing={1.35} sx={{ p: { xs: 1.6, md: 1.8 }, height: '100%' }}>
                                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.25}>
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                                            <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: card.softColor, color: card.themeColor, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `inset 0 0 0 1px ${card.themeColor}22` }}>
                                                {card.iconUrl ? (
                                                    <Box component="img" src={card.iconUrl} alt={`${card.name || 'Plan'} icon`} sx={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                                                ) : (
                                                    <WorkspacePremiumIcon sx={{ fontSize: 24 }} />
                                                )}
                                            </Box>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography sx={{ color: '#172b4d', fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}>
                                                    {card.name || 'Plan Name'}
                                                </Typography>
                                                <Typography sx={{ color: '#667085', fontSize: 12 }}>{card.includedCredits || '0'} credits</Typography>
                                            </Box>
                                        </Stack>
                                        {card.badgeText && <Chip label={card.badgeText} size="small" sx={{ height: 22, bgcolor: card.softColor, color: card.themeColor, fontSize: 11, fontWeight: 700, flexShrink: 0 }} />}
                                    </Stack>

                                    <Typography sx={{ color: '#667085', fontSize: 13, lineHeight: 1.45, minHeight: 38 }}>
                                        {card.description || 'Plan description'}
                                    </Typography>

                                    <Box sx={{ py: 1.2, px: 1.25, borderRadius: 1.5, bgcolor: card.isFeatured ? '#fff' : '#f8fafc', border: `1px solid ${card.isFeatured ? `${card.themeColor}33` : '#eef1f4'}` }}>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 0.7 }}>
                                            <Typography sx={{ color: '#667085', fontSize: 12, fontWeight: 600 }}>Sale price</Typography>
                                            <Typography sx={{ color: '#98a2b3', fontSize: 13, fontWeight: 700, textDecoration: 'line-through' }}>
                                                Rs. {Math.round((Number(card.salePriceInPaise) || 0) / 100)}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={1}>
                                            <Typography sx={{ color: '#667085', fontSize: 12, fontWeight: 600, pb: 0.35 }}>Offer price</Typography>
                                            <Box sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.5 }}>
                                                <Typography sx={{ color: '#111827', fontSize: 25, fontWeight: 700, lineHeight: 1 }}>
                                                    Rs. {Math.round((Number(card.offerPriceInPaise) || 0) / 100)}
                                                </Typography>
                                                <Typography sx={{ color: '#667085', fontSize: 12, fontWeight: 600 }}>{billingCycleLabels[card.billingCycle] || '/ 1 month'}</Typography>
                                            </Box>
                                        </Stack>
                                    </Box>

                                    <Stack spacing={1.15} sx={{ flex: 1 }}>
                                        {card.features.filter((feature) => feature.text).map((feature) => (
                                            <Stack key={feature.id} direction="row" spacing={1} alignItems="center">
                                                <CheckCircleIcon sx={{ color: feature.included ? card.themeColor : '#98a2b3', fontSize: 18, flexShrink: 0 }} />
                                                <Typography sx={{ color: feature.included ? '#344054' : '#98a2b3', fontSize: 13, fontWeight: 500, textDecoration: feature.included ? 'none' : 'line-through' }}>
                                                    {feature.text}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>

                                    <Button fullWidth variant={card.isFeatured ? 'contained' : 'outlined'} sx={{ mt: 'auto', height: 42, borderColor: card.themeColor, bgcolor: card.isFeatured ? card.themeColor : '#fff', color: card.isFeatured ? '#fff' : card.themeColor, textTransform: 'none', fontWeight: 700, '&:hover': { borderColor: card.themeColor, bgcolor: card.isFeatured ? card.themeColor : card.softColor } }}>
                                        {card.ctaButtonText || 'Choose Plan'}
                                    </Button>
                                </Stack>
                            </Paper>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
}
