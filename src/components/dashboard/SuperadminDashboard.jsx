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
    Card,
    CardContent,
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
    AttachMoney as MoneyIcon,
    PersonAdd as PersonAddIcon,
    ConfirmationNumber as TicketIcon,
    SupportAgent as SupportIcon,
    BarChart as ChartIcon,
    Assessment as AssessmentIcon,
    LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useRouter } from 'next/router';
import SidebarLogo from '@/images/sidebar-logo.png';
import LogoutButton from '@/components/common/LogoutButton';
import { getDisplayRoleLabel, getPasswordRoute, getProfileRoute } from '@/util/authRouting';

// Superadmin navigation
const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard/superadmin' },
    {
        name: 'Services',
        icon: <PackagesIcon />,
        children: [
            { name: 'Add Service Category', path: '/service/add-category' },
            { name: 'Add Services', path: '/service/add-services' },
        ],
    },
    {
        name: 'Subscription Plan',
        icon: <TicketIcon />,
        children: [
            { name: 'Add Plan', path: '/admin/add-subscription-plan' },
            
        ],
    },
    // {
    //     name: 'Lead Management',
    //     icon: <PackagesIcon />,
    //     children: [
    //         { name: 'Lead List', path: '/leads/lead-list' },
    //     ],
    // },
    // {
    //     name: 'Add Story',
    //     icon: <MoneyIcon />,
    //     children: [
    //         { name: 'Add Story', path: '/blog/add-story' },
    //         { name: 'Story List', path: '/blog/story-list' },
    //     ],
    // },
    // {
    //     name: 'Agent Management',
    //     icon: <PeopleIcon />,
    //     children: [
    //         { name: 'Agent List', path: '/agent/agent-list' },
    //         { name: 'Agent Wallet Recharge', path: '/agent/wallet-recharge' },
    //     ],
    // },
    // {
    //     name: 'Property Booking',
    //     icon: <ApartmentIcon />,
    //     children: [
    //         { name: 'Booking List', path: '/admin/booking-list' },
            
    //     ],
    // },
    // {
    //     name: 'CMS',
    //     icon: <PackagesIcon />,
    //     children: [
    //         { name: 'Add Blog', path: '/dashboard/superadmin?view=add-blog' },
    //         { name: 'Add Destination', path: '/dashboard/superadmin?view=add-destination' },
    //         { name: 'Add Offer', path: '/dashboard/superadmin?view=add-offer' },
    //     ],
    // },
    {
        name: 'Setting',
        icon: <SettingsIcon />,
        children: [
            { name: 'Theme Setting', path: '/admin/theme-setting' },
            { name: 'Update Profile', path: '/admin/update-profile' },
            { name: 'Update Password', path: '/admin/update-password' },
        ],
    },
];

// Stats Cards Data
const statsData = [
    { title: 'Total Lead', value: '1,234', change: '+12%', icon: <SupportIcon />, color: '#f79f03' },
    { title: 'All Agent', value: '568', change: '+23%', icon: <PeopleIcon />, color: '#2196f3' },
    { title: 'All Partner', value: '342', change: '+8%', icon: <HotelsIcon />, color: '#4caf50' },
    { title: 'All Registered Customer', value: '5,678', change: '+15%', icon: <PersonAddIcon />, color: '#9c27b0' },
];

const monthlyRevenueData = [
    { label: 'Jan', value: 72 },
    { label: 'Feb', value: 88 },
    { label: 'Mar', value: 104 },
    { label: 'Apr', value: 96 },
    { label: 'May', value: 118 },
    { label: 'Jun', value: 132 },
    { label: 'Jul', value: 146 },
    { label: 'Aug', value: 138 },
    { label: 'Sep', value: 154 },
    { label: 'Oct', value: 168 },
    { label: 'Nov', value: 182 },
    { label: 'Dec', value: 196 },
];

const leadShareData = [
    { label: 'Total Lead', value: 48, color: '#f79f03' },
    { label: 'All Agent', value: 22, color: '#2196f3' },
    { label: 'All Partner', value: 14, color: '#4caf50' },
    { label: 'All Registered Customer', value: 64, color: '#9c27b0' },
];

const maxMonthlyRevenue = Math.max(...monthlyRevenueData.map((item) => item.value));
const leadShareTotal = leadShareData.reduce((total, item) => total + item.value, 0);
const donutRadius = 54;
const donutCircumference = 2 * Math.PI * donutRadius;
const leadShareSegments = leadShareData.reduce((segments, item) => {
    const previousTotal = segments.reduce((total, segment) => total + segment.value, 0);

    return [
        ...segments,
        {
            ...item,
            dash: (item.value / leadShareTotal) * donutCircumference,
            offset: -(previousTotal / leadShareTotal) * donutCircumference,
        },
    ];
}, []);

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
        fullName: `${firstName} ${lastName}`.trim() || user?.name || user?.fullName || user?.full_name || 'Super Admin',
    };
}

