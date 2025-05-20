import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Header } from "@/app/Components/Header";

interface HomeProps {
  openSideBar: () => void;
}

const UserHomeScreen: React.FC<HomeProps> = ({ openSideBar }) => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState<string>(""); // State để lưu giá trị TextInput

  const handleSearch = () => {
    console.log("search text", searchQuery);
    navigation.navigate("OrderInfo", { order: searchQuery });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header openSideBar={openSideBar} />
      {/* Logo hoặc tiêu đề */}
      <View style={styles.header}>
        <Image
          source={require("../../images/logo.png")} // Thay bằng đường dẫn logo của bạn
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Ứng Dụng Đơn Hàng</Text>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập mã đơn hàng để tra cứu"
          placeholderTextColor="#999"
          value={searchQuery} // Gán giá trị từ state
          onChangeText={(text) => setSearchQuery(text)} // Cập nhật state khi người dùng nhập
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch} // Gọi hàm handleSearch khi nhấn nút
        >
          <Text style={styles.searchButtonText}>Tra cứu</Text>
        </TouchableOpacity>
      </View>

      {/* Nút chức năng chính */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            navigation.navigate("CreateOrder");
          }} // Điều hướng đến màn hình tạo đơn
        >
          <Text style={styles.actionButtonText}>Tạo đơn hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("MyOrder")} // Điều hướng đến màn hình tra cứu
        >
          <Text style={styles.actionButtonText}>Đơn hàng của tôi</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default UserHomeScreen;
