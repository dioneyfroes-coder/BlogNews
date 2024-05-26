"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import EditPost from '@/components/EditPost';

const EditPostPage = ({ params }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const postId = params.id;

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
    } else if (status === 'authenticated' && session.user.role !== 'admin') {
      toast.error('Access denied');
      router.push('/');
    } else if (status === 'authenticated') {
      fetchPost();
    }
  }, [status, session, router]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch post');
      }
      const data = await res.json();
      if (data.success) {
        setPost(data.data);
      } else {
        toast.error('Failed to load post');
        router.push('/admin');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
      router.push('/admin');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return post ? <EditPost post={post} /> : <div>Post not found</div>;
};

export default EditPostPage;
