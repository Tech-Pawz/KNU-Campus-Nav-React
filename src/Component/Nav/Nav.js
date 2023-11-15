import React, { useState, useRef } from 'react';
import Place from './Place/Place';



export default function Nav() {
    const [findBuil, setFindBuil] = useState('')
    const [search, setSearch] = useState('')
    const formInputNoRef = useRef(null);

    return (
        <div id='nav'>
            <div className="logo">
                <img src="./images/wlogo.png" alt="logo" />
            </div>
            <div className="w-inp-box po-rel" style={{ width: "344px", height: "48px", background: "white", boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.20)", borderRadius: "8px", margin: "10px auto" }}>
                <input
                    className="w-inp"
                    placeholder="건물명"
                    type="text"
                    ref={formInputNoRef}
                    value={findBuil}
                    onKeyDown={(evt) => {
                        if (evt.key === 'Enter') {
                            setSearch(findBuil);
                            formInputNoRef.current.focus();
                        }
                    }}
                    onChange={(e) => setFindBuil(e.target.value)}
                />
                <div style={{ width: "24px", height: "24px", right: "16px", top: "12px", position: "absolute" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="action/search">
                            <path id="icon/action/search_24px" fillRule="evenodd" clipRule="evenodd" d="M14.965 14.255H15.755L20.745 19.255L19.255 20.745L14.255 15.755V14.965L13.985 14.685C12.845 15.665 11.365 16.255 9.755 16.255C6.165 16.255 3.255 13.345 3.255 9.755C3.255 6.165 6.165 3.255 9.755 3.255C13.345 3.255 16.255 6.165 16.255 9.755C16.255 11.365 15.665 12.845 14.685 13.985L14.965 14.255ZM5.255 9.755C5.255 12.245 7.26501 14.255 9.755 14.255C12.245 14.255 14.255 12.245 14.255 9.755C14.255 7.265 12.245 5.255 9.755 5.255C7.26501 5.255 5.255 7.265 5.255 9.755Z" fill="black" fillOpacity="0.6" />
                        </g>
                    </svg>
                </div>
            </div>
            <Place findBuil={findBuil} search={search} />
        </div>
    );
}