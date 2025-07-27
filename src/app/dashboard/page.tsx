'use client';

import { useAuth } from '@/contexts/AuthContext';
import UserDashboard from '@/components/UserDashboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { isAuthenticated, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else if (isAdmin) {
            router.push('/admin/dashboard');
        }
    }, [isAuthenticated, isAdmin, router]);

    if (!isAuthenticated || isAdmin) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    My Profile
                </h1>
                <UserDashboard />
            </div>
        </div>
    );
} 