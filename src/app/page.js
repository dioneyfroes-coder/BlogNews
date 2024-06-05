// src/pages/index.js

import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Home from '@/app/Home/page';

export const dynamic = 'force-dynamic'; // Para garantir renderização dinâmica

export default async function Page() {
  await dbConnect();

  const posts = await Post.find({}).sort({ createdAt: -1 }).lean();
  posts.forEach(post => {
    post._id = post._id.toString();
    post.createdAt = post.createdAt.toString();
    post.updatedAt = post.updatedAt ? post.updatedAt.toString() : null;
    if (post.comments) {
      post.comments.forEach(comment => {
        comment._id = comment._id.toString();
      });
    }
  });

  return <Home initialPosts={posts} />;
};
