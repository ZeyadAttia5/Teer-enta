import { TUser } from './User'; // Adjust the path as needed

export type TSeller = TUser & {
    name?: string;
    logoUrl?: string;
    idCardUrl?: string;
    taxationCardUrl?: string;
    isTermsAndConditionsAccepted?: boolean ,
    description?: string;
    isAccepted: 'Pending' | 'Accepted' | 'Rejected';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};
