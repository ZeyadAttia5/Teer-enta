import {TTourist} from "../Users/Tourist";
import {TSeller} from "../Users/Seller";
import {TUser} from "../Users/User";

export type TProduct = {
    _id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    price: number;
    quantity: number;
    createdBy: TUser|TSeller;
    ratings: Array<{
        createdBy: TTourist; // ObjectId referencing the 'User' model
        rating: number;
    }>;
    reviews: Array<{
        createdBy: TTourist; // ObjectId referencing the 'User' model
        review: string;
    }>;
    isActive: boolean;
    createdAt: string; // Mongoose timestamps
    updatedAt: string; // Mongoose timestamps
};
