/* comments.js - Firebase 댓글 시스템 (무한 재귀 대댓글 지원) */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, onChildRemoved, remove, query, orderByChild, get, onValue }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
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
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 관리자 UID
const ADMIN_UID = "9qn6kv1dT6ahIPQhZZ9IvAIQ2qF3";

// 최대 깊이 제한 (UI가 너무 좁아지는 것 방지)
const MAX_DEPTH = 10;

// 현재 페이지의 고유 ID
function getArticleId() {
    const path = window.location.pathname;
    return path.replace(/[^a-zA-Z0-9]/g, '_');
}

// 현재 로그인 상태
let currentUser = null;
let isAdmin = false;

// 페이지 로드 즉시 이전 로그인 상태 적용 (깜박임 완전 방지)
(function preApplyAuthState() {
    const wasLoggedIn = localStorage.getItem('auth_logged_in') === 'true';
    const savedName = localStorage.getItem('auth_user_name');
    const savedIsAdmin = localStorage.getItem('auth_is_admin') === 'true';

    if (wasLoggedIn) {
        // DOM이 준비되면 즉시 로그인 상태 UI 적용
        const applyState = () => {
            const guestForm = document.getElementById('guestForm');
            const loggedInForm = document.getElementById('loggedInForm');
            const loginPrompt = document.getElementById('loginPrompt');
            const loggedInInfo = document.getElementById('loggedInInfo');
            const userName = document.getElementById('userName');
            const adminBadge = document.getElementById('adminBadgeInfo');
            const loginArea = document.querySelector('.login-area');
            const commentForm = document.querySelector('.comment-form');

            if (guestForm) guestForm.style.display = 'none';
            if (loggedInForm) loggedInForm.style.display = 'block';
            if (loginPrompt) loginPrompt.style.display = 'none';
            if (loggedInInfo) loggedInInfo.style.display = 'flex';
            if (userName && savedName) userName.textContent = savedName;
            if (adminBadge) adminBadge.style.display = savedIsAdmin ? 'inline' : 'none';
            if (loginArea) loginArea.classList.add('auth-ready');
            if (commentForm) commentForm.classList.add('auth-ready');
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyState);
        } else {
            applyState();
        }
    }
})();

// 인증 상태 감시
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    isAdmin = user && user.uid === ADMIN_UID;

    // localStorage에 상태 저장 (다음 페이지 로드 시 깜박임 방지용)
    if (user) {
        localStorage.setItem('auth_logged_in', 'true');
        localStorage.setItem('auth_user_name', user.displayName || user.email);
        localStorage.setItem('auth_is_admin', isAdmin ? 'true' : 'false');
    } else {
        localStorage.removeItem('auth_logged_in');
        localStorage.removeItem('auth_user_name');
        localStorage.removeItem('auth_is_admin');
    }

    updateAuthUI();
    updateDeleteButtons();
});

// UI 업데이트
function updateAuthUI() {
    const guestForm = document.getElementById('guestForm');
    const loggedInForm = document.getElementById('loggedInForm');
    const loginPrompt = document.getElementById('loginPrompt');
    const loggedInInfo = document.getElementById('loggedInInfo');
    const userName = document.getElementById('userName');
    const adminBadge = document.getElementById('adminBadgeInfo');
    const loginArea = document.querySelector('.login-area');
    const commentForm = document.querySelector('.comment-form');

    if (currentUser) {
        if (guestForm) guestForm.style.display = 'none';
        if (loggedInForm) loggedInForm.style.display = 'block';
        if (loginPrompt) loginPrompt.style.display = 'none';
        if (loggedInInfo) loggedInInfo.style.display = 'flex';
        if (userName) userName.textContent = currentUser.displayName || currentUser.email;
        if (adminBadge) adminBadge.style.display = isAdmin ? 'inline' : 'none';
    } else {
        // 비회원 상태: 게스트 폼 표시
        if (guestForm) {
            guestForm.style.display = 'block';
            console.log("updateAuthUI: 게스트 폼 표시"); // 디버깅용
        }
        if (loggedInForm) loggedInForm.style.display = 'none';
        if (loginPrompt) {
            loginPrompt.style.display = 'block';
            console.log("updateAuthUI: 로그인 프롬프트 표시"); // 디버깅용
        }
        if (loggedInInfo) loggedInInfo.style.display = 'none';
    }

    // 인증 체크 완료 후 댓글 섹션 표시 (항상)
    const commentSection = document.querySelector('.comment-section');
    if (commentSection) {
        commentSection.classList.add('auth-ready');
        commentSection.style.display = 'block'; // 강제로 표시
    }
}

