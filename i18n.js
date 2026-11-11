// =============================================================
// Language (English / Korean).
// - Words of the page itself (buttons, headings, hints) live in UI below.
// - Content of each space lives in data.js as { en: "...", ko: "..." }.
// - The choice is saved in localStorage; if that is blocked
//   (private mode, file settings...), the page simply opens in English.
// Word rules for Korean: Memorization = 암기, Idea generation = 아이디어 구상,
// Teamwork = 팀플, Comfort = 편안함. Space names stay in English.
// Study names (author, year) and links are never translated.
// =============================================================

window.I18N = (() => {
  const KEY = "studySpaceLang";
  const LANGS = ["en", "ko"];
  let lang = "en";
  try {
    const saved = window.localStorage.getItem(KEY);
    if (LANGS.includes(saved)) lang = saved;
  } catch (e) { /* storage blocked: stay in English */ }

  // Korean object particle: 암기 → 암기를, 팀플 → 팀플을
  const eulReul = (word) => {
    const c = word.charCodeAt(word.length - 1);
    return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0 ? "을" : "를";
  };

  const UI = {
    // page
    title: { en: "Study-Type Space Design", ko: "공부 유형별 공간 디자인" },
    description: {
      en: "Four study spaces designed for four study types, with 3D views, lighting and sound previews.",
      ko: "네 가지 공부 유형을 위해 디자인한 네 가지 공간. 3D 보기와 조명, 소리 미리보기를 함께 볼 수 있어요."
    },
    langGroup: { en: "Language", ko: "언어" },
    navPick: { en: "Find your space", ko: "내 공간 찾기" },
    navCompare: { en: "Compare", ko: "비교" },
    navResearch: { en: "Research", ko: "연구" },
    eyebrow: { en: "Group 6 · Ajou University", ko: "아주대학교 6조" },
    question: { en: "What am I studying today?", ko: "오늘은 어떤 공부를 하나요?" },
    lede: {
      en: "Pick one. We'll show you the space we designed for it, so you can see its light and hear its sound.",
      ko: "하나를 골라 보세요. 그 공부를 위해 우리가 디자인한 공간을 보여 드려요. 조명을 보고 소리도 들어 볼 수 있어요."
    },
    studyTypes: { en: "Study types", ko: "공부 유형" },
    factPrefix: { en: "Why space matters:", ko: "공간이 중요한 이유:" },
    compareTitle: { en: "Different study, different space", ko: "공부가 다르면, 공간도 달라요" },
    compareLede: {
      en: "All four designs side by side. Tap one to open it.",
      ko: "네 가지 디자인을 나란히 비교해 보세요. 누르면 자세히 볼 수 있어요."
    },
    surveyTitle: { en: "What Ajou students told us", ko: "아주대 학생들이 들려준 이야기" },
    surveyLede: { en: "Survey results will appear here after week 12.", ko: "설문 결과는 12주차 이후에 여기에 올라와요." },
    surveyTodo: {
      en: "TODO: add survey chart (preferred space by study type)",
      ko: "TODO: 설문 차트 추가 (공부 유형별 선호 공간)"
    },
    researchTitle: { en: "Research behind the designs", ko: "디자인의 근거가 된 연구" },
    researchNote: {
      en: "Some effects (for example, color and light) were small or mixed in later studies, so we describe them as tendencies, not rules.",
      ko: "일부 효과(예: 색과 빛)는 이후 연구에서 작거나 엇갈리게 나타났어요. 그래서 규칙이 아니라 경향으로 설명해요."
    },
    footerGroup: { en: "Group 6", ko: "6조" },

    // design card
    designFor: { en: (type) => `Design for ${type}`, ko: (type) => `${type}${eulReul(type)} 위한 디자인` },
    hearSpace: { en: "Hear this space", ko: "이 공간 소리 듣기" },
    stopSound: { en: "Stop sound", ko: "소리 끄기" },
    lightingPreview: { en: (on) => `Lighting preview ${on ? "on" : "off"}`, ko: (on) => `조명 미리보기 ${on ? "켜짐" : "꺼짐"}` },
    viewTabs: { en: "How to show the space", ko: "공간 보기 방식" },
    view3d: { en: "3D view", ko: "3D 보기" },
    viewPlan: { en: "Floor plan", ko: "평면도" },
    caption3d: { en: (s) => `3D model · sound: ${s}`, ko: (s) => `3D 모델 · 소리: ${s}` },
    captionPlan: { en: (s) => `Top-view layout · sound: ${s}`, ko: (s) => `위에서 본 배치도 · 소리: ${s}` },
    planAria: { en: (name) => `Floor plan of the ${name}`, ko: (name) => `${name} 평면도` },
    surveySoon: { en: "Source: our survey (coming soon)", ko: "출처: 우리 설문 (준비 중)" },

    // 3D view
    s3dAria: {
      en: (name) => `3D model of the ${name}. Drag to turn, scroll or pinch to zoom, or use the arrow keys.`,
      ko: (name) => `${name} 3D 모델. 끌어서 돌리고, 스크롤하거나 두 손가락으로 확대·축소해요. 화살표 키도 쓸 수 있어요.`
    },
    s3dHint: { en: "Drag to turn · scroll or pinch to zoom", ko: "끌어서 돌리기 · 스크롤이나 두 손가락으로 확대" },
    light: { en: "Light", ko: "조명" },
    ceiling: { en: "Ceiling", ko: "천장" },
    ours: { en: "Our design", ko: "우리 디자인" },
    compare: { en: "Compare", ko: "비교" },
    fullScreen: { en: "Full screen", ko: "전체 화면" },
    s3dIntro: {
      en: "Tap <b>Light</b> or <b>Ceiling</b> to compare our design with a different one.",
      ko: "<b>조명</b>이나 <b>천장</b> 버튼을 눌러 우리 디자인과 다른 디자인을 비교해 보세요."
    },
    ceilingLabel: { en: (m) => `Ceiling ${m} m`, ko: (m) => `천장 ${m} m` },
    s3dDialog: { en: (name) => `${name} in 3D`, ko: (name) => `${name} 3D 보기` },
    close3d: { en: "Close 3D view", ko: "3D 보기 닫기" }
  };

  // content value → current language. Accepts { en, ko } or a plain string.
  const tr = (v) =>
    v && typeof v === "object" && ("en" in v || "ko" in v) ? (v[lang] ?? v.en) : v;

  // UI word → current language. Extra arguments go to word functions.
  const t = (key, ...args) => {
    const v = tr(UI[key]) ?? key;
    return typeof v === "function" ? v(...args) : v;
  };

  // words written in index.html (data-i18n / data-i18n-aria)
  function applyStatic() {
    document.documentElement.lang = lang;
    document.title = t("title");
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("description"));
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
    document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  }

  function set(next) {
    if (!LANGS.includes(next) || next === lang) return;
    lang = next;
    try { window.localStorage.setItem(KEY, next); } catch (e) { /* not saved, still works */ }
    applyStatic();
    document.dispatchEvent(new CustomEvent("lang:change", { detail: { lang } }));
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-lang]");
    if (b) set(b.dataset.lang);
  });
  applyStatic();

  return { get lang() { return lang; }, t, tr, set };
})();
