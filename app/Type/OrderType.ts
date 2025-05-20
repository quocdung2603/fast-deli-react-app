export interface Order {
  id: string;
  userId: string;
  orderCode: string;
  senderAddress: string;
  reciverName: string;
  reciverPhone: string;
  receiverAddress: string;
  note?: string | null;
  weight: number;
  deliveryFee: number;
  imageUrls: string[];
  status: string;
  createAt: string;
  updatedAt: string;
}

export interface Order1 {
  id: string;
  userId: string;
  orderCode: string;
  senderAddress: string;
  reciverName: string;
  reciverPhone: string;
  receiverAddress: string;
  note: string;
  weight: number;
  deliveryFee: number;
  images: any;
  status: string;
  createAt: Date;
  updateAt: Date;
  locationSender: GeoPoint;
  locationReciver: GeoPoint;
}

export interface OrderResponse {
  code: number;
  message: string;
  data: Order[];
}
export interface OrderIdResponse {
  code: number;
  message: string;
  data: Order;
}
export interface GeoPoint {
  latitude: number;
  longitude: number;
}
export interface WareHouse {
  id: string;
  name: string;
  type: string;
  location: GeoPoint;
}
export interface WareHouseResponse {
  code: number;
  message: string;
  data: WareHouse[];
}

interface InfoUser {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  dateOfBirth: string | null;
  address: string | null;
  gender: boolean;
  nationality: string | null;
  accountStatus: string;
  createdAt: string;
  updatedAt: string;
  role: string;
}

interface OrderData {
  id: string;
  infoUser: InfoUser;
  orderCode: string;
  senderAddress: string;
  reciverName: string;
  reciverPhone: string;
  receiverAddress: string;
  note: string;
  weight: number;
  deliveryFee: number;
  imageUrls: string[];
  status: string;
  createAt: string;
  updateAt: string;
}

export interface OrderResponseInfo {
  code: number;
  message: string;
  data: OrderData;
}
