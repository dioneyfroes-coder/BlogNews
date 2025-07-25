'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { postServiceV2 } from '@/services/postService';

// Interfaces para a estrutura da árvore de datas
interface DateTreeNode {
  value: string;
  label: string;
  posts: any[];
  children?: DateTreeNode[];
}

interface DateTree {
  [year: string]: {
    [month: string]: {
      [day: string]: any[];
    };
  };
}

// Função para construir a árvore hierárquica de datas
const buildDateTree = (groupedPosts: any): DateTreeNode[] => {
  if (!groupedPosts || typeof groupedPosts !== 'object') {
    return [];
  }

  const dateTree: DateTree = {};

  // Organizar posts por ano > mês > dia
  Object.entries(groupedPosts).forEach(([dateKey, posts]) => {
    if (!Array.isArray(posts) || posts.length === 0) return;

    try {
      // Corrigir parsing da data - adicionar 'T00:00:00' para evitar problemas de timezone
      const date = new Date(dateKey + 'T00:00:00');
      if (isNaN(date.getTime())) {
        console.warn('buildDateTree: Data inválida:', dateKey);
        return;
      }

      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      if (!dateTree[year]) dateTree[year] = {};
      if (!dateTree[year][month]) dateTree[year][month] = {};
      if (!dateTree[year][month][day]) dateTree[year][month][day] = [];

      // Garantir que não sobrescreva posts existentes
      dateTree[year][month][day] = posts;
    } catch (error) {
      console.warn('buildDateTree: Erro ao processar data:', dateKey, error);
    }
  });

  // Converter para estrutura de árvore
  const result: DateTreeNode[] = [];

  Object.entries(dateTree)
    .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Anos em ordem decrescente
    .forEach(([year, months]) => {
      const yearNode: DateTreeNode = {
        value: year,
        label: year,
        posts: [],
        children: []
      };

      Object.entries(months)
        .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Meses em ordem decrescente
        .forEach(([month, days]) => {
          const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
          ];
          const monthName = monthNames[parseInt(month) - 1];

          const monthNode: DateTreeNode = {
            value: `${year}-${month}`,
            label: monthName,
            posts: [],
            children: []
          };

          Object.entries(days)
            .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Dias em ordem decrescente
            .forEach(([day, posts]) => {
              const dayNode: DateTreeNode = {
                value: `${year}-${month}-${day}`,
                label: `${day} de ${monthName}`,
                posts: posts || []
              };

              monthNode.children!.push(dayNode);
              monthNode.posts = monthNode.posts.concat(posts || []);
            });

          yearNode.children!.push(monthNode);
          yearNode.posts = yearNode.posts.concat(monthNode.posts);
        });

      result.push(yearNode);
    });

  return result;
};

const DateFilter: React.FC = () => {
  const [groupedPosts, setGroupedPosts] = useState<any>({});
  const [dateTree, setDateTree] = useState<DateTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedYears, setExpandedYears] = useState<string[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
  const router = useRouter();

  // Carregar dados agrupados
  useEffect(() => {
    const loadGroupedPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await postServiceV2.getGroupedPosts();
        
        if (response && response.success && response.data) {
          const groupedData = response.data;
          setGroupedPosts(groupedData);
          const tree = buildDateTree(groupedData);
          setDateTree(tree);
        } else {
          setError('Dados de posts inválidos recebidos');
        }
      } catch (err) {
        console.error('Erro ao carregar posts agrupados:', err);
        setError('Erro ao carregar o histórico de posts');
      } finally {
        setLoading(false);
      }
    };

    loadGroupedPosts();
  }, []);

  // Navegar para página de busca com filtro de data
  const navigateToSearch = (date: string, posts: any[]) => {
    if (!posts || posts.length === 0) return;
    
    const searchParams = new URLSearchParams({
      date: date, // Passar a data específica em formato YYYY-MM-DD
      filterByDate: 'true' // Indicar que é uma busca por data
    });
    
    router.push(`/search?${searchParams.toString()}`);
  };

  // Controlar expansão dos anos
  const handleYearToggle = (year: string) => {
    setExpandedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  // Controlar expansão dos meses
  const handleMonthToggle = (monthValue: string) => {
    setExpandedMonths(prev => 
      prev.includes(monthValue) 
        ? prev.filter(m => m !== monthValue)
        : [...prev, monthValue]
    );
  };

  // Renderizar anos
  const renderYear = (yearNode: DateTreeNode) => (
    <Accordion
      key={yearNode.value}
      expanded={expandedYears.includes(yearNode.value)}
      onChange={() => handleYearToggle(yearNode.value)}
      sx={{ 
        boxShadow: 'none',
        '&:before': { display: 'none' },
        backgroundColor: 'transparent'
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          padding: '8px 16px',
          minHeight: '48px',
          '&.Mui-expanded': {
            minHeight: '48px'
          },
          '& .MuiAccordionSummary-content': {
            margin: '12px 0',
            '&.Mui-expanded': {
              margin: '12px 0'
            }
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarTodayIcon fontSize="small" />
          <Typography variant="h6" component="span">
            {yearNode.label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({yearNode.posts.length} posts)
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: '0 16px 16px' }}>
        {yearNode.children?.map(monthNode => renderMonth(monthNode))}
      </AccordionDetails>
    </Accordion>
  );

  // Renderizar meses
  const renderMonth = (monthNode: DateTreeNode) => (
    <Accordion
      key={monthNode.value}
      expanded={expandedMonths.includes(monthNode.value)}
      onChange={() => handleMonthToggle(monthNode.value)}
      sx={{ 
        boxShadow: 'none',
        '&:before': { display: 'none' },
        backgroundColor: 'transparent',
        marginLeft: 2
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          padding: '4px 16px',
          minHeight: '40px',
          '&.Mui-expanded': {
            minHeight: '40px'
          },
          '& .MuiAccordionSummary-content': {
            margin: '8px 0',
            '&.Mui-expanded': {
              margin: '8px 0'
            }
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle1" component="span">
            {monthNode.label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({monthNode.posts.length} posts)
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: '0 16px 8px' }}>
        <List dense>
          {monthNode.children?.map(dayNode => renderDay(dayNode))}
        </List>
      </AccordionDetails>
    </Accordion>
  );

  // Renderizar dias
  const renderDay = (dayNode: DateTreeNode) => (
    <ListItem key={dayNode.value} disablePadding>
      <ListItemButton
        onClick={() => navigateToSearch(dayNode.value, dayNode.posts)}
        sx={{
          borderRadius: 1,
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        <ListItemText
          primary={dayNode.label}
          secondary={`${dayNode.posts.length} posts`}
          primaryTypographyProps={{
            variant: 'body2',
            fontWeight: 500
          }}
          secondaryTypographyProps={{
            variant: 'caption'
          }}
        />
      </ListItemButton>
    </ListItem>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (dateTree.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          Nenhum post encontrado para filtrar
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        Filtrar por Data
      </Typography>
      <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
        {dateTree.map(yearNode => renderYear(yearNode))}
      </Box>
    </Box>
  );
};

export default DateFilter;
