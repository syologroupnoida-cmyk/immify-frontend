// components/dashboard/DashboardLayout.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    Menu,
    MenuItem,
    Badge,
    Stack,
    Paper,
    Card,
    CardContent,
    Button,
    Collapse,
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    ShoppingBag as PackagesIcon,
    FlightTakeoff as BookingsIcon,
    Hotel as HotelsIcon,
    AccountCircle as ProfileIcon,
    Settings as SettingsIcon,
    Notifications as NotificationsIcon,
    ExpandLess,
    ExpandMore,
    Star as StarIcon,
    LocationOn as LocationIcon,
    AttachMoney as MoneyIcon,
    ConfirmationNumber as TicketIcon,
    SupportAgent as SupportIcon,
    BarChart as ChartIcon,
    Assessment as AssessmentIcon,
    LocalOffer as LocalOfferIcon,
    Help as HelpIcon,
    AccountBalanceWallet as WalletIcon,
    Campaign as CampaignIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import SidebarLogo from '@/images/sidebar-logo.png';
import LogoutButton from '@/components/common/LogoutButton';
import { getDisplayRoleLabel, getPasswordRoute, getProfileRoute } from '@/util/authRouting';

const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard/partner' },

    {
        name: 'Services', icon: <PackagesIcon />, children: [
            { name: 'Add Service', path: '/service/add-service' },
            { name: 'Service List', path: '/service/service-list' },
            // { name: 'Property Report', path: '/dashboard/partner?view=property-report' },

        ]
    },
    // {
    //     name: 'Bookings', icon: <SupportIcon />, children: [
    //         { name: 'Booking List', path: '/partner/booking-list' },
    //         // { name: 'Booking Requests', path: '/dashboard/partner?view=booking-requests' },
    //         // { name: 'Enquiry Report', path: '/dashboard/partner?view=enquiry-report' },

    //     ]
    // },
    // {
    //     name: 'Guest Leads', icon: <TicketIcon />, children: [
    //         { name: 'New Enquiries', path: '/dashboard/partner?view=new-enquiries' },
    //         { name: 'Contacted Guests', path: '/dashboard/partner?view=contacted-guests' },
    //         { name: 'Offer Sent', path: '/dashboard/partner?view=offer-sent' },
    //         { name: 'Confirmed Bookings', path: '/dashboard/partner?view=confirmed-bookings' },
    //         { name: 'Lost Enquiries', path: '/dashboard/partner?view=lost-enquiries' },
    //     ]
    // },
    // {
    //     name: 'Payouts & Billing', icon: <WalletIcon />, children: [
    //         { name: 'Partner Plans', path: '/dashboard/partner?view=plans' },
    //         { name: 'Payout History', path: '/dashboard/partner?view=payout-history' },
    //         { name: 'Invoice List', path: '/dashboard/partner?view=invoices' },
    //     ]
    // },
    // {
    //     name: 'Area Guides', icon: <LocalOfferIcon />, children: [
    //         { name: 'Add Area Guide', path: '/destination-guide/add-destination' },
    //         { name: 'Area Guide List', path: '/destination-guide/destination-list' },

    //     ]
    // },
    // {
    //     name: 'Booking', icon: <BookingsIcon />, children: [
    //         { name: 'Active Bookings', path: '/dashboard/partner?view=active-bookings' },
    //         { name: 'Completed Bookings', path: '/dashboard/partner?view=completed-bookings' },
    //     ]
    // },
    // {
    //     name: 'Report', icon: <AssessmentIcon />, children: [
    //         { name: 'Revenue', path: '/dashboard/partner?view=revenue-report' },
    //         { name: 'Occupancy', path: '/dashboard/partner?view=occupancy-report' },
    //         { name: 'Enquiry Conversion', path: '/dashboard/partner?view=enquiry-conversion' },
    //     ]
    // },
    {
        name: 'Settings', icon: <SettingsIcon />, children: [
            { name: 'Update profile', path: '/partner/update-profile' },
            { name: 'Change Password', path: '/partner/update-password' },
        ]
    },
];

