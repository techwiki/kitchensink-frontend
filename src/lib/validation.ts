import { z } from 'zod';

export const memberSchema = z.object({
    name: z.string()
        .min(1, 'Name is required')
        .max(25, 'Name must be 25 characters or less')
        .regex(/^[^0-9]*$/, 'Name must not contain numbers'),
    
    email: z.string()
        .email('Invalid email address')
        .min(1, 'Email is required'),
    
    phoneNumber: z.string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(12, 'Phone number must be 12 digits or less')
        .regex(/^\d+$/, 'Phone number must contain only digits')
}); 