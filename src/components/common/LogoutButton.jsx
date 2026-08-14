import React from 'react';
import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
// import MainApi from '@/util/MainApi';
// import { getVendorType, normalizeRole } from '@/util/authRouting';

function clearAuthSession() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authData');
    localStorage.removeItem('userData');
    localStorage.removeItem('UserData');
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshExpiresAt');
    document.cookie = 'tripz_auth=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'tripz_role=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'tripz_kyc=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'tripz_kyc_status=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'tripz_vendor_type=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'tripz_next_step=; path=/; max-age=0; SameSite=Lax';
    window.dispatchEvent(new Event('tripz-auth-change'));
}

function showLogoutRedirectLoader() {
    Swal.fire({
        icon: 'success',
        title: 'Logout success',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        showCancelButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
}

function readStoredJson(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch {
        return null;
    }
}

function getLogoutRedirectPath() {
    const storedRole = normalizeRole(localStorage.getItem('userRole'));
    const storedUser = readStoredJson('userData') || readStoredJson('UserData') || {};
    const authData = readStoredJson('authData') || {};
    const role = storedRole || normalizeRole(storedUser?.role || authData?.role || authData?.data?.user?.role);
    const vendorType = getVendorType(storedUser) || getVendorType(authData);

    if (role === 'superadmin' || role === 'super_admin') {
        return '/admin/login';
    }

    if (vendorType === 'TRAVEL_AGENT' || role === 'agent') {
        return '/agent/login';
    }

    if (vendorType === 'PROPERTY_OWNER' || role === 'partner') {
        return '/partner/login';
    }

    if (role === 'client' || role === 'customer' || role === 'user') {
        return '/user/login';
    }

    return '/admin/login';
}

export default function LogoutButton({ onBeforeLogout, variant = 'menu', showText = true }) {
    const router = useRouter();

    const handleLogout = async () => {
        const redirectPath = getLogoutRedirectPath();
        onBeforeLogout?.();

        const result = await Swal.fire({
            icon: 'warning',
            title: 'Logout?',
            text: 'Are you sure you want to logout?',
            showCancelButton: true,
            confirmButtonText: 'Logout',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d32f2f',
            cancelButtonColor: '#667085',
        });

        if (!result.isConfirmed) return;

        MainApi.post('/api/v1/auth/logout').catch(() => {});
        clearAuthSession();
        showLogoutRedirectLoader();
        await router.push(redirectPath);
        Swal.close();
    };

    if (variant === 'list') {
        return (
            <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        minHeight: 48,
                        justifyContent: showText ? 'initial' : 'center',
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        color: '#fff',
                        '&:hover': {
                            bgcolor: 'rgba(255, 109, 0, 0.2)',
                        },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 0, mr: showText ? 2 : 'auto', justifyContent: 'center', color: '#fff' }}>
                        <Logout />
                    </ListItemIcon>
                    {showText && (
                        <ListItemText
                            primary="Logout"
                            sx={{
                                '& .MuiTypography-root': {
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                },
                            }}
                        />
                    )}
                </ListItemButton>
            </ListItem>
        );
    }

    return (
        <MenuItem onClick={handleLogout} sx={{ mx: 0.75, mb: 0.75, borderRadius: '6px', gap: 1.2, color: '#d32f2f', fontWeight: 700 }}>
            <Box sx={{ color: '#d32f2f', display: 'flex' }}><Logout fontSize="small" /></Box>
            Logout
        </MenuItem>
    );
}
