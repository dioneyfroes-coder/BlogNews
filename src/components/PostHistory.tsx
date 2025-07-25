// src/components/PostHistory.tsx
"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  ButtonGroup,
  Button,
  Badge,
  Container,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Schedule as ScheduleIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';
import { groupPostsByDate, filterPostsByPeriod, GroupedPosts } from '@/utils/groupPostsByDate';
import PostCard from './PostCard';
import { Post } from '@/types';

interface PostHistoryProps {
  posts: Post[];
  title?: string;
}

const PostHistory: React.FC<PostHistoryProps> = ({ posts, title = "Histórico de Posts" }) => {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>('');

  const filteredPosts = filterPostsByPeriod(posts, selectedPeriod);
  const groupedPosts = groupPostsByDate(filteredPosts);

  const periodOptions = [
    { value: 'today', label: 'Hoje', icon: <TodayIcon fontSize="small" /> },
    { value: 'week', label: 'Semana', icon: <DateRangeIcon fontSize="small" /> },
    { value: 'month', label: 'Mês', icon: <CalendarMonthIcon fontSize="small" /> },
    { value: 'all', label: 'Todos', icon: <ScheduleIcon fontSize="small" /> }
  ] as const;

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  if (!posts || posts.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="text.secondary" align="center">
          Nenhum post encontrado no histórico
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          fontWeight="bold" 
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <ScheduleIcon color="primary" />
          {title}
        </Typography>

        {/* Filter Buttons */}
        <ButtonGroup 
          variant="outlined" 
          size="small"
          sx={{ mt: 2 }}
        >
          {periodOptions.map((option) => (
            <Button
              key={option.value}
              startIcon={option.icon}
              variant={selectedPeriod === option.value ? 'contained' : 'outlined'}
              onClick={() => setSelectedPeriod(option.value)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: selectedPeriod === option.value ? 'bold' : 'medium'
              }}
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Grouped Posts */}
      {groupedPosts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum post encontrado para o período selecionado
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mb: 4 }}>
          {groupedPosts.map((group: GroupedPosts, index: number) => (
            <Accordion
              key={group.date}
              expanded={expandedAccordion === group.date || (index === 0 && expandedAccordion === '')}
              onChange={handleAccordionChange(group.date)}
              sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: theme.shadows[2],
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  boxShadow: theme.shadows[4]
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800',
                  borderRadius: 2,
                  '&.Mui-expanded': {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Typography variant="h6" fontWeight="bold">
                    {group.label}
                  </Typography>
                  <Badge
                    badgeContent={group.count}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold'
                      }
                    }}
                  >
                    <Chip
                      label={`${group.count} post${group.count !== 1 ? 's' : ''}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Badge>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)'
                  },
                  gap: 2
                }}>
                  {group.posts.map((post) => (
                    <Box key={post._id}>
                      <PostCard post={post} variant="compact" />
                    </Box>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default PostHistory;
