// src/utils/groupPostsByDate.ts
import { Post } from '@/types';

interface GroupedPosts {
  [year: string]: {
    [month: string]: {
      [day: string]: Post[];
    };
  };
}

export const groupPostsByDate = (posts: Post[]): GroupedPosts => {
    return posts.reduce((acc: GroupedPosts, post: Post) => {
      const date = new Date(post.createdAt);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'long' }); // Ex: January, February
      const day = date.getDate();
  
      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][month]) {
        acc[year][month] = {};
      }
      if (!acc[year][month][day]) {
        acc[year][month][day] = [];
      }
  
      acc[year][month][day].push(post);
  
      return acc;
    }, {});
  };
  