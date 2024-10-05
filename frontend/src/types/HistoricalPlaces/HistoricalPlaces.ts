import {TTag} from "../Tag";
import {TUser} from "../Users/User";

export type THistoricalPlace = {
    _id: string;
    name: string;
    openingHours: string;
    description: string;
    location: string;
    images: string[]; // Array of image URLs
    isActive: boolean;
    tags: TTag[]; // Array of ObjectIds referencing 'Tag' schema
    tickets: {
        type: string;
        price: number;
    }[];
    createdBy: TUser; // ObjectId referencing 'User' schema
    createdAt: string;
    updatedAt: string;
};
