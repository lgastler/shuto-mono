import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

export function MasonryGallery({ children }: { children: React.ReactNode }) {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
    >
      <Masonry gutter={'0.5rem'}>{children}</Masonry>
    </ResponsiveMasonry>
  );
}
