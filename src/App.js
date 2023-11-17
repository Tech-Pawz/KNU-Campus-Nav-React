import React from 'react';
import  { useState, useEffect} from 'react';

import './App.css';
import KMap from './Component/Map/KMap';
import Nav from './Component/Nav/Nav';


function App() {
  

  return (
    <div className="App">
      <Nav />
      <KMap/>
      <div id='chatbot-wrap'>
        <img src='./images/icons8-chatbot-96.png' alt='icon' id='chatbot'/>
      </div>
     
    </div>
  );
}

export default App;
