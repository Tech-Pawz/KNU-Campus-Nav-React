import React, { useState } from 'react';

export default function Place() {
  const placeDataBase = [
    { icon: <i className="fa-regular fa-building"></i>, placeName: "강의실" },
    { icon: <i className="fa-solid fa-flask"></i>, placeName: "연구실" },
    { icon: <i className="fa-solid fa-clipboard-question"></i>, placeName: "센터" }
  ];

  const [page, setPage] = useState(0);

  return (
    <div>
      <div className="flex flex-jc-sa po-rel">
        {/* {placeDataBase.map((el, idx) => <NavUi icon={el.icon} placeName={el.placeName} idx={idx} />)} */}
        <div onClick={() => setPage(0)} className="con BottomBarItem">
          <div
            className='ta-c' style={{ color: 'white', padding: "13px 0" }}>
            <div>{placeDataBase[0].icon}</div>
            <div>{placeDataBase[0].placeName}</div>
          </div>

        </div>
        <div onClick={() => setPage(1)} className="con BottomBarItem lite-green">
          <div
            className='ta-c' style={{ color: 'white', padding: "13px 0" }}>
            <div>{placeDataBase[1].icon}</div>
            <div>{placeDataBase[1].placeName}</div>
          </div>

        </div>
        <div onClick={() => setPage(2)} className="con BottomBarItem">
          <div
            className='ta-c' style={{ color: 'white', padding: "13px 0" }}>
            <div>{placeDataBase[2].icon}</div>
            <div>{placeDataBase[2].placeName}</div>
          </div>

        </div>
      </div>

      <Inventory page={page} placeName={placeDataBase[page].placeName}/>
    </div>
  );
}


const Inventory = ({ page, placeName }) => {
  return (
    <div className="po-abs" style={{ zIndex: '2', top: '100%', width: '100%', height: '100vh', backgroundColor: '#eeeeee' }}>
      <div>
        <input className="w-inp" placeholder={placeName + " 찾기"} type="text" />
      </div>
    </div>
  );
}


// const NavUi = ({ icon, placeName, idx }) => {
//   return (
//     <div onClick={() => { }} className={idx % 2 == 0 ? "con BottomBarItem" : "con BottomBarItem lite-green"}>
//       <div
//         className='ta-c' style={{ color: 'white', padding: "13px 0" }}>
//         <div>{icon}</div>
//         <div>{placeName}</div>
//       </div>

//     </div>
//   );
// }