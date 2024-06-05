// src/components/HistoryNavigation.js
"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const HistoryNavigation = () => {
  const [groupedPosts, setGroupedPosts] = useState({});
  const [openYear, setOpenYear] = useState({});
  const [openMonth, setOpenMonth] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchGroupedPosts = async () => {
      const response = await fetch('/api/grouped-posts');
      const data = await response.json();
      setGroupedPosts(data.data);
    };

    fetchGroupedPosts();
  }, []);

  const handleYearClick = (year) => {
    setOpenYear((prevOpenYear) => ({ ...prevOpenYear, [year]: !prevOpenYear[year] }));
  };

  const handleMonthClick = (year, month) => {
    setOpenMonth((prevOpenMonth) => ({
      ...prevOpenMonth,
      [`${year}-${month}`]: !prevOpenMonth[`${year}-${month}`],
    }));
  };

  const handlePostClick = (postId) => {
    router.push(`/posts/${postId}`);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360 }}>
      {Object.keys(groupedPosts).map((year) => (
        <Box key={year}>
          <ListItem button onClick={() => handleYearClick(year)}>
            <ListItemText primary={year} />
            {openYear[year] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openYear[year]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {Object.keys(groupedPosts[year]).map((month) => (
                <Box key={month} sx={{ pl: 4 }}>
                  <ListItem button onClick={() => handleMonthClick(year, month)}>
                    <ListItemText primary={month} />
                    {openMonth[`${year}-${month}`] ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={openMonth[`${year}-${month}`]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {Object.keys(groupedPosts[year][month]).map((day) => (
                        <Box key={day} sx={{ pl: 8 }}>
                          <Typography variant="subtitle2">{`Day ${day}`}</Typography>
                          <List component="div" disablePadding>
                            {groupedPosts[year][month][day].map((post) => (
                              <ListItem key={post._id} button onClick={() => handlePostClick(post._id)}>
                                <ListItemText primary={post.title} />
                              </ListItem>
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
