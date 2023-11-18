import React from 'react';
import  { useState, useEffect} from 'react';

import './App.css';
import KMap from './Component/Map/KMap';
import Nav from './Component/Nav/Nav';
import Chatbot from './Component/Chatbot/Chatbot';


function App() {
  

  return (
    <div className="App">
      <Nav />
      <KMap/>
      <Chatbot />
    </div>
  );
}

export default App;