// 삭제 버튼 업데이트
function updateDeleteButtons() {
    document.querySelectorAll('.comment-item, .reply-item').forEach(item => {
        const deleteBtn = item.querySelector('.comment-delete-btn, .reply-delete-btn');
        if (!deleteBtn) return;

        const authorUid = item.dataset.authorUid;
        const isGuest = item.dataset.isGuest === 'true';

        if (isAdmin || isGuest || (currentUser && authorUid === currentUser.uid)) {
            deleteBtn.style.display = 'inline-block';
        } else {
            deleteBtn.style.display = 'none';
        }
    });
}

// 구글 로그인
window.googleLogin = async function () {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("로그인 에러:", error);
        alert("로그인에 실패했습니다.");
    }
};

// 로그아웃
window.googleLogout = async function () {
    await signOut(auth);
};

// 비밀번호 해시
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

// 현재 시간 문자열
function getTimeStr() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// 로그인 사용자 댓글 작성
window.submitLoggedInComment = function () {
    const content = document.getElementById('loggedInCommentContent').value.trim();
    if (!content) { alert("댓글 내용을 입력해주세요."); return; }
    if (content.length > 500) { alert("댓글은 500자 이하로 입력해주세요."); return; }

    const articleId = getArticleId();
    const commentsRef = ref(db, `comments/${articleId}`);

    push(commentsRef, {
        nickname: currentUser.displayName || currentUser.email,
        authorUid: currentUser.uid,
        isAdmin: isAdmin,
        isGuest: false,
        content: content,
        timestamp: Date.now(),
        time: getTimeStr()
    }).then(() => {
        document.getElementById('loggedInCommentContent').value = '';
    }).catch((error) => {
        console.error("에러:", error);
        alert("댓글 등록에 실패했습니다.");
    });
};

// 비로그인 사용자 댓글 작성
window.submitGuestComment = function () {
    const nickname = document.getElementById('guestNickname').value.trim();
    const password = document.getElementById('guestPassword').value.trim();
    const content = document.getElementById('guestCommentContent').value.trim();

    if (!nickname || !password || !content) { alert("닉네임, 비밀번호, 내용을 모두 입력해주세요."); return; }
    if (nickname.length > 20) { alert("닉네임은 20자 이하로 입력해주세요."); return; }
    if (content.length > 500) { alert("댓글은 500자 이하로 입력해주세요."); return; }

    const articleId = getArticleId();
    const commentsRef = ref(db, `comments/${articleId}`);

    push(commentsRef, {
        nickname: nickname,
        passwordHash: hashPassword(password),
        isGuest: true,
        isAdmin: false,
        content: content,
        timestamp: Date.now(),
        time: getTimeStr()
    }).then(() => {
        document.getElementById('guestNickname').value = '';
        document.getElementById('guestPassword').value = '';
        document.getElementById('guestCommentContent').value = '';
    }).catch((error) => {
        console.error("에러:", error);
        alert("댓글 등록에 실패했습니다.");
    });
};

// 대댓글 폼 토글 (재귀 지원 - dbPath 사용)
window.toggleReplyForm = function (dbPath, depth = 1) {
    const formId = `reply-form-${dbPath.replace(/\//g, '-')}`;
    const existing = document.getElementById(formId);
    if (existing) {
        existing.remove();
        return;
    }

    // 깊이 제한 확인
    if (depth >= MAX_DEPTH) {
        alert(`최대 ${MAX_DEPTH}단계까지만 답글을 작성할 수 있습니다.`);
        return;
    }

    // 다른 열린 폼 닫기
    document.querySelectorAll('.reply-form-container').forEach(f => f.remove());

    const itemId = `item-${dbPath.replace(/\//g, '-')}`;
    const commentItem = document.getElementById(itemId);
    if (!commentItem) return;

    const repliesContainer = commentItem.querySelector('.replies-container');
    if (!repliesContainer) return;

    const formHtml = currentUser ? `
        <div id="${formId}" class="reply-form-container" data-db-path="${dbPath}" data-depth="${depth}">
            <textarea id="reply-content-${formId}" placeholder="답글을 입력하세요..." maxlength="300"></textarea>
            <div class="reply-form-actions">
                <button class="reply-submit-btn" onclick="submitReply('${dbPath}', ${depth})">답글 작성</button>
                <button class="reply-cancel-btn" onclick="toggleReplyForm('${dbPath}', ${depth})">취소</button>
            </div>
        </div>
    ` : `
        <div id="${formId}" class="reply-form-container" data-db-path="${dbPath}" data-depth="${depth}">
            <div class="reply-guest-inputs">
                <input type="text" id="reply-nickname-${formId}" placeholder="닉네임" maxlength="20">
                <input type="password" id="reply-password-${formId}" placeholder="비밀번호">
            </div>
            <textarea id="reply-content-${formId}" placeholder="답글을 입력하세요..." maxlength="300"></textarea>
            <div class="reply-form-actions">
                <button class="reply-submit-btn" onclick="submitGuestReply('${dbPath}', ${depth})">답글 작성</button>
                <button class="reply-cancel-btn" onclick="toggleReplyForm('${dbPath}', ${depth})">취소</button>
            </div>
        </div>
    `;

    repliesContainer.insertAdjacentHTML('beforebegin', formHtml);
};

