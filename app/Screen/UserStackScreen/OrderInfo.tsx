import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  FontAwesome5,
  MaterialIcons,
  Ionicons,
  Entypo,
} from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderBack } from "@/app/Components/Header";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import {
  Order,
  OrderIdResponse,
  OrderResponseInfo,
} from "@/app/Type/OrderType";
import { addDays, formatDateTime } from "@/app/Untils/RenderDateTime";
import { Tracking, TrackingResponse } from "@/app/Type/TrackingType";
import { OrderService } from "@/app/Service/OrderService";

const getSampleShipment = () => ({
  container: {
    container_number: "CNT987654321",
    size: "40ft",
    notes: "Hàng dễ vỡ",
    location: [
      {
        id: 1,
        region: "Hà Nội",
        address: "Kho A",
        pivot: { expected_arrival_date: "2025-02-25T12:00:00Z" },
      },
      {
        id: 2,
        region: "Đà Nẵng",
        address: "Kho B",
        pivot: { expected_arrival_date: "2025-02-26T08:00:00Z" },
      },
      {
        id: 3,
        region: "Hồ Chí Minh",
        address: "Kho C",
        pivot: { expected_arrival_date: "2025-02-26T15:30:00Z" },
      },
    ],
  },
});

interface OrderInfoRouteParams {
  order: Order;
}

