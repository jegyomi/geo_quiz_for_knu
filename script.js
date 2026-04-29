let currentMode = "";
let currentProfessor = "";
let currentRegion = "";
let timerInterval = null;
let secondsElapsed = 0;

let currentBGM = null;
let globalVolume = 0.4;
let isMuted = false;
let isDefaultBgmPlaying = false;

let effectSound = new Audio();
let hoverSound = new Audio();

// 📌 100% 자동화된 교수님 데이터베이스! (파일만 넣으면 알아서 작동합니다)
const professorBGM = { 
    "김종근 교수님": "assets/bgm_kim.mp3", 
    "임은진 교수님": "assets/bgm_lim.mp3", 
    "유재진 교수님": "assets/bgm_yoo.mp3", 
    "류주현 교수님": "assets/bgm_ryu.mp3", 
    "박지훈 교수님": "assets/bgm_park.mp3", 
    "김성일 조교쌤": "assets/bgm_jo.mp3" 
};

const voiceData = {
    "김종근 교수님": { hover: "assets/kim_hover.mp3", correct: "assets/kim_correct.mp3", wrong: "assets/kim_wrong.mp3", finish: "assets/kim_finish.mp3" },
    "임은진 교수님": { hover: "assets/lim_hover.mp3", correct: "assets/lim_correct.mp3", wrong: "assets/lim_wrong.mp3", finish: "assets/lim_finish.mp3" },
    "유재진 교수님": { hover: "assets/yoo_hover.mp3", correct: "assets/yoo_correct.mp3", wrong: "assets/yoo_wrong.mp3", finish: "assets/yoo_finish.mp3" },
    "류주현 교수님": { hover: "assets/ryu_hover.mp3", correct: "assets/ryu_correct.mp3", wrong: "assets/ryu_wrong.mp3", finish: "assets/ryu_finish.mp3" },
    "박지훈 교수님": { hover: "assets/park_hover.mp3", correct: "assets/park_correct.mp3", wrong: "assets/park_wrong.mp3", finish: "assets/park_finish.mp3" },
    "김성일 조교쌤": { correct: "assets/snd_correct.mp3", wrong: "assets/snd_wrong.mp3", finish: "assets/snd_correct.mp3" }
};

const defaultBGM = "assets/bgm_default.mp3";

const regionMapImages = {
    "NortheastAsia": "assets/동북아시아.jpg", "SoutheastAsia": "assets/동남아시아.jpg",
    "SouthAsia": "assets/남부아시아.jpg", "SouthwestAsia": "assets/서남아시아.jpg",
    "NorthAmerica": "assets/북아메리카.jpg", "CentralAmerica": "assets/중앙아메리카.jpg",
    "SouthAmerica": "assets/남아메리카.jpg", "Europe": "assets/유럽.jpg",
    "Oceania": "assets/오세아니아.jpg", "Africa": "assets/아프리카.jpg"
};

