export type TFlight = {
    _id: string;
    flightNumber: string;
    departure: string;
    arrival: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    date: string;
    seats: number;
    availableSeats: number;
    status: 'Scheduled' | 'Delayed' | 'Cancelled';
    createdAt: string;
    updatedAt: string;
};
