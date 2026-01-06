/* history.js - Firebase Realtime Database 버전 (데이터 연동판) */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, query, limitToLast } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔴 Firebase 설정 (본인 것으로 유지!)
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
const historyRef = ref(db, 'history');

// 스타일 정의
document.addEventListener("DOMContentLoaded", () => {
    const style = document.createElement('style');
    style.textContent = `
        .history-container {
            width: 100%; margin-top: 30px; background-color: #f8f9fa;
            border-radius: 12px; padding: 15px; box-sizing: border-box;
        }
        .history-title {
            font-size: 0.85rem; color: #495057; margin-bottom: 12px;
            padding-bottom: 8px; border-bottom: 2px solid #e9ecef;
            font-weight: bold; display: flex; align-items: center; gap: 5px;
        }
        .history-list {
            list-style: none; padding: 0; margin: 0;
            max-height: 200px; overflow-y: hidden;
        }
        .history-item {
            display: flex; align-items: center; gap: 10px;
            padding: 6px 0; border-bottom: 1px solid #f1f3f5;
            animation: slideIn 0.3s ease-out; font-size: 0.85rem; color: #343a40;
        }
        .history-item:last-child { border-bottom: none; }
        .h-time { 
            color: #adb5bd; font-size: 0.7rem; font-family: monospace; 
            min-width: 130px; letter-spacing: -0.5px;
        }
        .h-icon { font-size: 1.2rem; }
        .h-menu { font-weight: bold; flex: 1; }
        .h-tag  { 
            font-size: 0.65rem; color: #fff; background: #ff6b6b; 
            padding: 2px 6px; border-radius: 4px; font-weight: bold;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    const container = document.querySelector('.container');
    const oldHistory = document.querySelector('.history-container');
    if (oldHistory) oldHistory.remove();

    const historyBox = document.createElement('div');
    historyBox.className = 'history-container';
    historyBox.innerHTML = `
        <div class="history-title">📢 실시간 당첨 현황 (전체 유저)</div>
        <ul class="history-list" id="historyList"></ul>
    `;
    container.appendChild(historyBox);
});

// [변경됨] 아이콘을 menu_data.js (RouletteData)에서 가져옴
// 만약 로딩 순서 문제로 없으면 기본값 사용
const getIcons = () => {
    if (typeof RouletteData !== 'undefined' && RouletteData.icons) {
        return RouletteData.icons;
    }
    return ["🎉", "✨"]; // 비상용 기본값
};

window.addHistory = function(menuName) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    // 아이콘 풀에서 랜덤 선택
    const iconList = getIcons();
    const randomIcon = iconList[Math.floor(Math.random() * iconList.length)];

    push(historyRef, {
        time: timeStr,
        icon: randomIcon,
        menu: menuName,
        sessionId: sessionStorage.getItem('mySessionId') || generateSessionId()
    });
};

function generateSessionId() {
    const id = Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('mySessionId', id);
    return id;
}

const recentHistoryQuery = query(historyRef, limitToLast(10));

onChildAdded(recentHistoryQuery, (snapshot) => {
    renderLog(snapshot.val());
});

function renderLog(data) {
    const list = document.getElementById('historyList');
    if (!list) return;

    const li = document.createElement('li');
    li.className = 'history-item';

    const myId = sessionStorage.getItem('mySessionId');
    const isMine = data.sessionId === myId;
    const myTag = isMine ? `<span class="h-tag">MY</span>` : ``;

    li.innerHTML = `
        <span class="h-time">${data.time}</span>
        <span class="h-icon">${data.icon}</span>
        <span class="h-menu">${data.menu}</span>
        ${myTag}
    `;

    list.prepend(li);

    if (list.children.length > 7) {
        list.removeChild(list.lastChild);
    }
}