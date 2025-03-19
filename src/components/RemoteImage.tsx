import { Image } from 'react-native';
import { ComponentProps, useEffect, useState } from 'react';
import { supabase } from '../lib/client/supabase';

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    if (!path) return;

    // Handle local file URIs directly
    if (path.startsWith('file://')) {
      setImage(path);
      return;
    }

    (async () => {
      setImage('');
      const { data, error } = await supabase.storage
        .from('product-images')
        .download(path);

      if (error) {
        console.error(error);
      }

      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setImage(fr.result as string);
        };
      }
    })();
  }, [path]);

  if (!image) {
  }

  return <Image source={{ uri: image || fallback }} {...imageProps} />;
};

export default RemoteImage;