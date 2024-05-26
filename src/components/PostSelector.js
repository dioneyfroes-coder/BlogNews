import React from 'react';

const PostSelector = ({ posts, loading, handlePostSelect }) => (
  <div style={{ maxHeight: '200px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
    {loading ? (
      <div>Carregando posts...</div>
    ) : (
      <select size="10" style={{ width: '100%' }} onChange={handlePostSelect}>
        {posts.map((post) => (
          <option key={post._id} value={post._id}>
            {post.title}
          </option>
        ))}
      </select>
    )}
  </div>
);

export default PostSelector;
