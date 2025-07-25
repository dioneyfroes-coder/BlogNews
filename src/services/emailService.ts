// src/services/emailService.ts
import { BaseApiService, FilterOptions } from '@/lib/api/base';
import { logger } from '@/lib/logger';

/**
 * Interface para assinante da newsletter
 */
export interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
  categories: string[];
  preferences: {
    frequency: 'daily' | 'weekly' | 'monthly';
    topics: string[];
  };
}

/**
 * Interface para template de email
 */
export interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  type: 'newsletter' | 'notification' | 'transactional';
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface para campanha de email
 */
export interface EmailCampaign {
  _id: string;
  name: string;
  subject: string;
  templateId: string;
  recipientCount: number;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  categories: string[];
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface para dados de newsletter
 */
export interface NewsletterData {
  subject: string;
  content: string;
  categories?: string[];
  scheduledAt?: string;
  templateId?: string;
}

/**
 * Interface para estatísticas de email
 */
export interface EmailStats {
  totalSubscribers: number;
  activeSubscribers: number;
  campaignsSent: number;
  averageOpenRate: number;
  averageClickRate: number;
  recentCampaigns: EmailCampaign[];
}

/**
 * Serviço de gerenciamento de emails e newsletters
 * Gerencia assinantes, templates, campanhas e estatísticas
 */
export class EmailService extends BaseApiService {
  private static instance: EmailService;

  constructor() {
    super('/api/email');
  }

  /**
   * Singleton pattern para garantir uma única instância
   */
  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // ===============================
  // GERENCIAMENTO DE ASSINANTES
  // ===============================

  /**
   * Adiciona novo assinante
   */
  async addSubscriber(subscriberData: {
    email: string;
    name?: string;
    categories?: string[];
  }): Promise<Subscriber> {
    try {
      logger.info('Adicionando novo assinante', { email: subscriberData.email });
      
      const response = await this.post<Subscriber>('/subscribers', subscriberData);
      
      if (response.success && response.data) {
        logger.info('Assinante adicionado com sucesso', { 
          email: subscriberData.email,
          subscriberId: response.data._id 
        });
        return response.data;
      }
      
      throw new Error(response.error || 'Falha ao adicionar assinante');
    } catch (error) {
      logger.error('Erro ao adicionar assinante', error as Error);
      throw error;
    }
  }

  /**
   * Lista todos os assinantes com paginação
   */
  async getAllSubscribers(
    page = 1, 
    limit = 20, 
    filters?: FilterOptions
  ): Promise<{
    subscribers: Subscriber[];
    pagination: {
      current: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await this.get<{
        subscribers: Subscriber[];
        pagination: any;
      }>(`/subscribers?${queryParams}`);

      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.error || 'Falha ao carregar assinantes');
    } catch (error) {
      logger.error('Erro ao carregar assinantes', error as Error);
      throw error;
    }
  }

  /**
   * Envia newsletter para assinantes
   */
  async sendNewsletter(newsletterData: NewsletterData): Promise<EmailCampaign> {
    try {
      logger.info('Enviando newsletter', { subject: newsletterData.subject });
      
      const response = await this.post<EmailCampaign>('/newsletter/send', newsletterData);
      
      if (response.success && response.data) {
        logger.info('Newsletter enviada com sucesso', { 
          campaignId: response.data._id 
        });
        return response.data;
      }
      
      throw new Error(response.error || 'Falha ao enviar newsletter');
    } catch (error) {
      logger.error('Erro ao enviar newsletter', error as Error);
      throw error;
    }
  }

  /**
   * Envia email de notificação
   */
  async sendNotification(
    email: string,
    subject: string,
    content: string
  ): Promise<void> {
    try {
      logger.info('Enviando notificação', { email, subject });
      
      const response = await this.post('/notification/send', {
        email,
        subject,
        content
      });
      
      if (response.success) {
        logger.info('Notificação enviada com sucesso', { email });
      } else {
        throw new Error(response.error || 'Falha ao enviar notificação');
      }
    } catch (error) {
      logger.error('Erro ao enviar notificação', error as Error);
      throw error;
    }
  }

  /**
   * Remove assinante (unsubscribe)
   */
  async unsubscribe(email: string): Promise<void> {
    try {
      logger.info('Removendo assinante', { email });
      
      const response = await this.delete(`/subscribers/unsubscribe`, { email });
      
      if (response.success) {
        logger.info('Assinante removido com sucesso', { email });
      } else {
        throw new Error(response.error || 'Falha ao remover assinante');
      }
    } catch (error) {
      logger.error('Erro ao remover assinante', error as Error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas gerais do sistema de email
   */
  async getEmailStats(): Promise<EmailStats> {
    try {
      const response = await this.get<EmailStats>('/stats');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.error || 'Falha ao carregar estatísticas');
    } catch (error) {
      logger.error('Erro ao carregar estatísticas de email', error as Error);
      throw error;
    }
  }

  /**
   * Testa configuração de email
   */
  async testEmailConfiguration(): Promise<boolean> {
    try {
      const response = await this.post<{ success: boolean }>('/test', {});
      
      return response.success && response.data?.success === true;
    } catch (error) {
      logger.error('Erro ao testar configuração de email', error as Error);
      return false;
    }
  }
}

// Export da instância singleton
export const emailService = EmailService.getInstance();
