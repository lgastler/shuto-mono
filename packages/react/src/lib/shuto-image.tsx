import { ImgHTMLAttributes, useEffect, useState } from 'react';
import { ImageParams } from '@shuto-img/api';
import { useShutoClient } from './shuto-client';

export interface ShutoImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  path: string;
  params?: Omit<ImageParams, 'path'>;
  alt?: string;
}

export function ShutoImage({
  path,
  params,
  alt = '',
  ...imgProps
}: ShutoImageProps) {
  const client = useShutoClient();
  const [url, setUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateUrl = async () => {
      setIsLoading(true);
      try {
        const imageUrl = await client.getImageUrl({
          path,
          ...params,
        });
        setUrl(imageUrl);
      } finally {
        setIsLoading(false);
      }
    };

    generateUrl();
  }, [client, path, params]);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 w-full h-48" />;
  }

  if (!url) {
    return null;
  }

  return <img src={url} alt={alt} {...imgProps} />;
}

export default ShutoImage;
