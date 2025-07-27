import axios from 'axios';
import { Member, MemberInput, Role } from '@/types/member';
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
        // Get public key and encrypt password
        const publicKey = await authApi.getPublicKey();
        const encryptedPassword = await encryptPassword(data.password, publicKey);
        
        const response = await api.post('/auth/login', {
            email: data.email,
            password: encryptedPassword
        });
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        // Get public key and encrypt password
        const publicKey = await authApi.getPublicKey();
        const encryptedPassword = await encryptPassword(data.password, publicKey);
        
        const response = await api.post('/auth/register', {
            ...data,
            password: encryptedPassword
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

    updateRole: async (id: string, role: Role): Promise<Member> => {
        const response = await api.patch(`/members/${id}/role`, { role });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/members/${id}`);
    }
}; 