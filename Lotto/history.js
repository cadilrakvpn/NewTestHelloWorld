/* Lotto/history.js - Firebase 연동 및 자동 삭제 기능 포함 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getDatabase, ref, push, onChildAdded, query, limitToLast,
    get, remove, orderByKey, endBefore
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyB0DjOSo_SDVILv5YUcqm782tJCXNhmXpo",
    authDomain: "randomroulette-847fa.firebaseapp.com",
    databaseURL: "https://randomroulette-847fa-default-rtdb.firebaseio.com",
    projectId: "randomroulette-847fa",
    storageBucket: "randomroulette-847fa.firebasestorage.app",
    messagingSenderId: "1001747092628",
    appId: "1:1001747092628:web:99be55d724dce4454c9081",
    measurementId: "G-2H91DXJCT3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const historyRef = ref(db, 'lotto_history');

// 세션 ID 생성
function generateSessionId() {
    let id = sessionStorage.getItem('mySessionId');
    if (!id) {
        id = Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('mySessionId', id);
    }
    return id;
}

// 공 색상 결정 함수
function getBallColorClass(num) {
    if (num <= 10) return 'bg-yellow';
    if (num <= 20) return 'bg-blue';
    if (num <= 30) return 'bg-red';
    if (num <= 40) return 'bg-gray';
    return 'bg-green';
}

// [핵심] DB 청소 함수 (최근 10개만 남기고 삭제)
async function cleanUpOldData() {
    try {
        // 1. 가장 최근 10개 데이터를 가져옴
        const last10Query = query(historyRef, limitToLast(10));
        const snapshot = await get(last10Query);

        if (snapshot.exists()) {
            // 가져온 10개 중 가장 오래된 것(첫 번째)의 키를 찾음
            let oldestKeptKey = null;
            snapshot.forEach((child) => {
                if (!oldestKeptKey) oldestKeptKey = child.key;
            });

            // 2. 그 키보다 더 오래된(이전) 데이터가 있다면 모두 찾아서 삭제
            if (oldestKeptKey) {
                const deleteQuery = query(historyRef, orderByKey(), endBefore(oldestKeptKey));
                const oldDataSnapshot = await get(deleteQuery);

                oldDataSnapshot.forEach((child) => {
                    remove(child.ref); // 삭제 실행
                });
            }
        }
    } catch (e) {
        console.error("DB 정리 중 오류:", e);
    }
}

// [전역 함수] 기록 추가 및 청소 실행
window.addLottoHistory = function (numbers) {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 데이터 저장
    push(historyRef, {
        time: timeStr,
        nums: numbers,
        sessionId: generateSessionId()
    }).then(() => {
        // 저장이 완료되면 청소 시작
        cleanUpOldData();
    });
};

// 화면 표시용 리스너 (최근 10개만)
const recentHistoryQuery = query(historyRef, limitToLast(10));

onChildAdded(recentHistoryQuery, (snapshot) => {
    const data = snapshot.val();
    renderLog(data);
});

function renderLog(data) {
    const list = document.getElementById('historyList');
    if (!list) return;

    if (list.querySelector('.empty-msg')) {
        list.innerHTML = '';
    }

    const li = document.createElement('li');
    li.className = 'history-item';

    const myId = sessionStorage.getItem('mySessionId');
    const isMine = data.sessionId === myId;

    let ballsHtml = '';
    if (Array.isArray(data.nums)) {
        data.nums.forEach(n => {
            ballsHtml += `<span class="small-ball ${getBallColorClass(n)}">${n}</span>`;
        });
    }

    li.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
            <span class="hist-date">${data.time}</span>
            ${isMine ? '<span style="font-size:0.7rem; background:#ff6b6b; color:white; padding:2px 5px; border-radius:4px;">MY</span>' : ''}
        </div>
        <div class="hist-nums">${ballsHtml}</div>
    `;

    list.prepend(li);

    if (list.children.length > 10) {
        list.removeChild(list.lastChild);
    }
}