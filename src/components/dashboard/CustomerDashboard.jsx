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
    InputBase,
    Stack,
    Chip,
    Paper,
    Grid,
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
    Logout as LogoutIcon,
    Settings as SettingsIcon,
    Notifications as NotificationsIcon,
    Search as SearchIcon,
    ExpandLess,
    ExpandMore,
    Star as StarIcon,
    MonetizationOn as RevenueIcon,
    LocationOn as LocationIcon,
    AttachMoney as MoneyIcon,
    PersonAdd as PersonAddIcon,
    ConfirmationNumber as TicketIcon,
    SupportAgent as SupportIcon,
    BarChart as ChartIcon,
    Assessment as AssessmentIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Add as AddIcon,
    LocalOffer as LocalOfferIcon,
    MeetingRoom as MeetingRoomIcon,
    Chat as ChatIcon,
    Help as HelpIcon,
    TrendingUp,
    TrendingDown,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import SidebarLogo from '@/images/sidebar-logo.png';
import LogoutButton from '@/components/common/LogoutButton';
import { getDisplayRoleLabel, getPasswordRoute, getProfileRoute } from '@/util/authRouting';

const accent = '#f79f03';

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

function getDisplayName(user) {
    const firstName = user?.firstName || user?.first_name || user?.firstname || '';
    const lastName = user?.lastName || user?.last_name || user?.lastname || '';
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || user?.name || user?.fullName || user?.full_name || user?.email || 'User';
}

function getFirstInitial(user) {
    const firstName = user?.firstName || user?.first_name || user?.firstname || user?.name || user?.email || 'U';
    return firstName.trim().charAt(0).toUpperCase() || 'U';
}

const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard/customer' },
    // {
    //     name: 'Trip Request', icon: <SupportIcon />, children: [
    //         { name: 'Create New', path: '/dashboard/customer?view=create-request' },
    //         { name: 'Draft Request', path: '/dashboard/customer?view=draft-requests' },
    //         { name: 'Submitted Request', path: '/dashboard/customer?view=submitted-requests' },
    //         { name: 'Trip List', path: '/dashboard/customer?view=trip-list' },
    //     ]
    // },
    // {
    //     name: 'Quotation', icon: <LocalOfferIcon />, children: [
    //         { name: 'Received Quotes', path: '/dashboard/customer?view=received-quotes' },
    //         { name: 'Compare', path: '/dashboard/customer?view=compare-quotes' },
    //         { name: 'Approved', path: '/dashboard/customer?view=approved-quotes' },
    //     ]
    // },
    // {
    //     name: 'My Booking', icon: <BookingsIcon />, children: [
    //         { name: 'Booking List', path: '/user/booking-list' },
           
    //     ]
    // },
    // {
    //     name: 'Agent Profit', icon: <ChartIcon />, children: [
    //         { name: 'Agent Rating', path: '/dashboard/customer?view=agent-rating' },
    //         { name: 'Reviews', path: '/dashboard/customer?view=agent-reviews' },
    //         { name: 'Response Rate', path: '/dashboard/customer?view=response-rate' },
    //     ]
    // },
    // {
    //     name: 'Reviews', icon: <StarIcon />, children: [
    //         { name: 'Submit Review', path: '/dashboard/customer?view=submit-review' },
    //         { name: 'Submitted Review', path: '/dashboard/customer?view=submitted-reviews' },
    //     ]
    // },
    {
        name: 'Setting', icon: <SettingsIcon />, children: [
            { name: 'Update Profile', path: '/user/update-profile' },
            { name: 'Change Password', path: '/user/update-password' },
        ]
    },
    { name: 'Logout', icon: <LogoutIcon />, path: '/login' },
];

const statsData = [
    { title: 'Total Requests', value: '12', change: '+3', changeType: 'up', icon: <SupportIcon />, color: '#f79f03' },
    { title: 'Active Requests', value: '5', change: '+2', changeType: 'up', icon: <CheckCircleIcon />, color: '#4caf50' },
    { title: 'Pending Requests', value: '4', change: '+1', changeType: 'up', icon: <ScheduleIcon />, color: '#2196f3' },
    { title: 'Cancelled Requests', value: '2', change: '-1', changeType: 'down', icon: <CancelIcon />, color: '#d32f2f' },
];

// Bar Chart Data
const barChartData = [
    { month: 'Jan', requests: 8, active: 4, pending: 3 },
    { month: 'Feb', requests: 10, active: 5, pending: 4 },
    { month: 'Mar', requests: 12, active: 6, pending: 5 },
    { month: 'Apr', requests: 15, active: 8, pending: 4 },
    { month: 'May', requests: 14, active: 7, pending: 5 },
    { month: 'Jun', requests: 18, active: 10, pending: 6 },
    { month: 'Jul', requests: 16, active: 9, pending: 5 },
    { month: 'Aug', requests: 20, active: 12, pending: 6 },
    { month: 'Sep', requests: 22, active: 14, pending: 7 },
    { month: 'Oct', requests: 19, active: 11, pending: 6 },
    { month: 'Nov', requests: 24, active: 16, pending: 7 },
    { month: 'Dec', requests: 28, active: 18, pending: 8 },
];

