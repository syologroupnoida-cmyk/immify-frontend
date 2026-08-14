import React from 'react';
import SignUp from '@/auth/user/SignUp';

function sign_up() {
    return (
        <div>
            <SignUp />
        </div>
    )
}

sign_up.disableDefaultLayout = true;

export default sign_up;
