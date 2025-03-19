import { View, Text , StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import Button from '@components/Button';
import { useEffect, useState } from 'react';

import * as ImagePicker from 'expo-image-picker';


import { defaultPizzaImage } from '@components/ProdcutsListItem';
import Colors from '@constants/Colors';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useInsertProduct, useUpdateProduct, useProduct, useDeleteProduct} from '@api/products';

import { randomUUID } from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@lib/supabase';
import { decode } from 'base64-arraybuffer';
import RemoteImage from '@components/RemoteImage';

const CreateProductScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0]);
  const isUpdating = !!id;

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: updatingProduct } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();

  const uploadImage = async () => {
    if (!image?.startsWith('file://')) {
      return;
    }
    
    setIsLoading(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: 'base64',
      });
      const filePath = `${randomUUID()}.png`;
      const contentType = 'image/png';
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, decode(base64), { contentType });
      if (data) {
        return data.path;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

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
    setIsLoading(true);
    deleteProduct(id, {
      onSuccess: () => {
        console.log('Product deleted:', id);
        resetFields();
        setIsLoading(false);
        router.replace('/(admin)');
      },
      onError: (error) => {
        console.error('Error deleting product:', error);
        error instanceof Error ? setErrors(error.message) : setErrors('An unknown error occurred');
        setIsLoading(false);
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

  const onUpdate = async () => {
    if (!validateInput()) {
      console.warn(errors);
      return;
    }

    setIsLoading(true);
    try {
      const imagePath = await uploadImage();

      updateProduct({
        id,
        name,
        price: parseFloat(price),
        image: imagePath,
      },
      {
        onSuccess: () => {
          console.log('Product updated:', { name, price, image });
          resetFields();
          setIsLoading(false);
          router.back();
        },
        onError: (error) => {
          console.error('Error updating product:', error);
          setErrors(error.message);
          setIsLoading(false);
        }
      });
    } catch (error) {
      error instanceof Error ? setErrors(error.message) : setErrors('An unknown error occurred');
      setIsLoading(false);
    }
  }

  const onCreate = async () => {
    if (!validateInput()) {
      console.warn(errors);
      return;
    }

    setIsLoading(true);
    try {
      const imagePath = await uploadImage();

      insertProduct({
        name,
        price: parseFloat(price),
        image: imagePath,
      },
      {
        onSuccess: () => {
          console.log('Product created:', { name, price, image: imagePath });
          resetFields();
          setIsLoading(false);
          router.replace('/(admin)');
        },
        onError: (error) => {
          console.error('Error creating product:', error);
          setErrors(error.message);
          setIsLoading(false);
        }
      });
    } catch (error) {
      error instanceof Error ? setErrors(error.message) : setErrors('An unknown error occurred');
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    setIsLoading(true);
    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        selectionLimit: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    } finally {
      setIsLoading(false);
    }
  }
    
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isUpdating ? 'Update Product' : 'Create Product' }} />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
        </View>
      )}
      
      <RemoteImage 
        path={image}
        fallback={defaultPizzaImage}
        style={[styles.image, { opacity: isLoading ? 0.5 : 1 }]}
      />

      <Text onPress={!isLoading ? pickImage : undefined} 
            style={[styles.textButton, isLoading && styles.disabledText]}>
        Tap to select an image
      </Text>

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
      <Button 
        text={isUpdating ? (isLoading ? 'Updating...' : 'Update') : (isLoading ? 'Creating...' : 'Create')}
        onPress={!isLoading ? onSubmit : undefined}
        disabled={isLoading}
      />

      {isUpdating && (
        <Text 
          style={[styles.textButton, isLoading && styles.disabledText]} 
          onPress={!isLoading ? confirmDelete : undefined}>
          Delete
        </Text>
      )}
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
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1,
  },
  disabledText: {
    opacity: 0.5,
  }
});

export default CreateProductScreen;