// 📌 국가 데이터베이스 
const regionData = {
    "NortheastAsia": [
        { country: "대한민국", capital: "서울", x: 48.25, y: 50.46 }, 
        { country: "일본", capital: "도쿄", x: 92.75, y: 57.65 },
        { country: "중국", capital: "베이징", x: 14.41, y: 30.86 }
    ],
    "SouthAsia": [
        { country: "인도", capital: "뉴델리", x: 41.57, y: 36.52 },
        { country: "파키스탄", capital: "이슬라마바드", x: 32.81, y: 29.02},
        { country: "방글라데시", capital: "다카", x: 77.70, y: 48.19},
        { country: "네팔", capital: "카트만두", x: 62.15, y: 37.35},
        { country: "스리랑카", capital: "스리자야와르데네푸라코테",x: 53.39, y: 82.52 },
        { country: "아프가니스탄", capital: "카불", x: 17.93, y: 26.19},
        { country: "카자흐스탄", capital: "아스타나", x: 18.14, y: 1.52 },
        { country: "우즈베키스탄", capital: "타슈켄트", x: 14.64, y: 9.52 },
        { country: "키르기스스탄", capital: "비슈케크", x: 37.63, y: 4.85},
        { country: "타지키스탄", capital: "두샨베", x: 31.28, y: 13.85},
        { country: "투르크메니스탄", capital: "아슈하바트", x: 3.04, y: 15.52 },
        { country: "부탄", capital: "팀푸", x: 80.10, y: 40.52},
        { country: "몰디브", capital: "말레", x: 31.06, y: 92.19 }
    ],
    "SoutheastAsia": [
        { country: "베트남", capital: "하노이", x: 36.27, y: 20.52 },
        { country: "태국", capital: "방콕", x: 23.21, y: 38.02 },
        { country: "인도네시아", capital: "자카르타", x: 40.69, y: 85.36 },
        { country: "말레이시아", capital: "쿠알라룸푸르", x: 25.90, y: 62.36},
        { country: "필리핀", capital: "마닐라",x: 77.55, y: 34.69 },
        { country: "미얀마", capital: "네피도", x: 13.61, y: 26.52},
        { country: "캄보디아", capital: "프놈펜", x: 35.69, y: 39.86 },
        { country: "라오스", capital: "비엔티안",x: 30.13, y: 24.85 },
        { country: "싱가포르", capital: "싱가포르", x: 32.24, y: 66.36 },
        { country: "브루나이", capital: "반다르스리브가완", x: 61.04, y: 59.86},
        { country: "동티모르", capital: "딜리", x: 91.19, y: 90.19 },
        { country: "대만", capital: "타이베이", x: 77.55, y: 13.52 }
    ],
    "SouthwestAsia": [
        { country: "사우디아라비아", capital: "리야드", x: 43.07, y: 63.58 },
        { country: "이란", capital: "테헤란", x: 51.30, y: 29.70 },
        { country: "튀르키예", capital: "앙카라",x: 13.65, y: 13.63 },
        { country: "이라크", capital: "바그다드", x: 34.38, y: 35.70 },
        { country: "시리아", capital: "다마스쿠스", x: 22.34, y: 32.60 },
        { country: "요르단", capital: "암만", x: 22.18, y: 40.73 },
        { country: "레바논", capital: "베이루트", x: 20.51, y: 31.63},
        { country: "오만", capital: "무스카트", x: 61.96, y: 69.96},
        { country: "예멘", capital: "사나", x: 41.39, y: 85.45},
        { country: "아랍에미리트", capital: "아부다비", x: 56.33, y: 62.41 },
        { country: "이스라엘", capital: "예루살렘",x: 19.29, y: 39.57},
        { country: "쿠웨이트", capital: "쿠웨이트시티",x: 43.83, y: 46.15},
        { country: "카타르", capital: "도하", x: 50.99, y: 57.77 },
        { country: "바레인", capital: "마나마", x: 49.31, y: 54.67 },
        { country: "사이프러스", capital: "니코시아", x: 14.72, y: 29.12 },
        { country: "아제르바이잔", capital: "바쿠", x: 43.98, y: 10.92 },
        { country: "조지아", capital: "트빌리시", x: 37.27, y: 5.89 },
        { country: "아르메니아", capital: "예레반", x: 38.80, y: 11.89 }
    ],
    "Europe": [
        { country: "프랑스", capital: "파리", x: 38.69, y: 71.02 },
        { country: "영국", capital: "런던", x: 29.73, y: 61.02 },
        { country: "독일", capital: "베를린", x: 55.27, y: 60.86 },
        { country: "이탈리아", capital: "로마", x: 55.85, y: 86.02 },
        { country: "스페인", capital: "마드리드", x: 27.58, y: 90.36 },
        { country: "포르투갈", capital: "리스본", x: 15.30, y: 92.52 },
        { country: "네덜란드", capital: "암스테르담", x: 41.81, y: 62.19},
        { country: "벨기에", capital: "브뤼셀", x: 41.03, y: 66.02 },
        { country: "스위스", capital: "베른", x: 47.08, y: 75.19},
        { country: "오스트리아", capital: "빈", x: 59.16, y: 72.52 },
        { country: "폴란드", capital: "바르샤바",x: 72.23, y: 60.69},
        { country: "체코", capital: "프라하", x: 60.72, y: 67.69 },
        { country: "슬로바키아", capital: "브라티슬라바", x: 69.30, y: 70.36 },
        { country: "헝가리", capital: "부다페스트", x: 68.72, y: 74.86 },
        { country: "루마니아", capital: "부쿠레슈티", x: 80.80, y: 79.36},
        { country: "불가리아", capital: "소피아", x: 81.78, y: 84.36},
        { country: "그리스", capital: "아테네", x: 74.57, y: 89.19 },
        { country: "세르비아", capital: "베오그라드", x: 71.06, y: 81.36 },
        { country: "크로아티아", capital: "자그레브", x: 63.65, y: 77.69 },
        { country: "슬로베니아", capital: "류블랴나", x: 60.14, y: 76.86 },
        { country: "보스니아헤르체고비나", capital: "사라예보",x: 64.82, y: 81.36 },
        { country: "몬테네그로", capital: "포드고리차", x: 67.94, y: 84.52 },
        { country: "알바니아", capital: "티라나", x: 69.89, y: 88.02 },
        { country: "북마케도니아", capital: "스코페", x: 73.40, y: 87.02 },
        { country: "스웨덴", capital: "스톡홀름",x: 61.89, y: 39.52 },
        { country: "노르웨이", capital: "오슬로", x: 52.15, y: 36.86 },
        { country: "핀란드", capital: "헬싱키", x: 79.44, y: 36.02},
        { country: "덴마크", capital: "코펜하겐", x: 50.39, y: 53.19 },
        { country: "에스토니아", capital: "탈린", x: 80.80, y: 43.36 },
        { country: "라트비아", capital: "리가", x: 81.78, y: 48.69 },
        { country: "리투아니아", capital: "빌뉴스", x: 77.68, y: 53.86 },
        { country: "러시아", capital: "모스크바", x: 95.62, y: 46.52 },
        { country: "우크라이나", capital: "키이우", x: 93.67, y: 65.52 },
        { country: "벨라루스", capital: "민스크", x: 85.68, y: 56.69 },
        { country: "몰도바", capital: "키시너우",x: 86.46, y: 73.86 },
        { country: "아일랜드", capital: "더블린", x: 16.86, y: 59.86},
        { country: "룩셈부르크", capital: "룩셈부르크", x: 43.18, y: 68.19 }
    ],
    "SouthAmerica": [
        { country: "브라질", capital: "브라질리아", x: 70.53, y: 36.35 },
        { country: "아르헨티나", capital: "부에노스아이레스",x: 46.01, y: 63.19 },
        { country: "칠레", capital: "산티아고", x: 23.48, y: 53.02 },
        { country: "콜롬비아", capital: "보고타", x: 17.49, y: 12.69},
        { country: "페루", capital: "리마", x: 13.78, y: 28.85 },
        { country: "베네수엘라", capital: "카라카스", x: 31.18, y: 6.35 },
        { country: "에콰도르", capital: "키토", x: 8.93, y: 18.02 },
        { country: "볼리비아", capital: "라파스", x: 35.46, y: 37.52 },
        { country: "파라과이", capital: "아순시온",x: 52.85, y: 47.52},
        { country: "우루과이", capital: "몬테비데오", x: 55.13, y: 58.02 },
        { country: "가이아나", capital: "조지타운", x: 47.72, y: 10.52 },
        { country: "수리남", capital: "파라마리보", x: 55.70, y: 12.69 }
    ],
    "Africa": [
        { country: "이집트", capital: "카이로",x: 65.33, y: 20.19 },
        { country: "남아프리카공화국", capital: "프리토리아", x: 64.23, y: 82.19 },
        { country: "나이지리아", capital: "아부자", x: 36.31, y: 42.02},
        { country: "케냐", capital: "나이로비", x: 74.45, y: 53.19 },
        { country: "에티오피아", capital: "아디스아바바", x: 77.01, y: 43.02 },
        { country: "알제리", capital: "알제", x: 32.48, y: 12.19 },
        { country: "모로코", capital: "라바트", x: 22.81, y: 14.69 },
        { country: "가나", capital: "아크라", x: 27.37, y: 44.86 },
        { country: "탄자니아", capital: "도도마", x: 71.53, y: 59.69},
        { country: "리비아", capital: "트리폴리", x: 54.20, y: 19.35 },
        { country: "수단", capital: "하르툼", x: 66.06, y: 35.02 },
        { country: "남수단", capital: "주바", x: 65.15, y: 45.19 },
        { country: "콩고민주공화국", capital: "킨샤사",x: 50.55, y: 57.52 },
        { country: "콩고공화국", capital: "브라자빌", x: 45.99, y: 56.36 },
        { country: "앙골라", capital: "루안다", x: 46.53, y: 62.69 },
        { country: "모잠비크", capital: "마푸투",x: 69.34, y: 79.02},
        { country: "마다가스카르", capital: "안타나나리보", x: 86.13, y: 73.02 },
        { country: "코트디부아르", capital: "야무수크로", x: 21.72, y: 44.36},
        { country: "카메룬", capital: "야운데", x: 42.15, y: 47.69},
        { country: "니제르", capital: "니아메", x: 35.22, y: 35.69 },
        { country: "말리", capital: "바마코", x: 25.91, y: 33.52 },
        { country: "부르키나파소", capital: "와가두구", x: 27.19, y: 38.19 },
        { country: "세네갈", capital: "다카르", x: 9.86, y: 35.69},
        { country: "잠비아", capital: "루사카", x: 60.77, y: 70.02 },
        { country: "짐바브웨", capital: "하라레",x: 64.96, y: 73.19 },
        { country: "보츠와나", capital: "가보로네", x: 57.85, y: 79.36 },
        { country: "나미비아", capital: "빈트후크", x: 49.45, y: 76.19 },
        { country: "우간다", capital: "캄팔라", x: 68.06, y: 51.52 },
        { country: "르완다", capital: "키갈리", x: 64.78, y: 55.02 },
        { country: "부룬디", capital: "기테가", x: 64.96, y: 56.86 },
        { country: "말라위", capital: "릴롱궤", x: 69.71, y: 66.02 },
        { country: "베냉", capital: "포르토노보",x: 31.39, y: 41.86 },
        { country: "토고", capital: "로메", x: 29.93, y: 43.52 },
        { country: "라이베리아", capital: "몬로비아", x: 16.79, y: 45.86 },
        { country: "시에라리온", capital: "프리타운", x: 13.87, y: 43.86 },
        { country: "기니", capital: "코나크리", x: 13.32, y: 40.19},
        { country: "기니비사우", capital: "비사우", x: 10.20, y: 39.30},
        { country: "감비아", capital: "반줄", x: 8.93, y: 37.97 },
        { country: "모리타니", capital: "누악쇼트", x: 11.85, y: 32.47 },
        { country: "에리트레아", capital: "아스마라", x: 75.39, y: 35.80 },
        { country: "지부티", capital: "지부티", x: 80.13, y: 39.63 },
        { country: "소말리아", capital: "모가디슈", x: 83.41, y: 49.63},
        { country: "중앙아프리카공화국", capital: "방기", x: 50.21, y: 47.13 },
        { country: "차드", capital: "은자메나", x: 48.75, y: 41.63 },
        { country: "가봉", capital: "리브르빌", x: 41.63, y: 53.63 },
        { country: "적도기니", capital: "말라보", x: 40.90, y: 51.13 },
        { country: "튀니지", capital: "튀니스", x: 40.17, y: 10.93 }
    ],
    "NorthAmerica": [
        { country: "미국", capital: "워싱턴 D.C.", x: 72.82, y: 69.30 },
        { country: "캐나다", capital: "오타와", x: 37.89, y: 50.14 },
        { country: "멕시코", capital: "멕시코시티", x: 54.16, y: 88.06 }
    ],
    "CentralAmerica": [
        { country: "쿠바", capital: "하바나", x: 46.72, y: 40.45 },
        { country: "과테말라", capital: "과테말라시티",x: 23.51, y: 69.95 },
        { country: "파나마", capital: "파나마시티", x: 54.54, y: 90.45 },
        { country: "코스타리카", capital: "산호세", x: 40.11, y: 87.12},
        { country: "온두라스", capital: "테구시갈파", x: 32.41, y: 69.45},
        { country: "엘살바도르", capital: "산살바도르",x: 27.12, y: 73.79},
        { country: "니카라과", capital: "마나과", x: 35.78, y: 77.79 },
        { country: "벨리즈", capital: "벨모판", x: 28.08, y: 60.62 },
        { country: "자메이카", capital: "킹스턴", x: 57.07, y: 57.79 },
        { country: "아이티", capital: "포르토프랭스",x: 69.58, y: 53.29 },
        { country: "도미니카공화국", capital: "산토도밍고", x: 74.75, y: 54.95 }
    ],
    "Oceania": [
        { country: "호주", capital: "캔버라", x: 38.37, y: 74.77 },
        { country: "뉴질랜드", capital: "웰링턴", x: 65.08, y: 81.43 },
        { country: "파푸아뉴기니", capital: "포트모르즈비", x: 36.76, y: 40.43},
        { country: "피지", capital: "수바", x: 68.01, y: 51.27 }
    ] 
};

