/* Lotto/history.js - Firebase 연동 및 기록 관리 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, query, limitToLast }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// MenuRoulette와 동일한 Firebase 설정
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
const historyRef = ref(db, 'lotto_history'); // 로또 전용 데이터 경로

// 세션 ID 생성 (내 기록 식별용)
function generateSessionId() {
    let id = sessionStorage.getItem('mySessionId');
    if (!id) {
        id = Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('mySessionId', id);
    }
    return id;
}

// 공 색상 결정 헬퍼 함수
function getBallColorClass(num) {
    if (num <= 10) return 'bg-yellow';
    if (num <= 20) return 'bg-blue';
    if (num <= 30) return 'bg-red';
    if (num <= 40) return 'bg-gray';
    return 'bg-green';
}

// [전역 함수] 기록 추가 (index.html에서 호출 가능하도록 window에 등록)
window.addLottoHistory = function (numbers) {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    push(historyRef, {
        time: timeStr,
        nums: numbers,
        sessionId: generateSessionId()
    });
};

// 실시간 데이터 수신 (최근 10개만)
const recentHistoryQuery = query(historyRef, limitToLast(10));

onChildAdded(recentHistoryQuery, (snapshot) => {
    const data = snapshot.val();
    renderLog(data);
});

function renderLog(data) {
    const list = document.getElementById('historyList');
    if (!list) return;

    // 안내 메시지 제거 (첫 데이터 들어올 때)
    const emptyMsg = list.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.remove();

    const li = document.createElement('li');
    li.className = 'history-item';

    // 내 기록인지 확인 (MY 태그 표시)
    const myId = sessionStorage.getItem('mySessionId');
    const isMine = data.sessionId === myId;

    // 번호 공 HTML 생성
    let ballsHtml = '';
    if (Array.isArray(data.nums)) {
        data.nums.forEach(n => {
            ballsHtml += `<span class="small-ball ${getBallColorClass(n)}">${n}</span>`;
        });
    }

    // HTML 조립
    li.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
            <span class="hist-date">${data.time}</span>
            ${isMine ? '<span style="font-size:0.7rem; background:#ff6b6b; color:white; padding:2px 5px; border-radius:4px;">MY</span>' : ''}
        </div>
        <div class="hist-nums">${ballsHtml}</div>
    `;

    // 최신순 정렬을 위해 prepend 사용
    list.prepend(li);

    // 10개 넘어가면 뒤에서부터 삭제 (화면 유지용)
    if (list.children.length > 10) {
        list.removeChild(list.lastChild);
    }
}