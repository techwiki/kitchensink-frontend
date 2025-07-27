'use client';

import RegistrationForm from './RegistrationForm';

export default function RegisterForm() {
    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <RegistrationForm />
            </div>
        </div>
    );
} 