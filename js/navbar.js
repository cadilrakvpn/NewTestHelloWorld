/* js/navbar.js - 블로그 스타일 네비게이션 (로그인 UI 포함) */

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
                    <a href="/" class="nav-link">🏠 홈</a>
                    <a href="/about.html" class="nav-link">📌 소개</a>
                    <a href="/MenuRoulette/" class="nav-link">🍽️ 메뉴룰렛</a>
                    <a href="/SnapMaster/" class="nav-link">⚡ 게임</a>
                    <a href="/Lotto/" class="nav-link">🔮 로또</a>
                </nav>
                
                <!-- 로그인 영역 -->
                <div class="auth-area" style="display: flex; align-items: center; gap: 10px;">
                    <button id="nav-login-btn" onclick="globalLogin()" style="
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        background: #4285f4;
                        color: white;
                        border: none;
                        padding: 8px 14px;
                        border-radius: 20px;
                        font-size: 0.85rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: background 0.2s;
                    ">
                        <span style="font-size: 1rem;">🔐</span> 로그인
                    </button>
                    
                    <div id="nav-user-info" style="
                        display: none;
                        align-items: center;
                        gap: 8px;
                        background: #f8f9fa;
                        padding: 6px 12px;
                        border-radius: 20px;
                    ">
                        <span style="font-size: 1.1rem;">👤</span>
                        <span id="nav-user-name" style="font-size: 0.85rem; font-weight: 600; color: #333;"></span>
                        <span id="nav-admin-badge" style="
                            display: none;
                            background: #ff6b6b;
                            color: white;
                            padding: 2px 6px;
                            border-radius: 8px;
                            font-size: 0.7rem;
                            font-weight: bold;
                        ">관리자</span>
                        <button onclick="globalLogout()" style="
                            background: none;
                            border: 1px solid #dee2e6;
                            padding: 4px 10px;
                            border-radius: 12px;
                            font-size: 0.75rem;
                            color: #666;
                            cursor: pointer;
                            margin-left: 5px;
                        ">로그아웃</button>
                    </div>
                </div>
                
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
            .nav-link {
                padding: 8px 14px;
                font-weight: 600;
                font-size: 0.9rem;
                color: #333;
                border-radius: 8px;
                text-decoration: none;
                transition: all 0.2s;
            }
            
            .nav-link:hover {
                background: #f8f9fa;
                color: #ff6b6b;
            }
            
            #nav-login-btn:hover {
                background: #3367d6;
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
                
                .nav-link {
                    width: 100%;
                    padding: 12px 15px !important;
                }
                
                .auth-area {
                    display: none !important;
                }
                
                .blog-nav.active .auth-area-mobile {
                    display: flex;
                    flex-direction: column;
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid #e9ecef;
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