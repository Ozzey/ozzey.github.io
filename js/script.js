const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");
const year = document.querySelector("[data-year]");
const revealItems = document.querySelectorAll(".reveal");
const modeLinks = document.querySelectorAll("[data-mode-link]");
const portfolioBack = document.querySelector("[data-portfolio-back]");

if (year) {
  year.textContent = new Date().getFullYear().toString();
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen.toString());
  });

  nav.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

modeLinks.forEach((link) => {
  link.addEventListener("click", () => {
    localStorage.setItem("portfolio-mode", "immersive");
  });
});

if (portfolioBack instanceof HTMLAnchorElement) {
  const params = new URLSearchParams(window.location.search);
  const fromPortfolioParam = params.get("from") === "portfolio";
  let fromPortfolioReferrer = false;

  try {
    const referrer = document.referrer ? new URL(document.referrer) : null;
    fromPortfolioReferrer =
      referrer?.origin === window.location.origin &&
      referrer.pathname.startsWith("/Portfolio/");
  } catch {
    fromPortfolioReferrer = false;
  }

  if (fromPortfolioParam || fromPortfolioReferrer) {
    portfolioBack.hidden = false;

    if (fromPortfolioParam && window.history.replaceState) {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("from");
      window.history.replaceState({}, "", cleanUrl.pathname + cleanUrl.search + cleanUrl.hash);
    }
  }
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
