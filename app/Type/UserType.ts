export interface User {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  dateOfBirth: string | null;
  address: string | null;
  gender: boolean;
  nationality: string | null;
  accountStatus: "Active" | "Inactive" | "Banned"; // Nếu có nhiều trạng thái, thêm vào đây
  createdAt: string; // ISO Date format
  updatedAt: string;
  role: "admin" | "user" | "shipper"; // Nếu có nhiều role, thêm vào đây
}
export interface UserLogin {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  code: number;
  message: string;
  data: any;
}

export interface UserInfoResponse {
  code: number;
  message: string;
  data: User;
}
