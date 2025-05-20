import AsyncStorage from "@react-native-async-storage/async-storage";
import { request } from "../Config/Request"
import { UserInfoResponse, UserLogin, UserLoginResponse } from "../Type/UserType";
import { KEY_TOKEN } from "@/env";

export const UserService={
    login: async(data:UserLogin)=>{
        const res = await request.post("/userservice/auth",data)
        return res.data;
    },
    findInforUser: async()=>{
        const token = await AsyncStorage.getItem(KEY_TOKEN);
        const tokenStr = token ? JSON.parse(token) : null;
        const res = await request.get(`/userservice/findbytoken/${tokenStr}`);
        return res.data;
    }
}