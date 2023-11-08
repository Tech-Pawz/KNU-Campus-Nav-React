import React from 'react';

export default function ActionBtn({id, d, left = "auto", right = "auto"}) {
    return (
        <div  style={{width: "24px", height: "24px", left: left, right : right,  top: "12px", position: "absolute"}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id={"action/" + id}>
                    <path id="icon/action/search_24px" fillRule="evenodd" clipRule="evenodd" d={d} fill="black" fillOpacity="0.6"/>
                </g>
            </svg>
        </div>
    );
}