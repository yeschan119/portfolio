/* =========================================================
  DOM Ready Wrapper
========================================================= */
document.addEventListener("DOMContentLoaded", () => {

/* =========================================================
  Mobile Menu
========================================================= */
const mobileBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

mobileBtn?.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

mobileMenu?.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => mobileMenu.classList.add("hidden"))
);

/* =========================================================
  Language Toggle
========================================================= */

let currentLang = "en";
let translations = {};

async function loadLanguage(lang) {
    try {
        const response = await fetch("/locales/" + lang + ".json");
        translations = await response.json();
        applyTranslations();
        localStorage.setItem("preferredLang", lang);
        currentLang = lang;
        setActiveLang(lang);
    } catch (error) {
        console.error("Language load error:", error);
    }
}

function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");

        const keys = key.split(".");
        let value = translations;

        keys.forEach(k => {
            value = value?.[k];
        });

        if (value) {
            element.innerHTML = value;
        }
    });
}

const btnEn = document.getElementById("langEn");
const btnKo = document.getElementById("langKo");
const btnEnMobile = document.getElementById("langEnMobile");
const btnKoMobile = document.getElementById("langKoMobile");

btnEn?.addEventListener("click", () => loadLanguage("en"));
btnKo?.addEventListener("click", () => loadLanguage("ko"));
btnEnMobile?.addEventListener("click", () => loadLanguage("en"));
btnKoMobile?.addEventListener("click", () => loadLanguage("ko"));

/* 최초 실행 */
const savedLang = localStorage.getItem("preferredLang") || "en";
loadLanguage(savedLang);

function setActiveLang(lang) {

    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.remove("bg-accent","text-white","border-accent");
    });

    if (lang === "en") {
        document.getElementById("langEn")?.classList.add("bg-accent","text-white","border-accent");
        document.getElementById("langEnMobile")?.classList.add("bg-accent","text-white","border-accent");
    }

    if (lang === "ko") {
        document.getElementById("langKo")?.classList.add("bg-accent","text-white","border-accent");
        document.getElementById("langKoMobile")?.classList.add("bg-accent","text-white","border-accent");
    }
}

