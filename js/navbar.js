/* js/navbar.js - 블로그 스타일 네비게이션 */

document.addEventListener("DOMContentLoaded", function () {
    const navContainer = document.getElementById("global-nav");

    if (navContainer) {
        navContainer.innerHTML = `
        <header class="blog-header" style="
            background: #fff;
            border-bottom: 1px solid #e9ecef;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        ">
            <div class="header-inner" style="
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 60px;
            ">
                <a href="/" class="blog-logo" style="
                    font-size: 1.5rem;
                    font-weight: 900;
                    color: #ff6b6b;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    🎲 심심센터
                </a>
                
                <nav class="blog-nav" id="nav-menu" style="
                    display: flex;
                    align-items: center;
                    gap: 5px;
                ">
                    <a href="/" style="
                        padding: 8px 14px;
                        font-weight: 600;
                        font-size: 0.9rem;
                        color: #333;
                        border-radius: 8px;
                        text-decoration: none;
                        transition: all 0.2s;
                    ">🏠 홈</a>
                    <a href="/about.html" style="
                        padding: 8px 14px;
                        font-weight: 600;
                        font-size: 0.9rem;
                        color: #333;
                        border-radius: 8px;
                        text-decoration: none;
                        transition: all 0.2s;
                    ">📌 소개</a>
                    <a href="/MenuRoulette/" style="
                        padding: 8px 14px;
                        font-weight: 600;
                        font-size: 0.9rem;
                        color: #333;
                        border-radius: 8px;
                        text-decoration: none;
                        transition: all 0.2s;
                    ">🍽️ 메뉴룰렛</a>
                    <a href="/SnapMaster/" style="
                        padding: 8px 14px;
                        font-weight: 600;
                        font-size: 0.9rem;
                        color: #333;
                        border-radius: 8px;
                        text-decoration: none;
                        transition: all 0.2s;
                    ">⚡ 게임</a>
                    <a href="/Lotto/" style="
                        padding: 8px 14px;
                        font-weight: 600;
                        font-size: 0.9rem;
                        color: #333;
                        border-radius: 8px;
                        text-decoration: none;
                        transition: all 0.2s;
                    ">🔮 로또</a>
                </nav>
                
                <button class="mobile-menu-btn" id="mobile-menu-btn" style="
                    display: none;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 8px;
                " onclick="toggleMobileMenu()">☰</button>
            </div>
        </header>
        
        <style>
            .blog-nav a:hover {
                background: #f8f9fa !important;
                color: #ff6b6b !important;
            }
            
            @media (max-width: 768px) {
                .blog-nav {
                    display: none !important;
                    position: absolute;
                    top: 60px;
                    left: 0;
                    right: 0;
                    background: #fff;
                    flex-direction: column;
                    padding: 15px;
                    border-bottom: 1px solid #e9ecef;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
                }
                
                .blog-nav.active {
                    display: flex !important;
                }
                
                .mobile-menu-btn {
                    display: block !important;
                }
                
                .blog-nav a {
                    width: 100%;
                    padding: 12px 15px !important;
                }
            }
        </style>
        `;
    }
});

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const nav = document.getElementById('nav-menu');
    if (nav) {
        nav.classList.toggle('active');
    }
}