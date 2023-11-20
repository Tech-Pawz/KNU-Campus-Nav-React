import { useState, useEffect } from "react";
import "./KMap.css";
import { Map, MapMarker, Polyline, CustomOverlayMap } from "react-kakao-maps-sdk";
import eventService from "../../EventService";
import useKakaoLoader from "./useKakaoLoader";



export default function KMap() {
    useKakaoLoader();
    const [isdrawing, setIsdrawing] = useState(false);
    const [paths, setPaths] = useState([]);
    const [distances, setDistances] = useState([]);
    const [nev, setNev] = useState(true);

    useEffect(() => {
        eventService.listenEvent("addMapPoints", (points) => {
            if (!isdrawing) {
                setDistances([]);
                setPaths([]);
            }
            console.log(points);
            setPaths(points);
            getDistanceFromPath(points);
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

    return (
        <div className='map-wrap'>
            <div className='cnEwCe'>
                <span className="blind">〉</span>
            </div>
            <Map
                center={{ lat: "37.2771248", lng: "127.1341975" }}
                style={{ width: '100%', height: '100%' }}
                level={3}>

                {paths.map((path, i) => 
                i == paths.length-1 ?
                (<MapMarker
                    key={`dot-${path.lat},${path.lng}`}
                    position={path}
                    // image={{
                    //   src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                    //   size: {
                    //     width: 24,
                    //     height: 35
                    //   }, // 마커이미지의 크기입니다
                    // }}
                  />) :
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
                // onCreate={setClickLine}
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
            </Map>

        </div>
    )
}