let currentQuestionList = []; 
let currentQuestionIndex = 0; 

function playBGM(src) {
    if(!src) return;
    if(currentBGM) currentBGM.pause();
    currentBGM = new Audio(src);
    currentBGM.loop = true;
    currentBGM.volume = globalVolume * 0.2; 
    currentBGM.muted = isMuted;
    
    // 파일이 없으면 에러가 나지 않고 조용히 무시함
    currentBGM.play().catch(e => {});
}

function playVoice(src) {
    if(!src || isMuted) return;
    effectSound.src = src;
    
    let vol = globalVolume;
    if (src.includes('kim_')) {
        vol = Math.min(globalVolume * 2.0, 1.0); 
    }
    
    effectSound.volume = vol;
    effectSound.play().catch(e => {}); 
}

// 📌 모든 교수님 자동 적용!
function playHoverVoice(profName) {
    if(isMuted || !voiceData[profName] || !voiceData[profName].hover) return;
    
    let src = voiceData[profName].hover;
    hoverSound.src = src;
    
    let vol = globalVolume;
    if (src.includes('kim_')) {
        vol = Math.min(globalVolume * 2.0, 1.0); 
    }
    
    hoverSound.volume = vol;
    hoverSound.play().catch(e => {}); // 파일 없으면 스킵
}

