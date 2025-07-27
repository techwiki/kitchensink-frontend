import axios from 'axios';
import { Member, MemberInput } from '@/types/member';
import { encryptPassword } from './encryption';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface AuthResponse {
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest extends LoginRequest {
    name: string;
    phoneNumber: string;
}

export const authApi = {
    getPublicKey: async (): Promise<string> => {
        const response = await api.get('/keys/public');
        return response.data.publicKey;
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        // TEMPORARY: Skip encryption for debugging
        console.log('Attempting login without encryption (temporary)');
        
        const response = await api.post('/auth/login', {
            ...data,
            password: data.password // Send plain password temporarily
        });
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        // TEMPORARY: Skip encryption for debugging
        console.log('Attempting registration without encryption (temporary)');
        
        const response = await api.post('/auth/register', {
            ...data,
            password: data.password // Send plain password temporarily
        });
        return response.data;
    }
};

export const memberApi = {
    getAll: async (): Promise<Member[]> => {
        const response = await api.get('/members');
        return response.data;
    },
    
    getById: async (id: string): Promise<Member> => {
        const response = await api.get(`/members/${id}`);
        return response.data;
    },

    getCurrentMember: async (): Promise<Member> => {
        const response = await api.get('/members/me');
        return response.data;
    },
    
    create: async (member: MemberInput): Promise<Member> => {
        const response = await api.post('/members', member);
        return response.data;
    },

    update: async (id: string, member: MemberInput): Promise<Member> => {
        const response = await api.put(`/members/${id}`, member);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/members/${id}`);
    }
}; 