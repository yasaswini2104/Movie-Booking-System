import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleSuccess } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      handleGoogleSuccess(token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [handleGoogleSuccess, navigate, searchParams]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  );
};

export default GoogleCallback;