function getUserInitial(user) {
    const { firstName, fullName } = getUserName(user);
    return (firstName || fullName).charAt(0).toUpperCase() || 'S';
}

function getUserEmail(user) {
    return user?.email || user?.emailAddress || user?.email_address || 'superadmin@tripz.local';
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
    const [hoveredLeadShare, setHoveredLeadShare] = useState(null);
    const [leadShareTooltip, setLeadShareTooltip] = useState(null);
    const userName = getUserName(user);
    const userInitial = getUserInitial(user);
    const userEmail = getUserEmail(user);

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
        if (!router.isReady) return;

        const syncCurrentPath = (path = router.asPath) => {
            setCurrentPath(path);
        };

        const frameId = window.requestAnimationFrame(() => syncCurrentPath());
        router.events.on('routeChangeComplete', syncCurrentPath);

        return () => {
            window.cancelAnimationFrame(frameId);
            router.events.off('routeChangeComplete', syncCurrentPath);
        };
    }, [router]);

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
                            Superadmin Dashboard
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
                <Box sx={{ p: 2, minHeight: 70, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ width: isSidebarOpen ? 260 : 90, height: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            src={SidebarLogo}
                            alt="Sidebar logo"
                            width={isSidebarOpen ? 170 : 90}
                            height={42}
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
                    px: 2,
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
                                <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</Typography>
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
                        {/* Stats Cards */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, minmax(0, 1fr))',
                                    lg: 'repeat(4, minmax(0, 1fr))',
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
                                        minHeight: 104,
                                        border: '1px solid #edf0f4',
                                        bgcolor: '#fff',
                                        boxShadow: '0 8px 18px rgba(31,45,61,0.05)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 24px rgba(31,45,61,0.08)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ height: '100%', p: 1.5 }}>
                                        <Stack spacing={1.1} alignItems="stretch" justifyContent="center" sx={{ height: '100%' }}>
                                            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-start', gap: 0.9, width: '100%', minWidth: 0 }}>
                                                <Avatar sx={{ bgcolor: `${stat.color}18`, color: stat.color, width: 32, height: 32, flexShrink: 0, '& .MuiSvgIcon-root': { fontSize: 18 } }}>
                                                    {stat.icon}
                                                </Avatar>
                                                <Typography sx={{ color: '#344054', fontSize: 13, fontWeight: 600, lineHeight: 1.2, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {stat.title}
                                                </Typography>
                                            </Box>
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
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.85fr) minmax(340px, 1fr)' },
                                gap: 1.5,
                                alignItems: 'stretch',
                            }}
                        >
                            <Card sx={{ borderRadius: 2, border: '1px solid #edf0f4', bgcolor: '#fff', boxShadow: '0 8px 18px rgba(31,45,61,0.05)', minHeight: 356 }}>
                                <CardContent sx={{ p: 2.25 }}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                        <Box>
                                            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#172b4d', lineHeight: 1.2 }}>
                                                Monthly Lead Growth
                                            </Typography>
                                            <Typography sx={{ color: '#667085', fontSize: 12, mt: 0.4 }}>Dummy lead volume by month</Typography>
                                        </Box>
                                        <Chip label="+14%" size="small" sx={{ height: 24, bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }} />
                                    </Stack>
                                    <Box sx={{ position: 'relative', height: 272, pt: 1, pl: 1, pr: 1 }}>
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
                                        <Box sx={{ position: 'relative', height: '100%', display: 'grid', gridTemplateColumns: `repeat(${monthlyRevenueData.length}, minmax(0, 1fr))`, gap: { xs: 0.6, md: 1 }, alignItems: 'end' }}>
                                            {monthlyRevenueData.map((item) => {
                                                const barHeight = Math.max((item.value / maxMonthlyRevenue) * 78, 14);

                                                return (
                                                    <Stack key={item.label} spacing={1} alignItems="center" justifyContent="flex-end" sx={{ height: '100%', pb: 0.2 }}>
                                                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#344054' }}>
                                                            {item.value}k
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                width: '100%',
                                                                maxWidth: 34,
                                                                height: `${barHeight}%`,
                                                                borderRadius: '7px 7px 2px 2px',
                                                                background: 'linear-gradient(0deg, #f79f03 0%, #ffcf6b 100%)',
                                                                boxShadow: '0 10px 18px rgba(247,159,3,0.22)',
                                                            }}
                                                        />
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
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                        <Box>
                                            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#172b4d', lineHeight: 1.2 }}>
                                                Dashboard Distribution
                                            </Typography>
                                            <Typography sx={{ color: '#667085', fontSize: 12, mt: 0.4 }}>Dummy data based on dashboard totals</Typography>
                                        </Box>
                                    </Stack>
                                    <Stack spacing={2.25} alignItems="center" justifyContent="flex-start" sx={{ minHeight: 268, pt: 0.5, width: '100%', flex: 1 }}>
                                        <Box sx={{ width: { xs: 176, sm: 188 }, height: { xs: 176, sm: 188 }, mx: 'auto', alignSelf: 'center', position: 'relative', flexShrink: 0 }}>
                                            <Box
                                                component="svg"
                                                viewBox="0 0 160 160"
                                                sx={{ width: '100%', height: '100%', display: 'block', filter: 'drop-shadow(0 16px 22px rgba(31,45,61,0.12))' }}
                                            >
                                                <circle cx="80" cy="80" r={donutRadius} fill="none" stroke="#edf0f4" strokeWidth="34" />
                                                {leadShareSegments.map((item) => {
                                                    const isActive = hoveredLeadShare === item.label;

                                                    return (
                                                        <circle
                                                            key={item.label}
                                                            cx="80"
                                                            cy="80"
                                                            r={donutRadius}
                                                            fill="none"
                                                            stroke={item.color}
                                                            strokeWidth={isActive ? 38 : 34}
                                                            strokeDasharray={`${item.dash} ${donutCircumference}`}
                                                            strokeDashoffset={item.offset}
                                                            strokeLinecap="butt"
                                                            transform="rotate(-90 80 80)"
                                                            onMouseEnter={(event) => {
                                                                setHoveredLeadShare(item.label);
                                                                setLeadShareTooltip({ label: item.label, value: item.value, color: item.color, x: event.clientX, y: event.clientY });
                                                            }}
                                                            onMouseMove={(event) => {
                                                                setLeadShareTooltip({ label: item.label, value: item.value, color: item.color, x: event.clientX, y: event.clientY });
                                                            }}
                                                            onMouseLeave={() => {
                                                                setHoveredLeadShare(null);
                                                                setLeadShareTooltip(null);
                                                            }}
                                                            style={{
                                                                cursor: 'pointer',
                                                                opacity: hoveredLeadShare && !isActive ? 0.58 : 1,
                                                                transition: 'stroke-width 160ms ease, opacity 160ms ease',
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </Box>
                                        </Box>
                                        <Stack spacing={0.9} sx={{ width: '100%' }}>
                                            {leadShareData.map((item) => (
                                                <Stack
                                                    key={item.label}
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    spacing={2}
                                                    onMouseEnter={() => setHoveredLeadShare(item.label)}
                                                    onMouseLeave={() => setHoveredLeadShare(null)}
                                                    sx={{
                                                        px: 1.25,
                                                        py: 0.75,
                                                        borderRadius: 1,
                                                        bgcolor: hoveredLeadShare === item.label ? `${item.color}14` : '#f8fafc',
                                                        cursor: 'default',
                                                        transition: 'background-color 160ms ease',
                                                    }}
                                                >
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                                                        <Typography sx={{ color: '#344054', fontSize: 13, fontWeight: 600 }}>{item.label}</Typography>
                                                    </Stack>
                                                    <Typography sx={{ color: '#172b4d', fontSize: 13, fontWeight: 600 }}>{item.value}%</Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Box>
                        {leadShareTooltip && (
                            <Box
                                sx={{
                                    position: 'fixed',
                                    left: leadShareTooltip.x,
                                    top: leadShareTooltip.y - 14,
                                    transform: 'translate(-50%, -100%)',
                                    zIndex: 1800,
                                    pointerEvents: 'none',
                                    bgcolor: '#172b4d',
                                    color: '#fff',
                                    borderRadius: 1,
                                    px: 1,
                                    py: 0.55,
                                    boxShadow: '0 10px 24px rgba(31,45,61,0.2)',
                                    minWidth: 0,
                                    width: 'max-content',
                                    maxWidth: 180,
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        left: '50%',
                                        bottom: -6,
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 0,
                                        borderLeft: '6px solid transparent',
                                        borderRight: '6px solid transparent',
                                        borderTop: '6px solid #172b4d',
                                    },
                                }}
                            >
                                <Typography sx={{ fontSize: 12, fontWeight: 600, lineHeight: 1.1 }}>
                                    {leadShareTooltip.label}: <Box component="span" sx={{ color: leadShareTooltip.color, fontWeight: 700 }}>{leadShareTooltip.value}%</Box>
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default DashboardLayout;
