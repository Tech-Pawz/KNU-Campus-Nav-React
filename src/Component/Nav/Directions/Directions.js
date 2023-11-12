import React, { useState, useRef } from 'react';
import $ from 'jquery';
import dataPlace from '../dataPlace.json';



export default function Directions({findBuil}) {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const startRef = useRef(null);
    const endRef = useRef(null);

    return (
        <div className="po-abs" style={{ left: '0', top: '100%', width: '100%', height: '100vh', backgroundColor: '#eeeeee' }}>
            <div>
                <span style={{ fontSize: '1.5rem', padding: '15px', verticalAlign: "middle" }}>출발점</span>
                <div className="w-inp-box" style={{ verticalAlign: 'middle', display: 'inline-block', width: "300px", height: "48px", position: "relative", background: "white", boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.20)", borderRadius: "8px 8px 0 0", margin: "10px 0 auto auto" }}>
                    <input
                        className="w-inp"
                        placeholder="ex) 샬101"
                        type="text"
                        ref={startRef}
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                    />
                </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '1.5rem', padding: '15px', verticalAlign: "middle" }}>도착점</span>
                <div className="w-inp-box" style={{ verticalAlign: 'middle', display: 'inline-block', width: "300px", height: "48px", position: "relative", background: "white", boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.20)", borderRadius: "0 0 8px 8px", margin: "1px 10px auto auto" }}>
                    <input
                        className="w-inp"
                        placeholder={findBuil}
                        type="text"
                        ref={endRef}
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                    />
                </div>
            </div>

            <ul className="place-list list-group">
                {Object.keys(dataPlace).map((v, i) => <li className="list-group-item">
                    <ul key={i} className='nav-ul' style={{ display: "flex" }}>
                        <li className='col'>B1</li>
                        <li>Dapibus ac facilisis in</li>
                    </ul>
                </li>)}
            </ul>

        </div>
    )
}


