import {TActivity} from "../Activity/Activity";
import {TPreferenceTag} from "./PreferenceTag";
import {TTourist} from "../Users/Tourist";
import {TTourGuide} from "../Users/TourGuide";

export type TItinerary = {
    _id: string;
    name: string;
    accessibility?: string;
    pickupLocation?: string;
    dropOffLocation?: string;
    isBookingOpen: boolean;
    imageUrl: string;
    language: string;
    price: number;
    isActive: boolean;
    createdBy: TTourGuide; // ObjectId referencing 'User'
    activities: {
        activity: TActivity; // ObjectId referencing 'ActivityList'
        duration: number;
    }[];
    timeline: {
        activity: TActivity; // ObjectId referencing 'ActivityList'
        startTime?: string;
        duration?: number; // in minutes
    }[];
    availableDates: {
        Date: string; // ISO date string
        Times: string;
    }[];
    preferenceTags: TPreferenceTag[]; // Array of ObjectIds referencing 'PreferenceTags'
    ratings: {
        createdBy: TTourist; // ObjectId referencing 'User'
        rating: number;

    }[];
    comments: {
        createdBy: TTourist; // ObjectId referencing 'User'
        comment: string;
    }[];
    createdAt: string;
    updatedAt: string;
};
