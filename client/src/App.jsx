import React from 'react'
// import { useState } from 'react'
import {BrowserRouter,Routes, Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';

const App = () => {
  return (
    // <>
    //   <h1>k</h1>
    // </>
    <BrowserRouter>
        <Routes>
          <Route path='/admin/*' element={<AdminPage />}   />
          <Route path='/' element={<LandingPage />}   />
        </Routes>
    </BrowserRouter>
  )
}

export default App;




