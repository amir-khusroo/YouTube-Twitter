import { useState } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import Post from './components/Post.jsx';
import Login from './components/Login.jsx';
import RegistrationForm from './components/RegistrationForm.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/Profile.jsx';

function App() {
  const [authToken, setAuthToken] = useState(null);

  return (
    <Router>
      <ToastContainer />
      <Header authToken={authToken} setAuthToken={setAuthToken} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/post' element={<Post />} />
        <Route path='/profile' element={<Profile authToken={authToken}/>} />
        <Route path='/login' element={<Login authToken={authToken} setAuthToken={setAuthToken} />} />
        <Route path='/registration' element={<RegistrationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
