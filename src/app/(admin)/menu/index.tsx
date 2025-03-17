import Products from '@assets/data/products';
import ProductListItem from '@components/ProdcutsListItem';
import { Text, View, } from '@components/Themed';
import { FlatList } from 'react-native';

export default function MenuScreen() {
  return (
      <FlatList 
        data={Products}
        renderItem={({ item }) => <ProductListItem product={item} />} 
        numColumns={2}
        contentContainerStyle={{ gap: 10 , padding: 10 }}
        columnWrapperStyle = {{ gap: 10 }}
      />
  );
}

