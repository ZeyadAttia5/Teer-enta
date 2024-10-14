import {TTourist} from "../Users/Tourist";
import {TProduct} from "./Product";

export type TOrderProduct = {
    product: TProduct; // Product ID (refers to TProduct in another context)
    quantity: number;
    price: number;
};

export type TOrder = {
    _id: string;
    createdBy: TTourist
    products: TOrderProduct[];
    totalPrice: number;
    status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};
