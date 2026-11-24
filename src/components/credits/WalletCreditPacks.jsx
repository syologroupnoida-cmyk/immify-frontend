import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TollIcon from '@mui/icons-material/Toll';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';
import { extractPacks, priceLabel } from '@/components/credits/CreditPacks';

function loadRazorpay() {
    if (window.Razorpay) return Promise.resolve();
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => window.Razorpay ? resolve() : reject(new Error('Razorpay Checkout could not be loaded.'));
        script.onerror = () => { script.remove(); reject(new Error('Razorpay Checkout could not be loaded. Check your connection and try again.')); };
        document.head.appendChild(script);
    });
}

function openRazorpay(checkout, description) {
    return new Promise((resolve, reject) => {
        let completed = false;
        const razorpay = new window.Razorpay({
            key: checkout.publicKey,
            order_id: checkout.providerOrderId,
            amount: checkout.amountInPaise,
            currency: checkout.currency,
            name: 'Immify',
            description,
            handler: (result) => { completed = true; resolve(result); },
            modal: { ondismiss: () => { if (!completed) reject(new Error('Payment was cancelled.')); } },
        });
        razorpay.open();
    });
}

export default function WalletCreditPacks() {
    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [purchasingId, setPurchasingId] = useState(null);
    const purchaseInProgress = useRef(false);

    const loadPacks = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await MainApi.get('/vendor/credits/packs');
            setPacks(extractPacks(response.data));
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Unable to load credit packs.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { queueMicrotask(loadPacks); }, [loadPacks]);

    const buyPack = async (pack) => {
        const creditPackId = pack.creditPackId ?? pack.credit_pack_id ?? pack.id ?? pack._id;
        if (!creditPackId || purchaseInProgress.current) return;
        purchaseInProgress.current = true;
        setPurchasingId(creditPackId);
        let checkoutStarted = false;
        try {
            await loadRazorpay();
            checkoutStarted = true;
            const checkout = await MainApi.post('/vendor/credits/checkout', { creditPackId });
            if (checkout.data?.success === false) throw new Error(checkout.data.message || 'Checkout was not successful.');
            const payload = checkout.data;
            const data = payload?.data ?? payload;
            const order = data?.order ?? data?.paymentOrder ?? data?.payment_order ?? payload?.paymentOrder;
            const paymentOrderId = data?.paymentOrderId ?? data?.payment_order_id ?? payload?.paymentOrderId ?? payload?.payment_order_id ?? order?.id ?? order?._id;
            if (!paymentOrderId || (typeof paymentOrderId !== 'string' && typeof paymentOrderId !== 'number')) {
                throw new Error('Checkout did not return a recognizable payment order ID. Check your wallet or contact support before retrying.');
            }
            let verificationPayload;
            if (data?.paymentRequired !== false) {
                const payment = data?.checkout;
                if (String(payment?.provider || '').toUpperCase() !== 'RAZORPAY' || !payment?.publicKey || !payment?.providerOrderId || !payment?.currency || !Number.isSafeInteger(payment?.amountInPaise) || payment.amountInPaise <= 0) {
                    throw new Error('Checkout did not return valid Razorpay payment details.');
                }
                const result = await openRazorpay(payment, order?.description || pack.name || 'Credit pack');
                if (!result?.razorpay_payment_id || !result?.razorpay_signature) {
                    throw new Error('Razorpay did not return payment verification details.');
                }
                verificationPayload = { providerPaymentId: result.razorpay_payment_id, signature: result.razorpay_signature };
            }
            const verification = await MainApi.post(`/payments/orders/${encodeURIComponent(paymentOrderId)}/verify`, verificationPayload);
            if (verification.data?.success === false) throw new Error(verification.data.message || 'Payment verification was not successful.');
            window.dispatchEvent(new Event('wallet-balance-changed'));
            await Swal.fire({ icon: 'success', title: 'Credits purchased', text: verification.data?.message || 'Your credit pack payment was verified.', confirmButtonColor: '#3446f1' });
        } catch (err) {
            const message = err?.response?.data?.message || err.message || 'Unable to complete the purchase.';
            await Swal.fire({ icon: 'error', title: 'Unable to complete purchase', text: `${message}${checkoutStarted && !message.includes('before retrying') ? ' Check your wallet or contact support before retrying.' : ''}`, confirmButtonColor: '#3446f1' });
        } finally {
            purchaseInProgress.current = false;
            setPurchasingId(null);
        }
    };

    return <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid #e6eaf0', borderRadius: 2, minHeight: 'calc(100dvh - 104px)', bgcolor: '#f7f8fd' }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}><Box sx={{ display: 'flex', p: 1.25, borderRadius: 2, bgcolor: '#e2e5ff', color: '#3446f1' }}><AccountBalanceWalletIcon /></Box><Box><Typography sx={{ color: '#101d48', fontSize: 19, fontWeight: 700 }}>Wallet Credit Packs</Typography><Typography sx={{ color: '#667085', fontSize: 13 }}>Choose a credit pack to boost your wallet.</Typography></Box></Stack>
        {error && <Alert severity="error" action={<Button color="inherit" size="small" onClick={loadPacks}>Retry</Button>}>{error}</Alert>}
        {loading ? <Box sx={{ py: 6, textAlign: 'center' }}><CircularProgress size={30} /></Box> : !error && (packs.length ?
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
                {packs.map((pack, index) => {
                    const id = pack.creditPackId ?? pack.credit_pack_id ?? pack.id ?? pack._id;
                    const active = pack.isActive ?? pack.is_active;
                    return <Paper key={id || `${pack.name}-${index}`} variant="outlined" sx={{ borderRadius: 2.5, borderColor: '#b5bfff', overflow: 'hidden', display: 'flex', flexDirection: 'column', bgcolor: '#fff', boxShadow: '0 8px 20px rgba(52,70,241,0.08)' }}>
                        <Box sx={{ p: 2, flex: 1, background: 'linear-gradient(135deg, #fff 55%, #f0f1ff)' }}>
                            <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                                <Box sx={{ display: 'flex', p: 1.25, borderRadius: 2, bgcolor: '#e7ecff', color: '#3446f1' }}><AccountBalanceWalletIcon /></Box>
                                <Box sx={{ minWidth: 0 }}><Typography sx={{ color: '#101d48', fontSize: 16, fontWeight: 700, overflowWrap: 'anywhere' }}>{pack.name || 'Credit Pack'}</Typography><Chip icon={<TollIcon />} label={`${pack.credits ?? '—'} credits`} size="small" sx={{ mt: 0.75, bgcolor: '#e9eaff', color: '#303bd4', fontWeight: 700, fontSize: 12 }} /></Box>
                            </Stack>
                            <Typography sx={{ color: '#667085', fontSize: 13, mt: 1.5, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{pack.description || 'No description available.'}</Typography>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.5 }}><Typography sx={{ color: '#101d48', fontWeight: 700, fontSize: 20 }}>{priceLabel(pack)}</Typography>{active != null && <Chip size="small" label={active ? 'Active' : 'Inactive'} color={active ? 'success' : 'default'} sx={{ fontSize: 11, height: 22 }} />}</Stack>
                        </Box>
                        <Box sx={{ p: 1.5, bgcolor: '#f4f5ff', borderTop: '1px solid #e2e5ff' }}><Button fullWidth variant="contained" startIcon={<ShoppingCartOutlinedIcon />} endIcon={<ArrowForwardIcon />} onClick={() => buyPack(pack)} disabled={!id || active === false || purchasingId !== null} sx={{ textTransform: 'none', fontSize: 13, fontWeight: 700, bgcolor: '#3446f1' }}>{purchasingId === id ? 'Processing...' : 'Buy Credits'}</Button></Box>
                    </Paper>;
                })}
            </Box> : <Typography color="text.secondary">No credit packs available.</Typography>)}
    </Paper>;
}
