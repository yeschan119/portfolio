/* =========================================================
  ENTRY POINT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initLanguage();
  initArchitecture();
  initChat();
  initScrollEffects();
  initCounter();
  initSlider();
  warmUpServer();
});

/* =========================================================
  Mobile Menu
========================================================= */
function initMobileMenu() {
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  mobileBtn?.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  mobileMenu?.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => mobileMenu.classList.add("hidden"))
  );
}

/* =========================================================
  Language
========================================================= */
function initLanguage() {
  let translations = {};

  async function loadLanguage(lang) {
    try {
      const response = await fetch("/locales/" + lang + ".json");
      translations = await response.json();
      applyTranslations();
      localStorage.setItem("preferredLang", lang);
      setActiveLang(lang);
    } catch (error) {
      console.error("Language load error:", error);
    }
  }

  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const keys = element.getAttribute("data-i18n").split(".");
      let value = translations;

      keys.forEach(k => value = value?.[k]);

      if (value) element.innerHTML = value;
    });
  }

  function setActiveLang(lang) {
    document.querySelectorAll(".lang-btn").forEach(btn =>
      btn.classList.remove("bg-accent","text-white","border-accent")
    );

    if (lang === "en") {
      document.getElementById("langEn")?.classList.add("bg-accent","text-white","border-accent");
    }

    if (lang === "ko") {
      document.getElementById("langKo")?.classList.add("bg-accent","text-white","border-accent");
    }
  }

  document.getElementById("langEn")?.addEventListener("click", () => loadLanguage("en"));
  document.getElementById("langKo")?.addEventListener("click", () => loadLanguage("ko"));

  const savedLang = localStorage.getItem("preferredLang") || "ko";
  loadLanguage(savedLang);
}

/* =========================================================
  Chat
========================================================= */
function initChat() {
  const openBtn = document.getElementById('openChat');
  const sendBtn = document.getElementById('sendChat');
  const closeBtn = document.getElementById('closeChat');
  const overlay = document.getElementById('chatOverlay');

  if (!openBtn || !sendBtn || !closeBtn || !overlay) return;

  let isOpen = false;

  openBtn.addEventListener('click', () => {
    if (isOpen) return;
    isOpen = true;

    overlay.classList.remove('hidden');
    requestAnimationFrame(() => overlay.classList.add('active'));
  });

  closeBtn.addEventListener('click', closeChat);

  function closeChat() {
    if (!isOpen) return;
    isOpen = false;

    overlay.classList.remove('active');
    setTimeout(() => overlay.classList.add('hidden'), 500);
  }

  sendBtn.addEventListener('click', sendChat);
  initChatInput();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeChat();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeChat();
  });
}

/* =========================================================
  Chat Input (한글 대응)
========================================================= */
function initChatInput() {
  const input = document.getElementById("chatInput");

  let isComposing = false;

  input.addEventListener("compositionstart", () => {
    isComposing = true;
  });

  input.addEventListener("compositionend", () => {
    isComposing = false;
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      sendChat();
    }
  });
}

/* =========================================================
  Send Chat
========================================================= */
async function sendChat() {
  const input = document.getElementById("chatInput");
  const chat = document.getElementById("chatMessages");

  const message = input.value.trim();
  if (!message) return;

  input.value = "";

  // USER
  chat.innerHTML += `
    <div class="chat-user">
      <div>${message}</div>
    </div>
  `;

  chat.scrollTop = chat.scrollHeight;

  // loading
  const loadingId = "loading-" + Date.now();

  chat.innerHTML += `
    <div id="${loadingId}" class="chat-ai">
      <div class="typing-indicator">
        <div class="dots">
          <span></span><span></span><span></span>
        </div>
        <div class="typing-text">AI is thinking...</div>
      </div>
    </div>
  `;

  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("https://portfolio-llm-b1gj.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    document.getElementById(loadingId)?.remove();

    const container = document.createElement("div");
    container.className = "chat-ai";

    const bubble = document.createElement("div");
    container.appendChild(bubble);
    chat.appendChild(container);

    await typeWriter(data.reply, bubble);

    bubble.innerHTML = formatAIResponse(data.reply);

  } catch (err) {
    document.getElementById(loadingId)?.remove();
  }

  chat.scrollTop = chat.scrollHeight;
}

/* =========================================================
  Type Writer
========================================================= */
function typeWriter(text, element, speed = 15) {
  return new Promise((resolve) => {
    let i = 0;

    function typing() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typing, speed);
      } else {
        resolve();
      }
    }

    typing();
  });
}

/* =========================================================
  Markdown
========================================================= */
function formatAIResponse(text) {
  if (!text) return "";
  const html = marked.parse(text);
  return `<div class="ai-markdown">${html}</div>`;
}

if (typeof marked !== "undefined") {
  marked.setOptions({
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  });
}

function initArchitecture() {
  const down = document.getElementById("flowDown");
  const up = document.getElementById("flowUp");
  const dotDown = document.getElementById("dotDown");
  const dotUp = document.getElementById("dotUp");

  if (!down || !up || !dotDown || !dotUp) {
    console.warn("flow elements not found");
    return;
  }

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
  Scroll Effects
========================================================= */
function initScrollEffects() {
  const fadeElements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, { threshold: 0.15 });

  fadeElements.forEach(el => observer.observe(el));
}

/* =========================================================
  Counter
========================================================= */
function initCounter() {
  let ran = false;
  const hero = document.querySelector(".hero-bg");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || ran) return;

      ran = true;

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

  hero && observer.observe(hero);
}

/* =========================================================
  Slider
========================================================= */
function initSlider() {
  const track = document.getElementById("referenceTrack");
  const prev = document.getElementById("prevRef");
  const next = document.getElementById("nextRef");

  if (!track || !prev || !next) return;

  let index = 0;
  const total = track.children.length;

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  next.addEventListener("click", () => {
    index = (index + 1) % total;
    update();
  });

  prev.addEventListener("click", () => {
    index = (index - 1 + total) % total;
    update();
  });
}

/* =========================================================
  Server Warmup
========================================================= */
async function warmUpServer() {
  fetch("https://portfolio-llm-b1gj.onrender.com/health")
    .then(() => console.log("server warmed up"))
    .catch(() => {});
}