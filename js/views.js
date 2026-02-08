/* views.js - 조회수 시스템 (Firebase Realtime Database) */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, set, runTransaction }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase 설정 (comments.js와 동일)
const firebaseConfig = {
    apiKey: "AIzaSyB0DjOSo_SDVILv5YUcqm782tJCXNhmXpo",
    authDomain: "randomroulette-847fa.firebaseapp.com",
    databaseURL: "https://randomroulette-847fa-default-rtdb.firebaseio.com",
    projectId: "randomroulette-847fa",
    storageBucket: "randomroulette-847fa.firebasestorage.app",
    messagingSenderId: "1001747092628",
    appId: "1:1001747092628:web:99be55d724dce4454c9081"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 현재 페이지의 고유 ID
function getArticleId(path = window.location.pathname) {
    // .html 확장자 제거 후 ID 생성 (일관성 유지)
    path = path.replace(/\.html$/, '');
    return path.replace(/[^a-zA-Z0-9]/g, '_');
}

// 조회수 증가 (세션당 1회)
async function incrementViewCount() {
    const articleId = getArticleId();
    const sessionKey = `viewed_${articleId}`;

    // 이미 이 세션에서 조회했으면 스킵
    // 이미 이 세션에서 조회했으면 스킵
    if (sessionStorage.getItem(sessionKey)) {
        console.log(`ℹ️ 이미 조회함 (${articleId}) - 세션 스토리지 체크 통과 (디버깅 중이면 이 메시지 무시)`);
        // return; // 디버깅을 위해 잠시 주석 처리 (새로고침 할 때마다 증가하도록)
    }

    const viewsRef = ref(db, `views/${articleId}`);

    try {
        await runTransaction(viewsRef, (currentCount) => {
            return (currentCount || 0) + 1;
        });

        // 세션에 조회 기록
        sessionStorage.setItem(sessionKey, 'true');
        console.log(`✅ 조회수 증가 성공! (${articleId})`);
    } catch (error) {
        console.error("❌ 조회수 업데이트 실패:", error);
        if (error.code === 'PERMISSION_DENIED') {
            console.warn("⚠️ Firebase Rules에 'views' 규칙이 추가되었는지 확인해주세요!");
        }
    }
}

// 조회수 표시
async function displayViewCount() {
    const articleId = getArticleId();
    const viewsRef = ref(db, `views/${articleId}`);
    const viewCountEl = document.getElementById('viewCount');

    if (!viewCountEl) return;

    try {
        const snapshot = await get(viewsRef);
        const count = snapshot.val() || 0;
        viewCountEl.textContent = count.toLocaleString();
    } catch (error) {
        console.error("조회수 로드 실패:", error);
        viewCountEl.textContent = '-';
    }
}

// 초기화
document.addEventListener("DOMContentLoaded", async () => {
    await incrementViewCount();
    await displayViewCount();
    window.dispatchEvent(new Event('viewsReady'));
});

// 모든 조회수 가져오기 (인덱스 페이지용)
async function getAllViewCounts() {
    const viewsRef = ref(db, 'views');
    try {
        const snapshot = await get(viewsRef);
        return snapshot.val() || {};
    } catch (error) {
        console.error("조회수 목록 로드 실패:", error);
        return {};
    }
}

// 전역 함수로 내보내기 (다른 곳에서 사용 가능)
window.refreshViewCount = displayViewCount;
window.getAllViewCounts = getAllViewCounts;
window.getArticleIdFromPath = getArticleId;
