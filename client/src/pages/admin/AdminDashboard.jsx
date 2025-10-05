import { useState } from 'react';
import { Container, Box, Tabs, Tab, Typography } from '@mui/material';
import { TheaterComedy, Theaters, Movie as MovieIcon, LiveTv} from '@mui/icons-material';
import CinemaManagement from '../../components/admin/CinemaManagement';
import ScreenManagement from '../../components/admin/ScreenManagement';
import MovieManagement from '../../components/admin/MovieManagement';
import ShowManagement from '../../components/admin/ShowManagement';

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        Admin Panel
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab icon={<TheaterComedy />} label="Cinemas" />
          <Tab icon={<Theaters />} label="Screens" />
          <Tab icon={<MovieIcon />} label="Movies" />
          <Tab icon={<LiveTv />} label="Shows" />
        </Tabs>
      </Box>

      {currentTab === 0 && <CinemaManagement />}
      {currentTab === 1 && <ScreenManagement />}
      {currentTab === 2 && <MovieManagement />}
      {currentTab === 3 && <ShowManagement />}
    </Container>
  );
};

export default AdminDashboard;