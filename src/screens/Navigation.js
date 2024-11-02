import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import CargoHome from "./CargoHome";
import Rides from "./Rides";
import Notification from "./Notification";
import Profile from "./Profile";
import Menu from "./Menu";
import Chat from "./Chat";
import DirectionMap from "./DirectionMap";
import MoreDetails from "../components/MoreDetails";
import SearchDriver from "./SearchDriver";
import AddItems from "./AddItems";
import ECSellerHome from "./ECSellerHome";
import EconomicCenter from "./EconomicCenter";
import SalesInsight from "./SalesInsight";
import MarketSellerHome from "./MarketSellerHome";
import DriverProfile from "./DriverProfile";
import SelectSeller from "./SelectSeller";
import MarketSellerCart from "./MarketSellerCart";
import SelectedItemsDetails from "./SelectedItemsDetails";
import BottomPopup from "../components/BottomPopup";
import FinishedRides from "./FinishedRides";
import Joinnow from "./Joinnow";
import Signup from "./Signup";
import Login from "./Password";
import Otp from "./Otp";
import Success from "./Success";
import SignIn from "./SignIn";
import SelectRole from "./SelectRole";
import TrackingScreen from "./TrackingScreen";
import ForgetPasswordOtp from './ForgetPasswordOtp';
import ForgetPasswordNew from './ForgetPasswordNew';
import ForgetPasswordEmail from './ForgetPasswordEmail';

const LogIn = createStackNavigator();
const MainStack = createStackNavigator();

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const RideStack = createStackNavigator();

const EcoStack = createStackNavigator();
const EcoSellerTab = createBottomTabNavigator();
const EcoRideStack = createStackNavigator();

const MSStack = createStackNavigator();
const MarketSellerTab = createBottomTabNavigator();
const MarketRideStack = createStackNavigator();

function LoginStackScreen() {
  return (
    <LogIn.Navigator
      screenOptions={{
        headerShown: false,
      }}
    ></LogIn.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen name="Home1" component={CargoHome} />
      <HomeStack.Screen name="Chat" component={Chat} />
    </HomeStack.Navigator>
  );
}
function RideStackScreen() {
  return (
    <RideStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RideStack.Screen name="Ride" component={Rides} />
      <RideStack.Screen name="MoreDetails" component={MoreDetails} />
      <RideStack.Screen name="SearchDriver" component={SearchDriver} />
      <RideStack.Screen name="DirectionMap" component={DirectionMap} />
      <RideStack.Screen name="TrackingScreen" component={TrackingScreen} />
      <RideStack.Screen name="DriverProfile" component={DriverProfile} />
      <RideStack.Screen name="FinishedRides" component={FinishedRides} />
    </RideStack.Navigator>
  );
}
function TabBarStackScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#004344",
        tabBarInactiveTintColor: "gray",
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 13,
          marginBottom: 5,
          fontWeight: "700",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Rides") {
            iconName = "truck-fast";
          } else if (route.name === "Notification") {
            iconName = "notifications";
          } else if (route.name === "Profile") {
            iconName = "person";
          }

          return iconName === "truck-fast" ? (
            <MaterialCommunityIcons
              name={iconName}
              size={size}
              color={color}
              style={{ marginTop: 2 }}
            />
          ) : (
            <MaterialIcons
              name={iconName}
              size={size}
              color={color}
              style={{ marginTop: 2 }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Rides" component={RideStackScreen} />
      <Tab.Screen name="Notification" component={Notification} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

function EcoSellerTabBarStackScreen() {
  return (
    <EcoSellerTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#004344",
        tabBarInactiveTintColor: "gray",
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 13,
          marginBottom: 5,
          fontWeight: "700",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Rides") {
            iconName = "truck-fast";
          } else if (route.name === "Notification") {
            iconName = "notifications";
          } else if (route.name === "Profile") {
            iconName = "person";
          }

          return iconName === "truck-fast" ? (
            <MaterialCommunityIcons
              name={iconName}
              size={size}
              color={color}
              style={{ marginTop: 2 }}
            />
          ) : (
            <MaterialIcons
              name={iconName}
              size={size}
              color={color}
              style={{ marginTop: 2 }}
            />
          );
        },
      })}
    >
      <EcoSellerTab.Screen name="Home" component={EcoStackScreen} />
      <EcoSellerTab.Screen name="Rides" component={RideStackScreen} />
      <EcoSellerTab.Screen name="Notification" component={Notification} />
      <EcoSellerTab.Screen name="Profile" component={Profile} />
    </EcoSellerTab.Navigator>
  );
}
function EcoStackScreen() {
  return (
    <EcoStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <EcoStack.Screen name="ECHome" component={ECSellerHome} />
      <EcoStack.Screen name="Add" component={AddItems} />
      <EcoStack.Screen name="EconomicCenter" component={EconomicCenter} />
      <EcoStack.Screen name="SalesInsight" component={SalesInsight} />
      <EcoStack.Screen name="chat" component={Chat} />
    </EcoStack.Navigator>
  );
}

