import { useEffect, useState, useRef } from 'react';
import { ImageParams } from '@shuto-img/api';
import { useShutoClient } from './shuto-provider';

interface ShutoImageProps extends Omit<ImageParams, 'excludeBaseUrl'> {
  className?: string;
  alt: string;
  loading?: 'lazy' | 'eager';
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
  responsive?: boolean;
}

export function ShutoImage({
  path,
  className,
  alt,
  loading = 'lazy',
  fallback,
  onError,
  responsive,
  ...params
}: ShutoImageProps) {
  const client = useShutoClient();
  const [src, setSrc] = useState<string>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const generateUrl = async () => {
      try {
        if (responsive) {
          // Generate srcSet for responsive images
          const sizes = [320, 640, 1024, 1920];
          const srcSet = await Promise.all(
            sizes.map(async (width) => {
              const url = await client.getImageUrl({
                path,
                ...params,
                w: width,
              });
              return `${url} ${width}w`;
            })
          );
          const defaultUrl = await client.getImageUrl({ path, ...params });
          setSrc(defaultUrl);
          if (imgRef.current) {
            imgRef.current.srcset = srcSet.join(', ');
            imgRef.current.sizes =
              '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px';
          }
        } else {
          const url = await client.getImageUrl({ path, ...params });
          setSrc(url);
        }
        setError(undefined);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      }
    };

    generateUrl();
  }, [client, path, ...Object.values(params), responsive]);

  const imgRef = useRef<HTMLImageElement>(null);

  if (error && fallback) {
    return <>{fallback}</>;
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={(e) => {
        const error = new Error('Failed to load image');
        setError(error);
        onError?.(error);
      }}
    />
  );
}

export default ShutoImage;
