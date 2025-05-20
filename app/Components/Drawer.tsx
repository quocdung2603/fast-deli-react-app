import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React, { useEffect, useState, useTransition } from "react";
import { Drawer } from "react-native-drawer-layout";
import Home from "../Screen/StackScreen/Home";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import "../Lang/i18n";
import { useAuth } from "../Context/AuthContext";
import { UserService } from "../Service/UserService";
import UserHomeScreen from "../Screen/UserStackScreen/UserHomeScreen";
const DrawerNav = () => {
  const { user,logout } = useAuth();
  
  const [open, setOpen] = useState(false);
  const navigation = useNavigation<any>();
  const toggleSidebar = () => setOpen(!open);
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState("vn");
  const handleChangeLangue = (value: string) => {
    i18n
      .changeLanguage(value)
      .then(() => setCurrentLanguage(value))
      .catch((e) => console.log(e));
  };
  

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType="slide"
      hideStatusBarOnOpen={true}
      renderDrawerContent={() => (
        <View style={styles.drawerContent}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/16869/16869838.png",
              }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{user && user.fullName}</Text>
          </View>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setOpen(false);
              // navigation.navigate('Home');
            }}
          >
            <Ionicons name="person" size={24} color="#333" />
            <Text style={styles.menuText}>{t("profile")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              handleChangeLangue(currentLanguage === "vn" ? "en" : "vn")
            }
          >
            <Ionicons name="language" size={24} color="#333" />
            <Text style={styles.menuText}>
              {currentLanguage === "vn" ? "Tiếng Anh" : "VietNamese"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              logout();
              setOpen(false);
            }}
          >
            <Ionicons name="log-out" size={24} color="#53045F" />
            <Text style={[styles.menuText, { color: "#53045F" }]}>
              {t("logout")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    >
      {user && user.role === "shipper" ? (
        <Home openSideBar={toggleSidebar}></Home>
      ) : (
        <UserHomeScreen openSideBar={toggleSidebar}></UserHomeScreen>
      )}
    </Drawer>
  );
};
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    padding: 20,
  },
  userInfo: {
    alignItems: "center",
    marginVertical: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    padding: 10,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
    fontFamily: "Cairo-Regular",
  },
});
export default DrawerNav;
