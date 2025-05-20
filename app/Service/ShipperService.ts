import { request } from "../Config/Request"

export const ShipperService = {
    findShipperByUserId: async(userId:string)=>{
        const res = await request.get(`/shipperservice/shipper/findByUserId/${userId}`);
        return res.data;
    }
}