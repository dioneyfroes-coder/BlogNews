// src/utils/groupPostsByDate.js

export const groupPostsByDate = (posts) => {
    return posts.reduce((acc, post) => {
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
  