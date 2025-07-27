'use client';

import MemberForm from '@/components/MemberForm';
import MemberList from '@/components/MemberList';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
    return (
        <ProtectedRoute>
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Kitchensink Member Registration
                </h1>
                <MemberForm />
                <MemberList />
            </main>
        </ProtectedRoute>
    );
}
