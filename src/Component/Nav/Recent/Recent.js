import React, { useState, useRef, useEffect } from 'react';
import eventService from '../../../EventService';


export default function Recent() {
    const storageInit = () => {
        const data = JSON.parse(localStorage.getItem('searchHistory'));
        if (data && data !== list) {

            const orderedDate = data.sort((a, b) => new Date(b.time) - new Date(a.time));
            setList([...orderedDate]);
        }
    };
    const elapsedTime = (date) => {
        const start = new Date(date);
        const end = new Date();

        const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
        if (seconds < 60) return '방금 전';

        const minutes = seconds / 60;
        if (minutes < 60) return `${Math.floor(minutes)}분 전`;

        const hours = minutes / 60;
        if (hours < 24) return `${Math.floor(hours)}시간 전`;

        const days = hours / 24;
        if (days < 7) return `${Math.floor(days)}일 전`;

        return `${start.toLocaleDateString()}`;
    };

    const removeWord = (name) => {
        const data = JSON.parse(localStorage.getItem('searchHistory'));
        const filtered = data.filter(v => (v.name !== name));
        let dataset = [...filtered];

        localStorage.setItem('searchHistory', JSON.stringify(dataset));
        setList(dataset);
    }

    const [list, setList] = useState([]);

    useEffect(() => {
        storageInit();
        eventService.listenEvent('updatedLocalStorage', () => {
            storageInit();
        })
    }, [])



    return (
        <div className="po-abs" style={{ left: '0', top: '100%', width: '100%', height: '100vh', backgroundColor: '#eeeeee' }}>
            <ul class="list-group">
                {list.map((v, i) =>
                    <li idx={i} class="list-group-item list-group-item-action d-flex justify-content-between align-items-center cursor-pointer">
                        <i class="fa-regular fa-clock"></i>
                        <div class="ms-2 me-auto">
                            <div class="fw-bold">{v.name}</div>
                        </div>
                        <small class="text-muted">{elapsedTime(v.time)}</small>
                        <i class="fa-solid fa-circle-xmark ms-2" onClick={() => removeWord(v.name)}></i>
                    </li>)}

                {
                    list.length == 0 ? (<>
                        <div class="empty-contents">
                            <h4>오늘은<br/>
                                어디서 수업하나요?</h4>
                            <p>학교에 대한 모든 시설들을<br />
                                가장 빠른 경로와 함께 알려드려요.</p>
                        </div>

                    </>) : ''
                }
            </ul>


        </div>
    )
}


