/**
 * Serviço para gerenciamento de dados About da aplicação
 * 
 * @description
 * Este serviço gerencia as informações da página "Sobre", incluindo:
 * - Dados básicos da empresa/site
 * - Informações de contato
 * - Links sociais
 * - Imagens e conteúdo
 */

import { BaseApiService } from '@/lib/api/base';
import { logger } from '@/lib/logger';

/**
 * Interface para dados About
 */
export interface AboutData {
  _id?: string;
  title: string;
  text: string;
  imageURL: string;
  phone: string;
  whatsapp: string;
  address: string;
  email: string;
  socialLinks: string[];
}

/**
 * Dados para criação/atualização de About
 */
export interface AboutInput {
  title: string;
  text: string;
  imageURL: string;
  phone: string;
  whatsapp: string;
  address: string;
  email: string;
  socialLinks: string[];
}

/**
 * Serviço para operações relacionadas aos dados About
 * 
 * @class AboutService
 * @extends {BaseApiService}
 */
export class AboutService extends BaseApiService {
  private static instance: AboutService;
  
  constructor() {
    super('/api/about');
  }

  /**
   * Singleton pattern - retorna uma única instância do serviço
   */
  static getInstance(): AboutService {
    if (!AboutService.instance) {
      AboutService.instance = new AboutService();
    }
    return AboutService.instance;
  }

  /**
   * Busca os dados About
   */
  async getAboutData() {
    try {
      logger.info('Buscando dados About');
      return this.get<AboutData>('');
    } catch (error) {
      logger.error('Erro ao buscar dados About', error as Error);
      throw error;
    }
  }

  /**
   * Cria novos dados About
   */
  async createAboutData(aboutData: AboutInput) {
    try {
      logger.info('Criando dados About');
      return this.post<AboutData>('', aboutData);
    } catch (error) {
      logger.error('Erro ao criar dados About', error as Error);
      throw error;
    }
  }

  /**
   * Atualiza dados About existentes
   */
  async updateAboutData(aboutData: AboutInput) {
    try {
      logger.info('Atualizando dados About');
      return this.put<AboutData>('', aboutData);
    } catch (error) {
      logger.error('Erro ao atualizar dados About', error as Error);
      throw error;
    }
  }

  /**
   * Salva dados About (cria ou atualiza automaticamente)
   */
  async saveAboutData(aboutData: AboutInput & { _id?: string }) {
    try {
      if (aboutData._id) {
        return this.updateAboutData(aboutData);
      } else {
        return this.createAboutData(aboutData);
      }
    } catch (error) {
      logger.error('Erro ao salvar dados About', error as Error);
      throw error;
    }
  }
}

// Instância singleton para exportação
export const aboutService = AboutService.getInstance();
