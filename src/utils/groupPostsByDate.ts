// src/utils/groupPostsByDate.ts

import { Post } from '@/types';
import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth, subWeeks, subMonths, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface GroupedPosts {
  date: string;
  label: string;
  posts: Post[];
  count: number;
}

/**
 * Agrupa posts por data de forma inteligente
 */
export const groupPostsByDate = (posts: Post[]): GroupedPosts[] => {
  if (!posts || posts.length === 0) return [];

  // Ordenar posts por data (mais recente primeiro)
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = typeof a.createdAt === 'string' ? parseISO(a.createdAt) : a.createdAt;
    const dateB = typeof b.createdAt === 'string' ? parseISO(b.createdAt) : b.createdAt;
    return dateB.getTime() - dateA.getTime();
  });

  // Agrupar por data
  const grouped = new Map<string, Post[]>();

  sortedPosts.forEach(post => {
    const postDate = typeof post.createdAt === 'string' ? parseISO(post.createdAt) : post.createdAt;
    const dateKey = format(postDate, 'yyyy-MM-dd');
    
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(post);
  });

  // Converter para array com labels inteligentes
  const result: GroupedPosts[] = [];

  for (const [dateKey, postsGroup] of grouped.entries()) {
    const date = parseISO(dateKey);
    let label: string;

    if (isToday(date)) {
      label = 'Hoje';
    } else if (isYesterday(date)) {
      label = 'Ontem';
    } else if (isAfter(date, subWeeks(new Date(), 1))) {
      label = format(date, 'EEEE', { locale: ptBR });
    } else if (isAfter(date, subMonths(new Date(), 1))) {
      label = format(date, "dd 'de' MMMM", { locale: ptBR });
    } else {
      label = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    }

    result.push({
      date: dateKey,
      label: label.charAt(0).toUpperCase() + label.slice(1),
      posts: postsGroup,
      count: postsGroup.length
    });
  }

  return result;
};

/**
 * Filtra posts por período
 */
export const filterPostsByPeriod = (posts: Post[], period: 'today' | 'week' | 'month' | 'all'): Post[] => {
  if (period === 'all') return posts;

  const now = new Date();

  return posts.filter(post => {
    const postDate = typeof post.createdAt === 'string' ? parseISO(post.createdAt) : post.createdAt;

    switch (period) {
      case 'today':
        return isToday(postDate);
      case 'week':
        return isAfter(postDate, subWeeks(now, 1));
      case 'month':
        return isAfter(postDate, subMonths(now, 1));
      default:
        return true;
    }
  });
};
