import {TTourist} from "./Users/Tourist";

export type TComplain = {
    _id: string;
    title: string;
    body: string;
    date: string; // Dates are often serialized as strings in JSON
    createdBy: TTourist; // ObjectId referencing the 'User' model
    status: 'Pending' | 'Resolved';
    reply?: string; // Optional field
    createdAt: string; // Mongoose timestamps
    updatedAt: string; // Mongoose timestamps
};
