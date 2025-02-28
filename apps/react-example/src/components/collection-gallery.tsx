import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MasonryGallery } from './masonry-gallery';
import SimpleGallery from './simple-gallery';
import { motion, AnimatePresence } from 'framer-motion';
import { useImageUrls, ShutoImage } from '@shuto-img/react';
import { useEffect } from 'react';
import type { OptimizedImage } from '@shuto-img/react';

export interface Collection {
  id: string;
  title: string;
  folderPath: string;
  description?: string;
  layout: 'masonry' | 'simple';
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

const imageOptimizations = [
  {
    name: 'thumbnail',
    w: 300,
  },
  {
    name: 'full',
    w: 1600,
  },
];

function LoadingPlaceholder({ layout }: { layout: 'masonry' | 'simple' }) {
  return layout === 'masonry' ? (
    <MasonryGallery>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="w-full rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse"
          style={{ aspectRatio: `${Math.random() * 0.5 + 0.75}` }}
        />
      ))}
    </MasonryGallery>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="w-full aspect-square rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse"
        />
      ))}
    </div>
  );
}

export function CollectionGallery({
  collections,
  activeId,
  onCollectionChange,
}: {
  collections: Collection[];
  activeId: string;
  onCollectionChange: (newId: string) => void;
}) {
  const activeCollection = collections.find((c) => c.id === activeId);

  const { data: images, isLoading } = useImageUrls(
    activeCollection?.folderPath ?? '',
    imageOptimizations
  );

  return (
    <div className="w-full space-y-6">
      <Tabs
        value={activeId}
        onValueChange={onCollectionChange}
        className="w-full"
      >
        <TabsList className="w-full justify-start">
          {collections.map((collection) => (
            <TabsTrigger
              key={collection.id}
              value={collection.id}
              className="relative"
            >
              <span>{collection.title}</span>
              {collection.description && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {collection.description}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          {collections.map((collection) => (
            <TabsContent
              key={collection.id}
              value={collection.id}
              className="mt-6"
            >
              <motion.div {...fadeInUp}>
                {isLoading ? (
                  <LoadingPlaceholder layout={collection.layout} />
                ) : (
                  images && (
                    <SimpleGallery galleryID={`gallery-${collection.id}`}>
                      {collection.layout === 'masonry' ? (
                        <MasonryGallery>
                          {images.map((image: OptimizedImage) => (
                            <motion.a
                              key={image.file.fullPath}
                              href={image.urls.full.src}
                              data-pswp-width={image.urls.full.width}
                              data-pswp-height={image.urls.full.height}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, ease: 'easeOut' }}
                            >
                              <ShutoImage
                                path={image.file.fullPath}
                                alt={image.file.path}
                                className="w-full h-auto rounded-lg hover:opacity-90 transition-opacity"
                                responsive
                              />
                            </motion.a>
                          ))}
                        </MasonryGallery>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {images.map((image: OptimizedImage) => (
                            <motion.a
                              key={image.file.fullPath}
                              href={image.urls.full.src}
                              data-pswp-width={image.urls.full.width}
                              data-pswp-height={image.urls.full.height}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, ease: 'easeOut' }}
                              className="block"
                            >
                              <ShutoImage
                                path={image.file.fullPath}
                                alt={image.file.path}
                                className="w-full aspect-square object-cover rounded-lg hover:opacity-90 transition-opacity"
                                w={300}
                                h={300}
                                fit="crop"
                              />
                            </motion.a>
                          ))}
                        </div>
                      )}
                    </SimpleGallery>
                  )
                )}
              </motion.div>
            </TabsContent>
          ))}
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
