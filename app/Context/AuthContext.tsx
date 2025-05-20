import { Children, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User, UserInfoResponse, UserLogin, UserLoginResponse } from "../Type/UserType";
import { UserService } from "../Service/UserService";
import { KEY_TOKEN, KEY_USER } from "@/env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { string } from "yup";
export const AuthContext = createContext<any | undefined>(undefined);
interface AuthProviderProps {
    children: ReactNode;  
  }
export const AuthProvider = ({ children }:AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(false);
  const login = async (data:UserLogin)=>{
    setIsLoading(true);
    try {
      //Đăng nhập lấy token
      const res:UserLoginResponse = await UserService.login(data);
      await AsyncStorage.setItem(KEY_TOKEN,JSON.stringify(res.data));
      setToken(res.data);
      //Lưu thông tin của người dùng sau khi đăng nhập
      const infoUser:UserInfoResponse = await UserService.findInforUser();
      setUser(infoUser.data);
      await AsyncStorage.setItem(KEY_USER,JSON.stringify(infoUser.data));
    } catch (error) {
      console.error("Lỗi đăng nhập:", JSON.stringify(error, null, 2));
    } finally {
      setIsLoading(false);
    }
  }
  const logout = async ()=>{
    await AsyncStorage.removeItem(KEY_TOKEN);
    setToken(null);
    await AsyncStorage.removeItem(KEY_USER);
    setUser(null);
  }
  const loadInfor = async () => {
    setIsLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem(KEY_TOKEN);
      setToken(storedToken ? JSON.parse(storedToken) : null);
      const storedUser = await AsyncStorage.getItem(KEY_USER);
      setUser(storedUser ? JSON.parse(storedUser): null);
    } catch (error) {
      console.error('Lỗi khi lấy token:', error);
    } finally{
      setIsLoading(false);
    }
  };
  useEffect(() => {    
    loadInfor();
  }, []);
  return (
    <AuthContext.Provider value={{ user, token, isLoading, setIsLoading, login,logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth=()=>{
    const context = useContext(AuthContext);
    if(!context)
        throw new Error("User này bị rỗng");
    return context;
}
