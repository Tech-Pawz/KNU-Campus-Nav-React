import React, { useState, useRef, useEffect } from 'react';
import dataPlace from '../dataPlace.json';
import eventService from '../../../EventService';
import {FindRoad} from '../../Road/road';

export default function Directions({ findBuil, search }) {

    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [nowBuil, setNowBuil] = useState('샬롬관');
    const startRef = useRef(null);
    const endRef = useRef(null);

    useEffect(() => {
        if (Object.keys(dataPlace).includes(findBuil)) {
            setNowBuil(findBuil);

            //localstroage
            let data = JSON.parse(localStorage.getItem('searchHistory'));
            let item = { name: findBuil, time: (new Date()).toISOString() };
            if (data) {
                const filtered = data.filter(v => (v.name !== item.name));
                let dataset = [...filtered, ...[item]];

                localStorage.setItem('searchHistory', JSON.stringify(dataset));
            } else localStorage.setItem('searchHistory', JSON.stringify([item]));
            eventService.emitEvent("updatedLocalStorage", true);
        }
    }, [findBuil]);

    useEffect(() => {
        setEnd(search);
    }, [search])

    const inputToFindRoad = () => {
        // console.log(start, end);
        let res = FindRoad(start, end);
        console.log(res);
    }

    return (
        <div className="po-abs" style={{ left: '0', top: '100%', width: '100%', height: '100vh', backgroundColor: '#eeeeee' }}>
            <div>
                <span style={{ fontSize: '1rem', padding: '15px', verticalAlign: "middle" }}>출발점</span>
                <div className="w-inp-box" style={{ verticalAlign: 'middle', display: 'inline-block', width: "300px", height: "48px", position: "relative", background: "white", boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.20)", borderRadius: "8px 8px 0 0", margin: "10px 0 auto auto" }}>
                    <input
                        className="w-inp"
                        placeholder="ex) 샬101"
                        type="text"
                        ref={startRef}
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        onKeyDown={(evt) => {
                            if (evt.key === 'Enter') {
                                startRef.current.focus();
                            }
                        }}
                    />
                </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '1rem', padding: '15px', verticalAlign: "middle" }}>도착점</span>
                <div className="w-inp-box" style={{ verticalAlign: 'middle', display: 'inline-block', width: "300px", height: "48px", position: "relative", background: "white", boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.20)", borderRadius: "0 0 8px 8px", margin: "1px 10px auto auto" }}>
                    <input
                        className="w-inp"
                        placeholder=""
                        type="text"
                        ref={endRef}
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        onKeyDown={(evt) => {
                            if (evt.key === 'Enter') {
                                endRef.current.focus();
                            }
                        }}
                    />
                </div>
            </div>
            <div className='send-form d-grid gap-2 d-md-flex justify-content-md-end'>
                <button type="button" class="btn btn-primary btn-sm m-2" onClick={inputToFindRoad}>
                    길찾기 <i class="fa-solid fa-angle-right"></i>
                </button>
            </div>
            <ul className="place-list list-group">
                {Object.keys(dataPlace[nowBuil]).map((v, i) => <li className="list-group-item">
                    <ul key={i} className='nav-ul flex' style={{ paddingLeft: '0px' }}>
                        <li>{v}</li>
                        <li className='col'>{dataPlace[nowBuil][v]}</li>
                    </ul>
                </li>)}
            </ul>

        </div>
    )
}


