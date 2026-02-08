/* js/load_articles.js - 블로그 카드형 아티클 렌더링 */

// 전역 변수로 정렬된 아티클과 카테고리 정보 저장
let _sortedArticles = [];
let _categories = {};
let _currentFilter = 'all';

document.addEventListener("DOMContentLoaded", function () {
    const listContainer = document.getElementById('blog-list-container');
    const gridContainer = document.getElementById('article-grid-container');

    if (typeof ArticleData === 'undefined') return;

    // 1. 날짜+시간 기준 내림차순 정렬 (최신 시간이 위로)
    _sortedArticles = ArticleData.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 2. 카테고리 정보 (article_list.js에서 가져오거나 기본값 사용)
    _categories = typeof CategoryInfo !== 'undefined' ? CategoryInfo : {
        life: { name: "라이프", class: "category-life" },
        productivity: { name: "생산성", class: "category-productivity" },
        money: { name: "재테크", class: "category-money" },
        health: { name: "건강", class: "category-health" },
        tech: { name: "테크", class: "category-tech" },
        tip: { name: "꿀팁", class: "category-tip" }
    };

    // 3. 그리드 컨테이너가 있으면 초기 렌더링
    if (gridContainer) {
        renderArticleGrid('all');
    }

    // 4. 기존 리스트 컨테이너가 있으면 리스트형 렌더링 (호환성 유지)
    if (listContainer) {
        renderArticleList();
    }
});