// skills
const skillData = {
    python: `
    > 5년 경험
    > 프로젝트 레벨 경험
        - SKT AI 경진대회 우수상 수상
        - flask, django를 사용한 다수의 미니 프로젝트 수행
            - 은행 시스템 구현, 신용평가 모델 구현
        - 다수의 미니 게임 개발 및 coding test  문제들 풀기
    > 프로덕션 레벨 경험
        - 제약회사(대웅제약) python desktop application 개발
        - AI 회사(AIWORKX)에서 AI vision 개발자로 근무
            - AI modeling(YOLO 등)
            - OpenCV를 활용한 AI Application 개발
        - RDBMS(Tibero)회사에서 업무 보고 자동화 시스템을 파이썬으로 구현(업무 효율화)`,

    csharp: `
      > 3년 경험
      > 프로덕션 레벨 경험
        - Asp dotNet Core 기반 Backend 개발 담당
        - 수십만 명이 사용하는 Web Browser의 backend 개발 진행`,

    cpp: `
      > 5년 경험
      > 프로젝트 구현
        - DB engine의 data-level 설계 및 구현
        - 다양한 알고리즘을 활용한 다수의 미니 프로젝트 구현
      > 프로덕션 레벨 개발 경험
        - RDBMS(Tmax Tibero)회사 R&D팀에서 로직 설계 및 기능 추가
            - DB Parser / Optimizer module 기능 추가
                - 대표적으로 SQL Tuning Advisor, SQL Plan Management 기능 추가
            - 사내 C++ study 장기간 진행
            - Legacy Code(C 언어)를 C++로 이전하는 작업 진행`,

      typescript: `
      > 3년 경험
      > 프로젝트 경험
        - 다수의 미니 프로젝트 경험
      > 프로덕션 레벨
          - 수십만 명이 사용하는 Web Browser에서 Angular Framework를 기반으로 Front-end 개발
          - 실제 상용화된 LG KIOSK application을 Typescript로 구현`,

    sql: `
      > 5년 경험(MySQL, Oracle, SQL Server, PostgreSQL, Tibero)
      > 프로젝트 경험
          - 다양한 언어(python, java, C#)로 진행하는 프로젝트에서 DB를 연결하여 프로젝트 수행
              - 은행 관리 시스템 등
      > 프로덕션 레벨 경험
          - RDBMS회사(Timax Tibero)에서 다수의 client(은행, 회사, 학교)들을 상대로 SQL Tuning 작업 수행
              - query plan을 분석하고 각종 인덱스, 파티션, 조인, 힌트등 기법으로 튜닝 진행
          - SQL plan을 직접 구현하고 테스트하고 프로덕션 배포
          - 수십만 명이 사용하는 Web Browser에서 DB 관리를 담당하여 30% 이상의 Performance 달성`,

    pl_sql: `
      > 2년 경험
      > 프로덕션 경험
        - RDBMS(Tibero) engine에서 통계수집 모듈을 담당하여 기능 추가 및 관리 진행
        - Tibero의 통계수집 모듈은 대부분 Pl/SQL로 구현되어 있음`,

    html: `
      > 2년 경험
      > 프로젝트 경험
        - 포트폴리오를 직접 HTML/CSS로 구현
      > 프로덕션 레벨 경험
          - 수십만 명이 사용하는 Web Browser에서 Angular Framework를 기반으로 Front-end 개발
          - 실제 상용화된 LG KIOSK application을 HTML/CSS로 구현
      `,

    java: `
      > 1년 경험
      - 소수의 미니 프로젝트 수행
      - OOP 구조 수업을 Java로 수강`,

    dart: `
      > IOS, MacOS용 Application 개발
      > 각종 단위 변환 application
      > 메모 관리 application`,

    aws: `
      > 4년
      > 프로젝트 경험
        - 미니 프로젝트들 전부 RDS/EC2/Lambda 등으로 구현
      > 프로덕션 레벨 경험
        2년 동안 full-stack 개발자로 근무하면서 다양한 AWS Architecture 설계 및 구현`,
};

const wrappers = document.querySelectorAll('.skill-wrapper');

wrappers.forEach(wrapper => {
  const item = wrapper.querySelector('.skill-item');
  const note = wrapper.querySelector('.skill-note');
  const key = item.dataset.skill;

  // hover
  wrapper.addEventListener('mouseenter', () => show(wrapper, key));
  wrapper.addEventListener('mouseleave', () => hide(wrapper));

  // click (모바일 대응)
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle(wrapper, key);
  });

  function show(w, key) {
    if (!skillData[key]) return;
    note.textContent = skillData[key];
    w.classList.add('active');
  }

  function hide(w) {
    w.classList.remove('active');
  }

  function toggle(w, key) {
    wrappers.forEach(x => x.classList.remove('active'));
    show(w, key);
  }
});

// 바깥 클릭 시 닫기
document.addEventListener('click', () => {
  wrappers.forEach(w => w.classList.remove('active'));
});

function formatContent(text) {
  if (!text) return '';

  return text
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      if (trimmed.startsWith('>')) {
        return `<div class="note-title">${trimmed.replace('>', '').trim()}</div>`;
      }

      if (trimmed.startsWith('-')) {
        return `<div class="note-item">${trimmed.substring(1).trim()}</div>`;
      }

      return `<div class="note-text">${trimmed}</div>`;
    })
    .join('');
}

wrappers.forEach(wrapper => {
  const item = wrapper.querySelector('.skill-item');
  const note = wrapper.querySelector('.skill-note');

  if (!item || !note) return;

  const key = item.dataset.skill;

  // 🔥 hover (desktop)
  wrapper.addEventListener('mouseenter', () => {
    if (!skillData[key]) return;

    note.innerHTML = formatContent(skillData[key]);
    wrapper.classList.add('active');
  });

  wrapper.addEventListener('mouseleave', () => {
    wrapper.classList.remove('active');
  });

  // 🔥 click (mobile + 유지)
  item.addEventListener('click', (e) => {
    e.stopPropagation();

    wrappers.forEach(w => w.classList.remove('active'));

    if (skillData[key]) {
      note.innerHTML = formatContent(skillData[key]);
      wrapper.classList.add('active');
    }
  });
});

