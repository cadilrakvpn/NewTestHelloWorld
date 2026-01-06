/* navbar.js - 공통 네비게이션 관리 (모바일 스크롤 개선판) */

document.addEventListener("DOMContentLoaded", function () {
    const navContainer = document.getElementById("global-nav");

    if (navContainer) {
        navContainer.innerHTML = `
        <nav style="width: 100%; background: #fff; border-bottom: 1px solid #e9ecef; padding: 10px 0; box-sizing: border-box; display: flex; justify-content: center; margin-bottom: 10px;">
            <div style="
                max-width: 800px; 
                width: 100%; 
                display: flex; 
                gap: 15px; 
                font-size: 14px; 
                font-weight: bold; 
                overflow-x: auto; 
                white-space: nowrap; 
                padding: 0 20px; 
                -webkit-overflow-scrolling: touch; /* 모바일 부드러운 스크롤 */
                scrollbar-width: none; /* 스크롤바 숨김 (선택사항) */
            ">
                <a href="/" style="text-decoration: none; color: #333; flex-shrink: 0;">🏠 홈</a>
                <a href="/MenuRoulette/index.html" style="text-decoration: none; color: #333; flex-shrink: 0;">🍽️ 메뉴룰렛</a>
                <a href="/SnapMaster/index.html" style="text-decoration: none; color: #333; flex-shrink: 0;">⚡ 스냅마스터</a>
                <a href="/Articles/lunch_tips.html" style="text-decoration: none; color: #1971c2; flex-shrink: 0;">📖 점심 메뉴 추천 팁</a>
                <a href="/Articles/reflex_tips.html" style="text-decoration: none; color: #1971c2; flex-shrink: 0;">📖 반응속도 올리는 법</a>
            </div>
        </nav>
        `;
    }
});