export interface Shipper{
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: boolean;
    address: string;
    vehicle: {
        name: string;
        typeVehicle: string;
        color: string;
        licensePlateNumber: string;
    };
    status: boolean;
    createdAt: string;
    updatedAt: string;
    shipperArea: {
        latitude: number;
        longitude: number;
    }[];
}

export interface ShipperResponse {
    code: number;
    message: string;
    data: Shipper
}