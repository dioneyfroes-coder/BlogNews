"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const DeletePost = ({ postId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!postId) {
      toast.error('Post ID is required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/posts?id=${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete post');
      }

      toast.success('Post deleted successfully');
      router.push('/admin');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete Post'}
      </button>
    </div>
  );
};

export default DeletePost;
