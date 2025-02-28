import { useCallback } from 'react';
import { ListContentsOptions, ImageFile, ImageParams } from '@shuto-img/api';
import { useQuery, QueryKey } from '@tanstack/react-query';
import { useShutoClient } from './shuto-provider';

interface UseShutoQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface ImageOptimization extends Partial<ImageParams> {
  name: string;
}

export interface OptimizedImageUrl {
  src: string;
  width: number;
  height: number;
}

export interface OptimizedImage {
  file: ImageFile;
  urls: Record<string, OptimizedImageUrl>;
}

export function useShutoQuery<T>(
  queryFn: (client: ReturnType<typeof useShutoClient>) => Promise<T>,
  deps: QueryKey = []
): UseShutoQueryResult<T> {
  const client = useShutoClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['shuto', ...deps],
    queryFn: () => queryFn(client),
    gcTime: 1000 * 60 * 5,
    refetchOnMount: 'always' as const,
  });

  return {
    data: data as T | null,
    isLoading,
    error:
      error instanceof Error ? error : error ? new Error(String(error)) : null,
    refetch: async () => {
      await refetch();
    },
  };
}

export function useListContents(path: string, options?: ListContentsOptions) {
  const queryFn = useCallback(
    (client: ReturnType<typeof useShutoClient>) =>
      client.listContents(path, options),
    [path, options]
  );

  return useShutoQuery(queryFn, [path, options]);
}

export function useShutoImages(path: string, options?: ListContentsOptions) {
  const { data: files, isLoading } = useListContents(path, {
    filter: /\.(jpg|jpeg|png|gif|webp)$/i,
    ...options,
  });

  // Filter and type cast to ImageFile[]
  const imageFiles =
    files?.filter((file): file is ImageFile =>
      file.mimeType.startsWith('image/')
    ) ?? [];

  return { images: imageFiles, isLoading };
}

export function useImageUrls(
  path: string,
  optimizations: ImageOptimization[],
  options?: ListContentsOptions
) {
  const { images, isLoading: imagesLoading } = useShutoImages(path, options);

  const queryFn = useCallback(
    async (client: ReturnType<typeof useShutoClient>) => {
      if (!images || images.length === 0) {
        return [];
      }

      const optimizedImages: OptimizedImage[] = await Promise.all(
        images.map(async (file) => {
          const urls: Record<string, OptimizedImageUrl> = {};

          await Promise.all(
            optimizations.map(async (opt) => {
              const finalDimensions = calculateMaintainedAspectRatio(
                file.width,
                file.height,
                opt.w,
                opt.h
              );

              const urlParams = {
                path: file.fullPath,
                ...(opt.w !== undefined && { w: finalDimensions.width }),
                ...(opt.h !== undefined && { h: finalDimensions.height }),
                ...opt,
              };

              const imageUrl = await client.getImageUrl(urlParams);
              urls[opt.name] = {
                src: imageUrl,
                ...finalDimensions,
              };
            })
          );

          return {
            file,
            urls,
          };
        })
      );

      return optimizedImages;
    },
    [images, optimizations, path]
  );

  const { data, isLoading: urlsLoading } = useShutoQuery(queryFn, [
    'imageUrls',
    path,
    optimizations,
    images,
  ]);

  return {
    data: data ?? [],
    isLoading: imagesLoading || urlsLoading,
  };
}

function calculateMaintainedAspectRatio(
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } {
  if (!targetWidth && !targetHeight) {
    return { width: originalWidth, height: originalHeight };
  }

  const aspectRatio = originalWidth / originalHeight;

  if (targetWidth && !targetHeight) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio),
    };
  }

  if (!targetWidth && targetHeight) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight,
    };
  }

  // If both dimensions are specified, use them as is
  return {
    width: targetWidth!,
    height: targetHeight!,
  };
}
