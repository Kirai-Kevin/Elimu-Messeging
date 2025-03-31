import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';

interface LoginProps {
  onLogin: (userData: {
    userId: string;
    nickname: string;
    userType: 'student' | 'instructor';
  }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [userType, setUserType] = useState<'student' | 'instructor'>('student');
  const [id, setId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('');

  const handleUserTypeChange = (event: SelectChangeEvent<'student' | 'instructor'>) => {
    setUserType(event.target.value as 'student' | 'instructor');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const userId = userType === 'student'
      ? `Student_${id}_${firstName}`
      : `Instructor_${id}_${firstName}`;

    onLogin({
      userId,
      nickname: `${firstName} ${lastName}`,
      userType,
    });
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Elimu Chat
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
          Connect with Students and Instructors
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="user-type-label">I am a</InputLabel>
            <Select
              labelId="user-type-label"
              value={userType}
              label="I am a"
              onChange={handleUserTypeChange}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="instructor">Instructor</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label={userType === 'student' ? 'Student ID' : 'Instructor ID'}
            value={id}
            onChange={(e) => setId(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            margin="normal"
            required
          />

          {userType === 'instructor' && (
            <TextField
              fullWidth
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              margin="normal"
              required
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 4 }}
            disabled={!id || !firstName || !lastName || (userType === 'instructor' && !department)}
          >
            Start Chatting
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