document.body.addEventListener('click', () => {
    if (!isDefaultBgmPlaying && !currentProfessor) {
        playBGM(defaultBGM);
        isDefaultBgmPlaying = true;
    }
}, { once: true });

function changeVolume(val) {
    globalVolume = val;
    if(currentBGM) currentBGM.volume = val * 0.2;
    document.getElementById('mute-btn').innerText = val == 0 ? "🔇" : "🔊";
    isMuted = val == 0;
}

function toggleMute() {
    isMuted = !isMuted;
    if(currentBGM) currentBGM.muted = isMuted;
    const volSlider = document.getElementById('volume-slider');
    const muteBtn = document.getElementById('mute-btn');
    if(isMuted) {
        muteBtn.innerText = "🔇";
        volSlider.value = 0;
    } else {
        muteBtn.innerText = "🔊";
        volSlider.value = globalVolume == 0 ? 0.4 : globalVolume;
        if(globalVolume == 0) globalVolume = 0.4;
        if(currentBGM) currentBGM.volume = globalVolume * 0.2;
    }
}

function selectMode(mode) {
    currentMode = mode;
    document.getElementById('step-mode').classList.remove('active');
    
    if (mode === 'learning') {
        document.getElementById('step-professor').classList.add('active');
    } else if (mode === 'test') {
        currentProfessor = '김성일 조교쌤';
        document.getElementById('step-region').classList.add('active');
    }
}

