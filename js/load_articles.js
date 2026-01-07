/* js/load_articles.js - 환경별 Clean URL 대응 및 최신순 정렬 적용 */

document.addEventListener("DOMContentLoaded", function () {
    const listContainer = document.getElementById('blog-list-container');
    if (!listContainer || typeof ArticleData === 'undefined') return;

    // 1. 날짜+시간 기준 내림차순 정렬 (최신 시간이 위로)
    const sortedArticles = ArticleData.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 2. 최근 10개만 자르기
    const recentArticles = sortedArticles.slice(0, 10);

    // 3. 환경 감지 (로컬 개발 환경인지 확인)
    const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    const extension = isLocal ? '.html' : ''; // 로컬이면 .html 붙임, 아니면 뺌

    // 4. HTML 생성 및 주입
    let htmlContent = '';

    recentArticles.forEach(article => {
        // [폴더명 생성] "2026-01-07" -> "20260107"
        const datePart = article.date.split(' ')[0];
        const folderName = datePart.replace(/-/g, '');

        // [화면 표시용 날짜 생성] "2026-01-07 14:30"
        const displayDate = article.date.substring(0, 16);

        // [링크 경로 생성] 로컬과 서버 환경에 따라 확장자 자동 조절
        const linkPath = `Articles/${folderName}/${article.id}${extension}`;

        htmlContent += `
            <a href="${linkPath}">
                <div class="blog-icon">${article.icon}</div>
                <div class="blog-content">
                    <h3>
                        ${article.title} 
                        <span style="font-size:0.75rem; color:#bbb; font-weight:normal; margin-left: 5px;">${displayDate}</span>
                    </h3>
                    <p>${article.desc}</p>
                </div>
            </a>
        `;
    });

    listContainer.innerHTML = htmlContent;
});