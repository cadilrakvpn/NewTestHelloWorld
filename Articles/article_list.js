/* Articles/article_list.js - 블로그 글 목록 데이터 (카테고리 추가) */

const ArticleData = [
    {
        id: "valentine_gift_guide",
        title: "2026 발렌타인데이 선물 추천 - 예산별 완벽 가이드 💝",
        desc: "이틀 앞으로 다가온 발렌타인데이! 3만원대 실용적인 선물부터 10만원대 프리미엄 선물까지, 예산별로 정리한 완벽 가이드입니다.",
        icon: "💝",
        date: "2026-02-12 22:00:00",
        category: "life"
    },
    {
        id: "dragonsword_pig_location",
        title: "드래곤소드 멧돼지 파밍 위치 총정리",
        desc: "드래곤소드에서 멧돼지 고기를 빠르게 파밍할 수 있는 최적의 위치를 정리했습니다. 요리 재료 수급을 위한 필수 가이드!",
        icon: "🐗",
        thumbnail: "/Articles/20260207/dragonsword_piglocation.png",
        date: "2026-02-07 16:00:00",
        category: "game"
    },
    {
        id: "dragonsword_cooking_recipes",
        title: "드래곤소드 요리 레시피 및 효과 총정리",
        desc: "웹젠 드래곤소드의 요리 시스템 완벽 가이드! 재료 조합법부터 각 요리의 버프 효과까지 한눈에 정리했습니다.",
        icon: "🎮",
        thumbnail: "/Articles/20260207/dragonsword_cooking_recipes_1.png",
        date: "2026-02-07 14:00:00",
        category: "game"
    },
    {
        id: "budget_gadgets_7",
        title: "2026년 가성비 끝판왕: 삶의 질을 수직 상승시키는 1만 원 이하 '갓템' 7가지",
        desc: "고물가 시대, 지갑은 가볍게 삶은 풍요롭게! 단돈 1만 원 이하로 일상의 불편함을 해소하고 행복을 선사하는 갓성비 아이템 7가지를 엄선하여 소개합니다.",
        icon: "🎁",
        date: "2026-01-16 11:00:00",
        category: "life"
    },
    {
        id: "flow_state_three_switches",
        title: "2026년 뇌 과학이 밝혀낸 '초집중 상태(Flow)' 진입을 위한 3가지 스위치",
        desc: "멀티태스킹에 지쳤나요? 뇌 과학이 증명한 몰입(Flow) 상태 진입의 3가지 스위치: 도전과 능력의 4% 법칙, 즉각적 피드백, 환경 통제. 생산성을 200% 끌어올리는 과학적 방법을 공개합니다.",
        icon: "🧠",
        date: "2026-01-15 10:30:00",
        category: "productivity"
    },
    {
        id: "adsense_approval_strategy",
        title: "월급 외 수익 파이프라인 구축: 2026년 구글 애드센스 승인받는 5단계 전략",
        desc: "구글 애드센스 승인이 어려우신가요? 2026년 최신 기준을 반영한 5단계 전략으로 고품질 콘텐츠, SEO 최적화, 승인 후 수익 극대화까지 완벽 가이드를 공개합니다.",
        icon: "💰",
        date: "2026-01-14 10:00:00",
        category: "money"
    },
    {
        id: "multitasking_lie",
        title: "멀티태스킹의 거짓말: 당신의 뇌는 동시에 일할 수 없다",
        desc: "유튜브 보면서 공부하기? 업무 중에 메신저 답장하기? 뇌의 작업 전환 비용(Switching Cost) 때문에 실제 지능지수가 15점이나 떨어진다는 연구 결과.",
        icon: "🤯",
        date: "2026-01-12 09:00:00",
        category: "productivity"
    },
    {
        id: "power_of_boredom",
        title: "심심함은 죄가 아니다: 천재들의 멍 때리기 비법",
        desc: "빌 게이츠와 일론 머스크가 '심심한 시간'을 갖는 이유와 뇌과학적으로 증명된 디폴트 모드 네트워크(DMN)의 비밀.",
        icon: "🤔",
        date: "2026-01-12 14:00:00",
        category: "productivity"
    },
    {
        id: "sleep_tech",
        title: "잠만 잘 자도 연봉이 오른다? 2026년 '슬립테크'와 꿀잠 루틴",
        desc: "하루 4시간을 자도 개운한 사람들의 비밀은? AI 매트리스부터 10-3-2-1 법칙까지, 수면의 질을 높이는 현실적인 가이드.",
        icon: "💤",
        date: "2026-01-10 09:30:00",
        category: "health"
    },
    {
        id: "digital_detox_travel",
        title: "와이파이 없는 곳이 제일 비싸다? 2026 여행 트렌드 'JOMO'",
        desc: "연결되지 않을 권리를 찾는 사람들. 스마트폰을 반납해야 입장 가능한 '디지털 디톡스' 숙소가 뜨는 이유.",
        icon: "🌲",
        date: "2026-01-10 09:00:00",
        category: "life"
    },
    {
        id: "habit_forming_tips",
        title: "작심삼일은 과학이다? 뇌를 속여 목표 달성하는 '습관 성형' 3법칙",
        desc: "새해 결심 벌써 포기하셨나요? 의지력 따윈 필요 없습니다. 아주 작은 행동 설계로 2026년을 내 것으로 만드는 뇌과학적 루틴 설정법.",
        icon: "📅",
        date: "2026-01-09 10:30:00",
        category: "productivity"
    },
    {
        id: "subscription_diet",
        title: "숨만 쉬어도 나가는 돈? OTT부터 영양제까지 '구독 다이어트' 가이드",
        desc: "넷플릭스, 유튜브, 쿠팡... 매달 야금야금 빠져나가는 고정 지출이 10만 원? 불필요한 구독을 정리하고 통장을 지키는 현실적인 방법.",
        icon: "✂️",
        date: "2026-01-09 09:00:00",
        category: "money"
    },
    {
        id: "tax_settlement_2026",
        title: "13월의 월급? 세금 폭탄? 2026 연말정산 핵심 가이드",
        desc: "홈택스 미리보기 폭주! 올해부터 신설된 반려동물 공제부터 놓치기 쉬운 영수증까지, 환급금 늘리는 필승 전략.",
        icon: "🧾",
        date: "2026-01-08 11:04:00",
        category: "money"
    },
    {
        id: "dopamine_detox",
        title: "도파민 중독 탈출: 숏폼 지옥에서 뇌 구하기",
        desc: "1분짜리 영상만 보다 1시간이 삭제되는 당신. 팝콘 브레인을 치유하는 3단계 현실 가이드.",
        icon: "🧘",
        date: "2026-01-07 12:30:00",
        category: "health"
    },
    {
        id: "lunch_tips",
        title: "직장인 점심 메뉴 고르는 노하우 5가지",
        desc: "결정 장애를 해결하고 맛있는 점심 시간을 보내는 현실적인 팁을 공개합니다.",
        icon: "🍱",
        date: "2026-01-07 11:00:00",
        category: "tip"
    },
    {
        id: "reflex_tips",
        title: "게임 반응속도(피지컬) 올리는 훈련법",
        desc: "FPS 게이머 필독! 동체시력과 반사신경을 깨우는 과학적인 훈련 가이드.",
        icon: "⏱️",
        date: "2026-01-07 09:00:00",
        category: "tip"
    },
    {
        id: "decision_fatigue",
        title: "결정 피로(Decision Fatigue)란?",
        desc: "저녁마다 배달앱만 30분 켜놓는 당신, 우유부단한 게 아니라 뇌가 지친 겁니다.",
        icon: "🧠",
        date: "2026-01-07 18:20:00",
        category: "productivity"
    }
];

// 카테고리 정보
const CategoryInfo = {
    game: { name: "게임", class: "category-game" },
    life: { name: "라이프", class: "category-life" },
    productivity: { name: "생산성", class: "category-productivity" },
    money: { name: "재테크", class: "category-money" },
    health: { name: "건강", class: "category-health" },
    tech: { name: "테크", class: "category-tech" },
    tip: { name: "꿀팁", class: "category-tip" }
};
