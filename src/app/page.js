import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export default async function Home() {
  await dbConnect();
  const posts = await Post.find({}).sort({ createdAt: -1 }).lean();
  
  return (
    <div>
      <div id="blog-container">
        <h1>Blog News</h1>
      </div>

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
