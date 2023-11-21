import { useState } from "react";

export const points = [
    { id: 1, name: "샬롬관", latlng: { lat: 37.27474571017286, lng: 127.1302733945799 } },
    { id: 2, name: "인문사회관", latlng: { lat: 37.27509398192308, lng: 127.13107171678483 } },
    { id: 3, name: "우원관", latlng: { lat: 37.27569220778272, lng: 127.13194095305134 } },
    { id: 4, name: "예술관", latlng: { lat: 37.275873233078535, lng: 127.13120555307452 } },
    { id: 5, name: "도서관", latlng: { lat: 37.27632905296753, lng: 127.13251429147898 } },
    { id: 6, name: "본관", latlng: { lat: 37.27600171824672, lng: 127.1331451377874 } },
    { id: 7, name: "후생관", latlng: { lat: 37.27684588853907, lng: 127.1336371081736 } },
    { id: 8, name: "교육관", latlng: { lat: 37.2754226649809, lng: 127.1332653271354 } },
    { id: 9, name: "경천관", latlng: { lat: 37.27632722752416, lng: 127.13413512806927 } },
    { id: 10, name: "천은관", latlng: { lat: 37.27574155291512, lng: 127.13413408889642 } },
    { id: 11, name: "이공관", latlng: { lat: 37.27698949666928, lng: 127.13413066542857 } },
    { id: 12, name: "a", latlng: { lat: 37.275345856906355, lng: 127.1314470559062 } },
    { id: 13, name: "d", latlng: { lat: 37.27622141040828, lng: 127.13208281906462 } },
    { id: 14, name: "c", latlng: { lat: 37.276198190913696, lng: 127.13270292484154 } },
    { id: 15, name: "f", latlng: { lat: 37.2765691373003, lng: 127.13335473285674 } },
    { id: 16, name: "g", latlng: { lat: 37.2752000000000, lng: 127.13249900000000 } }
];


export default function parseMapPoints(obj) {
    // let sample = { "거리": 3, "경로": [1, 2, 12, 3] };
    //ex. obj = {거리: 10, 경로: Array(7)}
    let idArr = obj["경로"];
    idArr = idArr.map(v => points.filter(pV => pV.id == v)[0].latlng);
    console.log(idArr);
    return idArr;
}

export function parseNameToPointData(name) {
    let pointData = points.filter(pV => pV.name == name)[0];
    console.log(pointData);
    return pointData;
}