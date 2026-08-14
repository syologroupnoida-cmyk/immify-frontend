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
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import SidebarLogo from '@/images/sidebar-logo.png';
import LogoutButton from '@/components/common/LogoutButton';
import { getDisplayRoleLabel, getPasswordRoute, getProfileRoute } from '@/util/authRouting';

// Admin navigation
const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard/admin' },
    {
        name: 'Lead',
        icon: <SupportIcon />,
        children: [
            { name: 'New Lead List', path: '/dashboard/admin?view=new-leads' },
            { name: 'Verification Queue List', path: '/dashboard/admin?view=verification-queue' },
            { name: 'Publish List', path: '/dashboard/admin?view=published-leads' },
        ],
    },
    {
        name: 'Lead Pricing',
        icon: <LocalOfferIcon />,
        children: [
            { name: 'Set Lead', path: '/dashboard/admin?view=set-lead-pricing' },
        ],
    },
    {
        name: 'Lead Distribution',
        icon: <PersonAddIcon />,
        children: [
            { name: 'Auto Assignment', path: '/dashboard/admin?view=auto-assignment' },
            { name: 'Manual Assignment', path: '/dashboard/admin?view=manual-assignment' },
        ],
    },
    {
        name: 'Agent Management',
        icon: <PeopleIcon />,
        children: [
            { name: 'Agent List', path: '/agent/agent-list' },
            { name: 'Approval Agent List', path: '/dashboard/admin?view=agent-approvals' },
            { name: 'Suspension', path: '/dashboard/admin?view=agent-suspensions' },
        ],
    },
    {
        name: 'Booking Report',
        icon: <AssessmentIcon />,
        children: [
            { name: 'Total Booking List', path: '/dashboard/admin?view=total-bookings' },
            { name: 'Agent Performance List', path: '/dashboard/admin?view=agent-performance' },
        ],
    },
    {
        name: 'Finance',
        icon: <RevenueIcon />,
        children: [
            { name: 'Lead Revenue', path: '/dashboard/admin?view=lead-revenue' },
            { name: 'Subscription Revenue', path: '/dashboard/admin?view=subscription-revenue' },
        ],
    },
];

// Stats Cards Data
const statsData = [
    { title: 'Total Lead', value: '1,234', change: '+12%', icon: <SupportIcon />, color: '#f79f03' },
    { title: 'Revenue Today', value: '$45,678', change: '+8%', icon: <RevenueIcon />, color: '#4caf50' },
    { title: 'Active Agent', value: '568', change: '+23%', icon: <PeopleIcon />, color: '#2196f3' },
    { title: 'Lead Sales', value: '892', change: '+15%', icon: <LocalOfferIcon />, color: '#9c27b0' },
];

// Recent Bookings Data
const recentBookings = [
    { id: 1, customer: 'John Doe', package: 'Shimla Manali Tour', amount: '$983', status: 'Confirmed', date: '2024-01-15' },
    { id: 2, customer: 'Jane Smith', package: 'Kerala Backwaters', amount: '$899', status: 'Pending', date: '2024-01-14' },
    { id: 3, customer: 'Mike Johnson', package: 'Goa Beach Holiday', amount: '$1,200', status: 'Confirmed', date: '2024-01-13' },
    { id: 4, customer: 'Sarah Williams', package: 'Rajasthan Heritage', amount: '$1,450', status: 'Cancelled', date: '2024-01-12' },
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
        fullName: `${firstName} ${lastName}`.trim() || user?.name || user?.fullName || user?.full_name || 'Admin',
    };
}

