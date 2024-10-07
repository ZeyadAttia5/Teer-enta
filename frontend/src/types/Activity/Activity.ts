import {TTag} from "../Tag";
import {TActivityCategory} from "./ActivityCategory";
import {TTourist} from "../Users/Tourist";
import {TAdvertiser} from "../Users/Advertiser";
import {TPreferenceTag} from "../Itinerary/PreferenceTag";

export type TActivity = {
    _id: string;
    name: string;
    date: string; // ISO date string
    time: string;
    isBookingOpen: boolean;
    location: {
        lat: number;
        lng: number;
    };
    isActive: boolean;
    price: {
        min?: number;
        max?: number;
    };
    category: TActivityCategory; // ObjectId referencing 'ActivityCategories'
    preferenceTags: TPreferenceTag[]; // Array of ObjectIds referencing 'Tag'
    specialDiscounts: {
        discount: number;
        Description: string;
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
