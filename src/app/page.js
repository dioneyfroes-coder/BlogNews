// app/page.js
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export default async function Home() {
  await dbConnect();

  const posts = await Post.find({}).sort({ createdAt: -1 }).lean();
  
  return (
    <div>
      <h1>Blog de Notícias</h1>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <small>By {post.author}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