// 아티클 그리드 렌더링 (카테고리 필터링 지원)
function renderArticleGrid(category) {
    const gridContainer = document.getElementById('article-grid-container');
    if (!gridContainer) return;

    _currentFilter = category;

    const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    const extension = isLocal ? '.html' : '';

    // 카테고리 필터링
    let filteredArticles = _sortedArticles;
    if (category !== 'all') {
        filteredArticles = _sortedArticles.filter(a => a.category === category);
    }

    // 표시할 글 개수
    const displayCount = parseInt(gridContainer.dataset.count) || 10;
    const articlesToShow = filteredArticles.slice(0, displayCount);

    if (articlesToShow.length === 0) {
        gridContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #888;">
                <div style="font-size: 3rem; margin-bottom: 15px;">📭</div>
                <p>해당 카테고리에 글이 없습니다.</p>
                <button onclick="filterByCategory('all')" style="
                    margin-top: 15px;
                    padding: 10px 20px;
                    background: #ff6b6b;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                ">전체 글 보기</button>
            </div>
        `;
        return;
    }

    let htmlContent = '';

    articlesToShow.forEach((article, index) => {
        const datePart = article.date.split(' ')[0];
        const folderName = datePart.replace(/-/g, '');
        const displayDate = datePart.replace(/-/g, '. ');
        const linkPath = `Articles/${folderName}/${article.id}${extension}`;

        const catInfo = _categories[article.category] || { name: "기타", class: "category-tip" };

        // 모든 아티클을 가로형으로 표시
        const cardClass = 'article-card article-card-horizontal';

        // 썸네일이 있으면 이미지, 없으면 아이콘
        const thumbnailContent = article.thumbnail
            ? `<img src="${article.thumbnail}" alt="${article.title}" class="thumbnail-img">`
            : `<span class="thumbnail-icon">${article.icon}</span>`;

        htmlContent += `
            <a href="${linkPath}" class="${cardClass}">
                <div class="article-thumbnail ${article.thumbnail ? 'has-image' : ''}">${thumbnailContent}</div>
                <div class="article-body">
                    <div class="article-meta">
                        <span class="article-category ${catInfo.class}">${catInfo.name}</span>
                        <span class="article-date">${displayDate}</span>
                        <span class="article-view-count" data-path="/${linkPath}" style="font-size: 0.8rem; color: #888; margin-left: 8px; opacity: 0; transition: opacity 0.3s;">👁️ ...</span>
                    </div>
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-excerpt">${article.desc}</p>
                    <span class="article-read-more">자세히 보기 →</span>
                </div>
            </a>
        `;
    });

    gridContainer.innerHTML = htmlContent;

    // 사이드바 카테고리 활성화 상태 업데이트
    updateCategoryActiveState(category);

    // 조회수 업데이트 (비동기)
    updateViewCountsFromFirebase();
}

// Firebase 조회수 가져오기 및 업데이트
async function updateViewCountsFromFirebase() {
    if (typeof window.getAllViewCounts !== 'function') {
        // views.js가 아직 로드되지 않았으면 이벤트 리스너 등록
        window.addEventListener('viewsReady', updateViewCountsFromFirebase, { once: true });
        return;
    }

    const allViews = await window.getAllViewCounts();
    const viewElements = document.querySelectorAll('.article-view-count');

    viewElements.forEach(el => {
        const articlePath = el.dataset.path.replace(/\.html$/, ''); // .html 제거 후 ID 생성
        // views.js와 동일한 ID 생성 로직 사용
        const viewId = articlePath.replace(/[^a-zA-Z0-9]/g, '_');

        if (allViews[viewId]) {
            el.innerHTML = `👁️ ${allViews[viewId].toLocaleString()}`;
        } else {
            el.innerHTML = `👁️ 0`;
        }
        el.style.opacity = '1';
    });
}

// 카테고리 필터 함수 (전역)
function filterByCategory(category) {
    renderArticleGrid(category);

    // 스크롤을 아티클 영역으로 이동
    const gridContainer = document.getElementById('article-grid-container');
    if (gridContainer) {
        gridContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    return false; // 링크 기본 동작 방지
}

// 사이드바 카테고리 활성화 상태 업데이트
function updateCategoryActiveState(activeCategory) {
    const categoryLinks = document.querySelectorAll('#category-list a');
    categoryLinks.forEach(link => {
        const onclick = link.getAttribute('onclick') || '';
        const match = onclick.match(/filterByCategory\(['"](.+)['"]\)/);
        if (match) {
            const linkCategory = match[1];
            if (linkCategory === activeCategory) {
                link.style.background = '#ff6b6b';
                link.style.color = '#fff';
            } else {
                link.style.background = '';
                link.style.color = '';
            }
        }
    });
}

// 기존 리스트형 렌더링 (호환성 유지)
function renderArticleList() {
    const listContainer = document.getElementById('blog-list-container');
    if (!listContainer) return;

    const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    const extension = isLocal ? '.html' : '';

    const recentArticles = _sortedArticles.slice(0, 10);
    let htmlContent = '';

    recentArticles.forEach(article => {
        const datePart = article.date.split(' ')[0];
        const folderName = datePart.replace(/-/g, '');
        const displayDate = article.date.substring(0, 16);
        const linkPath = `Articles/${folderName}/${article.id}${extension}`;

        const catInfo = _categories[article.category] || { name: "기타", class: "category-tip" };

        htmlContent += `
            <a href="${linkPath}">
                <div class="blog-icon">${article.icon}</div>
                <div class="blog-content">
                    <h3>
                        <span class="article-category ${catInfo.class}" style="font-size: 0.75rem; padding: 2px 8px; border-radius: 10px; margin-right: 8px;">${catInfo.name}</span>
                        ${article.title} 
                        <span style="font-size:0.75rem; color:#bbb; font-weight:normal; margin-left: 5px;">${displayDate}</span>
                    </h3>
                    <p>${article.desc}</p>
                </div>
            </a>
        `;
    });

    listContainer.innerHTML = htmlContent;
}

// 사이드바 인기 글 렌더링
function renderPopularArticles(containerId, count = 5) {
    const container = document.getElementById(containerId);
    if (!container || typeof ArticleData === 'undefined') return;

    const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    const extension = isLocal ? '.html' : '';

    // 최신 글 중 상위 N개를 인기 글로 표시
    const popularArticles = _sortedArticles.slice(0, count);

    let htmlContent = '';
    popularArticles.forEach(article => {
        const datePart = article.date.split(' ')[0];
        const folderName = datePart.replace(/-/g, '');
        const displayDate = datePart.replace(/-/g, '. ');
        const linkPath = `Articles/${folderName}/${article.id}${extension}`;

        htmlContent += `
            <a href="${linkPath}" class="popular-item">
                <div class="popular-icon">${article.icon}</div>
                <div class="popular-content">
                    <h4>${article.title}</h4>
                    <span class="popular-date">${displayDate}</span>
                </div>
            </a>
        `;
    });

    container.innerHTML = htmlContent;
}

// 카테고리별 글 개수 계산
function getCategoryCounts() {
    if (typeof ArticleData === 'undefined') return {};

    const counts = {};
    ArticleData.forEach(article => {
        const cat = article.category || 'tip';
        counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
}