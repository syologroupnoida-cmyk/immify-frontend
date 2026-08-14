import React from 'react';
import SignUpForm from '@/auth/admin/SignUp';

function sign_up() {
    return (
        <div>
            <SignUpForm />
        </div>
    )
}

sign_up.disableDefaultLayout = true;

export default sign_up;
