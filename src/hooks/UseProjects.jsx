import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export function useProjects(selectedCategory) {
  return useQuery({
    queryKey: ['projects', selectedCategory],
    queryFn: async () => {
      const baseCollection = collection(db, 'projects');
      const filters = [];

      if (selectedCategory) {
        filters.push(where('category', '==', selectedCategory));
      }

      filters.push(orderBy('createdAt', 'desc'));

      const projectsQuery = query(baseCollection, ...filters);

      const snapshot = await getDocs(projectsQuery);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
  });
}