function selectProfessor(prof) {
    currentProfessor = prof;
    document.getElementById('step-professor').classList.remove('active');
    document.getElementById('step-region').classList.add('active');
}

function selectRegion(region) {
    currentRegion = region;
    currentQuestionList = [...regionData[region]].sort(() => Math.random() - 0.5);
    
    document.getElementById('step-region').classList.remove('active');
    
    const mapBg = document.getElementById('map-bg');
    if (regionMapImages[region]) {
        mapBg.src = regionMapImages[region];
    }

    if (currentMode === 'test') {
        document.getElementById('step-count').classList.add('active');
    } else {
        startGame();
    }
}

function setQuestionCount(count) {
    if (count > 0 && count < currentQuestionList.length) {
        currentQuestionList = currentQuestionList.slice(0, count);
    }
    startGame();
}

function startTimer() {
    const timerDisplay = document.getElementById('timer-display');
    timerDisplay.style.display = "inline-block";
    secondsElapsed = 0;
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const mins = Math.floor(secondsElapsed / 60);
        const secs = secondsElapsed % 60;
        timerDisplay.innerText = `⏱️: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, 1000);
}

function startGame() {
    currentQuestionIndex = 0;
    
    if (professorBGM[currentProfessor]) {
        playBGM(professorBGM[currentProfessor]);
    }
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('step-game').classList.add('active');
    
    const regionNamesKR = { 
        "NortheastAsia": "동북아시아", "SoutheastAsia": "동남아시아", "SouthAsia": "남부아시아", 
        "SouthwestAsia": "서남아시아", "NorthAmerica": "북아메리카", "CentralAmerica": "중앙아메리카", 
        "SouthAmerica": "남아메리카", "Europe": "유럽", "Oceania": "오세아니아", "Africa": "아프리카" 
    };
    document.getElementById('game-title').innerText = `${regionNamesKR[currentRegion]} (${currentMode==='learning'?'학습':'시험'})`;
    
    if(currentMode === 'learning') startTimer();
    showNextQuestion();
}

function showNextQuestion() {
    document.getElementById('input-country').value = "";
    document.getElementById('input-capital').value = "";
    document.getElementById('input-country').focus();

    const q = currentQuestionList[currentQuestionIndex];
    const mapInner = document.getElementById('map-inner');
    document.querySelectorAll('.map-dot').forEach(d => d.remove());
    
    const dot = document.createElement('div');
    dot.className = "map-dot";
    
    dot.style.left = q.x + "%";
    dot.style.top = q.y + "%";
    
    if(currentMode === 'learning') {
        dot.style.cursor = "help";
        dot.onclick = () => alert(`정답: ${q.country} - ${q.capital}`);
    }
    mapInner.appendChild(dot);
}

function showPopup(msg, success, duration = 1200) {
    const p = document.getElementById('toast-popup');
    document.getElementById('toast-text').innerText = msg;
    document.getElementById('toast-img').src = success ? "assets/jiho_good.jpg" : "assets/jiho_bad.jpg";
    p.className = `show ${success ? 'toast-success' : 'toast-error'}`;
    
    setTimeout(() => p.className = "", duration);
}

function checkAnswer() {
    const q = currentQuestionList[currentQuestionIndex];
    const inCountry = document.getElementById('input-country').value.trim();
    const inCapital = document.getElementById('input-capital').value.trim();

    if (inCountry === q.country && inCapital === q.capital) {
        showPopup(`🎉 정답!`, true, 1200);
        
        if (voiceData[currentProfessor] && voiceData[currentProfessor].correct) {
            playVoice(voiceData[currentProfessor].correct);
        }

        setTimeout(() => {
            if (++currentQuestionIndex < currentQuestionList.length) {
                showNextQuestion();
            } else {
                clearInterval(timerInterval);
                const finalTime = document.getElementById('timer-display').innerText.replace('⏱️: ', '');
                
                const msg = currentMode === 'learning' 
                    ? `🎓 종강이닷! (소요시간: ${finalTime})`
                    : `💯 시험 종료! (${currentQuestionList.length}문제 완료)`;
                
                showPopup(msg, true, 3000);
                
                if (voiceData[currentProfessor] && voiceData[currentProfessor].finish) {
                    playVoice(voiceData[currentProfessor].finish);
                }
                
                setTimeout(() => { location.reload(); }, 3000);
            }
        }, 1300);
    } else {
        showPopup(`❌ 오답입니다.`, false, 1200);
        
        if (voiceData[currentProfessor] && voiceData[currentProfessor].wrong) {
            playVoice(voiceData[currentProfessor].wrong);
        }
    }
}

function goHome() {
    if(confirm("처음으로 돌아갈까요?")) location.reload();
}

document.getElementById('input-country').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('input-capital').focus();
    }
});

document.getElementById('input-capital').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkAnswer();
    }
});

document.getElementById('map-inner').addEventListener('click', function(e) {
    if(e.target.classList.contains('map-dot')) return; 
    
    const rect = this.getBoundingClientRect();
    
    const bgImg = new Image();
    const style = window.getComputedStyle(this);
    const bgSrc = style.backgroundImage.slice(5, -2).replace(/"/g, "");
    if(!bgSrc || bgSrc === 'none') return;
    
    bgImg.src = bgSrc;
    bgImg.onload = function() {
        const imgRatio = this.width / this.height;
        const containerRatio = rect.width / rect.height;

        let renderW, renderH, offsetX, offsetY;

        if (imgRatio > containerRatio) {
            renderW = rect.width;
            renderH = rect.width / imgRatio;
            offsetX = 0;
            offsetY = (rect.height - renderH) / 2;
        } else {
            renderH = rect.height;
            renderW = rect.height * imgRatio;
            offsetX = (rect.width - renderW) / 2;
            offsetY = 0;
        }

        const x = ((e.clientX - rect.left - offsetX) / renderW) * 100;
        const y = ((e.clientY - rect.top - offsetY) / renderH) * 100;

        if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
            alert(`📍 오차 보정 완료 좌표!\n\nx: ${x.toFixed(2)}, y: ${y.toFixed(2)}\n\n(이 값을 복사해서 regionData에 넣어주세요)`);
        }
    };
});