import {TPreferenceTag} from "./Itinerary/PreferenceTag";

export type THotel = {
    _id: string;
    name: string;
    location: string;
    price: number;
    rating: number;
    tags: TPreferenceTag[] ;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};
