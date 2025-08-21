import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export function useProjects(selectedCategory) {
  return useQuery({
    queryKey: ['projects', selectedCategory],
    queryFn: async () => {
      const baseCollection = collection(db, "projects");
      const projectsQuery = selectedCategory
        ? query(baseCollection, where("category", "==", selectedCategory))
        : baseCollection;

      const snapshot = await getDocs(projectsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
  });
}