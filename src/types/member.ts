export interface Member {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
}

export type MemberInput = Omit<Member, 'id'>; 