// 로그인 사용자 대댓글 작성 (재귀 지원)
window.submitReply = function (dbPath, depth) {
    const formId = `reply-form-${dbPath.replace(/\//g, '-')}`;
    const content = document.getElementById(`reply-content-${formId}`).value.trim();
    if (!content) { alert("답글 내용을 입력해주세요."); return; }

    const articleId = getArticleId();
    const repliesRef = ref(db, `comments/${articleId}/${dbPath}/replies`);

    push(repliesRef, {
        nickname: currentUser.displayName || currentUser.email,
        authorUid: currentUser.uid,
        isAdmin: isAdmin,
        isGuest: false,
        content: content,
        timestamp: Date.now(),
        time: getTimeStr()
    }).then(() => {
        document.getElementById(formId)?.remove();
    }).catch((error) => {
        console.error("에러:", error);
        alert("답글 등록에 실패했습니다.");
    });
};

// 비로그인 사용자 대댓글 작성 (재귀 지원)
window.submitGuestReply = function (dbPath, depth) {
    const formId = `reply-form-${dbPath.replace(/\//g, '-')}`;
    const nickname = document.getElementById(`reply-nickname-${formId}`).value.trim();
    const password = document.getElementById(`reply-password-${formId}`).value.trim();
    const content = document.getElementById(`reply-content-${formId}`).value.trim();

    if (!nickname || !password || !content) { alert("닉네임, 비밀번호, 내용을 모두 입력해주세요."); return; }

    const articleId = getArticleId();
    const repliesRef = ref(db, `comments/${articleId}/${dbPath}/replies`);

    push(repliesRef, {
        nickname: nickname,
        passwordHash: hashPassword(password),
        isGuest: true,
        isAdmin: false,
        content: content,
        timestamp: Date.now(),
        time: getTimeStr()
    }).then(() => {
        document.getElementById(formId)?.remove();
    }).catch((error) => {
        console.error("에러:", error);
        alert("답글 등록에 실패했습니다.");
    });
};

// 댓글/대댓글 삭제 (재귀 지원 - dbPath 사용)
window.deleteComment = async function (dbPath, authorUid, isGuestComment, passwordHash) {
    // 권한 확인
    if (isGuestComment && !isAdmin) {
        const inputPassword = prompt("댓글 삭제를 위해 비밀번호를 입력해주세요:");
        if (!inputPassword) return;
        if (hashPassword(inputPassword) !== passwordHash) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
    } else if (!isAdmin && (!currentUser || authorUid !== currentUser.uid)) {
        alert("삭제 권한이 없습니다.");
        return;
    }

    if (!confirm("정말 삭제하시겠습니까?")) return;

    const articleId = getArticleId();
    const commentRef = ref(db, `comments/${articleId}/${dbPath}`);

    try {
        await remove(commentRef);
    } catch (error) {
        console.error("삭제 에러:", error);
        alert("삭제에 실패했습니다.");
    }
};

// 닉네임 HTML 생성
function getNicknameHtml(data) {
    if (data.isAdmin) {
        return `<span class="admin-badge-comment">👑 관리자</span>`;
    }
    if (!data.isGuest && data.authorUid) {
        return `${escapeHtml(data.nickname)} <span class="google-badge">G</span>`;
    }
    return escapeHtml(data.nickname);
}

