export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export interface Member {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: Role;
}

export type MemberInput = Omit<Member, 'id' | 'role'>; 