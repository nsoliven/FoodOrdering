import { StyleSheet, Pressable} from 'react-native';
import Colors from '@constants/Colors';
import { Text } from '@components/Themed';
import { Link } from 'expo-router';
import { Tables } from '@src/types';

export const defaultPizzaImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

import RemoteImage from '@components/RemoteImage';

type ProductListItemProps = {
  product: Tables<'products'>;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
  return (
    <Link href={`./menu/${product.id}`} asChild>
      <Pressable style={styles.container}>
        <RemoteImage
          path = {product.image}
          fallback={defaultPizzaImage}
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