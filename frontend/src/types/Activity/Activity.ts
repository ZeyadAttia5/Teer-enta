import {TTag} from "../Tag";
import {TActivityCategory} from "./ActivityCategory";
import {TTourist} from "../Users/Tourist";
import {TAdvertiser} from "../Users/Advertiser";

export type TActivity = {
    _id: string;
    name: string;
    date: string; // ISO date string
    time: string;
    isBookingOpen: boolean;
    location: string;
    isActive: boolean;
    price: {
        min?: number;
        max?: number;
    };
    category: TActivityCategory; // ObjectId referencing 'ActivityCategory'
    tags: TTag[]; // Array of ObjectIds referencing 'Tag'
    specialDiscounts: {
        discount: number;
        description: string;
        isAvailable: boolean;
    }[];
    ratings: {
        createdBy: TTourist; // ObjectId referencing 'User'
        rating: number;
    }[];
    comments: {
        createdBy: TTourist; // ObjectId referencing 'User'
        comment: string;
    }[];
    createdBy: TAdvertiser; // ObjectId referencing 'User'
    createdAt: string;
    updatedAt: string;
};
