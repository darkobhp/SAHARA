document.documentElement.classList.add("reveal-ready");

const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-mobile-menu]");

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menu.getAttribute("data-open") === "true";
    menu.setAttribute("data-open", String(!isOpen));
    menu.classList.toggle("hidden", isOpen);
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  });
}

const saharaForm = document.querySelector("[data-sahara-form]");

if (saharaForm) {
  saharaForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const action = saharaForm.getAttribute("action") || "";
    const isConfigured = /^https:\/\/script\.google\.com\/macros\/s\//.test(action);
    const warning = saharaForm.querySelector("[data-form-warning]");
    const success = saharaForm.querySelector("[data-form-success]");
    const bottomSuccess = saharaForm.querySelector("[data-form-success-bottom]");
    const submitButton = saharaForm.querySelector('button[type="submit"]');

    if (!isConfigured) {
      warning?.classList.remove("hidden");
      warning?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    warning?.classList.add("hidden");
    success?.classList.add("hidden");
    bottomSuccess?.classList.add("hidden");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }

    try {
      await fetch(action, {
        method: "POST",
        body: new FormData(saharaForm),
        mode: "no-cors",
      });

      success?.classList.remove("hidden");
      bottomSuccess?.classList.remove("hidden");
      saharaForm.reset();
      bottomSuccess?.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch {
      warning?.classList.remove("hidden");
      if (warning) {
        warning.textContent = "Submission could not be completed. Please check your connection and try again.";
        warning.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Application";
      }
    }
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

revealItems.forEach((item) => observer.observe(item));
