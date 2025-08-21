import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject, listAll } from 'firebase/storage';
import { db, storage } from '../firebase';

/**
 * Deletes a project and its associated assets from Firestore and Firebase Storage.
 * @param {Object} project - The project object to delete.
 * @returns {Promise<void>}
 */

export async function deleteProjectWithAssets(project) {
  if (!project?.id) {
    throw new Error('Project ID is required to delete assets.');
  }

  try {
    try {
      const thumbnailFolderRef = ref(storage, `project-thumbnails/${project.id}/`);
      const thumbnailList = await listAll(thumbnailFolderRef);
      const deleteThumbPromises = thumbnailList.items.map(itemRef => deleteObject(itemRef));
      await Promise.all(deleteThumbPromises);
    } catch (thumbErr) {
      console.warn('Thumbnail cleanup skipped:', thumbErr.message);
    }

    try {
      const galleryFolderRef = ref(storage, `project-images/${project.id}/`);
      const galleryList = await listAll(galleryFolderRef);
      const deleteGalleryPromises = galleryList.items.map(itemRef => deleteObject(itemRef));
      await Promise.all(deleteGalleryPromises);
    } catch (galleryErr) {
      console.warn('Gallery cleanup skipped:', galleryErr.message);
    }

    await deleteDoc(doc(db, 'projects', project.id));
  } catch (err) {
    console.error('Failed to delete project with assets:', err);
    throw err;
  }
}
