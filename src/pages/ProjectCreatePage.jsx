import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useNavigate } from 'react-router-dom';
import {collection, addDoc, serverTimestamp, updateDoc, doc,} from 'firebase/firestore';
import { db } from '../firebase';
import { CATEGORIES } from '../constants/Categories';
import '../styles/projectCreateLayout.css';

import { uploadThumbnailImage, uploadGalleryImages, resizeAndCropImage } from '../services/ImageService';
import { generateSlug, ensureUniqueSlug } from '../services/SlugService';

function ProjectCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    briefDescription: '',
    workDescription: '',
    category: '',
    slug: '',
    published: false,
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      galleryPreviews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [galleryPreviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const resizedFile = await resizeAndCropImage(selectedFile);
    setThumbnailFile(resizedFile);

    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result);
    reader.readAsDataURL(resizedFile);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setGalleryFiles(prev => [...prev, ...files]);
    setGalleryPreviews(prev => [
      ...prev,
      ...files.map(f => URL.createObjectURL(f)),
    ]);
  };

  const removePreviewImage = (idx) => {
    const updatedFiles = [...galleryFiles];
    const updatedPreviews = [...galleryPreviews];

    URL.revokeObjectURL(updatedPreviews[idx]);
    updatedFiles.splice(idx, 1);
    updatedPreviews.splice(idx, 1);

    setGalleryFiles(updatedFiles);
    setGalleryPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const baseSlug = generateSlug(form.title);
      const uniqueSlug = await ensureUniqueSlug(baseSlug);

      const newProject = {
        title: form.title || '',
        briefDescription: form.briefDescription || '',
        workDescription: form.workDescription || '',
        category: form.category.toLowerCase() || '',
        slug: uniqueSlug || '',
        published: form.published || false,
        imageUrl: '',
        imagePath: '',
        images: [],
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'projects'), newProject);
      const projectId = docRef.id;

      let thumbnailUrl = '';
      let thumbnailPath = '';
      if (thumbnailFile) {
        const result = await uploadThumbnailImage(projectId, thumbnailFile);
        thumbnailUrl = result.url;
        thumbnailPath = result.path;
      }

      const galleryUploads = await uploadGalleryImages(projectId, galleryFiles);

      await updateDoc(doc(db, 'projects', projectId), {
        imageUrl: thumbnailUrl,
        imagePath: thumbnailPath,
        images: galleryUploads,
        updatedAt: serverTimestamp(),
      });

      alert('✅ Project created successfully.');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Error adding project:', err);
      setError('❌ Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Create New Project</h1>
      <form onSubmit={handleSubmit} className="project-create-form">
        <label>
          Project Title
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            onBlur={() =>
              setForm(prev => ({
                ...prev,
                slug: generateSlug(prev.title),
              }))
            }
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
            style={{
              backgroundColor: '#f3f3f3',
              color: '#777',
              cursor: 'not-allowed',
            }}
          />
        </label>

        <label>
          Brief Description
          <textarea
            name="briefDescription"
            value={form.briefDescription}
            onChange={handleChange}
            required
            rows={5}
          />
        </label>

        <label>
          Work Description
          <textarea
            name="workDescription"
            value={form.workDescription}
            onChange={handleChange}
            required
            rows={5}
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
            {CATEGORIES.map((cat) => (
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
            onChange={(e) =>
              setForm(prev => ({ ...prev, published: e.target.checked }))
            }
          />
          <span>Published</span>
        </label>

        <label>
          Upload Thumbnail Image
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            required
          />
        </label>

        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="Thumbnail Preview"
            className="preview-image"
          />
        )}

        <hr style={{ margin: '2rem 0' }} />

        <label>
          Upload Project Gallery Images
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
          />
        </label>

        <div className="project-images-container">
          {galleryPreviews.map((src, idx) => (
            <div
              key={idx}
              className="project-image-wrapper"
            >
              <img
                src={src}
                alt={`Gallery Preview ${idx + 1}`}
                className="project-image"
              />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removePreviewImage(idx)}
                title="Remove this image"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </AdminLayout>
  );
}

export default ProjectCreate;