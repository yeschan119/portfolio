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