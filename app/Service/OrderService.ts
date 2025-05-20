import { request } from "../Config/Request";
import { Order1 } from "../Type/OrderType";
import { UpdateTracking } from "../Type/TrackingType";

export const OrderService = {
  getAllOrder: async () => {
    const res = await request.get("/orderservice");
    return res.data;
  },
  findOrderById: async (orderId: string) => {
    const res = await request.get(`/orderservice/${orderId}`);
    return res.data;
  },
  getAllWareHouse: async () => {
    const res = await request.get("/orderservice/warehouse");
    return res.data;
  },
  getAllTracking: async (orderId: string) => {
    const res = await request.get(
      `/orderservice/tracking/getbyorder/${orderId}`
    );
    return res.data;
  },
  getTrackingByShipeprId: async (userId: string) => {
    const res = await request.get(
      `/orderservice/tracking/gettrackingbyshipperid/${userId}`
    );
    return res.data;
  },
  updateTracking: async (id: string, data: UpdateTracking) => {
    const res = await request.put(`/orderservice/tracking/${id}`, data);
    return res.data;
  },
  getHistoryShipperTracking: async (shipperId: string) => {
    const res = await request.get(
      `/orderservice/tracking/getHistoryShipper/${shipperId}`
    );
    return res.data;
  },
  checkTrackingShipperAndOrderId: async (
    shipperId: string,
    orderId: string
  ) => {
    const res = await request.get(
      `/orderservice/tracking/checkshipperIdandorderId/${shipperId}/${orderId}`
    );
    return res.data;
  },

  create: async (data: Order1) => {
    const formData = new FormData();

    formData.append("userId", data.userId);
    formData.append("senderAddress", data.senderAddress);
    formData.append("reciverName", data.reciverName);
    formData.append("reciverPhone", data.reciverPhone);
    formData.append("receiverAddress", data.receiverAddress);
    formData.append("weight", String(data.weight));
    formData.append("deliveryFee", String(data.deliveryFee));
    formData.append("status", data.status);
    formData.append("note", data.note || "");

    formData.append("locationSender.latitude", String(data.locationSender.latitude));
    formData.append("locationSender.longitude", String(data.locationSender.longitude));
    formData.append("locationReciver.latitude", String(data.locationReciver.latitude));
    formData.append("locationReciver.longitude", String(data.locationReciver.longitude));

    // Append images (if any)
    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((uri, index) => {
        const fileName = uri.split("/").pop() || `image_${index}.jpg`;
        const file = {
          uri,
          name: fileName,
          type: "image/jpeg",
        } as unknown as Blob;
        formData.append("images", file);
      });
    }

    const res = await request.post("/orderservice", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  update: async (id: string, data: Order1) => {
    const res = await request.put(`/orderservice/${id}`, data);
    return res.data;
  },
};
