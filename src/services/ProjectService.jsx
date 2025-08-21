import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export async function getPublishedProjects(category = "") {
  const baseCollection = collection(db, "projects");
  const filters = [where("published", "==", true)];

  if (category) {
    filters.push(where("category", "==", category));
  }

  const q = query(baseCollection, ...filters);
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getProjectBySlug(slug) {
  const projectsRef = collection(db, 'projects');
  const q = query(projectsRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } else {
    throw new Error('Project not found');
  }
}