import { View, Text , StyleSheet, TextInput, Image, Alert} from 'react-native';
import Button from '@components/Button';
import { useEffect, useState } from 'react';

import * as ImagePicker from 'expo-image-picker';


import { defaultPizzaImage } from '@components/ProdcutsListItem';
import Colors from '@constants/Colors';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useInsertProduct, useUpdateProduct, useProduct, useDeleteProduct} from '@api/products';


const CreateProductScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState('');
  const [image, setImage] = useState(defaultPizzaImage);

  const router = useRouter();

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0]);
  const isUpdating = !!id;

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: updatingProduct } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();

  const resetFields = () => {
    setName('');
    setPrice('');
    setErrors('');
    setImage('');
  };

  useEffect(() => {
    if (isUpdating) {
      setName(updatingProduct?.name || '');
      setPrice(updatingProduct?.price.toString() || '');
      setImage(updatingProduct?.image || defaultPizzaImage);
    }
  }, [updatingProduct]);

  const validateInput = () => {
    setErrors('');
    if (!name || !price) {
      setErrors('Name is required / Price is required');
      return false;
    }

    if (isNaN(parseFloat(price))) {
      setErrors('Price must be a number');
      return false;
    }

    return true;
  }

  const onSubmit = () => {
    isUpdating ? onUpdate() : onCreate();
  };

  const onDelete = () => {
    deleteProduct(id, {
      onSuccess: () => {
        console.log('Product deleted:', id);
        resetFields();
        router.replace('/(admin)');
      },
      onError: (error) => {
        console.error('Error deleting product:', error);
        setErrors(error.message);
      }
    })
  };
  const confirmDelete = () => {
    //confirmation
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDelete,
        }
      ]
    );
  }

  const onUpdate = () => {
    if (!validateInput()) {
      console.warn(errors);
      return;
    }

    updateProduct({
      id,
      name,
      price: parseFloat(price),
      image: image === defaultPizzaImage ? null : image,
    },
    {
      onSuccess: () => {
        console.log('Product updated:', { name, price, image });
        resetFields();
        router.back();
      },
      onError: (error) => {
        console.error('Error updating product:', error);
        setErrors(error.message);
      }
    }

    );
    console.log('Product updated:', { name, price, image });
  }

  const onCreate = () => {
    if (!validateInput()) {
      console.warn(errors);
      return;
    }

    insertProduct({
      name,
      price: parseFloat(price),
      image: image === defaultPizzaImage ? null : image,
    },
    {
      onSuccess: () => {
        console.log('Product created:', { name, price, image });
        resetFields();
        router.replace('/(admin)');
      },
      onError: (error) => {
        console.error('Error creating product:', error);
        setErrors(error.message);
      }
    });
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 1,
    });

    console.log(result);
    if (result.canceled) {
      console.warn('Image picker was canceled');
      return;
    }
    if (!result.assets || result.assets.length === 0) {
      console.warn('Select correct amount of images');
      return;
    }

    setImage(result.assets[0].uri);
  }
    
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isUpdating ? 'Update Product' : 'Create Product' }} />
      <Image source={{ uri: image || defaultPizzaImage }} style={styles.image} />
      <Text onPress={pickImage} style={styles.textButton}>Tap to select an image</Text>

      <Text style={styles.label}>Create Product Screen</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Product Name"
        style={styles.input}
      />

      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="9.99"
        style={styles.input}
        keyboardType='numeric'
      />

      <Text style={{ color: 'red' }}>{errors}</Text>
      <Button text={isUpdating ? 'Update' : 'Create'} onPress={onSubmit} />

      {isUpdating && <Text style={styles.textButton} onPress={confirmDelete}>Delete</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5
  },
  label: {
    color: 'gray',
    fontSize: 16
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginTop: 10,
    marginBottom: 10,
  }
});

export default CreateProductScreen;