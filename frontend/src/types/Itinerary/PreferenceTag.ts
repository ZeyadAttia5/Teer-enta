import { TUser } from '../Users/User';

export type TPreferenceTag = {
    _id: string;
    tag: string;
    isActive: boolean;
    createdBy: TUser; // Admin
    createdAt: string;
    updatedAt: string;
};
