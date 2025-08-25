import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import AdminLayout from '../components/AdminLayout';
import { CATEGORIES } from '../constants/Categories';

import { uploadThumbnailImage, uploadGalleryImages, safeDeleteImage, resizeAndCropImage } from '../services/ImageService';
import { generateSlug, ensureUniqueSlug } from '../services/SlugService';

import '../styles/projectCreateLayout.css';

function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    briefDescription: '',
    workDescription: '',
    category: '',
    slug: '',
    published: false,
    imageUrl: '',
    imagePath: '',
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch project data on mount or when id changes
  useEffect(() => {
    async function fetchProject() {
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setForm({
            title: data.title || '',
            briefDescription: data.briefDescription || '',
            workDescription: data.workDescription || '',
            category: data.category.toLowerCase() || '',
            slug: data.slug || '',
            published: data.published || false,
            imageUrl: data.imageUrl || '',
            imagePath: data.imagePath || '',
          });
          setThumbnailPreview(data.imageUrl || null);
          setExistingGallery(data.images || []);
        } else {
          setError('❌ Project not found');
        }
      } catch (err) {
        console.error(err);
        setError('❌ Failed to load project');
      }
    }
    fetchProject();
  }, [id]);

  useEffect(() => {
    return () => {
      galleryPreviews.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [galleryPreviews]);


  const handleChange = async e => {

    try {
      const { name, value, type, checked } = e.target;

      if (name === 'title') {
        const baseSlug = generateSlug(value);
        const uniqueSlug = await ensureUniqueSlug(baseSlug);

        setForm(prev => ({
          ...prev,
          title: value,
          slug: uniqueSlug,
        }));
      } else if (type === 'checkbox') {
        setForm(prev => ({ ...prev, [name]: checked }));
      } else {
        setForm(prev => ({ ...prev, [name]: value }));
      }
    } catch (err) {
      console.error('Error updating slug', err);
      setError('❌ Failed to update slug. Please try again.');
    }
  };

  const handleThumbnailChange = async e => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    try {
      const resizedFile = await resizeAndCropImage(selectedFile);
      setThumbnailFile(resizedFile);

      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(resizedFile);
    } catch (err) {
      console.error('Failed to resize thumbnail:', err);
      setError('❌ Failed to process thumbnail image');
    }
  };

  const handleGalleryChange = e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setGalleryFiles(prev => [...prev, ...files]);
    setGalleryPreviews(prev => [
      ...prev,
      ...files.map(f => URL.createObjectURL(f)),
    ]);
  };

  const removeExistingImage = async idx => {
    const img = existingGallery[idx];
    if (!img) return;

    try {
      if (!img.path) {
        setError('❌ Image storage path missing, cannot delete');
        return;
      }
      const imageRef = ref(storage, img.path);
      await deleteObject(imageRef);

      const updated = existingGallery.filter((_, i) => i !== idx);
      setExistingGallery(updated);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('❌ Failed to remove existing image');
    }
  };

  const removePreviewImage = idx => {
    const updatedFiles = [...galleryFiles];
    const updatedPreviews = [...galleryPreviews];
    URL.revokeObjectURL(updatedPreviews[idx]);
    updatedFiles.splice(idx, 1);
    updatedPreviews.splice(idx, 1);
    setGalleryFiles(updatedFiles);
    setGalleryPreviews(updatedPreviews);
  };

  const handleThumbnailDelete = async () => {
    if (!form.imagePath) return;

    try {
      await deleteObject(ref(storage, form.imagePath));
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setForm(prev => ({ ...prev, imageUrl: '', imagePath: '' }));
      setError(null);
    } catch (err) {
      console.error('Error deleting thumbnail:', err);
      setError('❌ Failed to delete thumbnail image');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let thumbnailUrl = form.imageUrl;
      let thumbnailPath = form.imagePath;

      if (thumbnailFile && thumbnailPath) {
        await safeDeleteImage(thumbnailPath);
      }

      if (thumbnailFile) {
        const result = await uploadThumbnailImage(id, thumbnailFile);
        thumbnailUrl = result.url;
        thumbnailPath = result.path;
      }

      const galleryUploads = await uploadGalleryImages(id, galleryFiles);

      const updatedProject = {
        ...form,
        imageUrl: thumbnailUrl,
        imagePath: thumbnailPath,
        images: [...existingGallery, ...galleryUploads],
        updatedAt: serverTimestamp(),
      };

      await updateDoc(doc(db, 'projects', id), updatedProject);

      alert('✅ Project updated successfully');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError('❌ Failed to update project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Edit Project</h1>
      <form onSubmit={handleSubmit} className="project-create-form">
        <label>
          Project Title
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Slug (auto-generated)
          <input
            type="text"
            name="slug"
            value={form.slug}
            readOnly
            className="slug-input"
          />
        </label>

        <label>
          Brief Description
          <textarea
            name="briefDescription"
            value={form.briefDescription}
            onChange={handleChange}
            rows={5}
            required
          />
        </label>

        <label>
          Work Description
          <textarea
            name="workDescription"
            value={form.workDescription}
            onChange={handleChange}
            rows={5}
            required
          />
        </label>

        <label className="category-select-label">
          Category
          <select
            name="category"
            className="category-select"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="published"
            checked={form.published}
            onChange={handleChange}
          />
          <span>Published</span>
        </label>

        <label>
          Upload Thumbnail Image
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
        </label>

        {thumbnailPreview && (
          <div className="thumbnail-preview-wrapper">
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className="preview-image"
            />
            <button
              type="button"
              className="remove-btn thumbnail-remove-btn"
              onClick={handleThumbnailDelete}
              title="Delete thumbnail image"
            >
              ×
            </button>
          </div>
        )}

        <hr style={{ margin: '2rem 0' }} />

        <div className="project-images-container">
          <h3>Existing Gallery Images</h3>
          {existingGallery.length === 0 ? (
            <p className="no-images">No images yet.</p>
          ) : (
            existingGallery.map((img, idx) => (
              <div key={idx} className="project-image-wrapper">
                <img src={img.url} alt={`Existing ${idx + 1}`} className="project-image" />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeExistingImage(idx)}
                  title="Delete this image"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        <hr style={{ margin: '2rem 0' }} />

        <div className="project-images-container">
          <h3>New Gallery Images to Upload</h3>
          <label>
            Add Images to Gallery
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryChange}
            />
          </label>
          {galleryPreviews.length === 0 ? (
            <p className="no-images">No new images added.</p>
          ) : (
            galleryPreviews.map((src, idx) => (
              <div key={idx} className="project-image-wrapper">
                <img src={src} alt={`New Preview ${idx + 1}`} className="project-image" />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removePreviewImage(idx)}
                  title="Remove this new image"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Project'}
        </button>
      </form>
    </AdminLayout>
  );
}

export default ProjectEdit;