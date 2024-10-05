import {TTourist} from "../Users/Tourist";
import {TProduct} from "./Product";

export type TOrderProduct = {
    product: TProduct; // Product ID (refers to TProduct in another context)
    quantity: number;
};

export type TOrder = {
    _id: string;
    createdBy: TTourist
    products: TOrderProduct[];
    status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};
