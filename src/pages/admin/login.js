import React from 'react';
import LoginForm from '@/auth/admin/Login';

function login() {
    return (
        <div>
            <LoginForm />
        </div>
    )
}

login.disableDefaultLayout = true;

export default login;
