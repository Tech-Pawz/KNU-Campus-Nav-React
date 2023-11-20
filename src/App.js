import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Roadview from './Routes/Roadview/Roadview';
import Main from './Routes/Main/Main';
import NotFound from './Routes/NotFound/NotFound';

function App() {


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/roadview/:imgId" element={<Roadview />}></Route>
          <Route path="*" element={<NotFound/>}></Route>
        </Routes>
      </BrowserRouter>
     
    </div>
  );
}

export default App;
