import { TUser } from './User'; // Adjust the path as needed
import {TTourist} from "./Tourist";

export type TTourGuide = TUser & {
    mobileNumber?: string;
    yearsOfExperience: number;
    photoUrl?: string;
    idCardUrl?: string;
    certificates:Array<{
        certificateUrl:string;
    }>
    isTermsAndConditionsAccepted?: boolean;
    isActive: boolean;
    previousWorks: Array<{
        jobTitle?: string;
        jobDescription?: string;
        timeLine: Array<{
            startTime: string; // Dates are usually converted to strings in JSON responses
            endTime?: string;
        }>;
    }>;
    ratings: Array<{
        createdBy: TTourist; // ObjectId referencing the 'User' model
        rating: number;
    }>;
    comments: Array<{
        createdBy: TTourist; // ObjectId referencing the 'User' model
        comment: string;
    }>;
    isAccepted: 'Pending' | 'Accepted' | 'Rejected';
    createdAt: string;
    updatedAt: string;
};
