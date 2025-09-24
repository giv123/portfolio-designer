import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

import {
  uploadCarouselDesktopImages,
  uploadCarouselMobileImages,
  resizeAndCropImage,
  safeDeleteImage
} from '../services/ImageService';

import '../styles/projectCreateLayout.css';

function CarouselStorage() {
  const navigate = useNavigate();

  const [desktopImages, setDesktopImages] = useState([]);
  const [mobileImages, setMobileImages] = useState([]);

  const [desktopFiles, setDesktopFiles] = useState([]);
  const [mobileFiles, setMobileFiles] = useState([]);

  const [desktopPreviews, setDesktopPreviews] = useState([]);
  const [mobilePreviews, setMobilePreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load existing images from Firebase Storage
  const loadImages = async () => {
    try {
      const desktopRef = ref(storage, 'carousel-desktop-images');
      const mobileRef = ref(storage, 'carousel-mobile-images');

      const [desktopList, mobileList] = await Promise.all([
        listAll(desktopRef),
        listAll(mobileRef),
      ]);

      const desktopResults = await Promise.all(
        desktopList.items.map(async item => ({
          url: await getDownloadURL(item),
          path: item.fullPath
        }))
      );

      const mobileResults = await Promise.all(
        mobileList.items.map(async item => ({
          url: await getDownloadURL(item),
          path: item.fullPath
        }))
      );

      setDesktopImages(desktopResults);
      setMobileImages(mobileResults);
    } catch (err) {
      console.error('Failed to load images:', err);
      setError('❌ Failed to load existing images.');
    }
  };

  useEffect(() => {
    loadImages();

    return () => {
      desktopPreviews.forEach(url => URL.revokeObjectURL(url));
      mobilePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileChange = async (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const previews = files.map(file => URL.createObjectURL(file));

    if (type === 'desktop') {
      setDesktopFiles(prev => [...prev, ...files]);
      setDesktopPreviews(prev => [...prev, ...previews]);
    } else {
      setMobileFiles(prev => [...prev, ...files]);
      setMobilePreviews(prev => [...prev, ...previews]);
    }
  };

  const removePreview = (type, idx) => {
    if (type === 'desktop') {
      const newFiles = [...desktopFiles];
      const newPreviews = [...desktopPreviews];
      URL.revokeObjectURL(newPreviews[idx]);
      newFiles.splice(idx, 1);
      newPreviews.splice(idx, 1);
      setDesktopFiles(newFiles);
      setDesktopPreviews(newPreviews);
    } else {
      const newFiles = [...mobileFiles];
      const newPreviews = [...mobilePreviews];
      URL.revokeObjectURL(newPreviews[idx]);
      newFiles.splice(idx, 1);
      newPreviews.splice(idx, 1);
      setMobileFiles(newFiles);
      setMobilePreviews(newPreviews);
    }
  };

  const deleteExistingImage = async (path) => {
    try {
      await safeDeleteImage(path);
      await loadImages();
    } catch (err) {
      console.error('Failed to delete image:', err);
      setError('❌ Failed to delete image.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (desktopFiles.length > 0) {
        const resizedDesktop = await Promise.all(
          desktopFiles.map(file => resizeAndCropImage(file, 1920, 1080))
        );
        await uploadCarouselDesktopImages(resizedDesktop);
      }

      if (mobileFiles.length > 0) {
        const resizedMobile = await Promise.all(
          mobileFiles.map(file => resizeAndCropImage(file, 1080, 1080))
        );
        await uploadCarouselMobileImages(resizedMobile);
      }

      setDesktopFiles([]);
      setMobileFiles([]);
      setDesktopPreviews([]);
      setMobilePreviews([]);

      await loadImages();

      alert('✅ Carousel images updated.');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Upload failed:', err);
      setError('❌ Failed to upload images.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Configure Carousel Images</h1>
      <form onSubmit={handleSubmit} className="project-create-form">
        
        <label>
          Upload Desktop Images
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, 'desktop')}
          />
        </label>

        <div className="project-images-container">
          {desktopPreviews.map((src, idx) => (
            <div key={idx} className="project-image-wrapper">
              <img src={src} alt={`Desktop Preview ${idx + 1}`} className="project-image" />
              <button type="button" className="remove-btn" onClick={() => removePreview('desktop', idx)}>×</button>
            </div>
          ))}
        </div>

        <div className="project-images-container">
          {desktopImages.map((img, idx) => (
            <div key={idx} className="project-image-wrapper">
              <img src={img.url} alt={`Desktop Existing ${idx + 1}`} className="project-image" />
              <button type="button" className="remove-btn" onClick={() => deleteExistingImage(img.path)}>×</button>
            </div>
          ))}
        </div>

        <hr style={{ margin: '2rem 0' }} />

        <label>
          Upload Mobile Images
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, 'mobile')}
          />
        </label>

        <div className="project-images-container">
          {mobilePreviews.map((src, idx) => (
            <div key={idx} className="project-image-wrapper">
              <img src={src} alt={`Mobile Preview ${idx + 1}`} className="project-image" />
              <button type="button" className="remove-btn" onClick={() => removePreview('mobile', idx)}>×</button>
            </div>
          ))}
        </div>

        <div className="project-images-container">
          {mobileImages.map((img, idx) => (
            <div key={idx} className="project-image-wrapper">
              <img src={img.url} alt={`Mobile Existing ${idx + 1}`} className="project-image" />
              <button type="button" className="remove-btn" onClick={() => deleteExistingImage(img.path)}>×</button>
            </div>
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Save Carousel'}
        </button>
      </form>
    </AdminLayout>
  );
}

export default CarouselStorage;