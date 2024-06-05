// src/app/posts/[id]/page.server.js

import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function fetchPostData(id) {
  await dbConnect();
  const post = await Post.findById(id).lean();

  if (!post) {
    return null;
  }

  post._id = post._id.toString();
  post.comments = post.comments.map(comment => ({
    ...comment,
    _id: comment._id.toString(),
  }));

  return post;
}
