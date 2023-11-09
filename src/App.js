import React from 'react';
import  { useState, useEffect} from 'react';

import './App.css';
import Nav from './Component/Nav/Nav';

import { Map, MapMarker } from 'react-kakao-maps-sdk';


function App() {
  const [location, setLoacation] = useState(null); // 현재 위치를 저장할 상태
  const [position, setPosition] = useState();
	useEffect(() => {
		navigator.geolocation.getCurrentPosition(successHandler, errorHandler); // 성공시 successHandler, 실패시 errorHandler 함수가 실행된다.
	}, []);

	const successHandler = (response) => {
		console.log(response); // coords: GeolocationCoordinates {latitude: 위도, longitude: 경도, …} timestamp: 1673446873903
		const { latitude, longitude } = response.coords;
		setLoacation({ latitude, longitude });
	};

	const errorHandler = (error) => {
		console.log(error);
	};

  return (
    <div className="App">
      <Nav />
      <div className='map-wrap'>
        {location && (
          <Map 
              center={{lat: "37.2771248", lng: "127.1341975" }} 
              style={{ width: '100%', height: '100%' }} 
              level={3}
            >
            <MapMarker position={{lat: "37.2771248", lng: "127.1341975" }} />
          </Map>
        )}
      </div>
      <div id='chatbot-wrap'>
        <img src='./images/icons8-chatbot-96.png' alt='icon' id='chatbot'/>
      </div>
     
    </div>
  );
}

export default App;
