import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Animated,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { HeaderBack } from "@/app/Components/Header";
import { useTranslation } from "react-i18next";
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";

import { RouteProp, useRoute } from "@react-navigation/native";
import { Tracking, TrackingResponse } from "@/app/Type/TrackingType";
import { OrderService } from "@/app/Service/OrderService";
import { GeoPoint } from "@/app/Type/OrderType";
import { ShipperResponse } from "@/app/Type/ShipperType";
import { ShipperService } from "@/app/Service/ShipperService";
import { useAuth } from "@/app/Context/AuthContext";
interface MapScreenParam {
  orderId: string;
}
const MapScreen = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  // const route =
  //   useRoute<RouteProp<{ MapScreenRoute: MapScreenParam }, "MapScreenRoute">>();
  // const { orderId } = route.params;
  const [routeCoordinates, setRouteCoordinates] = useState<Tracking[]>([]);
  const [path, setPath] = useState<GeoPoint[]>([]);

  const [shipperArea, setShipperArea] = useState<
    {
      latitude: number;
      longitude: number;
    }[]
  >([]);

  const getAllTracking = async () => {
    try {
      const res: TrackingResponse = await OrderService.getTrackingByShipeprId(user.userId);
      setRouteCoordinates(res.data);
      const pathMap = res.data.map((item) => {
        return item.location;
      });
      setPath(pathMap);
    } catch (error) {
      console.log("Lấy dữ liệu thất bại", error);
    }
  };
  const getShipperArea = async () => {
    try {
      const res: ShipperResponse = await ShipperService.findShipperByUserId(
        user.userId
      );
      setShipperArea(res.data.shipperArea);
    } catch (error) {
      console.log("Lỗi lấy dữ liệu: ", error);
    }
  };
  useEffect(() => {
    getAllTracking();
    getShipperArea();
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack name={t("Google Map")} />
      <View style={{ flex: 1 }}>
        {shipperArea.length > 0 && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: shipperArea[0].latitude,
              longitude: shipperArea[0].longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Polygon
              coordinates={shipperArea}
              strokeWidth={2}
              strokeColor="red"
              fillColor="rgba(255, 0, 0, 0.2)" // Màu đỏ nhạt
            />
            {routeCoordinates.map((item, index) => (
              <Marker
                pinColor={`${item.status==="shipping" ? 'orange' : 'red'}`}
                key={index}
                coordinate={{
                  latitude: item.location.latitude,
                  longitude: item.location.longitude,
                }}
                title={`Đơn hàng: ${item.orderId}`}
                description={`Status: ${item.status},Lat: ${item.location.latitude}, Lng: ${item.location.longitude}`}
              />
            ))}
          </MapView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 10,
  },
});
