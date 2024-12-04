import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Index from "./app/index";
import Group_A_HomeScreen from "./app/screens/group_A_Home";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: "#25292e", borderTopWidth: 0 },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#888",
        }}
      >
        <Tab.Screen
          name="Login"
          component={Index} // Login screen as the first tab
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Home"
          component={Group_A_HomeScreen} // Your home screen component
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
