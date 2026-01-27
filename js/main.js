const themeToggleButtons = document.querySelectorAll("[data-theme-toggle]");
const themeStorageKey = "avs-theme";

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggleButtons.forEach((button) => {
    const isDark = theme === "dark";
    const icon = isDark
      ? "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M21 14.5a8.5 8.5 0 0 1-11.5-11.5 9 9 0 1 0 11.5 11.5Z\"/></svg>"
      : "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 4a1 1 0 0 1 1 1v1.25a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1Zm0 12.75a4.75 4.75 0 1 1 0-9.5 4.75 4.75 0 0 1 0 9.5Zm7-5.75a1 1 0 0 1 1 1v1.25a1 1 0 1 1-2 0V12a1 1 0 0 1 1-1ZM5 11a1 1 0 0 1 1 1v1.25a1 1 0 1 1-2 0V12a1 1 0 0 1 1-1Zm11.78-5.53a1 1 0 0 1 1.41 0l.88.88a1 1 0 1 1-1.42 1.42l-.87-.88a1 1 0 0 1 0-1.42Zm-11.14 0a1 1 0 0 1 1.42 1.42l-.88.88A1 1 0 1 1 4.76 6.35l.88-.88Zm11.14 12.07a1 1 0 0 1 1.42 1.42l-.88.88a1 1 0 0 1-1.42-1.42l.88-.88Zm-11.14 0 .88.88a1 1 0 1 1-1.42 1.42l-.88-.88a1 1 0 1 1 1.42-1.42Z\"/></svg>";

    button.setAttribute("aria-pressed", isDark.toString());
    button.setAttribute("aria-label", "Toggle theme");
    button.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
    button.innerHTML = icon;
  });
};

const initTheme = () => {
  const storedTheme = localStorage.getItem(themeStorageKey);
  if (storedTheme) {
    applyTheme(storedTheme);
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
};

themeToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(themeStorageKey, next);
    applyTheme(next);
  });
});

const rtlToggleButtons = document.querySelectorAll("[data-rtl-toggle]");
const rtlStorageKey = "avs-rtl";

const applyRtl = (isRtl) => {
  document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
  rtlToggleButtons.forEach((button) => {
    button.setAttribute("aria-pressed", isRtl.toString());
    button.innerHTML = isRtl ? "LTR Mode" : "RTL Mode";
  });
};

const initRtl = () => {
  const storedRtl = localStorage.getItem(rtlStorageKey);
  if (storedRtl !== null) {
    applyRtl(storedRtl === "true");
    return;
  }
  applyRtl(false);
};

rtlToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isRtl = document.documentElement.getAttribute("dir") === "rtl";
    const next = !isRtl;
    localStorage.setItem(rtlStorageKey, next.toString());
    applyRtl(next);
  });
});

initTheme();
initRtl();

const setActiveNav = () => {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const aliasMap = {
    "service-details.html": "services.html",
    "blog-details.html": "blog.html",
  };
  const target = aliasMap[currentPath] || currentPath;
  const navLinks = document.querySelectorAll(".site-header a[href]");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const normalized = href.split("#")[0];
    if (normalized === target) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
};

setActiveNav();

const blogSearchInput = document.querySelector("#blogSearch");
const blogCards = document.querySelectorAll("[data-blog-card]");
const filterChips = document.querySelectorAll("[data-filter]");

const applyFilters = () => {
  if (!blogSearchInput || blogCards.length === 0) return;
  const query = blogSearchInput.value.trim().toLowerCase();
  const activeChip = document.querySelector("[data-filter].active");
  const activeCategory = activeChip ? activeChip.dataset.filter : "all";

  blogCards.forEach((card) => {
    const category = card.dataset.category || "general";
    const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
    const matchCategory = activeCategory === "all" || category === activeCategory;
    const matchQuery = title.includes(query);
    card.style.display = matchCategory && matchQuery ? "block" : "none";
  });
};

if (blogSearchInput) {
  blogSearchInput.addEventListener("input", applyFilters);
}

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    applyFilters();
  });
});
