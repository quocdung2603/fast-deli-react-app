import axios from "axios";
import { API_URL, KEY_TOKEN } from "@/env";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tạo một instance axios với cấu hình mặc định
export const request = axios.create({
    baseURL: API_URL, // URL từ file cấu hình môi trường
    timeout: 10000, // Không giới hạn thời gian request
    headers: { 'X-Custom-Header': 'foobar' } // Header mặc định
});

// Thêm interceptor để chèn token vào mỗi request nếu có
request.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem(KEY_TOKEN);
            const tokenStr = token ? JSON.parse(token) : null;
            if (tokenStr) {
                config.headers.Authorization = `Bearer ${tokenStr}`; 
            }
        } catch (error) {
            console.error("Lỗi khi lấy token:", error);
        }
        return config; 
    },
    (error) => Promise.reject(error)
);

request.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized! Redirecting to login...");
        }
        return Promise.reject(error); 
    }
);
