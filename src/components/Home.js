"use client";

import React, { useState } from 'react';
import sanitizeHtml from 'sanitize-html';

const Home = ({ initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts);

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const updatedPost = await res.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? updatedPost : post
        )
      );
    } catch (error) {
      console.error('Error liking the post:', error);
    }
  };

  const handleAddComment = async (postId, author, content) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content }),
      });
      const updatedPost = await res.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? updatedPost : post
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className='container'>
      <div id="blog-container">
        <h1>Blog News</h1>
      </div>
      <ul>
        {posts.map((post) => {
          const sanitizedContent = sanitizeHtml(post.content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
              'img', 'iframe', 'div', 'pre', 'ul', 'ol', 'li', 'a', 'b', 'i', 'u', 's', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
            ]),
            allowedAttributes: {
              ...sanitizeHtml.defaults.allowedAttributes,
              img: ['src', 'alt'],
              a: ['href'],
              iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
            },
            allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'www.youtu.be', 'youtu.be']
          });

          return (
            <li key={post._id}>
              <h2>{post.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: sanitizedContent }}></div>
              <small>By {post.author}</small>
              <button onClick={() => handleLike(post._id)}>Gostei! ({post.likes})</button>
              <div>
                <h3>Comentários</h3>
                {post.comments && post.comments.map((comment, index) => (
                  <div key={index}>
                    <p>{comment.author}: {comment.content}</p>
                  </div>
                ))}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const author = e.target.author.value;
                  const content = e.target.content.value;
                  handleAddComment(post._id, author, content);
                  e.target.reset();
                }}>
                  <input type="text" name="author" placeholder="Seu nome" required />
                  <input type="text" name="content" placeholder="Seu comentário" required />
                  <button type="submit">Comentar</button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Home;
