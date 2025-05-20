import { Route, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";

import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const SlideShow = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState([1]);
  const nav = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  if (images.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Carousel
        width={width}
        height={275}
        data={images}
        autoPlay
        autoPlayInterval={5000} // Auto-scroll every 5 seconds
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={{
                uri: `https://tse4.mm.bing.net/th?id=OIP.0XUjdfdhEBAK26aUkBJYUwHaEK&pid=Api&P=0&h=180`,
              }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.overlay} />
          </View>
        )}
        pagingEnabled
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
      />
      <TouchableOpacity
        style={styles.Button}
        onPress={() => {
          nav.navigate("Map");
        }}
      >
        <Text style={styles.buttonText}>{t("Map View")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SlideShow;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 275,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    padding: 10,
  },
  slide: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  Button: {
    position: "absolute",
    top: "45%",
    left: "40%",
    backgroundColor: "#53045F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff", // Màu chữ trắng
    fontSize: 16,
    textAlign: "center",
  },
});
