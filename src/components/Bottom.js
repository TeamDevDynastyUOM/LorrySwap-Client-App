import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CargoHome from '../screens/CargoHome';
import Rides from '../screens/Rides';
import Notification from '../screens/Notification';
import Profile from '../screens/Profile';
import { MaterialIcons,MaterialCommunityIcons  } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const Bottom = () => {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#004344',
          tabBarInactiveTintColor: 'gray',
          tabBarHideOnKeyboard: true,
          tabBarLabelStyle: {
            fontSize: 13,
            marginBottom: 5,
            fontWeight: '700',
          },
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Notification') {
              iconName = 'notifications';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }

            return (
              iconName === 'truck-fast' ? (
                  <MaterialCommunityIcons  name={iconName} size={size} color={color} style={{ marginTop: 2}} />
              ) : (
                  <MaterialIcons name={iconName} size={size} color={color} style={{ marginTop: 2}}/>
              )
            );
          },
        })}

      >
        <Tab.Screen name="Home" component={CargoHome} />
        <Tab.Screen name="Rides" component={Rides} />
        <Tab.Screen name="Notification" component={Notification} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
  );
};

export default Bottom;
