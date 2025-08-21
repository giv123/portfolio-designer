import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function ensureUniqueSlug(baseSlug) {
  const projectsRef = collection(db, 'projects');
  let slug = baseSlug;
  let count = 1;

  const snapshot = await getDocs(
    query(
      projectsRef,
      where('slug', '>=', baseSlug),
      where('slug', '<=', baseSlug + '\uf8ff')
    )
  );

  const existingSlugs = snapshot.docs.map(doc => doc.data().slug);

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}