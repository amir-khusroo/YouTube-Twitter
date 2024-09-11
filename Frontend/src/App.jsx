import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import Home from './components/Home.jsx'
import Post from './components/Post.jsx'
import Login from './components/Login.jsx'
import { Route,Routes } from 'react-router-dom'
function App() {
  const [authToken, setAuthToken] = useState(null);
  return (

    <>
      <Header authToken={authToken} setAuthToken={setAuthToken}/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/post' element={<Post/>} />
        <Route path='/login' element={<Login authToken={authToken} setAuthToken={setAuthToken}/>}/>
      </Routes>
    </>
  )
}

export default App
