import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Nav from './components/nav/Nav';
import Login from './pages/Login';
import Main from './pages/Main';
import Register from './pages/Register';


const theme = createTheme({
  palette: {
    primary: {
      light: '#4f5b62',
      main: '#263238',
      dark: '#000a12',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#6f74dd',
      main: '#3949ab',
      dark: '#00227b',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica Neue", "Arial", sans-serif`,
    h1: {
      fontFamily: `"Open Sans", "Roboto", "Helvetica Neue", "Arial", sans-serif`
    },
    h2: {
      fontFamily: `"Open Sans", "Roboto", "Helvetica Neue", "Arial", sans-serif`
    },
    h3: {
      fontFamily: `"Open Sans", "Roboto", "Helvetica Neue", "Arial", sans-serif`
    },
    h4: {
      fontFamily: `"Open Sans", "Roboto", "Helvetica Neue", "Arial", sans-serif`
    },
    h5: {
      fontFamily: `"Open Sans", "Roboto", "Helvetica Neue", "Arial", sans-serif`
    },
    h6: {
      fontFamily: `"Open Sans", "Roboto", "Helvetica Neue", "Arial", sans-serif`
    },
  }
});

const App = () => {
  return (
    <>
      <Router>
        <ThemeProvider theme={theme}>
          <Nav />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </ThemeProvider>
      </Router>
    </>
  );
}

export default App;
