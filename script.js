const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }),
  );
}

const contactForm = document.getElementById("contact-form");
const statusEl = document.querySelector(".form-status");

if (contactForm && statusEl) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    if (!name || !email || !message) {
      statusEl.textContent =
        "Please complete all fields so we can respond meaningfully.";
      statusEl.style.color = "#ff7b7b";
      return;
    }

    statusEl.textContent =
      "Message queued! I'll reply within two business days.";
    statusEl.style.color = "#8f9bb7";
    contactForm.reset();
  });
}
