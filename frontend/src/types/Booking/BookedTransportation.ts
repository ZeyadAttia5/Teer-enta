// TypeScript interface for BookedTransportation
import {TTransportation} from "../Transportation";
import {TTourist} from "../Users/Tourist";

export type IBookedTransportation = {
    transportation: TTransportation; // The ObjectId reference to the Transportation document (as a string in frontend)
    createdBy: TTourist; // The ObjectId reference to the User document (as a string in frontend)
    status: 'Pending' | 'Completed' | 'Cancelled'; // Enum for status
    isActive: boolean; // Whether the transportation booking is active
    createdAt?: string; // Timestamps for creation
    updatedAt?:string; // Timestamps for updates
}
