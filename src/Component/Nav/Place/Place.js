import React, { useState, useEffect, useRef } from 'react';
import ActionBtn from '../ActionBtn/ActionBtn';
import Directions from '../Directions/Directions'
import Recent from '../Recent/Recent'
import Bus from '../Bus/Bus'
import './Place.css';
import dataPlace from '../dataPlace.json'


// const iconD = [
//   { id: "search", d: "M14.965 14.255H15.755L20.745 19.255L19.255 20.745L14.255 15.755V14.965L13.985 14.685C12.845 15.665 11.365 16.255 9.755 16.255C6.165 16.255 3.255 13.345 3.255 9.755C3.255 6.165 6.165 3.255 9.755 3.255C13.345 3.255 16.255 6.165 16.255 9.755C16.255 11.365 15.665 12.845 14.685 13.985L14.965 14.255ZM5.255 9.755C5.255 12.245 7.26501 14.255 9.755 14.255C12.245 14.255 14.255 12.245 14.255 9.755C14.255 7.265 12.245 5.255 9.755 5.255C7.26501 5.255 5.255 7.265 5.255 9.755Z" },
//   { id: "mic_none", d: "M12 14.5C13.66 14.5 15 13.16 15 11.5V5.5C15 3.84 13.66 2.5 12 2.5C10.34 2.5 9 3.84 9 5.5V11.5C9 13.16 10.34 14.5 12 14.5ZM11 5.5C11 4.95 11.45 4.5 12 4.5C12.55 4.5 13 4.95 13 5.5V11.5C13 12.05 12.55 12.5 12 12.5C11.45 12.5 11 12.05 11 11.5V5.5ZM12 16.5C14.76 16.5 17 14.26 17 11.5H19C19 15.03 16.39 17.93 13 18.42V21.5H11V18.42C7.61 17.93 5 15.03 5 11.5H7C7 14.26 9.24 16.5 12 16.5Z" }
// ];


export default function Place({findBuil}) {
  const placeDataBase = [
    { icon: <i className="fa-regular fa-building"></i>, placeName: "길찾기" },
    { icon: <i className="fa-solid fa-flask"></i>, placeName: "최근 검색" },
    { icon: <i className="fa-solid fa-clipboard-question"></i>, placeName: "달구지" }
  ];
  const [zIdx, setZIdx] = useState([1, 0, 0]);

  // 건물 검색이 이루어 졌을 때,
  useEffect(() => {
    setZIdx([1,0,0]);
  }, [findBuil]);

  return (
    <div>
      <div className="flex flex-jc-sa">
        {placeDataBase.map((el, idx) => <NavUi icon={el.icon} placeName={el.placeName} zIdx={zIdx} setZIdx={setZIdx} idx={idx} />)}
      </div>
      <Inventory zIdx={zIdx} findBuil={findBuil} />
    </div>
  );
}


const NavUi = ({ icon, placeName, zIdx, setZIdx, idx }) => {

  return (
    <div onClick={() => setZIdx(zIdx.map((e, i) => (i === idx ? 1 : 0)))} className={idx % 2 === 0 ? "con BottomBarItem" : "con BottomBarItem lite-green"}>
      <div
        className='ta-c' style={{ color: 'white', padding: "13px 0" }}>
        <div>{icon}</div>
        <div>{placeName}</div>
      </div>
    </div>
  );
}


const Inventory = ({ zIdx, findBuil }) => {
  return (
    <div>
      <div className='po-rel' style={{ zIndex: zIdx[0] }}>
        <Directions findBuil={findBuil} />
      </div>
      <div className='po-rel' style={{ zIndex: zIdx[1] }}>
        <Recent />
      </div>
      <div className='po-rel' style={{ zIndex: zIdx[2] }}>
        <Bus />
      </div>
    </div>
  );
}