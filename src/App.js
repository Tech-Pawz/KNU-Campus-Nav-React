import React from 'react';
import  { useState, useEffect} from 'react';

import './App.css';
import Nav from './Component/Nav/Nav';

import { Map, MapMarker } from 'react-kakao-maps-sdk';


function App() {
  const [location, setLoacation] = useState(null); // 현재 위치를 저장할 상태

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
              center={{ lat: location.latitude, lng: location.longitude }} 
              style={{ width: '100%', height: '100%' }} 
              level={3}
            >
            <MapMarker position={{ lat: location.latitude, lng: location.longitude }} />
          </Map>
        )}
      </div>
      
    </div>
  );
}

export default App;
