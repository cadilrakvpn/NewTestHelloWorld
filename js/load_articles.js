/* js/load_articles.js - 시간 포맷(YYYY-MM-DD HH:mm) 및 최신순 정렬 적용 */

document.addEventListener("DOMContentLoaded", function () {
    const listContainer = document.getElementById('blog-list-container');
    if (!listContainer || typeof ArticleData === 'undefined') return;

    // 1. 날짜+시간 기준 내림차순 정렬 (최신 시간이 위로)
    // Date 객체는 "2026-01-07 14:30:00" 형식을 잘 인식합니다.
    const sortedArticles = ArticleData.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 2. 최근 10개만 자르기
    const recentArticles = sortedArticles.slice(0, 10);

    // 3. HTML 생성 및 주입
    let htmlContent = '';

    recentArticles.forEach(article => {
        // [폴더명 생성]
        // "2026-01-07 14:30:00"에서 공백 앞부분("2026-01-07")만 가져온 뒤, 하이픈 제거 -> "20260107"
        const datePart = article.date.split(' ')[0];
        const folderName = datePart.replace(/-/g, '');

        // [화면 표시용 날짜 생성]
        // "2026-01-07 14:30:00" 에서 앞에서부터 16글자만 자름 -> "2026-01-07 14:30"
        const displayDate = article.date.substring(0, 16);

        // [링크 경로 생성]
        const linkPath = `Articles/${folderName}/${article.id}.html`;

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