// 재귀적 댓글/대댓글 렌더링
function renderCommentRecursive(dbPath, key, data, depth = 0) {
    const isTopLevel = depth === 0;
    const containerClass = isTopLevel ? 'comment-item' : 'reply-item';
    const currentPath = dbPath ? `${dbPath}/replies/${key}` : key;
    const itemId = `item-${currentPath.replace(/\//g, '-')}`;

    // 이미 존재하면 스킵
    if (document.getElementById(itemId)) return;

    const canDelete = isAdmin || data.isGuest || (currentUser && data.authorUid === currentUser.uid);
    const deleteBtn = canDelete
        ? `<button class="${isTopLevel ? 'comment-delete-btn' : 'reply-delete-btn'}" onclick="deleteComment('${currentPath}', '${data.authorUid || ''}', ${data.isGuest}, '${data.passwordHash || ''}')">삭제</button>`
        : '';

    // 깊이에 따른 들여쓰기 계산 (최대 들여쓰기 제한)
    const indentPx = Math.min(depth * 20, 100);

    const item = document.createElement('div');
    item.className = containerClass;
    item.id = itemId;
    item.dataset.authorUid = data.authorUid || '';
    item.dataset.isGuest = data.isGuest ? 'true' : 'false';
    item.dataset.depth = depth;

    if (depth > 0) {
        item.style.marginLeft = `${indentPx}px`;
    }

    const showReplyBtn = depth < MAX_DEPTH;
    const replyBtnHtml = showReplyBtn
        ? `<button class="reply-btn ${depth > 0 ? 'reply-btn-small' : ''}" onclick="toggleReplyForm('${currentPath}', ${depth + 1})">💬 답글</button>`
        : '';

    item.innerHTML = `
        <div class="${isTopLevel ? 'comment-header' : 'reply-header'}">
            <span class="${isTopLevel ? 'comment-nickname' : 'reply-nickname'}">${getNicknameHtml(data)}</span>
            <span class="${isTopLevel ? 'comment-time' : 'reply-time'}">${data.time}</span>
        </div>
        <div class="${isTopLevel ? 'comment-body' : 'reply-body'}">${escapeHtml(data.content)}</div>
        <div class="${isTopLevel ? 'comment-actions' : 'reply-actions'}">
            ${replyBtnHtml}
            ${deleteBtn}
        </div>
        <div class="replies-container" id="replies-${currentPath.replace(/\//g, '-')}"></div>
    `;

    // 부모 컨테이너 찾기
    let parentContainer;
    if (isTopLevel) {
        parentContainer = document.getElementById('commentList');
        if (parentContainer) {
            const emptyMsg = parentContainer.querySelector('.comment-empty');
            if (emptyMsg) emptyMsg.remove();
            parentContainer.prepend(item);
        }
    } else {
        // 부모 경로에서 replies-container 찾기
        const parentPath = dbPath.replace(/\//g, '-');
        parentContainer = document.getElementById(`replies-${parentPath}`);
        if (parentContainer) {
            parentContainer.appendChild(item);
        }
    }

    // 하위 대댓글 로드 (재귀)
    loadRepliesRecursive(currentPath, depth + 1);
}

// 재귀적 대댓글 로드
function loadRepliesRecursive(parentPath, depth) {
    const articleId = getArticleId();
    const repliesRef = ref(db, `comments/${articleId}/${parentPath}/replies`);

    onChildAdded(query(repliesRef, orderByChild('timestamp')), (snapshot) => {
        renderCommentRecursive(parentPath, snapshot.key, snapshot.val(), depth);
    });

    onChildRemoved(repliesRef, (snapshot) => {
        const itemId = `item-${parentPath.replace(/\//g, '-')}-replies-${snapshot.key}`;
        const el = document.getElementById(itemId);
        if (el) el.remove();
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function checkEmptyComments() {
    const list = document.getElementById('commentList');
    if (list && list.children.length === 0) {
        list.innerHTML = '<div class="comment-empty">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</div>';
    }
}

// 초기화
document.addEventListener("DOMContentLoaded", async () => {
    // 댓글 섹션 즉시 표시 및 기본 UI 설정 (비회원 우선)
    const commentSection = document.querySelector('.comment-section');
    const guestForm = document.getElementById('guestForm');
    const loginPrompt = document.getElementById('loginPrompt');

    if (commentSection) {
        commentSection.classList.add('auth-ready');
        commentSection.style.display = 'block';
    }

    // 기본적으로 비회원 폼 표시 (인증 상태 확인 전까지)
    if (guestForm) guestForm.style.display = 'block';
    if (loginPrompt) loginPrompt.style.display = 'block';
    const articleId = getArticleId();
    const commentsRef = ref(db, `comments/${articleId}`);

    // 최상위 댓글 로드
    onChildAdded(query(commentsRef, orderByChild('timestamp')), (snapshot) => {
        // replies 노드는 스킵
        if (snapshot.key === 'replies') return;
        const data = snapshot.val();
        // 데이터 객체인지 확인 (timestamp가 있어야 댓글)
        if (data && data.timestamp) {
            renderCommentRecursive('', snapshot.key, data, 0);
        }
    });

    onChildRemoved(commentsRef, (snapshot) => {
        const el = document.getElementById(`item-${snapshot.key}`);
        if (el) el.remove();
        checkEmptyComments();
    });

    setTimeout(() => {
        const list = document.getElementById('commentList');
        if (list && list.children.length === 0) {
            list.innerHTML = '<div class="comment-empty">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</div>';
        }
    }, 2000);
});
