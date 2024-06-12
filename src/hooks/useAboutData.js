// src/hooks/useAboutData.js

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const useAboutData = () => {
  const [aboutData, setAboutData] = useState({
    title: '',
    text: '',
    imageURL: '',
    phone: '',
    whatsapp: '',
    address: '',
    email: '',
    socialLinks: ['', '', '', ''],
  });

  const fetchAboutData = async () => {
    try {
      const res = await fetch('/api/about');
      const data = await res.json();
      if (data.success) {
        const socialLinks = data.data.socialLinks || ['', '', '', ''];
        setAboutData({ ...data.data, socialLinks });
      } else {
        console.error('Failed to fetch about data');
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const saveAboutData = async () => {
    const method = aboutData._id ? 'PUT' : 'POST';
    const body = JSON.stringify({
      title: aboutData.title,
      text: aboutData.text,
      imageURL: aboutData.imageURL,
      phone: aboutData.phone,
      whatsapp: aboutData.whatsapp,
      address: aboutData.address,
      email: aboutData.email,
      socialLinks: aboutData.socialLinks.filter(link => link !== ''),
    });

    try {
      const res = await fetch('/api/about', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Dados salvos com sucesso!');
      } else {
        toast.error('Erro ao salvar os dados.');
      }
    } catch (error) {
      console.error('Failed to save data:', error);
      toast.error('Erro ao salvar os dados.');
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  return { aboutData, setAboutData, saveAboutData };
};

export default useAboutData;
