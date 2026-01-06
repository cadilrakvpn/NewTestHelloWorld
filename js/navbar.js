/* navbar.js - 공통 네비게이션 관리 */

document.addEventListener("DOMContentLoaded", function () {
    const navContainer = document.getElementById("global-nav");

    if (navContainer) {
        navContainer.innerHTML = `
        <nav style="width: 100%; background: #fff; border-bottom: 1px solid #e9ecef; padding: 10px 20px; box-sizing: border-box; display: flex; justify-content: center; margin-bottom: 10px;">
            <div style="max-width: 800px; width: 100%; display: flex; gap: 15px; font-size: 14px; font-weight: bold; overflow-x: auto; white-space: nowrap;">
                <a href="/" style="text-decoration: none; color: #333;">🏠 홈</a>
                <a href="/MenuRoulette/" style="text-decoration: none; color: #333;">🍽️ 메뉴룰렛</a>
                <a href="/SnapMaster/" style="text-decoration: none; color: #333;">⚡ 스냅마스터</a>
                <a href="/Articles/lunch_tips.html" style="text-decoration: none; color: #1971c2;">📖 점심 메뉴 추천 팁</a>
                <a href="/Articles/reflex_tips.html" style="text-decoration: none; color: #1971c2;">📖 반응속도 올리는 법</a>
            </div>
        </nav>
        `;
    }
});