// Pie Chart Data
const pieChartData = [
    { label: 'Total Requests', value: 12, color: '#f79f03' },
    { label: 'Active Requests', value: 5, color: '#4caf50' },
    { label: 'Pending Requests', value: 4, color: '#2196f3' },
    { label: 'Cancelled Requests', value: 2, color: '#f44336' },
];

// Simple Bar Chart Component
function SimpleBarChart({ data }) {
    const maxValue = Math.max(...data.map(d => Math.max(d.requests, d.active, d.pending)));

    return (
        <Box sx={{ width: '100%', height: 300, display: 'flex', alignItems: 'flex-end', gap: 1, px: 2 }}>
            {data.map((item, index) => (
                <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', gap: 0.3, alignItems: 'flex-end', height: 240, width: '100%', justifyContent: 'center' }}>
                        <Box sx={{
                            width: 8,
                            height: `${(item.requests / maxValue) * 100}%`,
                            bgcolor: '#f79f03',
                            borderRadius: '2px 2px 0 0',
                            transition: 'height 0.3s ease',
                            minHeight: 4,
                        }} />
                        <Box sx={{
                            width: 8,
                            height: `${(item.active / maxValue) * 100}%`,
                            bgcolor: '#2196f3',
                            borderRadius: '2px 2px 0 0',
                            transition: 'height 0.3s ease',
                            minHeight: 4,
                        }} />
                        <Box sx={{
                            width: 8,
                            height: `${(item.pending / maxValue) * 100}%`,
                            bgcolor: '#4caf50',
                            borderRadius: '2px 2px 0 0',
                            transition: 'height 0.3s ease',
                            minHeight: 4,
                        }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#666', fontSize: 10, fontWeight: 600 }}>
                        {item.month}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}

// Simple Pie Chart Component
function SimplePieChart({ data }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    const slices = data.reduce((items, item) => {
        const startAngle = items.reduce((sum, slice) => sum + (slice.endAngle - slice.startAngle), 0);
        const percentage = (item.value / total) * 100;
        const angle = (percentage / 100) * 360;

        // Convert angles to radians for SVG arc
        const startRad = (startAngle - 90) * Math.PI / 180;
        const endRad = (startAngle + angle - 90) * Math.PI / 180;

        const x1 = 80 + 70 * Math.cos(startRad);
        const y1 = 80 + 70 * Math.sin(startRad);
        const x2 = 80 + 70 * Math.cos(endRad);
        const y2 = 80 + 70 * Math.sin(endRad);

        const largeArc = angle > 180 ? 1 : 0;

        return [
            ...items,
            {
            ...item,
            percentage,
            path: `M 80 80 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`,
            startAngle,
            endAngle: startAngle + angle,
            },
        ];
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="200" height="160" viewBox="0 0 160 160">
                {slices.map((slice, index) => (
                    <path
                        key={index}
                        d={slice.path}
                        fill={slice.color}
                        stroke="#fff"
                        strokeWidth="2"
                    />
                ))}
                <circle cx="80" cy="80" r="40" fill="#fff" />
                <text x="80" y="75" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">
                    {total}
                </text>
                <text x="80" y="92" textAnchor="middle" fontSize="10" fill="#666">
                    Total
                </text>
            </svg>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center', mt: 1 }}>
                {data.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                        <Typography variant="caption" sx={{ color: '#666', fontSize: 11 }}>
                            {item.label} ({item.value})
                        </Typography>
                    </Box>
                ))}
            </Box>
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
        const refreshStoredUser = () => {
            setUser(getStoredUser());
        };

        queueMicrotask(refreshStoredUser);
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
        if (item.name === 'Logout') {
            return <LogoutButton key={item.name} variant="list" showText={isSidebarOpen} />;
        }

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
            <AppBar
                position="fixed"
                elevation={1}
                sx={{
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
                        spacing={1.25}
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
                            Customer Dashboard
                        </Typography>
                    </Stack>

                    <Paper
                        component="form"
                        sx={{
                            p: '2px 4px',
                            display: { xs: 'none', lg: 'flex' },
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            alignItems: 'center',
                            width: 300,
                            bgcolor: '#f5f5f5',
                            borderRadius: 2,
                            boxShadow: 'none',
                        }}
                    >
                        <IconButton sx={{ p: '8px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search..."
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Paper>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton onClick={handleNotificationOpen} sx={{ color: '#666' }}>
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                            <Avatar
                                src={user?.profileImage || user?.profileImageUrl || user?.avatarUrl || user?.avatar_url || user?.avatar || undefined}
                                sx={{ bgcolor: accent, width: 40, height: 40, cursor: 'pointer', fontWeight: 600 }}
                            >
                                {!user?.profileImage && !user?.profileImageUrl && !user?.avatarUrl && !user?.avatar_url && !user?.avatar && getFirstInitial(user)}
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
                    <Box sx={{ width: isSidebarOpen ? 240 : 64, height: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    pt: { xs: 9, md: 10 },
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
                                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#fff7e8', color: accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <ProfileIcon sx={{ fontSize: 20 }} />
                                </Box>
                                <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 0.7, py: 0.2, borderRadius: '999px', bgcolor: '#fff7e8', border: '1px solid #ffe2b0', color: accent }}>
                                    <Typography variant="caption" fontWeight={800} sx={{ fontSize: 10, textTransform: 'capitalize', lineHeight: 1.2 }}>
                                        {getDisplayRoleLabel(user?.role || user?.userRole || user?.roleName || user?.type || '')}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ minWidth: 0, pt: 0.25 }}>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#24313f', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {getDisplayName(user)}
                                </Typography>
                                {user?.email && (
                                    <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {user.email}
                                    </Typography>
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
                            <Typography variant="body2">New quote received for your Kashmir request</Typography>
                            <Typography variant="caption" color="text.secondary">5 minutes ago</Typography>
                        </Box>
                    </MenuItem>
                    <MenuItem>
                        <Box>
                            <Typography variant="body2">Your Kerala trip request is now active</Typography>
                            <Typography variant="caption" color="text.secondary">1 hour ago</Typography>
                        </Box>
                    </MenuItem>
                    <MenuItem>
                        <Box>
                            <Typography variant="body2">An agent responded to your Bali request</Typography>
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
                        {/* Welcome Banner */}
                        <Paper sx={{ p: 3, mb: 3, bgcolor: '#1a237e', color: '#fff', borderRadius: 2 }}>
                            <Typography variant="h5" gutterBottom fontWeight="bold">
                                Welcome back, {user ? getDisplayName(user).split(' ')[0] : 'John'}!
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Track your trip requests, compare quotes, and manage your upcoming journeys.
                            </Typography>
                        </Paper>

                        {/* Stats Cards - 4 Tiles Only */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, minmax(0, 1fr))',
                                    md: 'repeat(4, minmax(0, 1fr))',
                                },
                                gap: 2,
                                mb: 3,
                            }}
                        >
                            {statsData.map((stat, index) => (
                                <Card
                                    key={index}
                                    sx={{
                                        borderRadius: 2,
                                        border: '1px solid #edf0f4',
                                        boxShadow: '0 8px 18px rgba(31,45,61,0.05)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 24px rgba(31,45,61,0.12)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 2.5 }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}>
                                                    {stat.title}
                                                </Typography>
                                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', fontSize: 32 }}>
                                                    {stat.value}
                                                </Typography>
                                            </Box>
                                            <Avatar
                                                sx={{
                                                    bgcolor: `${stat.color}15`,
                                                    color: stat.color,
                                                    width: 48,
                                                    height: 48,
                                                    '& .MuiSvgIcon-root': { fontSize: 24 }
                                                }}
                                            >
                                                {stat.icon}
                                            </Avatar>
                                        </Stack>
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            {stat.changeType === 'up' ? (
                                                <TrendingUp sx={{ fontSize: 16, color: '#4caf50' }} />
                                            ) : (
                                                <TrendingDown sx={{ fontSize: 16, color: '#f44336' }} />
                                            )}
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: stat.changeType === 'up' ? '#4caf50' : '#f44336',
                                                    fontWeight: 600,
                                                    fontSize: 13,
                                                }}
                                            >
                                                {stat.change}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#999' }}>
                                                vs last month
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>

                        {/* Charts Section - Bar Chart (col-8) and Pie Chart (col-4) */}
                        <Grid container spacing={3}>
                            {/* Bar Chart - 8 columns */}
                            <Grid item xs={12} md={8}>
                                <Card sx={{ borderRadius: 2, boxShadow: '0 8px 18px rgba(31,45,61,0.05)', border: '1px solid #edf0f4' }}>
                                    <CardContent>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold" sx={{ color: '#1f2937' }}>
                                                    Monthly Trip Statistics
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                                                    Requests, active and pending overview
                                                </Typography>
                                            </Box>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f79f03' }} />
                                                    <Typography variant="caption" sx={{ color: '#666' }}>Requests</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#2196f3' }} />
                                                    <Typography variant="caption" sx={{ color: '#666' }}>Active</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#4caf50' }} />
                                                    <Typography variant="caption" sx={{ color: '#666' }}>Pending</Typography>
                                                </Box>
                                            </Stack>
                                        </Stack>
                                        <SimpleBarChart data={barChartData} />
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Pie Chart - 4 columns */}
                            <Grid item xs={12} md={4}>
                                <Card sx={{ borderRadius: 2, boxShadow: '0 8px 18px rgba(31,45,61,0.05)', border: '1px solid #edf0f4', height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight="bold" sx={{ color: '#1f2937', mb: 1 }}>
                                            Request Distribution
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                                            Breakdown by status
                                        </Typography>
                                        <SimplePieChart data={pieChartData} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default DashboardLayout;
