import React from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../../Component/Nav/Nav';
import KMap from '../../Component/Map/KMap';
import Chatbot from '../../Component/Chatbot/Chatbot';

const Main = () => {
    // const { productId } = useParams();
    return (
        <>
            <Nav />
            <KMap />
            <Chatbot />
        </>
    );
}

export default Main;