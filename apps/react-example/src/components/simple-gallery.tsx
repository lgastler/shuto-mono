import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { useEffect } from 'react';
import 'photoswipe/style.css';

export default function SimpleGallery(props: {
  galleryID: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    let lightbox: PhotoSwipeLightbox | null = new PhotoSwipeLightbox({
      gallery: `#${props.galleryID}`,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });
    lightbox.init();

    return () => {
      lightbox?.destroy();
      lightbox = null;
    };
  }, [props.galleryID]);

  return (
    <div className="pswp-gallery" id={props.galleryID}>
      {props.children}
    </div>
  );
}
