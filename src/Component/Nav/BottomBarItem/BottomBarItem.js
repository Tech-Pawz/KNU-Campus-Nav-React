import React from 'react';

export default function BottomBarItem() {
    return (
        <div class="BottomBarItem" style="width: 131px; height: 61px; padding-top: 11px; padding-bottom: 10px; padding-left: 12px; padding-right: 12px; justify-content: center; align-items: center; display: inline-flex">
            <div class="Contents" style="width: 107px; flex-direction: column; justify-content: flex-start; align-items: center; display: inline-flex">
                <div class="ActionAccountCircle" style="width: 24px; height: 24px; position: relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M14.5 2.5C15.3284 1.67157 16.6716 1.67157 17.5 2.5V2.5C18.3284 3.32843 18.3284 4.67157 17.5 5.5L15 8L16.8633 15.4361C16.9482 15.7749 16.8501 16.1335 16.6046 16.382L16.3626 16.6269C15.9174 17.0776 15.1706 17.0059 14.8192 16.4788L11.5 11.5L7.5 15.5V17.5858C7.5 17.851 7.39464 18.1054 7.20711 18.2929L6.92578 18.5742C6.45953 19.0405 5.67757 18.9357 5.35043 18.3633L4 16L1.63675 14.6496C1.06425 14.3224 0.959533 13.5405 1.42578 13.0742L1.70711 12.7929C1.89464 12.6054 2.149 12.5 2.41421 12.5H4.5L8.5 8.5L3.52125 5.18083C2.99413 4.82942 2.92247 4.08263 3.37316 3.63739L3.61816 3.39535C3.86664 3.14987 4.2252 3.05183 4.56401 3.13673L12 5L14.5 2.5Z" stroke="white" stroke-width="2"/>
                    </svg>
                </div>
                <div class="TextLabel" style="align-self: stretch; text-align: center; color: #fff; font-size: 12px; font-weight: 400; line-height: 16px; word-wrap: break-word;">캠퍼스 투어</div>
            </div>
        </div>
    );
}