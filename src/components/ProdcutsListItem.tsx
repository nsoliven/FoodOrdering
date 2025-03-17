import { StyleSheet, Image, Pressable} from 'react-native';
import Colors from '@constants/Colors';
import { Text, View } from '@components/Themed';
import { Product } from '@src/types';
import { Link, useSegments } from 'expo-router';

export const defaultPizzaImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png'
;
type ProductListItemProps = {
  product: Product;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
  return (
    <Link href={`./menu/${product.id}`} asChild>
      <Pressable style={styles.container}>
        <Image
          source={{ uri: product.image || defaultPizzaImage }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </Pressable>
    </Link>
  );
}

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    maxWidth: '50%'
  },
  image: {
    width: '90%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold'
  }
});