import {
  CollectionGallery,
  Collection,
} from '../../components/collection-gallery';
import { useParams, useNavigate } from 'react-router-dom';

const collections: Collection[] = [
  {
    id: 'travel',
    title: 'Travel',
    folderPath: 'examples.ignored/travel',
    layout: 'masonry',
  },
  {
    id: 'minimalist',
    title: 'Minimalist',
    folderPath: 'examples.ignored/minimalist',
    layout: 'masonry',
  },
  {
    id: 'nature',
    title: 'Nature',
    folderPath: 'examples.ignored/nature',
    layout: 'masonry',
  },
  {
    id: 'gradients',
    title: 'Gradients',
    folderPath: 'examples.ignored/gradients',
    layout: 'masonry',
  },
];

export default function IndexPage() {
  const { collectionId } = useParams();
  const navigate = useNavigate();

  const handleCollectionChange = (newCollectionId: string) => {
    navigate(`/${newCollectionId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <code>@shuto-img/react</code> – Demo Gallery
        </h1>
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <a
            href="https://github.com/lgastler/shuto-mono"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full transition-all hover:scale-105"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current"
              aria-hidden="true"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
            </svg>
            <span className="font-medium">GitHub</span>
            <span>→</span>
          </a>
          <a
            href="https://www.npmjs.com/package/@shuto-img/api"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-full transition-all hover:scale-105"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current"
              aria-hidden="true"
            >
              <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
            </svg>
            <span className="font-medium">API Package</span>
            <span>→</span>
          </a>
          <a
            href="https://www.npmjs.com/package/@shuto-img/react"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-full transition-all hover:scale-105"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current"
              aria-hidden="true"
            >
              <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
            </svg>
            <span className="font-medium">React Package</span>
            <span>→</span>
          </a>
        </div>
      </div>
      <CollectionGallery
        collections={collections}
        activeId={collectionId || collections[0].id}
        onCollectionChange={handleCollectionChange}
      />
      <footer className="mt-12 py-4 border-t text-sm text-muted-foreground">
        <div className="flex gap-4 justify-center">
          <a
            href="https://www.lennartgastler.de/privacy-policy"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          <a
            href="https://www.lennartgastler.de/legal-notice"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Legal Notice
          </a>
        </div>
      </footer>
    </div>
  );
}
