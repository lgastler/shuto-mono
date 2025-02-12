import { useEffect, useState } from 'react';
import { RcloneFile } from '@shuto/api';
import { ShutoProvider, ShutoImage, useShutoClient } from '@shuto/react';

function ImageGallery() {
  const folder = 'examples/5';
  const [files, setFiles] = useState<RcloneFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const client = useShutoClient();

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const imageList = await client.listContents(folder);
        setFiles(imageList);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch images');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [client]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded p-4">
            <div className="animate-pulse bg-gray-200 w-full h-48" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => {
        const fullPath = `${folder}/${file.path}`;
        return (
          <div key={fullPath} className="border rounded p-4">
            <ShutoImage
              path={fullPath}
              params={{ w: 500 }}
              className="w-full h-auto"
              alt={file.name}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function Index() {
  return (
    <ShutoProvider
      config={{
        baseUrl: 'http://shuto.test:8080',
        apiKey: 'secret',
      }}
      signerConfig={{
        keys: [
          {
            id: 'v1',
            secret: 'your-secret-key-here',
          },
        ],
      }}
    >
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Image List</h1>
        <ImageGallery />
      </div>
    </ShutoProvider>
  );
}
