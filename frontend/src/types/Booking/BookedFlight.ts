import { TTourist } from "../Users/Tourist";

export type TBookedFlight = {
    _id: string;
    departureDate: string;  // Corresponds to Date in MongoDB, using string to handle ISO string format
    arrivalDate: string;    // Corresponds to Date in MongoDB, using string to handle ISO string format
    departureAirport: string;
    arrivalAirport: string;
    noOfPassengers: number; // The number of passengers
    price: number;          // The flight price
    createdBy: TTourist;    // ObjectId referencing 'User'
    status: 'Pending' | 'Completed' | 'Cancelled'; // Flight status
    isActive: boolean;      // Whether the flight booking is active
    createdAt: string;      // Automatically added timestamp (ISO string format)
    updatedAt: string;      // Automatically added timestamp (ISO string format)
};
