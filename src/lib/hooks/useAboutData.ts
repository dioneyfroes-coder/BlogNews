// src/lib/hooks/useAboutData.ts

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { aboutService, AboutData } from '@/services';
import { logger } from '@/lib/logger';

const useAboutData = () => {
  const [aboutData, setAboutData] = useState<AboutData>({
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
      logger.info('Buscando dados About', { hook: 'useAboutData' });
      
      const response = await aboutService.getAboutData();
      
      if (response.success && response.data) {
        const socialLinks = response.data.socialLinks || ['', '', '', ''];
        setAboutData({ ...response.data, socialLinks });
        logger.info('Dados About carregados com sucesso');
      } else {
        console.error('Falha ao buscar dados About:', response.error);
        logger.warn('Falha ao buscar dados About', { error: response.error });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar dados';
      logger.error('Erro ao buscar dados About', error as Error);
      console.error('Erro ao buscar dados:', error);
    }
  };

  const saveAboutData = async () => {
    try {
      logger.info('Salvando dados About', { hasId: !!(aboutData as any)._id });
      
      const dataToSave = {
        title: aboutData.title,
        text: aboutData.text,
        imageURL: aboutData.imageURL,
        phone: aboutData.phone,
        whatsapp: aboutData.whatsapp,
        address: aboutData.address,
        email: aboutData.email,
        socialLinks: aboutData.socialLinks.filter(link => link !== ''),
        _id: (aboutData as any)._id,
      };

      const response = await aboutService.saveAboutData(dataToSave);
      
      if (response.success) {
        toast.success('Dados salvos com sucesso!');
        logger.info('Dados About salvos com sucesso');
        
        // Atualiza o estado local com os dados retornados
        if (response.data) {
          setAboutData(prev => ({ ...prev, ...response.data }));
        }
      } else {
        throw new Error(response.error || 'Erro ao salvar dados');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar os dados';
      logger.error('Erro ao salvar dados About', error as Error);
      console.error('Erro ao salvar dados:', error);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  return { aboutData, setAboutData, saveAboutData };
};

export default useAboutData;
