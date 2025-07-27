'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { memberSchema } from '@/lib/validation';
import Link from 'next/link';

const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
    name: memberSchema.shape.name,
    phoneNumber: memberSchema.shape.phoneNumber,
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegistrationFormProps {
    onSuccess?: () => void;
    showLoginLink?: boolean;
    submitLabel?: string;
    loadingLabel?: string;
    showPasswordRequirements?: boolean;
}

export default function RegistrationForm({ 
    onSuccess, 
    showLoginLink = true,
    submitLabel = 'Sign Up',
    loadingLabel = 'Signing Up...',
    showPasswordRequirements = true
}: RegistrationFormProps) {
    const { login } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const mutation = useMutation({
        mutationFn: async (data: RegisterFormData) => {
            try {
                const { confirmPassword, ...registerData } = data;
                const response = await authApi.register(registerData);
                return response;
            } catch (error: any) {
                if (error.response?.data?.email) {
                    setError('email', { message: error.response.data.email });
                } else {
                    throw error;
                }
            }
        },
        onSuccess: (data) => {
            if (onSuccess) {
                onSuccess();
            } else {
                login(data.token);
            }
        },
        onError: (error: any) => {
            console.error('Registration error:', error);
            setError('root', {
                message: error.response?.data?.message || 'Failed to register. Please try again.'
            });
        }
    });

    return (
        <div className="w-full">
            {showLoginLink && (
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            )}

            <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
                <form className="space-y-6" onSubmit={handleSubmit((data) => mutation.mutate(data))} noValidate>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <div className="mt-1 relative">
                            <input
                                id="name"
                                {...register('name')}
                                type="text"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1 relative">
                            <input
                                id="email"
                                {...register('email')}
                                type="email"
                                autoComplete="email"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <input
                                id="password"
                                {...register('password')}
                                type="password"
                                autoComplete="new-password"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <div className="mt-1 relative">
                            <input
                                id="confirmPassword"
                                {...register('confirmPassword')}
                                type="password"
                                autoComplete="new-password"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <div className="mt-1 relative">
                            <input
                                id="phoneNumber"
                                {...register('phoneNumber')}
                                type="tel"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                                placeholder="(123) 456-7890"
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
                            disabled={isSubmitting || mutation.isPending}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {(isSubmitting || mutation.isPending) ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {loadingLabel}
                                </div>
                            ) : (
                                submitLabel
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {showPasswordRequirements && (
                <div className="mt-8">
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
            )}
        </div>
    );
} 