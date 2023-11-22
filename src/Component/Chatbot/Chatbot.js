import React, { useState } from 'react';


export default function Chatbot() {
    const [chat, setchat] = useState(false);

    return (
        <div>
            <div id='chatbot-wrap' onClick={()=>setchat(!chat)} style={{zIndex: chat ? 0 : 99}}>
                <img src='./images/icons8-chatbot-96.png' alt='icon' id='chatbot' />
            </div>
            <div id='chatbot-close' onClick={()=>setchat(!chat)} style={{zIndex: chat ? 99 : 0}}>
                <i id='chatbot-x' className="fa-solid fa-xmark"></i>
            </div>
            <div id='chat' style={{display: 'block', bottom: chat ? '140px' : '120px', opacity: chat ? '1' : '0', zIndex: chat ? '99' : '0'}} className='test'>Q n A</div>
        </div>
    );
}