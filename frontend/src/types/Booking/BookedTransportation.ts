import { TTransportation } from "../Transportation";
import { TTourist } from "../Users/Tourist";
import { ObjectId } from "mongoose";

export type IBookedTransportation = {
    transportation: ObjectId | TTransportation; // ObjectId reference to the Transportation document, or the full Transportation object
    createdBy: ObjectId | TTourist; // ObjectId reference to the User document, or the full User object
    date: string; // The date of the transportation booking
    price: number; // The price for the transportation (added as per Mongoose schema)
    status: 'Pending' | 'Completed' | 'Cancelled'; // Enum for status
    isActive: boolean; // Whether the transportation booking is active
    createdAt?: string; // Timestamps for creation
    updatedAt?: string; // Timestamps for updates
};
