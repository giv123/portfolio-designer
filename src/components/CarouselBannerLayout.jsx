import React, { useEffect, useState } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { useIsMobile } from "../hooks/IsMobile";
import "../styles/carouselBannerLayout.css";

function Banner() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    const loadImages = async () => {
      const folder = isMobile ? "carousel-mobile-images" : "carousel-desktop-images";
      const folderRef = ref(storage, folder);

      try {
        const list = await listAll(folderRef);

        const imageUrls = await Promise.all(
          list.items.map((item) => getDownloadURL(item))
        );

        setImages(imageUrls);
        setCurrentIndex(0);
        setPreviousIndex(null);
      } catch (err) {
        console.error("Failed to load banner images:", err);
      }
    };

    loadImages();
  }, [isMobile]);

  useEffect(() => {
    if (images.length < 2) return;

    const interval = setInterval(() => {
      setPreviousIndex(currentIndex);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);

      setTimeout(() => {
        setPreviousIndex(null);
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, [images, currentIndex]);

  return (
    <div className="banner-carousel">
      {images.length > 0 ? (
        <>
          <img
            src={images[currentIndex]}
            loading="lazy"
            alt={`Banner ${currentIndex + 1}`}
            className="banner-carousel-image fade-in"
            key={currentIndex}
          />

          {previousIndex !== null && (
            <img
              src={images[previousIndex]}
              loading="lazy"
              alt={`Banner ${previousIndex + 1}`}
              className="banner-carousel-image fade-out"
              key={previousIndex}
            />
          )}
        </>
      ) : (
        <p>Loading images...</p>
      )}
    </div>
  );
}

export default Banner;
