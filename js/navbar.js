/* navbar.js - 공통 네비게이션 관리 (디자인 개선판) */

document.addEventListener("DOMContentLoaded", function () {
    const navContainer = document.getElementById("global-nav");

    if (navContainer) {
        navContainer.innerHTML = `
        <nav style="
            width: 100%; 
            background: #ffffff; 
            border-bottom: 1px solid #ddd; 
            height: 50px; 
            display: flex; 
            justify-content: center; 
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            position: relative; 
            z-index: 1000;
        ">
            <div style="
                max-width: 800px; 
                width: 100%; 
                display: flex; 
                align-items: center;
                gap: 15px; 
                font-size: 14px; 
                font-weight: bold; 
                overflow-x: auto; 
                white-space: nowrap; 
                padding: 0 20px; 
                -webkit-overflow-scrolling: touch; 
                scrollbar-width: none;
                height: 100%;
            ">
                <a href="/" style="text-decoration: none; color: #333; flex-shrink: 0; display: flex; align-items: center; height: 100%;">🏠 홈</a>
                <a href="/MenuRoulette/" style="text-decoration: none; color: #333; flex-shrink: 0; display: flex; align-items: center; height: 100%;">🍽️ 메뉴룰렛</a>
                <a href="/SnapMaster/" style="text-decoration: none; color: #333; flex-shrink: 0; display: flex; align-items: center; height: 100%;">⚡ 스냅마스터</a>
            </div>
        </nav>
        `;
    }
});