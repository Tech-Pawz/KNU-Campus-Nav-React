import React, { useState, useRef, useEffect } from 'react';
import {points} from '../Map/MapPoints';
const INF = Number.MAX_SAFE_INTEGER;

const dijkstra = (edges, start, end, pointLen=16, roadLen=19) => {
    const road = Array.from({ length: pointLen }, () => []);

    for (let i = 0; i < roadLen; i++) {
        const [x, y, z] = edges[i];
        road[x - 1].push([y - 1, z]);
        road[y - 1].push([x - 1, z]); // 양방향성 고려
    }

    const que = [];
    que.push([0, start - 1]);

    const check = Array(pointLen).fill(INF);
    check[start - 1] = 0;

    const pre = Array(pointLen).fill(null);

    while (que.length > 0) {
        const [count, city] = que.shift();

        if (city === end - 1) {
            break;
        }

        for (const [c, cnt] of road[city]) {
            if (count + cnt < check[c]) {
                check[c] = count + cnt;
                pre[c] = city; // 이전 노드를 기록
                que.push([count + cnt, c]);
            }
        }
    }

    // 경로 재구성
    const path = [];
    let current = end - 1;
    while (current !== null) {
        path.unshift(current + 1);
        current = pre[current];
    }

    return { 거리: check[end - 1], 경로: path };
};


const numbering = (buil) => {
    // 노선도
const edges = [
    [1, 2], [2, 12], [12, 3], [12, 4], [4, 13], [13, 5], [13, 14], [3, 14], [3, 16], [16, 8],
    [14, 6], [8, 6], [8, 9], [5, 15], [7, 15], [9, 15], [9, 10], [7, 11], [9, 11]
].map(([start, end]) => [start, end, getDistanceFromPath(start, end)]);
    switch (buil) {
        case "샬롬관":
            return 1;
        case "인문사회관":
            return 2;
        case "우원관":
            return 3;
        case "예술관":
            return 4;
        case "도서관":
            return 5;
        case "본관":
            return 6;
        case "후생관":
            return 7;
        case "교육관":
            return 8;
        case "경천관":
            return 9;
        case "천은관":
            return 10;
        case "이공관":
            return 11;
        default:
            console.log("입력값이 잘못되었습니다.")
            return -1;
    }
}

// 사용 예시
// let start = "샬롬관";
// let end = "교육관";
// start = numbering(start);
// end = numbering(end);


//거리계산
const getDistanceFromPath = (i, j) => {
    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    const path1 = points[i-1].latlng;
    const path2 = points[j-1].latlng;
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(path2.lat - path1.lat);  // deg2rad below
    var dLon = deg2rad(path2.lng - path1.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(path1.lat)) * Math.cos(deg2rad(path2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = Math.floor(R * c * 1000); // Distance in km => m
    
    return d;
}

// 노선도
const edges = [
    [1, 2], [2, 12], [12, 3], [12, 4], [4, 13], [13, 5], [13, 14], [3, 14], [3, 16], [16, 8],
    [14, 6], [8, 6], [8, 9], [5, 15], [7, 15], [9, 15], [9, 10], [7, 11], [9, 11]
].map(([start, end]) => [start, end, getDistanceFromPath(start, end)]);


// const resultWithPath = dijkstra(pointLen, roadLen, edges, start, end);
// console.log(resultWithPath);

// 예시 출력 (start = "샬롬관", end = "이공관")
// {
//     "거리": 10,
//     "경로": [
//       1,
//       2,
//       12,
//       3,
//       8,
//       9,
//       11
//     ]
//   }

export function FindRoad(s, e) {
    if(s && e) {
        let start = numbering(s);
        let end = numbering(e);
        const res1 = dijkstra(edges, start, end);
        const res2 = dijkstra(edges, end, start);
        if (res1.거리 < res2.거리) {
            return res1;
        } else {
            return {"거리": res1.거리, "경로": res2.경로.reverse()};
        }
    } else {
        return false;
    }
}