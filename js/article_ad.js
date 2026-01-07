/* article_ad.js - 블로그 본문 광고 공통 관리 (테스트 모드) */

document.addEventListener("DOMContentLoaded", function () {
    // 1. 광고를 넣을 자리(.ad-placeholder)를 모두 찾습니다.
    const adPlaceholders = document.querySelectorAll('.ad-placeholder');

    if (adPlaceholders.length === 0) return; // 광고 자리가 없으면 종료

    // 2. 애드센스 메인 스크립트가 아직 로드 안 됐다면 불러옵니다.
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        const script = document.createElement('script');
        script.async = true;
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6146654241046448";
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
    }

    // 3. 각 자리에 광고 태그를 생성해서 넣습니다.
    adPlaceholders.forEach(function (placeholder) {
        // 중복 실행 방지: 이미 내용이 있다면 건너뜀
        if (placeholder.innerHTML.trim() !== "") return;

        // ▼▼▼ [테스트 코드] 빨간 테두리 및 텍스트 표시 (확인 후 삭제 필요) ▼▼▼
        placeholder.style.border = "4px solid red";     // 빨간 테두리
        placeholder.style.background = "#ffeaea";       // 연한 빨간 배경
        placeholder.style.minHeight = "150px";          // 최소 높이 확보
        placeholder.style.display = "flex";             // 글자 중앙 정렬용
        placeholder.style.justifyContent = "center";
        placeholder.style.alignItems = "center";

        // 안내 문구 추가 (광고 위에 뜸)
        const testText = document.createElement('div');
        testText.innerHTML = "🚧 광고 영역 (JS 정상 작동중) 🚧<br>잠시 후 광고가 로드됩니다.";
        testText.style.color = "red";
        testText.style.fontWeight = "bold";
        testText.style.textAlign = "center";
        testText.style.position = "absolute"; // 겹쳐서 보이게 함
        placeholder.appendChild(testText);
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        // 실제 광고 태그 생성
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.style.textAlign = 'center';
        ins.style.width = '100%'; // 꽉 차게

        // 아까 생성한 광고 단위 정보
        ins.setAttribute('data-ad-layout', 'in-article');
        ins.setAttribute('data-ad-format', 'fluid');
        ins.setAttribute('data-ad-client', 'ca-pub-6146654241046448');
        ins.setAttribute('data-ad-slot', '1807161750');

        placeholder.appendChild(ins);

        // 광고 송출 요청
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense Push Error:", e);
        }
    });
});