function getUserInitial(user) {
    const { firstName, fullName } = getUserName(user);
    return (firstName || fullName).charAt(0).toUpperCase() || 'A';
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
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
                        <IconButton onClick={handleDrawerToggle} sx={{ color: '#071952', borderRadius: 1 }}>
                            {open ? <ChevronLeftIcon /> : <MenuIcon />}
                        </IconButton>
                        <Typography sx={{ color: '#071952', fontSize: 22, fontWeight: 600, whiteSpace: 'nowrap' }}>
                            Admin Dashboard
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
                        <Button href="/pricing" variant="outlined" size="small" sx={{ borderColor: '#e0e0e0', color: '#071952' }}>
                            Pricing
                        </Button>
                        <IconButton onClick={handleNotificationOpen} sx={{ color: '#666' }}>
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                            <Avatar sx={{ bgcolor: '#f79f03', width: 40, height: 40, cursor: 'pointer' }}>
                                {userInitial}
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
                    <Box sx={{ width: isSidebarOpen ? 170 : 64, height: isSidebarOpen ? 48 : 48, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                            <Typography variant="body2">New booking received!</Typography>
                            <Typography variant="caption" color="text.secondary">5 minutes ago</Typography>
                        </Box>
                    </MenuItem>
                    <MenuItem>
                        <Box>
                            <Typography variant="body2">Payment successful for Booking #1234</Typography>
                            <Typography variant="caption" color="text.secondary">1 hour ago</Typography>
                        </Box>
                    </MenuItem>
                    <MenuItem>
                        <Box>
                            <Typography variant="body2">New customer registered</Typography>
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
                            <Typography variant="h5" gutterBottom>Welcome back, John!</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Here&apos;s what&apos;s happening with your travel business today.
                            </Typography>
                        </Paper>

                        {/* Stats Cards */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, minmax(0, 1fr))',
                                    md: 'repeat(6, minmax(0, 1fr))',
                                },
                                gap: 1.5,
                                mb: 2,
                            }}
                        >
                            {statsData.map((stat, index) => (
                                <Card
                                    key={index}
                                    sx={{
                                        borderRadius: 2,
                                        minHeight: 96,
                                        border: '1px solid #edf0f4',
                                        boxShadow: '0 8px 18px rgba(31,45,61,0.05)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 24px rgba(31,45,61,0.08)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ height: '100%', p: 1.25 }}>
                                        <Stack spacing={1} alignItems="center" justifyContent="center" sx={{ height: '100%', textAlign: 'center' }}>
                                            <Stack direction="row" spacing={0.8} alignItems="center" justifyContent="center" sx={{ width: '100%', minHeight: 28 }}>
                                                <Avatar sx={{ bgcolor: `${stat.color}20`, color: stat.color, width: 28, height: 28, '& .MuiSvgIcon-root': { fontSize: 17 } }}>
                                                    {stat.icon}
                                                </Avatar>
                                                <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, lineHeight: 1.15, textAlign: 'center' }}>
                                                    {stat.title}
                                                </Typography>
                                            </Stack>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography sx={{ fontSize: 24, lineHeight: 1, fontWeight: 600, color: '#1f2937' }}>
                                                    {stat.value}
                                                </Typography>
                                                <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center" sx={{ mt: 0.5 }}>
                                                    <Chip
                                                        label={stat.change}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: stat.change.includes('+') ? '#e8f5e9' : '#ffebee',
                                                            color: stat.change.includes('+') ? '#2e7d32' : '#c62828',
                                                            fontSize: 11,
                                                            height: 20,
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>vs last month</Typography>
                                                </Stack>
                                            </Box>
                                            <Box sx={{ width: '100%', height: 3, borderRadius: 999, bgcolor: '#eef2f7', overflow: 'hidden', mt: 'auto' }}>
                                                <Box sx={{ width: `${72 + index * 6}%`, height: '100%', bgcolor: stat.color, borderRadius: 999 }} />
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                        {/* Recent Bookings & Activity */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <Card sx={{ borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">
                                            Recent Bookings
                                        </Typography>
                                        <Box sx={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                        <th style={{ padding: '12px', textAlign: 'left' }}>Customer</th>
                                                        <th style={{ padding: '12px', textAlign: 'left' }}>Package</th>
                                                        <th style={{ padding: '12px', textAlign: 'left' }}>Amount</th>
                                                        <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                                                        <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recentBookings.map((booking) => (
                                                        <tr key={booking.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                            <td style={{ padding: '12px' }}>{booking.customer}</td>
                                                            <td style={{ padding: '12px' }}>{booking.package}</td>
                                                            <td style={{ padding: '12px' }}>{booking.amount}</td>
                                                            <td style={{ padding: '12px' }}>
                                                                <Chip
                                                                    label={booking.status}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: booking.status === 'Confirmed' ? '#e8f5e9' : booking.status === 'Pending' ? '#fff3e0' : '#ffebee',
                                                                        color: booking.status === 'Confirmed' ? '#2e7d32' : booking.status === 'Pending' ? '#ed6c02' : '#c62828',
                                                                    }}
                                                                />
                                                            </td>
                                                            <td style={{ padding: '12px' }}>{booking.date}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Card sx={{ borderRadius: 2, mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">
                                            Quick Actions
                                        </Typography>
                                        <Stack spacing={1}>
                                            <Button fullWidth variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#f79f03' }}>
                                                Add New Package
                                            </Button>
                                            <Button fullWidth variant="outlined" startIcon={<PeopleIcon />}>
                                                Add Customer
                                            </Button>
                                            <Button fullWidth variant="outlined" startIcon={<BookingsIcon />}>
                                                Create Booking
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </Card>

                                <Card sx={{ borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">
                                            Popular Destinations
                                        </Typography>
                                        <Stack spacing={1}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LocationIcon sx={{ color: '#f79f03' }} />
                                                    <Typography>Goa</Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight="bold">245 bookings</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LocationIcon sx={{ color: '#f79f03' }} />
                                                    <Typography>Manali</Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight="bold">189 bookings</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LocationIcon sx={{ color: '#f79f03' }} />
                                                    <Typography>Kerala</Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight="bold">167 bookings</Typography>
                                            </Box>
                                        </Stack>
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
