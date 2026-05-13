async function loadInclude(target) {
  const file = target.dataset.include;

  if (!file) {
    return;
  }

  const response = await fetch(file);

  if (!response.ok) {
    throw new Error(`No se pudo cargar ${file}`);
  }

  target.innerHTML = await response.text();
}

function setActiveNav() {
  const page = document.body.dataset.page;

  if (!page) {
    return;
  }

  document.querySelectorAll("[data-nav-page]").forEach((link) => {
    if (link.dataset.navPage === page || (page === "index" && link.dataset.navPage === "trabajos")) {
      link.classList.toggle("active", link.dataset.navPage === page);
    }
  });
}

function setupSmoothNavLinks() {
  document.querySelectorAll(".site-header a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = new URL(link.getAttribute("href"), window.location.href);
      const currentPath = window.location.pathname.split("/").pop() || "index.html";
      const targetPath = url.pathname.split("/").pop() || "index.html";

      if (!url.hash || currentPath !== targetPath) {
        return;
      }

      const target = document.querySelector(url.hash);

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", url.hash);

      const menu = document.querySelector("#mainNav.show");

      if (menu && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const includes = [...document.querySelectorAll("[data-include]")];

  await Promise.all(includes.map(loadInclude));
  setActiveNav();
  setupSmoothNavLinks();
});
