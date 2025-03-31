import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Chat from './components/Chat/Chat';
import Login from './components/Login/Login';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3498db', // Blue for education/learning
      light: '#5dade2',
      dark: '#2980b9',
    },
    secondary: {
      main: '#2ecc71', // Green for success/growth
      light: '#54d98c',
      dark: '#27ae60',
    },
    background: {
      default: '#f5f6fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

interface UserData {
  userId: string;
  nickname: string;
  userType: 'student' | 'instructor';
}

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleLogin = (data: UserData) => {
    setUserData(data);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          height: '100vh', 
          width: '100vw',
          bgcolor: 'background.default',
          overflow: 'hidden',
        }}>
          {userData ? (
            <Chat
              userId={userData.userId}
              nickname={userData.nickname}
              userType={userData.userType}
            />
          ) : (
            <Login onLogin={handleLogin} />
          )}
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
