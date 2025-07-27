'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { memberApi } from '@/lib/api';
import MemberForm from './MemberForm';

export default function UserDashboard() {
    const [isEditing, setIsEditing] = useState(false);
    
    const { data: member, isLoading } = useQuery({
        queryKey: ['currentMember'],
        queryFn: memberApi.getCurrentMember
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!member) {
        return (
            <div className="text-center text-gray-600">
                Failed to load member information
            </div>
        );
    }

    return (
        <div>
            {isEditing ? (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Edit Profile</h2>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <MemberForm
                            member={member}
                            onSuccess={() => setIsEditing(false)}
                        />
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-5">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                                <p className="mt-1 text-sm text-gray-500">Update your personal details here.</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Edit Profile
                            </button>
                        </div>
                        <div className="mt-6 border-t border-gray-100">
                            <dl className="divide-y divide-gray-100">
                                <div className="py-4">
                                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{member.name}</dd>
                                </div>
                                <div className="py-4">
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{member.email}</dd>
                                </div>
                                <div className="py-4">
                                    <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{member.phoneNumber}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 