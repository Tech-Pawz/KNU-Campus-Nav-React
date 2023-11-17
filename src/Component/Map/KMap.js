import { useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "./useKakaoLoader";

export default function KMap() {
    useKakaoLoader()

    const [state, setState] = useState({
        // 지도의 초기 위치
        center: { lat: 33.450701, lng: 126.570667 },
        // 지도 위치 변경시 panto를 이용할지에 대해서 정의
        isPanto: false,
    })

    return (
        <div className='map-wrap'>
            <Map
                center={{ lat: "37.2771248", lng: "127.1341975" }}
                style={{ width: '100%', height: '100%' }}
                level={3}>
                <MapMarker position={{ lat: "37.2771248", lng: "127.1341975" }} />
            </Map>
        </div>
    )
}
