import { TUser } from './User';
import { TPreferenceTag } from '../Itinerary/PreferenceTag';
import { TComplain } from '../Complain';
import { TProduct } from '../Product/Product';

// Define TTourist which extends TUser
export type TTourist = TUser & {
    mobileNumber: string;
    nationality: string;
    dateOfBirth: string; // Dates are often converted to strings in JSON responses
    occupation: string;
    level?: string;
    loyaltyPoints: number;
    isActive: boolean;
    wallet: number;
    preferenceTags: TPreferenceTag[]; // Array of ObjectIds referencing 'PreferenceTags'
    complaints: TComplain[]; // Array of ObjectIds referencing 'Complain'
    addresses: string[]; // Array of strings (address details)
    wishList: TProduct[]; // Array of ObjectIds referencing 'Product'
    cart: Array<{
        product: TProduct; // ObjectId referencing 'Product'
        quantity: number;
    }>;
    createdAt: string;
    updatedAt: string;
};
