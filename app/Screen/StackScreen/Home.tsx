import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Header } from "@/app/Components/Header";
import SlideShow from "@/app/Components/Slide";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
} from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Order, OrderIdResponse, OrderResponse } from "@/app/Type/OrderType";
import { OrderService } from "@/app/Service/OrderService";
import { RenderName30Words } from "@/app/Untils/RenderName";
import { KEY_IMAGEURL } from "@/env";
import {
  CheckShipper,
  Tracking,
  TrackingResponse,
} from "@/app/Type/TrackingType";
import { useAuth } from "@/app/Context/AuthContext";
interface HomeProps {
  openSideBar: () => void;
}
const Home: React.FC<HomeProps> = ({ openSideBar }) => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [data, setData] = useState<Order[]>([]);
  const [listTracking, setListTracking] = useState<Tracking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };
  const calculateDaysLeft = (deliveredDate: any) => {
    const currentDate = new Date();
    const deliveredDateObj = new Date(deliveredDate);
    const timeDifference = deliveredDateObj.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };
  const getAllOrder = async () => {
    try {
      const resTracking: TrackingResponse =
        await OrderService.getTrackingByShipeprId(user.userId);
      setListTracking(resTracking.data);
      const filteredItems = [];
      for (const item of resTracking.data) {
        if (item.status === "shipping" || item.status === "ready") {
          const checkShipper: CheckShipper =
            await OrderService.checkTrackingShipperAndOrderId(
              user.userId,
              item.orderId
            );
          if (checkShipper.data === false) {
            filteredItems.push(item);
          }
        }
      }
      const listOrderPromises = filteredItems.map(async (item) => {
        const order: OrderIdResponse = await OrderService.findOrderById(
          item.orderId
        );
        return order.data;
      });
      const listOrder: Order[] = await Promise.all(listOrderPromises);
      setData(listOrder);
    } catch (error) {
      console.log("Lỗi lấy dữ liệu: ", error);
    }
  };
  const checkShipping = (orderId: string) => {
    return listTracking.find(
      (item) => item.orderId === orderId && item.status === "shipping"
    );
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
      <Header openSideBar={openSideBar} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SlideShow />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>latest_shipments</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Text style={styles.showAll}>view all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("DetailOrder", { order: item })
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
                  <Text style={styles.shipmentText}>
                    {item.receiverAddress}
                  </Text>
                </View>
                {checkShipping(item.id) && (
                  <View style={styles.shipmentHeader}>
                    <Text style={{ fontWeight: "bold", color: "orange" }}>
                      Đã nhận
                    </Text>
                  </View>
                )}
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
                {/* <FontAwesome5 name="box" size={24} color="gray" /> */}
              </View>
            </TouchableOpacity>
          )}
        />

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Order");
            }}
            style={styles.optionButton}
          >
            <FontAwesome5
              name="truck"
              size={24}
              color="#fff"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>{t("order")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Delivery");
            }}
            style={styles.optionButton}
          >
            <FontAwesome5
              name="map-marked-alt"
              size={24}
              color="#fff"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>{t("ondelivery")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("History");
            }}
            style={styles.optionButton}
          >
            <Entypo
              name="location"
              size={24}
              color="#fff"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>{t("historydelivery")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Report");
            }}
            style={styles.optionButton}
          >
            <FontAwesome
              name="dollar"
              size={24}
              color="#fff"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>{t("report")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  section: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#53045F",
    fontFamily: "Cairo-SemiBold",
  },
  showAll: {
    fontSize: 12,
    color: "gray",
    fontFamily: "Cairo-SemiBold",
    textDecorationLine: "underline",
  },
  shipmentsContainer: {
    flexDirection: "row-reverse",
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
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    flex: 1,
    padding: 10,
  },
  optionButton: {
    width: "45%",
    backgroundColor: "#53045F",
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  optionIcon: {
    marginBottom: 10,
  },
  optionText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Cairo-SemiBold",
  },
  imageOrder: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
});
