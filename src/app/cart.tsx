import { View, Text, Platform, FlatList, Alert} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Button from '@components/Button';

import { useCart } from '@providers/CartProvider';
import CartListItem from '@components/CartListItem';

const CartScreen = () => {
  const { items, total, checkout } = useCart();
  
  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert(
        "Empty Cart",
        "You don't have any items selected in your cart.",
        [
          { text: "OK" }
        ]
      );
    } else {
      checkout();
    }
  };
  
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList 
        data={ items } 
        renderItem={({item}) => <CartListItem cartItem={item} />}
        contentContainerStyle = {{ padding: 10, gap: 10 }}
      />

      <Text style={{fontSize: 20, fontWeight: 500 }}>
        Total Price: ${total.toFixed(2)}
      </Text>
      <Button text="Checkout" onPress={handleCheckout} />

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
};

export default CartScreen;