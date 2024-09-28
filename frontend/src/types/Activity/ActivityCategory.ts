import {TUser} from "../Users/User";

export type TActivityCategory = {
    _id: string;
    category: string;
    description?: string; // Optional field
    isActive: boolean;
    createdBy: TUser; // ObjectId referencing 'User' schema
    createdAt: string;
    updatedAt: string;
};
