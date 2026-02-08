/* auth.js - 전역 인증 모듈 (navbar 및 전체 사이트 공용) */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase 설정
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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 관리자 UID
const ADMIN_UID = "9qn6kv1dT6ahIPQhZZ9IvAIQ2qF3";

// 전역 상태
window.authState = {
    user: null,
    isAdmin: false,
    isLoggedIn: false
};

// 인증 상태 변경 시 콜백 함수들을 저장
const authCallbacks = [];

// 콜백 등록 함수
window.onAuthChange = function (callback) {
    authCallbacks.push(callback);
    // 이미 상태가 있으면 즉시 호출
    if (window.authState.user !== undefined) {
        callback(window.authState);
    }
};

// 인증 상태 감시
onAuthStateChanged(auth, (user) => {
    window.authState = {
        user: user,
        isAdmin: user && user.uid === ADMIN_UID,
        isLoggedIn: !!user
    };

    if (user) {
        // console.log("🔑 [전역] 로그인됨:", user.displayName);
    } else {
        console.log("🔓 [전역] 로그아웃 상태");
    }

    // 네비게이션 UI 업데이트
    updateNavbarAuth();

    // 등록된 콜백들 호출
    authCallbacks.forEach(cb => cb(window.authState));
});

// 네비게이션 인증 UI 업데이트
function updateNavbarAuth() {
    const loginBtn = document.getElementById('nav-login-btn');
    const userInfo = document.getElementById('nav-user-info');
    const userName = document.getElementById('nav-user-name');
    const adminBadge = document.getElementById('nav-admin-badge');

    if (!loginBtn || !userInfo) return;

    if (window.authState.isLoggedIn) {
        loginBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        if (userName) userName.textContent = window.authState.user.displayName || 'User';
        if (adminBadge) adminBadge.style.display = window.authState.isAdmin ? 'inline' : 'none';
    } else {
        loginBtn.style.display = 'flex';
        userInfo.style.display = 'none';
    }
}

// 구글 로그인 (전역)
window.globalLogin = async function () {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("로그인 에러:", error);
        if (error.code === 'auth/unauthorized-domain') {
            alert("이 도메인에서는 로그인이 허용되지 않습니다.");
        } else {
            alert("로그인에 실패했습니다.");
        }
    }
};

// 로그아웃 (전역)
window.globalLogout = async function () {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("로그아웃 에러:", error);
    }
};

// Firebase 인스턴스 내보내기 (다른 모듈에서 사용 가능)
window.firebaseAuth = auth;
window.firebaseApp = app;
window.ADMIN_UID = ADMIN_UID;