function MarketSellerTabTabBarStackScreen() {
  return (
    <MarketSellerTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#004344",
        tabBarInactiveTintColor: "gray",
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 13,
          marginBottom: 5,
          fontWeight: "700",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Rides") {
            iconName = "truck-fast";
          } else if (route.name === "Notification") {
            iconName = "notifications";
          } else if (route.name === "Profile") {
            iconName = "person";
          }

          return iconName === "truck-fast" ? (
            <MaterialCommunityIcons
              name={iconName}
              size={size}
              color={color}
              style={{ marginTop: 2 }}
            />
          ) : (
            <MaterialIcons
              name={iconName}
              size={size}
              color={color}
              style={{ marginTop: 2 }}
            />
          );
        },
      })}
    >
      <MarketSellerTab.Screen name="Home" component={MarketSellerStack} />
      <MarketSellerTab.Screen
        name="Rides"
        component={MarketSellerRideStackScreen}
      />
      <MarketSellerTab.Screen name="Notification" component={Notification} />
      <MarketSellerTab.Screen name="Profile" component={Profile} />
    </MarketSellerTab.Navigator>
  );
}
function MarketSellerStack() {
  return (
    <MSStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MSStack.Screen name="MSHome" component={MarketSellerHome} />
      <MSStack.Screen name="Cart" component={MarketSellerCart} />
      <MSStack.Screen name="SelectSeller" component={SelectSeller} />
      <MSStack.Screen name="Details" component={SelectedItemsDetails} />
      <MSStack.Screen name="Popup" component={BottomPopup} />
    </MSStack.Navigator>
  );
}
function MarketSellerRideStackScreen() {
  return (
    <RideStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RideStack.Screen name="Ride" component={Rides} />
      <RideStack.Screen name="MoreDetails" component={MoreDetails} />
      <RideStack.Screen name="SearchDriver" component={SearchDriver} />
      <RideStack.Screen name="DirectionMap" component={DirectionMap} />
      <RideStack.Screen name="DriverProfile" component={DriverProfile} />
      <RideStack.Screen name="FinishedRides" component={FinishedRides} />
    </RideStack.Navigator>
  );
}

const Navigation = () => {
  return (
      <MainStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* <MainStack.Screen name="LoginScreens" component={LoginStackScreen} /> */}      
        <MainStack.Screen name="Joinnow" component={Joinnow}/>
        <MainStack.Screen name="Signin" component={SignIn} />
        <MainStack.Screen name="Signup" component={Signup} />
        <MainStack.Screen name="SelectRole" component={SelectRole}/>
        <MainStack.Screen name="Password" component={Login}/>
        <MainStack.Screen name="Otp" component={Otp}/>
        <MainStack.Screen name="Success" component={Success}/>      
        <MainStack.Screen name="ForgetPasswordOtp" component={ForgetPasswordOtp} />
        <MainStack.Screen name="ForgetPasswordNew" component={ForgetPasswordNew} />
        <MainStack.Screen name="ForgetPasswordEmail" component={ForgetPasswordEmail} />     
        <MainStack.Screen name="EconomicCenterSeller" component={EcoSellerTabBarStackScreen} />
        <MainStack.Screen name="MarketSeller" component={MarketSellerTabTabBarStackScreen} />
        <MainStack.Screen name="CargoFinder" component={TabBarStackScreen} />
        <MainStack.Screen name="Menu" component={Menu} /> 
      </MainStack.Navigator>
  );
};

export default Navigation;
