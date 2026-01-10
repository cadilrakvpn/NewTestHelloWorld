/* SnapMaster/game_config.js - 게임 설정 및 난이도 데이터 */

// [밸런스 패치]
// 1. 최저 난이도: 3.5초 -> 2.5초 (초반 지루함 제거, 시작부터 적당한 속도감)
// 2. 최고 난이도: 0.85초 -> 0.9초 (불가능한 난이도 완화, 판정 범위 확대)
// 목표: 유저가 '할 만하다'고 느껴 계속 도전하게 만드는 '몰입(Flow)' 구간 형성

const DifficultyPool = {
    // [초반] 속도를 높여(시간 단축) 지루하지 않게 설정
    VERY_EASY: { label: "WARM UP", speed: 2.5, size: 200, allow: 60, bounce: "0.8s", points: 100, signalClass: "signal-green", color: "#00E676" },
    EASY: { label: "EASY", speed: 2.1, size: 180, allow: 55, bounce: "0.7s", points: 200, signalClass: "signal-green", color: "#00E676" },

    // [중반] 점진적으로 빨라짐
    NORMAL: { label: "NORMAL", speed: 1.7, size: 160, allow: 50, bounce: "0.6s", points: 300, signalClass: "signal-yellow", color: "#FFD700" },
    HARD: { label: "HARD", speed: 1.4, size: 140, allow: 45, bounce: "0.5s", points: 500, signalClass: "signal-orange", color: "#FF9100" },

    // [후반] 기존보다 살짝 느리게 + 판정 범위(allow)를 너그럽게 수정하여 '아깝게 실패'하도록 유도
    VERY_HARD: { label: "JACKPOT", speed: 1.1, size: 120, allow: 40, bounce: "0.4s", points: 1000, signalClass: "signal-red", color: "#FF5252" },
    EXPERT: { label: "GOD LIKE", speed: 0.9, size: 110, allow: 35, bounce: "0.4s", points: 2000, signalClass: "signal-red", color: "#FF0000" }
};

const StandardChars = ['🏃', '🚴', '🐕', '🐈', '🚗', '🛵', '🐎', '🛹'];
const Themes = ['theme-day', 'theme-sunset', 'theme-night', 'theme-forest'];

// 레어 몹 정의 (10% 확률)
// 로켓 속도를 2.0배로 높여 '깜짝 재미' 요소 강화
const RareMobs = [
    { char: '🚀', name: "ROCKET", speedMod: 2.0, scoreMod: 3.0, effect: null }, // 하이리스크 하이리턴
    { char: '🐢', name: "TURTLE", speedMod: 0.6, scoreMod: 0.5, effect: null }, // 타이밍 뺏기
    { char: '💰', name: "MONEY", speedMod: 1.2, scoreMod: 1.0, effect: 'life' } // 생명력 보너스
];