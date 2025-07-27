'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '@/lib/api';
import { Member } from '@/types/member';
import MemberForm from './MemberForm';

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
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4">
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
                        <MemberForm
                            member={editingMember}
                            onSuccess={() => {
                                setEditingMember(null);
                                setIsAddingMember(false);
                                queryClient.invalidateQueries({ queryKey: ['members'] });
                            }}
                        />
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {members.map((member) => (
                            <tr key={member.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.phoneNumber}</td>
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