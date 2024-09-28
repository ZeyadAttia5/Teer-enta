import { TUser } from './User'; // Adjust the path as needed

export type TSeller = TUser & {
    name?: string;
    profileImage?: string;
    profileDocument?: string;
    description?: string;
    isAccepted: 'Pending' | 'Accepted' | 'Rejected';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};
