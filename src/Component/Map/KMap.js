import { useState, useEffect } from "react";
import "./KMap.css";
import { Map, MapMarker, Polyline, CustomOverlayMap } from "react-kakao-maps-sdk";
import eventService from "../../EventService";
import useKakaoLoader from "./useKakaoLoader";
import Panorama from "../Panorama/Panorama";


export default function KMap() {
    useKakaoLoader();
    //길안내 state
    const [isdrawing, setIsdrawing] = useState(false);
    const [paths, setPaths] = useState([]);
    const [distances, setDistances] = useState([]);
    // 건물검색 state
    const [searchBuildInfo, setSearchBuildInfo] = useState(null); // 건물좌표
    const [mapSetting, setMapSetting] = useState({
        center: { lat: 37.27474571017286, lng: 127.1302733945799 },
        isPanto: false
    });
    // 이미지 state
    const [pano, setPano] = useState(false);


    useEffect(() => {
        eventService.listenEvent("addMapPoints", (points) => {
            if (!isdrawing) {
                removeAll();
            }
            setPaths(points);
            getDistanceFromPath(points);
        });

        eventService.listenEvent("mapPointerToCenter", (pointData) => {
            removeAll();
            setSearchBuildInfo({ ...pointData, ...{ isShow: false } });
            setMapSetting({ center: pointData.latlng, isPanto: true });
        });
    }, []);

    //거리계산
    const getDistanceFromPath = (paths) => {
        function deg2rad(deg) {
            return deg * (Math.PI / 180)
        }
        let sum = 0;
        let arr = [0];
        for (let i = 1; i < paths.length; i++) {
            const path1 = paths[i - 1];
            const path2 = paths[i];
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(path2.lat - path1.lat);  // deg2rad below
            var dLon = deg2rad(path2.lng - path1.lng);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(path1.lat)) * Math.cos(deg2rad(path2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = Math.floor(R * c * 1000); // Distance in km => m
            console.log(d);
            arr = [...arr, ...[sum + d]];
            sum += d;
        }
        setDistances([
            ...(arr.filter(v => v != arr.slice(-1)[0])),
            ...[sum]
        ]);
        return sum;
    }

    const DistanceInfo = ({ distance }) => {
        const walkkTime = (distance / 67) | 0
        const bycicleTime = (distance / 227) | 0

        return (
            <ul className="dotOverlay distanceInfo">
                <li>
                    <span className="label">총거리</span>{" "}
                    <span className="number">{distance}</span>m
                </li>
                <li>
                    <span className="label">도보</span>{" "}
                    {walkkTime > 60 && (
                        <>
                            <span className="number">{Math.floor(walkkTime / 60)}</span> 시간{" "}
                        </>
                    )}
                    <span className="number">{walkkTime % 60}</span> 분
                </li>
                <li>
                    <span className="label">자전거</span>{" "}
                    {bycicleTime > 60 && (
                        <>
                            <span className="number">{Math.floor(bycicleTime / 60)}</span>{" "}
                            시간{" "}
                        </>
                    )}
                    <span className="number">{bycicleTime % 60}</span> 분
                </li>
            </ul>
        )
    }

    const removeAll = () => {
        setDistances([]);
        setPaths([]);
        setSearchBuildInfo(null);
    }

    const setSBInfoShow = (isShow) => {
        let temp = Object.assign({}, searchBuildInfo);
        temp.isShow = !isShow;
        setSearchBuildInfo(temp);
    }

    return (
        <div className='map-wrap'>
            <Map
                center={mapSetting.center}
                isPanto={mapSetting.isPanto}
                style={{ width: '100%', height: '100%' }}
                level={3}>

                {paths.map((path, i) =>
                    i == paths.length - 1 ?
                        (<MapMarker
                            key={`dot-${path.lat},${path.lng}`}
                            position={path} />) :
                        (
                            <CustomOverlayMap
                                key={`dot-${path.lat},${path.lng}`}
                                position={path}
                                zIndex={1}
                            >
                                <span className="dot"></span>
                            </CustomOverlayMap>
                        ))}

                <Polyline
                    path={paths}
                    strokeWeight={3} // 선의 두께입니다
                    strokeColor={"#5255ee"} // 선의 색깔입니다
                    strokeOpacity={1} // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
                    strokeStyle={"solid"} // 선의 스타일입니다
                />

                {paths.length > 1 &&
                    distances.slice(1, distances.length).map((distance, index) => (
                        <CustomOverlayMap
                            key={`distance-${paths[index + 1].lat},${paths[index + 1].lng}`}
                            position={paths[index + 1]}
                            yAnchor={1}
                            zIndex={2} >
                            {!isdrawing && distances.length === index + 2 ? (
                                <DistanceInfo distance={distance} />
                            ) : (
                                <div className="dotOverlay">
                                    거리 <span className="number">{distance}</span>m
                                </div>
                            )}
                        </CustomOverlayMap>
                    ))}

                {/* 검색 시 화면 */}
                {searchBuildInfo ? (
                    <>

                        {searchBuildInfo.isShow ?
                            (<CustomOverlayMap
                                key={`buildPathInfo-${searchBuildInfo.latlng.lat},${searchBuildInfo.latlng.lng}`}
                                position={searchBuildInfo.latlng}
                                yAnchor={1}
                                zIndex={2} >
                                <div className="buildInfo">
                                    <div className="buildInfo-title">
                                        <h4 className="">{searchBuildInfo.name}</h4>
                                        <span><i className="fa-solid fa-building"></i></span>
                                    </div>
                                    <div className="btn-group" role="group" aria-label="Basic example" style={{width: '80%'}}>
                                        <div type="button" className="btn btn-primary" disabled>Left</div>
                                        <div type="button" onClick={() => {setPano(!pano)}} className="btn btn-primary" disabled>
                                            <i className="fa-solid fa-panorama"></i>
                                        </div>
                                        <div type="button" className="btn btn-primary" disabled>Right</div>
                                    </div>
                                    <div className="close-btn" onClick={() => setSBInfoShow(searchBuildInfo.isShow)}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </div>
                                </div>

                            </CustomOverlayMap>) : ''}


                        <MapMarker
                            key={`buildPathMarker-${searchBuildInfo.latlng.lat},${searchBuildInfo.latlng.lng}`}
                            position={searchBuildInfo.latlng}
                            onClick={() => setSBInfoShow(searchBuildInfo.isShow)}>
                        </MapMarker>
                    </>
                ) : ''}
            </Map>
            <div className="load-view" style={{ zIndex: pano ? '100' : '0' , display: pano ? 'block' : 'none' }}>
                <Panorama pano={pano} setPano={setPano} />
            </div>

        </div>
    )
}