function getStoredUser() {
    if (typeof window === 'undefined') return null;

    try {
        const storedUser = JSON.parse(localStorage.getItem('userData') || 'null');
        const authData = JSON.parse(localStorage.getItem('authData') || 'null');
        const authUser = authData?.user || authData?.data?.user || authData?.data || authData;
        const resolvedUser = storedUser || authUser || null;
        const storedRole = localStorage.getItem('userRole');
        const role = resolvedUser?.role || storedRole || '';

        return localStorage.getItem('isAuthenticated') === 'true' && (resolvedUser || role)
            ? { ...(resolvedUser || {}), role }
            : null;
    } catch {
        return null;
    }
}

function getUserName(user) {
    const firstName = user?.firstName || user?.first_name || user?.firstname || '';
    const lastName = user?.lastName || user?.last_name || user?.lastname || '';

    return {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName} ${lastName}`.trim() || user?.name || user?.fullName || user?.full_name || 'Partner',
    };
}

function getUserInitial(user) {
    const { firstName, fullName } = getUserName(user);
    return (firstName || fullName).charAt(0).toUpperCase() || 'P';
}

function DashboardOverviewCharts({ barTitle, barSubtitle, barData, pieTitle, pieSubtitle, pieData, accentColor = '#f79f03' }) {
    const maxBarValue = Math.max(...barData.map((item) => item.value), 1);
    const pieTotal = pieData.reduce((sum, item) => sum + item.value, 0) || 1;
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const pieSegments = pieData.reduce((items, item) => {
        const previousOffset = items.reduce((sum, segment) => sum + segment.dash, 0);
        const dash = (item.value / pieTotal) * circumference;
        return [...items, { ...item, dash, offset: -previousOffset }];
    }, []);

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.85fr) minmax(320px, 1fr)' },
                gap: 1.5,
                alignItems: 'stretch',
            }}
        >
            <Card sx={{ borderRadius: 2, border: '1px solid #edf0f4', bgcolor: '#fff', boxShadow: '0 8px 18px rgba(31,45,61,0.05)', minHeight: 356 }}>
                <CardContent sx={{ p: 2.25 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#172b4d', lineHeight: 1.2 }}>{barTitle}</Typography>
                        <Typography sx={{ color: '#667085', fontSize: 12, mt: 0.4 }}>{barSubtitle}</Typography>
                    </Box>
                    <Box sx={{ position: 'relative', height: 272, pt: 1, px: 1 }}>
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 8,
                                right: 8,
                                top: 16,
                                bottom: 34,
                                backgroundImage: 'linear-gradient(to bottom, #edf0f4 1px, transparent 1px)',
                                backgroundSize: '100% 25%',
                                borderBottom: '1px solid #d9dee7',
                            }}
                        />
                        <Box sx={{ position: 'relative', height: '100%', display: 'grid', gridTemplateColumns: `repeat(${barData.length}, minmax(0, 1fr))`, gap: { xs: 0.6, md: 1 }, alignItems: 'end' }}>
                            {barData.map((item) => {
                                const barHeight = Math.max((item.value / maxBarValue) * 78, 14);
                                const barColor = item.color || accentColor;

                                return (
                                    <Stack key={item.label} spacing={1} alignItems="center" justifyContent="flex-end" sx={{ height: '100%', pb: 0.2, minWidth: 0 }}>
                                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#344054' }}>{item.value}</Typography>
                                        <Box sx={{ width: '100%', maxWidth: 34, height: `${barHeight}%`, borderRadius: '7px 7px 2px 2px', bgcolor: barColor, boxShadow: `0 10px 18px ${barColor}35` }} />
                                        <Typography sx={{ fontSize: 11, color: '#667085', fontWeight: 600 }}>{item.label}</Typography>
                                    </Stack>
                                );
                            })}
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2, border: '1px solid #edf0f4', bgcolor: '#fff', boxShadow: '0 8px 18px rgba(31,45,61,0.05)', minHeight: 356 }}>
                <CardContent sx={{ p: 2.25, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#172b4d', lineHeight: 1.2 }}>{pieTitle}</Typography>
                        <Typography sx={{ color: '#667085', fontSize: 12, mt: 0.4 }}>{pieSubtitle}</Typography>
                    </Box>
                    <Stack spacing={2.25} alignItems="center" sx={{ width: '100%' }}>
                        <Box sx={{ width: { xs: 176, sm: 188 }, height: { xs: 176, sm: 188 }, mx: 'auto', flexShrink: 0 }}>
                            <Box component="svg" viewBox="0 0 160 160" sx={{ width: '100%', height: '100%', display: 'block', filter: 'drop-shadow(0 16px 22px rgba(31,45,61,0.12))' }}>
                                <circle cx="80" cy="80" r={radius} fill="none" stroke="#edf0f4" strokeWidth="34" />
                                {pieSegments.map((item) => (
                                    <circle key={item.label} cx="80" cy="80" r={radius} fill="none" stroke={item.color} strokeWidth="34" strokeDasharray={`${item.dash} ${circumference}`} strokeDashoffset={item.offset} strokeLinecap="butt" transform="rotate(-90 80 80)" />
                                ))}
                                <circle cx="80" cy="80" r="34" fill="#fff" />
                                <text x="80" y="78" textAnchor="middle" fontSize="16" fontWeight="700" fill="#172b4d">{pieTotal}</text>
                                <text x="80" y="94" textAnchor="middle" fontSize="10" fill="#667085">Total</text>
                            </Box>
                        </Box>
                        <Stack spacing={0.9} sx={{ width: '100%' }}>
                            {pieData.map((item) => (
                                <Stack key={item.label} direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ px: 1.25, py: 0.75, borderRadius: 1, bgcolor: '#f8fafc' }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
                                        <Typography sx={{ color: '#344054', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</Typography>
                                    </Stack>
                                    <Typography sx={{ color: '#172b4d', fontSize: 13, fontWeight: 600 }}>{item.value}</Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}

const DashboardLayout = ({ children }) => {
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const [hoverOpen, setHoverOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const [openMenus, setOpenMenus] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const [logoLoadError, setLogoLoadError] = useState(false);
    const [currentPath, setCurrentPath] = useState('');
    const [user, setUser] = useState(null);
    const userName = getUserName(user);
    const userInitial = getUserInitial(user);

    const dashboardTiles = [
        { title: 'New Enquiries', value: '48', icon: <SupportIcon />, color: '#f79f03', bg: '#fff7e8' },
        { title: 'Active Bookings', value: '18', icon: <TicketIcon />, color: '#22a06b', bg: '#e9f8f0' },
        { title: 'Total Booking', value: '126', icon: <BookingsIcon />, color: '#3446f1', bg: '#eef0ff' },
        { title: 'Cancelled Booking', value: '9', icon: <AssessmentIcon />, color: '#ef4444', bg: '#fff1f1' },
    ];
    const partnerBarData = [
        { label: 'Jan', value: 22 },
        { label: 'Feb', value: 28 },
        { label: 'Mar', value: 34 },
        { label: 'Apr', value: 31 },
        { label: 'May', value: 42 },
        { label: 'Jun', value: 48 },
        { label: 'Jul', value: 54 },
        { label: 'Aug', value: 46 },
        { label: 'Sep', value: 51 },
        { label: 'Oct', value: 58 },
        { label: 'Nov', value: 64 },
        { label: 'Dec', value: 72 },
    ];
    const partnerPieData = [
        { label: 'New Enquiries', value: 48, color: '#f79f03' },
        { label: 'Active Bookings', value: 18, color: '#22a06b' },
        { label: 'Total Booking', value: 126, color: '#3446f1' },
        { label: 'Cancelled Booking', value: 9, color: '#ef4444' },
    ];

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 960;
            setIsMobile(mobile);
            if (mobile) {
                setOpen(false);
            } else {
                setOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!router.isReady) return undefined;

        const syncCurrentPath = (path = router.asPath) => {
            setCurrentPath(path);
        };

        syncCurrentPath();
        router.events.on('routeChangeComplete', syncCurrentPath);

        return () => {
            router.events.off('routeChangeComplete', syncCurrentPath);
        };
    }, [router.isReady, router.asPath, router.events]);

    useEffect(() => {
        const refreshStoredUser = () => setUser(getStoredUser());

        refreshStoredUser();
        window.addEventListener('storage', refreshStoredUser);
        window.addEventListener('tripz-auth-change', refreshStoredUser);

        return () => {
            window.removeEventListener('storage', refreshStoredUser);
            window.removeEventListener('tripz-auth-change', refreshStoredUser);
        };
    }, []);

    // Handle sidebar toggle
    const handleDrawerToggle = () => {
        setOpen((current) => !current);
        setHoverOpen(false);
    };

    const handleMouseEnter = () => {
        if (!open && !isMobile) {
            setHoverOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (!open) {
            setHoverOpen(false);
        }
    };

    const handleMenuToggle = (menuName, isOpen) => {
        setOpenMenus(isOpen ? { [menuName]: false } : { [menuName]: true });
    };

    // Handle user profile menu
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfileRoute = () => {
        handleProfileMenuClose();
        router.push(getProfileRoute(user?.role || user?.userRole || user?.roleName || user?.type || ''));
    };

    const handlePasswordRoute = () => {
        handleProfileMenuClose();
        router.push(getPasswordRoute(user?.role || user?.userRole || user?.roleName || user?.type || ''));
    };

    // Handle notifications menu
    const handleNotificationOpen = (event) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchor(null);
    };
    // Determine if sidebar should be visible
    const isSidebarOpen = open || hoverOpen;
    const drawerWidth = isSidebarOpen ? 280 : 80;

    // Render menu items recursively
    const renderMenuItem = (item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = item.path === currentPath;
        const hasActiveChild = item.children?.some((child) => child.path === currentPath);
        const isOpen = openMenus[item.name] ?? (Object.keys(openMenus).length === 0 && hasActiveChild);

        return (
            <Box key={item.name}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        component={!hasChildren && item.path ? NextLink : 'div'}
                        href={!hasChildren && item.path ? item.path : undefined}
                        onClick={() => hasChildren ? handleMenuToggle(item.name, isOpen) : undefined}
                        selected={isActive}
                        sx={{
                            minHeight: 48,
                            justifyContent: isSidebarOpen ? 'initial' : 'center',
                            px: 2.5,
                            borderRadius: 1,
                            mx: 1,
                            my: 0.5,
                            bgcolor: isActive ? 'rgba(255, 255, 255, 0.26)' : 'transparent',
                            color: '#fff',
                            boxShadow: isActive ? 'inset 0 0 0 1px rgba(255,255,255,0.18)' : 'none',
                            '&:hover': {
                                bgcolor: 'rgba(255, 109, 0, 0.2)',
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: isSidebarOpen ? 2 : 'auto',
                                justifyContent: 'center',
                                color: '#fff',
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        {isSidebarOpen && (
                            <>
                                <ListItemText
                                    primary={item.name}
                                    sx={{
                                        opacity: 1,
                                        '& .MuiTypography-root': {
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                        }
                                    }}
                                />
                                {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                            </>
                        )}
                    </ListItemButton>
                </ListItem>

                {hasChildren && isSidebarOpen && (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.children.map((child) => {
                                const childActive = child.path === currentPath;
                                return (
                                    <ListItemButton
                                        key={child.name}
                                        component={NextLink}
                                        href={child.path}
                                        selected={childActive}
                                        sx={{
                                            pl: 5.5,
                                            borderRadius: 1,
                                            mx: 1,
                                            my: 0.5,
                                            bgcolor: childActive ? 'rgba(255,255,255,0.26)' : 'transparent',
                                            color: '#fff',
                                            boxShadow: childActive ? 'inset 0 0 0 1px rgba(255,255,255,0.18)' : 'none',
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 109, 0, 0.1)',
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 0, mr: 2, color: '#fff' }}>
                                            <Box
                                                component="span"
                                                sx={{
                                                    width: 7,
                                                    height: 7,
                                                    border: '1.5px solid rgba(255,255,255,0.9)',
                                                    borderRadius: '50%',
                                                    display: 'inline-block',
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={child.name}
                                            sx={{
                                                '& .MuiTypography-root': {
                                                    fontSize: '0.85rem',
                                                }
                                            }}
                                        />
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    </Collapse>
                )}
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Top notice banner - KEPT */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: { xs: 0, md: `${drawerWidth}px` },
                    width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
                    zIndex: (theme) => theme.zIndex.drawer + 2,
                    bgcolor: '#ffc400',
                    color: '#111827',
                    height: { xs: 24, md: 28 },
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    transition: (theme) =>
                        theme.transitions.create(['width', 'left'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    '@keyframes partnerNoticeMarquee': {
                        '0%': { transform: 'translateX(100%)' },
                        '100%': { transform: 'translateX(-100%)' },
                    },
                }}
            >
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                        minWidth: 'max-content',
                        animation: 'partnerNoticeMarquee 28s linear infinite',
                        fontWeight: 700,
                        fontSize: { xs: 13, md: 15 },
                        whiteSpace: 'nowrap',
                        px: 2,
                    }}
                >
                    <CampaignIcon sx={{ fontSize: { xs: 17, md: 19 }, flexShrink: 0 }} />
                    <Box component="span">
                        Important Notice: Property partners are requested to keep room rates, availability, and property details updated. Listings with outdated information may receive fewer booking enquiries.
                    </Box>
                </Stack>
            </Box>

            <AppBar
                position="fixed"
                elevation={1}
                sx={{
                    top: { xs: 24, md: 28 }, // Keep the top offset for the banner
                    bgcolor: '#fff',
                    color: '#333',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    ml: { xs: 0, md: `${drawerWidth}px` },
                    width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
                    transition: (theme) =>
                        theme.transitions.create(['width', 'margin-left'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    borderRadius: 0,
                    boxShadow: '0 2px 8px rgba(16,24,40,0.08)',
                }}
            >
                <Toolbar sx={{ position: 'relative', justifyContent: 'space-between', minHeight: { xs: 60, md: 68 }, gap: 2 }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ minWidth: 0, height: '100%' }}
                    >
                        <IconButton
                            onClick={handleDrawerToggle}
                            sx={{
                                color: '#071952',
                                borderRadius: 1,
                                width: 38,
                                height: 38,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {open ? <ChevronLeftIcon /> : <MenuIcon />}
                        </IconButton>
                        <Typography
                            sx={{
                                color: '#071952',
                                fontSize: { xs: 16, md: 17 },
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                lineHeight: 1,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            Partner Dashboard
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" sx={{ ml: 'auto', minWidth: 0, height: '100%' }}>
                        {/* Removed the Chip with wallet balance */}
                        {/* Removed Plans button */}
                        {/* Removed Help & Support button */}
                        {/* <IconButton onClick={handleNotificationOpen} sx={{ color: '#666' }}>
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton> */}
                        <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                            <Avatar
                                src={user?.profileImage || user?.profileImageUrl || user?.avatarUrl || user?.avatar_url || user?.avatar || ''}
                                sx={{ bgcolor: '#f79f03', width: 40, height: 40, cursor: 'pointer' }}
                            >
                                {!user?.profileImage && !user?.profileImageUrl && !user?.avatarUrl && !user?.avatar_url && !user?.avatar && userInitial}
                            </Avatar>
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={open}
                onClose={handleDrawerToggle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: '#071952',
                        color: '#fff',
                        borderRight: 'none',
                        top: 0,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: (theme) =>
                            theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        overflowX: 'hidden',
                        overflowY: 'hidden',
                    },
                }}
            >
                <Box sx={{ p: 2, minHeight: 72, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ width: isSidebarOpen ? 170 : 64, height: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            src={SidebarLogo}
                            alt="Sidebar logo"
                            width={isSidebarOpen ? 170 : 64}
                            height={48}
                            style={{ objectFit: 'contain', borderRadius: 8 }}
                        />
                    </Box>
                </Box>

                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.18)', flexShrink: 0 }} />

                <List
                    sx={{
                        mt: 2,
                        flex: 1,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    {menuItems.map((item) => renderMenuItem(item))}
                </List>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    pt: { xs: 11, md: 13 }, // Keep the padding for the banner
                    px: { xs: 2, sm: 3 },
                    pb: { xs: 2, sm: 3 },
                    width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
                    transition: (theme) =>
                        theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                }}
            >
                {/* User Profile Dropdown Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    disableScrollLock
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            width: 280,
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        },
                    }}
                >
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75, minWidth: 44 }}>
                                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#fff7e8', color: '#f79f03', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <ProfileIcon sx={{ fontSize: 20 }} />
                                </Box>
                                <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 0.7, py: 0.2, borderRadius: '999px', bgcolor: '#eef6ff', border: '1px solid #cfe6ff', color: '#1687f9' }}>
                                    <Typography variant="caption" fontWeight={800} sx={{ fontSize: 10, textTransform: 'capitalize', lineHeight: 1.2 }}>
                                        {getDisplayRoleLabel(user?.role || user?.userRole || user?.roleName || user?.type || '')}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ minWidth: 0, pt: 0.25 }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#24313f', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName.fullName}</Typography>
                                {user?.email && (
                                    <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</Typography>
                                )}
                            </Box>
                        </Stack>
                    </Box>

                    <MenuItem onClick={handleProfileRoute}>
                        <ListItemIcon><ProfileIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>My Profile</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handlePasswordRoute}>
                        <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Account Settings</ListItemText>
                    </MenuItem>
                    <Divider />
                    <LogoutButton onBeforeLogout={handleProfileMenuClose} />
                </Menu>

                {/* Notifications Dropdown */}
                <Menu
                    anchorEl={notificationAnchor}
                    open={Boolean(notificationAnchor)}
                    onClose={handleNotificationClose}
                    disableScrollLock
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            width: 320,
                            borderRadius: 2,
                        },
                    }}
                >
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
                    </Box>
                    <MenuItem>
                        <Box>
                            <Typography variant="body2">New booking enquiry is available</Typography>
                            <Typography variant="caption" color="text.secondary">5 minutes ago</Typography>
                        </Box>
                    </MenuItem>
                    <MenuItem>
                        <Box>
                            <Typography variant="body2">Partner payout summary is ready</Typography>
                            <Typography variant="caption" color="text.secondary">1 hour ago</Typography>
                        </Box>
                    </MenuItem>
                    <MenuItem>
                        <Box>
                            <Typography variant="body2">A guest viewed your property listing</Typography>
                            <Typography variant="caption" color="text.secondary">2 hours ago</Typography>
                        </Box>
                    </MenuItem>
                    <Divider />
                    <MenuItem sx={{ justifyContent: 'center' }}>
                        <Typography variant="body2" color="#f79f03">View all notifications</Typography>
                    </MenuItem>
                </Menu>

                {/* Dashboard Content */}
                {children ? children : (
                    <Box>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, minmax(0, 1fr))',
                                    lg: 'repeat(4, minmax(0, 1fr))',
                                },
                                gap: 1.75,
                                mb: 2,
                            }}
                        >
                            {dashboardTiles.map((tile) => (
                                <Card
                                    key={tile.title}
                                    elevation={0}
                                    sx={{
                                        borderRadius: 2,
                                        border: '1px solid #e6eaf0',
                                        bgcolor: '#fff',
                                        minHeight: 116,
                                        boxShadow: '0 10px 24px rgba(31,45,61,0.06)',
                                    }}
                                >
                                    <CardContent sx={{ p: 2, height: '100%' }}>
                                        <Stack spacing={1.25} alignItems="flex-start" justifyContent="center" sx={{ height: '100%', textAlign: 'left' }}>
                                            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1, width: '100%', minWidth: 0, whiteSpace: 'nowrap' }}>
                                                <Avatar sx={{ bgcolor: tile.bg, color: tile.color, width: 32, height: 32, borderRadius: '50%', flexShrink: 0, '& .MuiSvgIcon-root': { fontSize: 19 } }}>
                                                    {tile.icon}
                                                </Avatar>
                                                <Typography sx={{ color: '#172b4d', fontSize: { xs: 13, md: 14 }, fontWeight: 600, lineHeight: 1.2, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {tile.title}
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ color: '#111827', fontSize: 28, lineHeight: 1, fontWeight: 600, textAlign: 'left' }}>
                                                {tile.value}
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                        <DashboardOverviewCharts
                            barTitle="Monthly Booking Enquiries"
                            barSubtitle="Dummy enquiry volume by month"
                            barData={partnerBarData}
                            pieTitle="Booking Distribution"
                            pieSubtitle="Dummy data by booking status"
                            pieData={partnerPieData}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default DashboardLayout;
