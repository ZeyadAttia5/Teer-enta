export type TUser = {
    _id: string;
    email: string;
    username: string;
    password: string;
    userRole: 'Tourist' | 'TourGuide' | 'Advertiser' | 'Seller' | 'Admin' | 'TourismGovernor';
    hasProfile: boolean;
    createdAt: string; // Mongoose timestamps
    updatedAt: string; // Mongoose timestamps
};
