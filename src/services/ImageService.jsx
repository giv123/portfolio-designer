import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from "../firebase";

function generateImageFileName(originalImageName) {
  const ext = originalImageName.split('.').pop();
  const randomNum = Math.floor(Math.random() * 1_000_000);
  return `${Date.now()}-${randomNum}.${ext}`;
}

export async function uploadThumbnailImage(projectId, file) {
  if (!file || !projectId) return { url: '', path: '' };

  const fileName = generateImageFileName(file.name);
  const filePath = `project-thumbnails/${projectId}/${fileName}`;
  const fileRef = ref(storage, filePath);

  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  return { url, path: filePath };
}

export async function uploadGalleryImages(projectId, files) {
  const uploads = [];

  for (const file of files) {
    const fileName = generateImageFileName(file.name);
    const filePath = `project-images/${projectId}/${fileName}`;
    const fileRef = ref(storage, filePath);

    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    
    uploads.push({ url, name: fileName, path: filePath });
  }

  return uploads;
}

export async function safeDeleteImage(path) {
  if (!path) return;

  const fileRef = ref(storage, path);

  try {
    await deleteObject(fileRef);
    console.log(`✅ Deleted image at ${path}`);
  } catch (err) {
    if (err.code === 'storage/object-not-found') {
      console.warn(`⚠️ Image not found at ${path}, skipping delete.`);
    } else {
      console.error(`❌ Failed to delete image at ${path}:`, err);
      throw err;
    }
  }
}

export function resizeAndCropImage(file, targetWidth = 600, targetHeight = 400) {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      const aspectRatio = img.width / img.height;
      const targetRatio = targetWidth / targetHeight;

      let sx, sy, sWidth, sHeight;

      if (aspectRatio > targetRatio) {
        sHeight = img.height;
        sWidth = sHeight * targetRatio;
        sx = (img.width - sWidth) / 2;
        sy = 0;
      } else {
        sWidth = img.width;
        sHeight = sWidth / targetRatio;
        sx = 0;
        sy = (img.height - sHeight) / 2;
      }

      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(blob => {
        const resizedFile = new File([blob], file.name, { type: file.type });
        resolve(resizedFile);
      }, file.type);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
  });
}