// 🔥 바깥 클릭 시 닫기
document.addEventListener('click', () => {
  wrappers.forEach(w => w.classList.remove('active'));
});


/* =========================================================
  Scroll Fade-in
========================================================= */
const fadeElements = document.querySelectorAll(".fade-in");

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.15 });

fadeElements.forEach(el => fadeObserver.observe(el));


/* =========================================================
  Counter Animation
========================================================= */
let countersRan = false;

const heroSection = document.querySelector(".hero-bg");

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || countersRan) return;

    countersRan = true;

    document.querySelectorAll(".counter").forEach(counter => {
      const target = Number(counter.dataset.target || 0);
      let current = 0;
      const step = Math.max(1, Math.floor(target / 80));

      const tick = () => {
        current += step;
        if (current >= target) {
          counter.innerText = target;
          return;
        }
        counter.innerText = current;
        requestAnimationFrame(tick);
      };

      tick();
    });
  });
}, { threshold: 0.35 });

heroSection && counterObserver.observe(heroSection);


/* =========================================================
  Architecture Flow Animation
========================================================= */
const down = document.getElementById("flowDown");
const up = document.getElementById("flowUp");
const dotDown = document.getElementById("dotDown");
const dotUp = document.getElementById("dotUp");

if (down && up && dotDown && dotUp) {

  const len1 = down.getTotalLength();
  const len2 = up.getTotalLength();

  function animateFlow(time) {
    const p1 = (time % 4000) / 4000;
    const p2 = (time % 5000) / 5000;

    const pt1 = down.getPointAtLength(len1 * p1);
    const pt2 = up.getPointAtLength(len2 * p2);

    dotDown.setAttribute("cx", pt1.x);
    dotDown.setAttribute("cy", pt1.y);
    dotUp.setAttribute("cx", pt2.x);
    dotUp.setAttribute("cy", pt2.y);

    requestAnimationFrame(animateFlow);
  }

  requestAnimationFrame(animateFlow);
}


/* =========================================================
  Project Filtering
========================================================= */
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const emptyState = document.getElementById("emptyState");

function applyFilter(filter) {

  filterButtons.forEach(btn => {
    btn.setAttribute("aria-pressed", btn.dataset.filter === filter);
  });

  let visible = 0;

  projectCards.forEach(card => {
    const tags = (card.dataset.tags || "").split(" ");
    const show = filter === "all" || tags.includes(filter);

    if (show) {
      card.style.display = "";
      card.classList.remove("hidden");
      visible++;
    } else {
      card.style.display = "none";
    }
  });

  if (emptyState) {
    emptyState.classList.toggle("hidden", visible !== 0);
  }
}

filterButtons.forEach(btn =>
  btn.addEventListener("click", () =>
    applyFilter(btn.dataset.filter)
  )
);

applyFilter("all");


/* =========================================================
  Timeline Scroll Progress
========================================================= */
const timeline = document.querySelector(".timeline");
const progress = document.getElementById("timelineProgress");

function updateTimeline() {
  if (!timeline || !progress) return;

  const rect = timeline.getBoundingClientRect();
  const vh = window.innerHeight;

  const total = rect.height;
  const visible = Math.min(total, Math.max(0, vh - rect.top));

  const ratio = Math.min(1, visible / total);

  progress.style.height = `${ratio * 100}%`;
}

window.addEventListener("scroll", updateTimeline);
window.addEventListener("resize", updateTimeline);
updateTimeline();


/* =========================================================
  Reference Slider
========================================================= */
const track = document.getElementById("referenceTrack");
const prevBtn = document.getElementById("prevRef");
const nextBtn = document.getElementById("nextRef");

if (track && prevBtn && nextBtn) {

  let index = 0;
  const total = track.children.length;

  function updateSlide() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % total;
    updateSlide();
  });

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + total) % total;
    updateSlide();
  });
}

});