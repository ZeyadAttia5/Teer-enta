import {TTourist} from "../Users/Tourist";

export type TBookedFlight = {
    _id: string;
    createdBy: TTourist; // ObjectId referencing 'User'
    status: 'Pending' | 'Completed' | 'Cancelled';
    isActive: boolean;
    createdAt: string; // Automatically added timestamp
    updatedAt: string; // Automatically added timestamp
};
