'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '@/lib/api';
import { Member } from '@/types/member';
import MemberForm from './MemberForm';
import RegistrationForm from './RegistrationForm';

export default function AdminDashboard() {
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const queryClient = useQueryClient();

    const { data: members = [], isLoading } = useQuery({
        queryKey: ['members'],
        queryFn: memberApi.getAll
    });

    const deleteMutation = useMutation({
        mutationFn: memberApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
        }
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div>
            {(editingMember || isAddingMember) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`bg-white p-6 rounded-lg shadow-xl mx-4 ${isAddingMember ? 'max-w-6xl w-full' : 'max-w-2xl w-full'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">
                                {isAddingMember ? 'Add Member' : 'Edit Member'}
                            </h2>
                            <button
                                onClick={() => {
                                    setEditingMember(null);
                                    setIsAddingMember(false);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        {isAddingMember ? (
                            <div className="flex flex-col lg:flex-row gap-8 items-start">
                                <div className="w-full lg:w-[600px]">
                                    <RegistrationForm
                                        showLoginLink={false}
                                        showPasswordRequirements={false}
                                        submitLabel="Add Member"
                                        loadingLabel="Adding Member..."
                                        onSuccess={() => {
                                            setIsAddingMember(false);
                                            queryClient.invalidateQueries({ queryKey: ['members'] });
                                        }}
                                    />
                                </div>
                                <div className="hidden lg:block w-[320px] flex-shrink-0">
                                    <div className="sticky top-8">
                                        <div className="bg-indigo-50/80 rounded-xl p-6 backdrop-blur-sm shadow-lg border border-indigo-100">
                                            <h3 className="text-lg font-semibold text-indigo-900 mb-4">Password Requirements</h3>
                                            <ul className="space-y-3 text-sm text-indigo-800">
                                                <li className="flex items-center">
                                                    <svg className="h-5 w-5 mr-2 text-indigo-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    Minimum 8 characters
                                                </li>
                                                <li className="flex items-center">
                                                    <svg className="h-5 w-5 mr-2 text-indigo-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    One uppercase letter
                                                </li>
                                                <li className="flex items-center">
                                                    <svg className="h-5 w-5 mr-2 text-indigo-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    One lowercase letter
                                                </li>
                                                <li className="flex items-center">
                                                    <svg className="h-5 w-5 mr-2 text-indigo-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    One number
                                                </li>
                                                <li className="flex items-center">
                                                    <svg className="h-5 w-5 mr-2 text-indigo-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    One special character
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <MemberForm
                                member={editingMember}
                                onSuccess={() => {
                                    setEditingMember(null);
                                    queryClient.invalidateQueries({ queryKey: ['members'] });
                                }}
                            />
                        )}
                    </div>
                </div>
            )}

            <div className="mb-6">
                <button
                    onClick={() => setIsAddingMember(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                    Add Member
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {members.map((member) => (
                            <tr key={member.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.phoneNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            member.role === 'ROLE_ADMIN' 
                                                ? 'bg-purple-100 text-purple-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {member.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                                        </span>
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to change ${member.name}'s role to ${member.role === 'ROLE_ADMIN' ? 'User' : 'Admin'}?`)) {
                                                    const newRole = member.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
                                                    memberApi.updateRole(member.id, newRole)
                                                        .then(() => {
                                                            queryClient.invalidateQueries({ queryKey: ['members'] });
                                                        })
                                                        .catch((error) => {
                                                            console.error('Failed to update role:', error);
                                                            alert('Failed to update role. Please try again.');
                                                        });
                                                }
                                            }}
                                            className="text-gray-400 hover:text-gray-600"
                                            title={`Change role to ${member.role === 'ROLE_ADMIN' ? 'User' : 'Admin'}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        onClick={() => setEditingMember(member)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this member?')) {
                                                deleteMutation.mutate(member.id);
                                            }
                                        }}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 