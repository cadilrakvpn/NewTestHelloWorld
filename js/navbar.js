/* js/navbar.js */

document.addEventListener("DOMContentLoaded", function () {
    const navContainer = document.getElementById("global-nav");

    if (navContainer) {
        navContainer.innerHTML = `
        <nav style="
            width: 100%; 
            background: #ffffff; 
            border-bottom: 1px solid #ddd; 
            height: 55px; /* 높이 약간 증가 (터치 영역 확보) */
            display: flex; 
            justify-content: center; 
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            position: sticky; /* relative -> sticky 변경 */
            top: 0;           /* 최상단 고정 */
            z-index: 9999;    /* 다른 요소보다 무조건 위에 */
        ">
            <div style="
                max-width: 800px; 
                width: 100%; 
                display: flex; 
                align-items: center;
                gap: 20px; 
                font-size: 15px; 
                font-weight: bold; 
                overflow-x: auto; 
                white-space: nowrap; 
                padding: 0 20px; 
                height: 100%;
            ">
                <a href="/" style="text-decoration: none; color: #333; display: flex; align-items: center; height: 100%;">🏠 홈</a>
                <a href="/MenuRoulette/" style="text-decoration: none; color: #333; display: flex; align-items: center; height: 100%;">🍽️ 메뉴룰렛</a>
                <a href="/SnapMaster/" style="text-decoration: none; color: #333; display: flex; align-items: center; height: 100%;">⚡ 스냅마스터</a>
                <a href="/Lotto/" style="text-decoration: none; color: #333; display: flex; align-items: center; height: 100%;">🔮 인생 로또</a>
            </div>
        </nav>
        `;
    }
});