import { View, Text, SafeAreaView, StyleSheet, Animated, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { HeaderBack } from "@/app/Components/Header";
import { useTranslation } from "react-i18next";
import MapView, { Marker, Polygon, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import { RouteProp, useRoute } from "@react-navigation/native";
import { Tracking, TrackingResponse } from "@/app/Type/TrackingType";
import { OrderService } from "@/app/Service/OrderService";
import { GeoPoint } from "@/app/Type/OrderType";
interface MapRouteOrderParam{
  orderId: string,
}
const MapRouteOrder = () => {
  const { t } = useTranslation();
  const route =
      useRoute<
        RouteProp<{ MapScreenRoute: MapRouteOrderParam}, "MapScreenRoute">
      >();
  const {orderId}=route.params;
  const [routeCoordinates,setRouteCoordinates] = useState<Tracking[]>([]);
  const [path,setPath]=useState<GeoPoint[]>([]);




  const getAllTracking = async()=>{
    try {
      const res:TrackingResponse = await OrderService.getAllTracking(orderId);
      setRouteCoordinates(res.data.filter((item)=>item.status!="complete"));
      const pathMap= res.data.filter((item)=>item.status!=="complete").map((item)=>{
        return item.location
      });
      pathMap.push(res.data[res.data.length-1].nextLocation);
      setPath(pathMap);
    } catch (error) {
      console.log(orderId);
      console.log("Lấy dữ liệu thất bại",error);
    }
  }
  useEffect(()=>{
    getAllTracking();
  },[orderId])

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack name={t("Google Map")} />
      <View style={{ flex: 1 }}>
        {routeCoordinates.length > 0 && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: routeCoordinates[0].location.latitude,
              longitude: routeCoordinates[0].location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Polyline
              coordinates={path}
              strokeWidth={3}
              strokeColor="blue"
            />
            {routeCoordinates.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: item.location.latitude,
                  longitude: item.location.longitude,
                }}
                title={item.description}
                description={`Status: ${item.status},Lat: ${item.location.latitude}, Lng: ${item.location.longitude}`}
              />
            ))}
          </MapView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MapRouteOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 10,
  },
});