const OrderInfo = () => {
  const { t } = useTranslation();
  const route =
    useRoute<RouteProp<{ OrderInfo: OrderInfoRouteParams }, "OrderInfo">>();
  const nav = useNavigation<any>();
  const [translatedShipment, setTranslatedShipment] = useState(
    getSampleShipment()
  );
  const [trackingOrder, setTrackingOrder] = useState<Tracking[]>([]);
  const [orderItem, setOrderItem] = useState<OrderResponseInfo | any>();
  const { order } = route.params;

  console.log("params receive", order);

  const getAllTracking = async () => {
    try {
      const res: TrackingResponse = await OrderService.getAllTracking(
        order.toString()
      );
      console.log("tracking order", JSON.stringify(res.data));
      setTrackingOrder(res.data);
    } catch (error) {
      console.log(order.id);
      console.log("Lấy dữ liệu thất bại", error);
    }
  };

  const getOrderById = async () => {
    try {
      const res: OrderResponseInfo = await OrderService.findOrderById(
        order.toString()
      );
      console.log("order item", res.data);
      setOrderItem(res.data);
    } catch (error) {
      console.log("Lấy dữ liệu thất bại", error);
    }
  };

  useEffect(() => {
    getAllTracking();
    getOrderById();
  }, [order]);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack name={t("orderInfo")} />
      <ScrollView>
        {/* Thông tin đơn hàng */}
        {orderItem && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{t("orderInfo")}</Text>
            <View style={styles.row}>
              <FontAwesome5 name="shipping-fast" size={24} color="#53045F" />
              <Text style={styles.title}>{t("trackingNumber")}:</Text>
              <Text style={styles.text}>{orderItem.id}</Text>
            </View>
            <View style={styles.row}>
              <FontAwesome5 name="user-alt" size={24} color="#53045F" />
              <Text style={styles.title}>{t("receiver")}:</Text>
              <Text style={styles.text}>{orderItem.reciverName}</Text>
            </View>
            <View style={styles.row}>
              <FontAwesome5 name="phone" size={24} color="#53045F" />
              <Text style={styles.title}>{t("receiverPhone")}:</Text>
              <Text style={styles.text}>{orderItem.reciverPhone}</Text>
            </View>
            <View style={styles.row}>
              <MaterialIcons name="location-on" size={24} color="#53045F" />
              <Text style={styles.title}>{t("senderAddress")}:</Text>
              <Text style={styles.text}>{orderItem.senderAddress}</Text>
            </View>
            <View style={styles.row}>
              <MaterialIcons name="location-on" size={24} color="#53045F" />
              <Text style={styles.title}>{t("receiverAddress")}:</Text>
              <Text style={styles.text}>{orderItem.receiverAddress}</Text>
            </View>
            <View style={styles.row}>
              <FontAwesome5 name="calendar-alt" size={24} color="#53045F" />
              <Text style={styles.title}>{t("sentDate")}:</Text>
              <Text style={styles.text}>
                {formatDateTime(orderItem.createAt)}
              </Text>
            </View>
            <View style={styles.row}>
              <FontAwesome5 name="calendar-alt" size={24} color="#53045F" />
              <Text style={styles.title}>{t("deliveredDate")}:</Text>
              <Text style={styles.text}>
                {formatDateTime(addDays(orderItem.createAt, 10))}
              </Text>
            </View>
            <View style={styles.row}>
              <FontAwesome5 name="weight" size={24} color="#53045F" />
              <Text style={styles.title}>{t("weight")}:</Text>
              <Text style={styles.text}>{orderItem.weight} kg</Text>
            </View>
            <View style={styles.row}>
              <FontAwesome5 name="weight" size={24} color="#53045F" />
              <Text style={styles.title}>{t("status")}:</Text>
              <Text style={styles.text}>{orderItem.status}</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="pricetag" size={24} color="#53045F" />
              <Text style={styles.title}>{t("price")}:</Text>
              <Text style={styles.text}>{orderItem.deliveryFee} vnđ</Text>
            </View>
            <View style={styles.row}>
              <Entypo name="info" size={24} color="#53045F" />
              <Text style={styles.title}>{t("notes")}:</Text>
              <Text style={styles.text}>
                {orderItem.note ? orderItem.note : "Không có"}
              </Text>
            </View>
          </View>
        )}

        {/* Thông tin container */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("containerDetails")}</Text>
          <View style={styles.row}>
            <Entypo name="box" size={24} color="#53045F" />
            <Text style={styles.title}>{t("containerNumber")}:</Text>
            <Text style={styles.text}>
              {translatedShipment.container.container_number}
            </Text>
          </View>
          <View style={styles.row}>
            <Entypo name="resize-full-screen" size={24} color="#53045F" />
            <Text style={styles.title}>{t("size")}:</Text>
            <Text style={styles.text}>{translatedShipment.container.size}</Text>
          </View>
        </View>

        {/* Timeline tracking */}
        <View style={styles.timelineContainer}>
          <Text style={styles.sectionTitle}>{t("track_shipment")}</Text>
          {trackingOrder.length > 0 ? (
            trackingOrder.map((loc, index) => (
              <View key={loc.id} style={styles.timelineItem}>
                {index < trackingOrder.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
                <View style={styles.timelineCircle} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineText}>
                    {loc.description || "N/A"}
                  </Text>
                  <Text style={styles.timelineText}>{loc.status || "N/A"}</Text>
                  <Text style={styles.timelineText}>
                    {loc.location.latitude + " : " + loc.location.longitude ||
                      "N/A"}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noTrackingText}>No tracking available</Text>
          )}
        </View>
      </ScrollView>

      {/* Nút View Map */}
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.buttonMap}
          onPress={() =>
            nav.navigate("MapRouteOrder", { orderId: order.toString() })
          }
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
            {t("view_map")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
    alignSelf: "center",
  },
  title: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Cairo-SemiBold",
    marginLeft: 10,
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Cairo-Regular",
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: 18,
    color: "#53045F",
    fontFamily: "Cairo-Bold",
    marginBottom: 10,
  },
  timelineContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  timelineCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#53045F",
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    height: "100%",
    backgroundColor: "#53045F",
    position: "absolute",
    top: "67%",
    right: "97%",
    zIndex: 0,
  },
  timelineContent: {
    paddingLeft: 20,
    alignItems: "flex-start",
    flex: 1,
    right: 10,
  },
  timelineText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Cairo-Regular",
    textAlign: "right",
  },
  noTrackingText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Cairo-Regular",
    textAlign: "center",
    marginTop: 10,
  },
  buttonView: {
    width: "100%",
    alignItems: "center",
  },
  buttonMap: {
    backgroundColor: "#53045F",
    padding: 20,
    width: "100%",
    marginVertical: 10,
    alignItems: "center",
  },
});

export default OrderInfo;
