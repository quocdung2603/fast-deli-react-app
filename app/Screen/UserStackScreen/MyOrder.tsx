import { HeaderBack } from "@/app/Components/Header";
import { useAuth } from "@/app/Context/AuthContext";
import { OrderService } from "@/app/Service/OrderService";
import { Order, OrderResponse, OrderIdResponse } from "@/app/Type/OrderType";
import { CheckShipper, TrackingResponse } from "@/app/Type/TrackingType";
import { RenderName30Words } from "@/app/Untils/RenderName";
import { KEY_IMAGEURL } from "@/env";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  FontAwesome6,
} from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";

const MyOrder = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [data, setData] = useState<Order[]>([]);
  const calculateDaysLeft = (deliveredDate: any) => {
    const currentDate = new Date();
    const deliveredDateObj = new Date(deliveredDate);
    const timeDifference = deliveredDateObj.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };
  const getAllOrder = async () => {
    try {
      const res: OrderResponse = await OrderService.getAllOrder();
      console.log(res.data.filter((item) => item.userId === user.userId));
      const filteredData = res.data.filter(
        (item) => item.userId === user.userId
      );
      setData(filteredData);
    } catch (error) {
      console.log("Đã có lỗi xảy ra:", error);
    }
  };
  useEffect(() => {
    getAllOrder();
    const unsubscribe = navigation.addListener("focus", () => {
      getAllOrder();
    });
    return unsubscribe;
  }, [user.userId]);
  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack name={t("order")} />
      <FlatList
        // style={styles.shipmentsContainer}
        data={data}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("OrderInfo", { order: item.id.toString() })
            }
            style={styles.shipmentCard}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.shipmentHeader}>
                <FontAwesome6 name="hashtag" size={15} color="#53045F" />
                <Text style={styles.shipmentText}>
                  {RenderName30Words(item.id)}
                </Text>
              </View>
              <View style={styles.shipmentHeader}>
                <AntDesign name="user" size={15} color="#53045F" />
                <Text style={styles.shipmentText}>{item.reciverName}</Text>
              </View>
              <View style={styles.shipmentHeader}>
                <Feather name="box" size={15} color="#53045F" />
                <Text style={styles.shipmentText}>{item.receiverAddress}</Text>
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={[
                  styles.shipmentText,
                  { color: "gray", marginBottom: 10 },
                ]}
              >
                {calculateDaysLeft(item.createAt)} {"days_left"}
              </Text>
              <Image
                source={{
                  uri: KEY_IMAGEURL + item.imageUrls,
                }}
                style={styles.imageOrder}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default MyOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  shipmentHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 5,
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  shipmentCard: {
    backgroundColor: "#fff",
    borderRightWidth: 5,
    borderColor: "#53045F",
    borderRadius: 10,
    padding: 7,
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    gap: 10,
    width: 340,
    margin: 10,
    elevation: 5,
  },
  shipmentText: {
    color: "#333",
    fontSize: 14,
    fontFamily: "Cairo-SemiBold",
  },
  imageOrder: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
});
