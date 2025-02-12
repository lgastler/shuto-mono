import { useEffect, useState } from 'react';
import { ShutoClient } from '@shuto/api';

export default function Index() {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const client = new ShutoClient(
          {
            baseUrl: 'http://shuto.test:8080',
            apiKey: 'secret',
          },
          {
            keys: [
              {
                id: 'v1',
                secret: 'your-secret-key-here',
              },
            ],
          }
        );
        const folder = 'examples/5';
        const imageList = await client.listContents(folder);
        const imageUrls = await Promise.all(
          imageList.map(async (file) => {
            console.log('file', file);
            const url = await client.getImageUrl({
              path: `${folder}/${file.path}`,
              w: 500,
            });
            return url;
          })
        );
        console.log('imageUrls', imageUrls);
        setImages(imageUrls);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch images');
      }
    };

    fetchImages();
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Image List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((url) => (
          <div key={url} className="border rounded p-4">
            <img src={url} alt="" className="w-full h-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
