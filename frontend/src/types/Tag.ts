import {TUser} from "./Users/User";

export type TTag = {
    _id: string;
    name: string;
    type?: 'Monuments' | 'Museums' | 'Religious' | 'Sites' | 'Palaces' | 'Castles';
    historicalPeriod?: 'Ancient' | 'Medieval' | 'Modern';
    isActive: boolean;
    createdBy: TUser; // Tourist Governer
    createdAt: string;
    updatedAt: string;
};
