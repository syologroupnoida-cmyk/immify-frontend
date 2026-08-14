import React from 'react';
import Login from '@/auth/user/Login';

function login() {
    return (
        <div>
            <Login />
        </div>
    )
}

login.disableDefaultLayout = true;

export default login
