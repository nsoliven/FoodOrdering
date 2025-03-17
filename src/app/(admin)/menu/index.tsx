import { useProductList } from '@api/products';
import Products from '@assets/data/products';
import ProductListItem from '@components/ProdcutsListItem';
import { Text, View, } from '@components/Themed';
import { ActivityIndicator, FlatList } from 'react-native';

export default function MenuScreen() {
  const { data: products, isLoading, error } = useProductList();

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Failed to fetch products</Text>;
    
  return (
      <FlatList 
        data={products}
        renderItem={({ item }) => <ProductListItem product={item} />} 
        numColumns={2}
        contentContainerStyle={{ gap: 10 , padding: 10 }}
        columnWrapperStyle = {{ gap: 10 }}
      />
  );
}

