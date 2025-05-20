import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderBack } from "@/app/Components/Header";
import { useAuth } from "@/app/Context/AuthContext";
import { OrderService } from "@/app/Service/OrderService";
import { Order1 } from "@/app/Type/OrderType";

interface CreateOrderProps {
  initForm?: Partial<Order1>;
  getAll?: () => void;
  closeModal?: () => void;
}

const fetchCoordinatesFromAddress = async (address: string) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address
      )}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "YourAppName/1.0 (your.email@example.com)",
        },
      }
    );
    const data = await response.json();
    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

const CreateOrder: React.FC<CreateOrderProps> = ({
  initForm,
  getAll,
  closeModal,
}) => {
  const { user } = useAuth();
  console.log("user", user);
  const navigation = useNavigation<any>();
  const [order, setOrder] = useState<Partial<Order1>>(
    initForm || {
      senderAddress: "",
      reciverName: "",
      reciverPhone: "",
      receiverAddress: "",
      note: "",
      weight: 0,
      deliveryFee: 0,
      locationSender: { latitude: 0, longitude: 0 },
      locationReciver: { latitude: 0, longitude: 0 },
    }
  );
  const [images, setImages] = useState<string[]>(initForm?.images || []);
  const [isLoadingSender, setIsLoadingSender] = useState(false);
  const [isLoadingReceiver, setIsLoadingReceiver] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission denied",
        "You need to grant permission to access the gallery"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleSearchCoordinates = async (
    address: string,
    field: "sender" | "receiver"
  ) => {
    if (!address) {
      Alert.alert("Error", "Vui lòng nhập địa chỉ trước khi tìm kiếm");
      return;
    }

    if (field === "sender") setIsLoadingSender(true);
    else setIsLoadingReceiver(true);

    const coords = await fetchCoordinatesFromAddress(address);
    if (coords) {
      setOrder({
        ...order,
        [field === "sender" ? "locationSender" : "locationReciver"]: coords,
      });
      Alert.alert(
        `Địa chỉ ${
          field === "sender" ? "người gửi" : "người nhận"
        } được tìm thấy`,
        `Địa chỉ: ${address}`
      );
      console.log(
        `Tọa độ cho địa chỉ ${
          field === "sender" ? "người gửi" : "người nhận"
        }: ${coords.latitude}, ${coords.longitude}`
      );
    } else {
      setOrder({
        ...order,
        [field === "sender" ? "locationSender" : "locationReciver"]: {
          latitude: 0,
          longitude: 0,
        },
      });
      Alert.alert(
        "Error",
        `Không tìm thấy tọa độ cho địa chỉ ${
          field === "sender" ? "người gửi" : "người nhận"
        }`
      );
    }

    if (field === "sender") setIsLoadingSender(false);
    else setIsLoadingReceiver(false);
  };

  const handleSubmit = async () => {
    try {
      const newOrder: Order1 = {
        ...order,
        userId: user?.userId || "", // Kiểm tra user.id
        images,
        status: initForm ? order.status || "waiting" : "waiting",
        createAt: initForm ? order.createAt || new Date() : new Date(),
        updateAt: new Date(),
        locationSender: order.locationSender || { latitude: 0, longitude: 0 },
        locationReciver: order.locationReciver || { latitude: 0, longitude: 0 },
        weight: Number(order.weight) || 0,
        deliveryFee: Number(order.deliveryFee) || 0,
      } as Order1;

      // Kiểm tra tọa độ hợp lệ
      if (
        newOrder.locationSender.latitude === 0 ||
        newOrder.locationSender.longitude === 0 ||
        newOrder.locationReciver.latitude === 0 ||
        newOrder.locationReciver.longitude === 0
      ) {
        Alert.alert(
          "Error",
          "Vui lòng tìm kiếm tọa độ hợp lệ cho người gửi và người nhận"
        );
        return;
      }

      // Kiểm tra user tồn tại
      if (!user) {
        Alert.alert("Error", "Vui lòng đăng nhập để tạo đơn hàng");
        return;
      }

      try {
        if (initForm && initForm.id) {
          await OrderService.update(initForm.id, newOrder);
          Alert.alert("Success", "Order updated successfully");
        } else {
          const dataReq = {
            ...newOrder,
            userId: user.userId,
            status: "waiting",
          };
          await OrderService.create(dataReq);
          Alert.alert("Success", "Tạo đơn hàng thành công!");
          navigation.navigate("MyOrder");
        }
      } catch (error) {
        console.log("Error:", error);
        Alert.alert("Error", "Không thể lưu đơn hàng, vui lòng thử lại");
      }

      if (getAll) getAll();
      if (closeModal) closeModal();
      setOrder({
        senderAddress: "",
        reciverName: "",
        reciverPhone: "",
        receiverAddress: "",
        note: "",
        weight: 0,
        deliveryFee: 0,
        locationSender: { latitude: 0, longitude: 0 },
        locationReciver: { latitude: 0, longitude: 0 },
      });
      setImages([]);
    } catch (err) {
      Alert.alert("Error", err as string);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderBack name="Tạo đơn hàng" />
      <ScrollView style={styles.container}>
        {/* Form Content */}
        <Text style={styles.sectionTitle}>Create Order</Text>

        {/* Product Info */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Product Information</Text>
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={order.weight?.toString()}
                onChangeText={(text) =>
                  setOrder({ ...order, weight: Number(text) })
                }
                placeholder="Enter weight"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Delivery Fee</Text>
              <TextInput
                style={styles.input}
                value={order.deliveryFee?.toString()}
                onChangeText={(text) =>
                  setOrder({ ...order, deliveryFee: Number(text) })
                }
                placeholder="Enter delivery fee"
                keyboardType="numeric"
              />
            </View>
          </View>
          <Text style={styles.label}>Product Images</Text>
          <Button title="Pick Images" onPress={pickImage} />
          <View style={styles.imageContainer}>
            {images.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.image} />
            ))}
          </View>
        </View>

        {/* Receiver Info */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Receiver Information</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Receiver Name</Text>
            <TextInput
              style={styles.input}
              value={order.reciverName}
              onChangeText={(text) => setOrder({ ...order, reciverName: text })}
              placeholder="Enter receiver name"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Receiver Phone</Text>
            <TextInput
              style={styles.input}
              value={order.reciverPhone}
              onChangeText={(text) =>
                setOrder({ ...order, reciverPhone: text })
              }
              placeholder="Enter receiver phone"
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Receiver Address</Text>
            <View style={styles.addressContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={order.receiverAddress}
                onChangeText={(text) =>
                  setOrder({ ...order, receiverAddress: text })
                }
                placeholder="Enter receiver address"
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() =>
                  handleSearchCoordinates(
                    order.receiverAddress || "",
                    "receiver"
                  )
                }
                disabled={isLoadingReceiver}
              >
                <Text style={styles.searchButtonText}>
                  {isLoadingReceiver ? "Đang tìm..." : "Tìm kiếm"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Sender Info */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Sender Information</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Sender Address</Text>
            <View style={styles.addressContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={order.senderAddress}
                onChangeText={(text) =>
                  setOrder({ ...order, senderAddress: text })
                }
                placeholder="Enter sender address"
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() =>
                  handleSearchCoordinates(order.senderAddress || "", "sender")
                }
                disabled={isLoadingSender}
              >
                <Text style={styles.searchButtonText}>
                  {isLoadingSender ? "Đang tìm..." : "Tìm kiếm"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Note */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Additional Note</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Note</Text>
            <TextInput
              style={[styles.input, styles.noteInput]}
              value={order.note}
              onChangeText={(text) => setOrder({ ...order, note: text })}
              placeholder="Enter note"
              multiline
            />
          </View>
        </View>

        {/* Submit Button */}
        <Button
          title={initForm ? "Update Order" : "Create Order"}
          onPress={handleSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  noteInput: {
    height: 80,
    textAlignVertical: "top",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  image: {
    width: 80,
    height: 80,
    margin: 4,
    borderRadius: 4,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchButton: {
    backgroundColor: "#007bff",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default CreateOrder;
