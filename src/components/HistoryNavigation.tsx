// src/components/HistoryNavigation.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Collapse, ListItemButton } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Post } from '../types';

interface GroupedPosts {
  [year: string]: {
    [month: string]: {
      [day: string]: Post[];
    };
  };
}

interface OpenState {
  [key: string]: boolean;
}

const HistoryNavigation: React.FC = () => {
  const [groupedPosts, setGroupedPosts] = useState<GroupedPosts>({});
  const [openYear, setOpenYear] = useState<OpenState>({});
  const [openMonth, setOpenMonth] = useState<OpenState>({});
  const router = useRouter();

  useEffect(() => {
    const fetchGroupedPosts = async () => {
      try {
        const response = await fetch('/api/grouped-posts');
        const data = await response.json();
        setGroupedPosts(data.data || {});
      } catch (error) {
        console.error('Error fetching grouped posts:', error);
        setGroupedPosts({});
      }
    };

    fetchGroupedPosts();
  }, []);

  const handleYearClick = (year: string) => {
    setOpenYear((prevOpenYear) => ({ ...prevOpenYear, [year]: !prevOpenYear[year] }));
  };

  const handleMonthClick = (year: string, month: string) => {
    setOpenMonth((prevOpenMonth) => ({
      ...prevOpenMonth,
      [`${year}-${month}`]: !prevOpenMonth[`${year}-${month}`],
    }));
  };

  const handlePostClick = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360 }}>
      {Object.keys(groupedPosts).map((year) => (
        <Box key={year}>
          <ListItemButton onClick={() => handleYearClick(year)}>
            <ListItemText primary={year} />
            {openYear[year] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openYear[year]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {Object.keys(groupedPosts[year]).map((month) => (
                <Box key={month} sx={{ pl: 4 }}>
                  <ListItemButton onClick={() => handleMonthClick(year, month)}>
                    <ListItemText primary={month} />
                    {openMonth[`${year}-${month}`] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openMonth[`${year}-${month}`]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {Object.keys(groupedPosts[year][month]).map((day) => (
                        <Box key={day} sx={{ pl: 8 }}>
                          <Typography variant="subtitle2">{`Day ${day}`}</Typography>
                          <List component="div" disablePadding>
                            {groupedPosts[year][month][day].map((post: Post) => (
                              <ListItemButton key={post._id} onClick={() => handlePostClick(post._id)}>
                                <ListItemText primary={post.title} />
                              </ListItemButton>
                            ))}
                          </List>
                        </Box>
                      ))}
                    </List>
                  </Collapse>
                </Box>
              ))}
            </List>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
};

export default HistoryNavigation;
