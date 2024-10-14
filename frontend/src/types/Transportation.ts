import {TUser} from "./Users/User";
import {TAdvertiser} from "./Users/Advertiser";

export type TTransportation = {
    _id: string;
    pickupLocation: {
        lat: number;
        lng: number;
    };
    dropOffLocation: {
        lat: number;
        lng: number;
    };
    price: number;
    date: string; // Date field
    vehicleType: 'Car' | 'Scooter' | 'Bus';
    notes: string;
    isActive?: boolean;
    createdBy: TAdvertiser; // Reference to the User model
    createdAt?: string; // Automatically added by Mongoose if timestamps are used
    updatedAt?: string; // Automatically added by Mongoose if timestamps are used
}