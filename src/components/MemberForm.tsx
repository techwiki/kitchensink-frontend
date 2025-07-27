'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '@/lib/api';
import { Member, MemberInput } from '@/types/member';
import { memberSchema } from '@/lib/validation';

interface MemberFormProps {
    member?: Member | null;
    onSuccess: () => void;
}

export default function MemberForm({ member, onSuccess }: MemberFormProps) {
    const queryClient = useQueryClient();
    const isEditing = !!member;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<MemberInput>({
        resolver: zodResolver(memberSchema),
        defaultValues: member || undefined
    });

    const mutation = useMutation({
        mutationFn: async (data: MemberInput) => {
            if (isEditing && member) {
                return memberApi.update(member.id, data);
            } else {
                return memberApi.create(data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
            queryClient.invalidateQueries({ queryKey: ['currentMember'] });
            onSuccess();
        },
        onError: (error: any) => {
            console.error('Form submission error:', error);
            if (error.response?.data?.message) {
                setError('root', { message: error.response.data.message });
            } else {
                setError('root', { message: 'An unexpected error occurred' });
            }
        }
    });

    return (
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                </label>
                <div className="mt-1">
                    <input
                        {...register('name')}
                        type="text"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <div className="mt-1">
                    <input
                        {...register('email')}
                        type="email"
                        disabled={isEditing}
                        className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${isEditing ? 'bg-gray-100' : ''}`}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                    {isEditing && (
                        <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                </label>
                <div className="mt-1">
                    <input
                        {...register('phoneNumber')}
                        type="tel"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                    )}
                </div>
            </div>

            {errors.root && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                {errors.root.message}
                            </h3>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {mutation.isPending ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </div>
                    ) : (
                        isEditing ? 'Save Changes' : 'Create Member'
                    )}
                </button>
            </div>
        </form>
    );
} 