import { Tabs, withLayoutContext } from "expo-router";

import { StyleSheet } from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FontAwesome } from "@expo/vector-icons";

const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function OrderListNavigator() {
  return (
    <TopTabs>
      <TopTabs.Screen
        name="index"
        options={{
          title: "Active",
        }}
      />
      <TopTabs.Screen
        name="archive"
        options={{
          title: "Archive",
        }}
      />
    </TopTabs>
  );
}

