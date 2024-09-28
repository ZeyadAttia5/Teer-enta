import {TUser} from "./Users/User";

export type TPromoCode = {
    _id: string;
    code: string;
    discount: number;
    isActive: boolean;
    createdBy: TUser;
    createdAt: string;
    updatedAt: string;
};
