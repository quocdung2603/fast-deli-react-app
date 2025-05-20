import { GeoPoint } from "./OrderType"

export interface Tracking{
    id: string,
    orderId: string,
    description: string,
    status: string,
    location: GeoPoint,
    nextLocation: GeoPoint
    timeStamp: string,
    updateTimeStamp: string,
    shipperId: string 
}
export interface TrackingResponse{
    code: number,
    message: string,
    data: Tracking[]
}
export interface UpdateTracking{
    status: string,
    shipperId: string | null
}

export interface CheckShipper{
    code: number,
    message: string,
    data: boolean
}