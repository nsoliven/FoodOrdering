import Colors from "@constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Stack } from "expo-router";

export default function OrderStack() {
  return (
    <Stack>
      <Stack.Screen name="list" options={{ title: "Order List" }} />
    </Stack>
  );
}