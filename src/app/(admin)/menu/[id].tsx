// React imports
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';

// Expo and Navigation
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Data and types
import { defaultPizzaImage } from '@components/ProdcutsListItem';
import { PizzaSize } from '@src/types';
import Colors from '@constants/Colors';

// Providers
import { useCart } from '@providers/CartProvider';
import { useProduct } from '@api/products';
import RemoteImage from '@components/RemoteImage';

const ProductDetailsScreen = () => {
  // Move ALL hooks to the top level before any conditional returns
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
  const { data: product, isLoading, error } = useProduct(id);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M'); // Default size
  const router = useRouter();

  // Conditional returns after all hooks have been called
  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Failed to fetch product</Text>;
  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const addToCart = () => {
    addItem(product, selectedSize);
    router.push('/cart');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Menu',
        headerRight: () => (
          <Link href={`/(admin)/menu/create?id=${id}`} asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="pencil"
                  size={25}
                  color={Colors.light.tint}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        ),
      }}/>
      <Stack.Screen options={{ title: product.name }} />
      <RemoteImage
        path={product.image}
        fallback={defaultPizzaImage}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.price}>Price: ${product.price.toFixed(2)}</Text>
      <Text style={styles.subtitle}>Size: {selectedSize}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    flex: 1,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  subtitle: {
    marginVertical: 10,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen;