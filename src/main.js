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
  initProjectFilter();
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
      document.getElementById("langEnMobile")?.classList.add("bg-accent","text-white","border-accent");
    }

    if (lang === "ko") {
      document.getElementById("langKo")?.classList.add("bg-accent","text-white","border-accent");
      document.getElementById("langKoMobile")?.classList.add("bg-accent","text-white","border-accent");
    }
  }

  document.getElementById("langEn")?.addEventListener("click", () => loadLanguage("en"));
  document.getElementById("langKo")?.addEventListener("click", () => loadLanguage("ko"));
  document.getElementById("langEnMobile")?.addEventListener("click", () => loadLanguage("en"));
  document.getElementById("langKoMobile")?.addEventListener("click", () => loadLanguage("ko"));

  const savedLang = localStorage.getItem("preferredLang") || "en";
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
function appendChatBubble(chat, className, text = "") {
  const container = document.createElement("div");
  container.className = className;

  const bubble = document.createElement("div");
  bubble.textContent = text;
  container.appendChild(bubble);
  chat.appendChild(container);

  return { container, bubble };
}

function appendGithubSources(bubble, sources) {
  if (!sources?.length) return;

  const sourceList = document.createElement("div");
  sourceList.className = "chat-sources";

  const label = document.createElement("span");
  label.textContent = "GitHub sources: ";
  sourceList.appendChild(label);

  sources.forEach((source, index) => {
    const link = document.createElement("a");
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = source.name;
    sourceList.appendChild(link);

    if (index < sources.length - 1) {
      sourceList.appendChild(document.createTextNode(" · "));
    }
  });

  bubble.appendChild(sourceList);
}

async function sendChat() {
  const input = document.getElementById("chatInput");
  const chat = document.getElementById("chatMessages");
  const sendButton = document.getElementById("sendChat");

  const message = input.value.trim();
  if (!message || sendButton.disabled) return;

  input.value = "";
  sendButton.disabled = true;

  appendChatBubble(chat, "chat-user", message);

  chat.scrollTop = chat.scrollHeight;

  const loading = document.createElement("div");
  loading.className = "chat-ai";
  loading.innerHTML = `
    <div class="typing-indicator">
      <div class="dots"><span></span><span></span><span></span></div>
      <div class="typing-text">Checking GitHub data...</div>
    </div>
  `;
  chat.appendChild(loading);

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

    if (!res.ok || typeof data.reply !== "string" || !data.reply.trim()) {
      throw new Error(data.error || `Chat request failed (${res.status})`);
    }

    loading.remove();
    const { bubble } = appendChatBubble(chat, "chat-ai");
    await renderMarkdownLineByLine(data.reply, bubble, chat);
    appendGithubSources(bubble, data.sources);

  } catch (err) {
    console.error("Grounded chat error:", err);
    loading.remove();

    const errorMessage = /[가-힣]/.test(message)
      ? "GitHub 저장소를 확인하지 못해 답변을 생성하지 않았습니다. 잠시 후 다시 시도해 주세요."
      : "I couldn't verify the GitHub repositories, so no answer was generated. Please try again shortly.";

    appendChatBubble(chat, "chat-ai chat-error", errorMessage);
  } finally {
    sendButton.disabled = false;
    input.focus();
  }

  chat.scrollTop = chat.scrollHeight;
}

/* =========================================================
  Progressive Markdown
========================================================= */
function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function renderMarkdownLineByLine(text, element, scrollContainer) {
  const normalizedText = text.replace(/\r\n/g, "\n");
  const lines = normalizedText.split("\n");
  const visibleLineCount = Math.max(lines.filter(line => line.trim()).length, 1);
  const lineDelay = Math.max(35, Math.min(90, 1800 / visibleLineCount));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    element.innerHTML = formatAIResponse(normalizedText);
    return;
  }

  const revealedLines = [];

  for (const line of lines) {
    revealedLines.push(line);

    if (!line.trim()) continue;

    element.innerHTML = formatAIResponse(revealedLines.join("\n"));
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
    await wait(lineDelay);
  }

  element.innerHTML = formatAIResponse(normalizedText);
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
        const suffix = counter.dataset.suffix || "";
        let current = 0;
        const step = Math.max(1, Math.floor(target / 80));

        const tick = () => {
          current += step;
          if (current >= target) {
            counter.innerText = target + suffix;
            return;
          }
          counter.innerText = current + suffix;
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

function initProjectFilter() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");
    const emptyState = document.getElementById("emptyState");

    if (!filterButtons.length || !projectCards.length) {
      console.warn("project filter elements not found");
      return;
    }

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
        // hide the empty-state whenever at least one card is visible
        emptyState.classList.toggle("hidden", visible !== 0);
      }
    }

    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        applyFilter(btn.dataset.filter);
      });
    });

    applyFilter("all");
}

/* =========================================================
  Server Warmup
========================================================= */
async function warmUpServer() {
  fetch("https://portfolio-llm-b1gj.onrender.com/health")
    .then(() => console.log("server warmed up"))
    .catch(() => {});
}
