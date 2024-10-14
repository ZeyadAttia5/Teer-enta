import { TUser } from './User'; // Assuming the base user type is defined

export type TAdvertiser = TUser & {
    companyName?: string;
    website?: string;
    logoUrl?: string;
    profileDocument?: string;
    idCardUrl?: string;
    taxationCardUrl?: string;
    isTermsAndConditionsAccepted?: boolean;
    hotline?: string;
    companyProfile?: string;
    industry?: string;
    companySize: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1001+';
    foundedAt?: string; // Date field
    location: {
        address?: string;
        city?: string;
        country?: string;
    };
    socialMediaLinks: {
        linkedin?: string;
        facebook?: string;
        twitter?: string;
        instagram?: string;
    };
    isAccepted: 'Pending' | 'Accepted' | 'Rejected';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};
