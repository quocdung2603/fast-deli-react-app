import React from "react";
import { useAuth } from "../Context/AuthContext";
import Loading from "../Components/Loading";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNav from "../Components/Drawer";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Order from "./StackScreen/Order";
import Delivery from "./StackScreen/Delivery";
import History from "./StackScreen/History";
import Report from "./StackScreen/Report";
import Notification from "./StackScreen/Notification";
import DetailOrder from "./StackScreen/DetailOrder";
import MapScreen from "./StackScreen/MapScreen";
import MapRouteOrder from "./StackScreen/MapRouteOrder";
import CreateOrder from "./UserStackScreen/CreateOrder";
import MyOrder from "./UserStackScreen/MyOrder";
import OrderInfo from "./UserStackScreen/OrderInfo";

const Stack = createNativeStackNavigator();

const App = () => {
  const { isLoading, token, user } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={!token ? "Login" : "Home"}
    >
      {!token ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      ) : user?.role === "shipper" ? (
        <>
          <Stack.Screen name="Home" component={DrawerNav} />
          <Stack.Screen name="Order" component={Order} />
          <Stack.Screen name="Delivery" component={Delivery} />
          <Stack.Screen name="Report" component={Report} />
          <Stack.Screen name="History" component={History} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="DetailOrder" component={DetailOrder} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="MapRouteOrder" component={MapRouteOrder} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={DrawerNav} />
          <Stack.Screen name="CreateOrder" component={CreateOrder} />
          <Stack.Screen name="MyOrder" component={MyOrder} />
          <Stack.Screen name="OrderInfo" component={OrderInfo} />
          <Stack.Screen name="MapRouteOrder" component={MapRouteOrder} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default App;
