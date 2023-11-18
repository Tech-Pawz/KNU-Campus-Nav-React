import React, { useState, useRef, useEffect } from 'react';
const INF = Number.MAX_SAFE_INTEGER;

const dijkstra = (pointLen, roadLen, edges, start, end) => {
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

const pointLen = 15;
const roadLen = 18;

// 사용 예시
// let start = "샬롬관";
// let end = "교육관";
// start = numbering(start);
// end = numbering(end);

// 노선도
const edges = [
    [1, 2, 1],
    [2, 12, 1],
    [12, 3, 1],
    [12, 4, 2],
    [4, 13, 2],
    [13, 5, 1],
    [13, 14, 1],
    [3, 14, 1],
    [3, 8, 4],
    [14, 6, 1],
    [8, 6, 1],
    [8, 9, 2],
    [5, 15, 2],
    [7, 15, 1],
    [9, 15, 1],
    [9, 10, 1],
    [7, 11, 2],
    [9, 11, 1]
];

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


export function FindRoad(s,e) {
    // console.log(s, e);
    if(s && e) {
        let start = numbering(s);
        let end = numbering(e);
        const res = dijkstra(pointLen, roadLen, edges, start, end);
        alert(res.경로);
        return res;
    } else {
        return false;
    }
}