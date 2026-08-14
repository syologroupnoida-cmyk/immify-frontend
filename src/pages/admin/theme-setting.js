import React from 'react';
import SuperadminDashboard from '@/components/dashboard/SuperadminDashboard';
import ThemeSetting from '@/components/admin/ThemeSettings';

function theme_setting() {
    return (
        <div>
            <SuperadminDashboard>
                <ThemeSetting />
            </SuperadminDashboard>
        </div>
    )
}

export default theme_setting;
