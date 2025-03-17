import { View, Text, StyleSheet, Image } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Products from '@assets/data/products';
import { defaultPizzaImage } from '@components/ProdcutsListItem';
import { PizzaSize } from '@/src/types';

import { Pressable } from 'react-native';
import Button from '@components/Button';
import { useState } from 'react';


import { useCart } from '@/src/providers/CartProvider';


const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];


const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M'); // Default size

  const router = useRouter();

  const product = Products.find((p) => p.id.toString() === id);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }
  const addToCart = () => {
    if (!product) return;
    addItem(product, selectedSize);
    router.push('/cart');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />
      <Image
        source={{ uri: product.image || defaultPizzaImage }}
        style={styles.image}
        resizeMode="contain"
      />
      
      <Text style={styles.subtitle}>Select size</Text>
      <View style={styles.sizes}>
        {sizes.map((size) => (
          <Pressable
            onPress={() => setSelectedSize(size)}
            key={size}
            style={[
              styles.size,
              {
                backgroundColor: size === selectedSize ? 'gainsboro' : 'white',
              },
            ]}
          >
            <Text
              style={[
                styles.sizeText,
                { color: size === selectedSize ? 'black' : 'gray' },
              ]}
            >
              {size}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.price}>Price: ${product.price.toFixed(2)}</Text>
      <Button onPress={addToCart} text="Add to cart" />
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
    marginTop: 'auto',
  },

  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  size: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
  },
});

export default ProductDetailsScreen;