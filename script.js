
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const themeToggle = document.getElementById("theme-toggle");
  const yearElement = document.getElementById("year");

  // Current year in footer
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Mobile navigation
  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navbar.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navbar.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.textContent = "☰";
      });
    });
  }

  // Light and dark theme
  const updateThemeButton = () => {
    if (!themeToggle) return;

    const isLight = document.body.classList.contains("light-mode");
    themeToggle.textContent = isLight ? "Dark Mode" : "Light Mode";
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode"
    );
    themeToggle.setAttribute("aria-pressed", String(isLight));
  };

  try {
    if (localStorage.getItem("portfolio-theme") === "light") {
      document.body.classList.add("light-mode");
    }
  } catch (error) {
    // Theme still works if local storage is unavailable.
  }

  updateThemeButton();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");

      const theme = document.body.classList.contains("light-mode")
        ? "light"
        : "dark";

      try {
        localStorage.setItem("portfolio-theme", theme);
      } catch (error) {
        // Ignore storage errors.
      }

      updateThemeButton();
    });
  }

  // Welcome screen
  const welcomeScreen = document.getElementById("welcome-screen");

  if (welcomeScreen) {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.setTimeout(() => {
      welcomeScreen.classList.add("is-leaving");

      window.setTimeout(
        () => welcomeScreen.remove(),
        reducedMotion ? 0 : 650
      );
    }, reducedMotion ? 800 : 2200);
  }

  // Typing animation
  const typingText = document.getElementById("typing-text");
  const typingTitles = [
    "Computer Engineering Student",
    "Future Computer Engineer",
    "Technology Enthusiast",
    "Aspiring Developer"
  ];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (typingText && !reducedMotion) {
    let titleIndex = 0;
    let characterIndex = typingTitles[0].length;
    let deleting = true;

    function typeNextTitle() {
      const currentTitle = typingTitles[titleIndex];

      if (deleting) {
        characterIndex--;
        typingText.textContent = currentTitle.slice(0, characterIndex);

        if (characterIndex <= 0) {
          deleting = false;
          titleIndex = (titleIndex + 1) % typingTitles.length;
          window.setTimeout(typeNextTitle, 350);
          return;
        }

        window.setTimeout(typeNextTitle, 45);
      } else {
        const nextTitle = typingTitles[titleIndex];
        characterIndex++;
        typingText.textContent = nextTitle.slice(0, characterIndex);

        if (characterIndex >= nextTitle.length) {
          deleting = true;
          window.setTimeout(typeNextTitle, 1800);
          return;
        }

        window.setTimeout(typeNextTitle, 75);
      }
    }

    window.setTimeout(typeNextTitle, 1800);
  }

  // Scroll reveal
  const revealElements = document.querySelectorAll(
    ".section-heading, .about-card, .skill-card, " +
    ".project-card, .gallery-card, .contact-card"
  );

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
  } else {
    revealElements.forEach((element) => element.classList.add("reveal"));

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  // Highlight active navigation link
  if ("IntersectionObserver" in window) {
    const sections = document.querySelectorAll("main section[id]");

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        });
      },
      { rootMargin: "-25% 0px -60% 0px" }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Scroll progress bar and Back to Top button
  const progressBar = document.getElementById("scroll-progress");
  const backToTop = document.getElementById("back-to-top");

  function updateScrollUI() {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollableHeight > 0
      ? (window.scrollY / scrollableHeight) * 100
      : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (backToTop) {
      backToTop.classList.toggle("show", window.scrollY > 350);
    }
  }

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  }

  // Animated skill bars
  const skillMeters = document.querySelectorAll(".skill-meter-track span");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    skillMeters.forEach((meter) => skillsObserver.observe(meter));
  } else {
    skillMeters.forEach((meter) => meter.classList.add("animate"));
  }

  // AutoCAD gallery lightbox
  const galleryCards = document.querySelectorAll(".gallery-card");

  const lightbox = document.createElement("div");
  lightbox.className = "gallery-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Gallery preview");
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <div class="lightbox-panel">
      <button class="lightbox-close" type="button" aria-label="Close preview">×</button>
      <div class="lightbox-content"></div>
    </div>
  `;

  document.body.appendChild(lightbox);

  const lightboxContent = lightbox.querySelector(".lightbox-content");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  let lastFocusedElement = null;

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");

    if (lastFocusedElement) lastFocusedElement.focus();
  }

  galleryCards.forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Open gallery preview");

    function openPreview() {
      const image = card.querySelector("img");
      const title = card.querySelector("h3")?.textContent || "Portfolio work";
      const description =
        card.querySelector(".gallery-info p")?.textContent || "";

      lastFocusedElement = card;
      lightboxContent.replaceChildren();

      if (image) {
        const largeImage = document.createElement("img");
        largeImage.src = image.src;
        largeImage.alt = image.alt || title;
        lightboxContent.appendChild(largeImage);
      } else {
        const placeholder = card.querySelector(".gallery-placeholder");

        if (placeholder) {
          const preview = placeholder.cloneNode(true);
          preview.classList.add("lightbox-placeholder");
          lightboxContent.appendChild(preview);
        }
      }

      const heading = document.createElement("h2");
      heading.textContent = title;

      const caption = document.createElement("p");
      caption.textContent = description;

      lightboxContent.append(heading, caption);
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      lightboxClose.focus();
    }

    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      openPreview();
    });

    card.addEventListener("keydown", (event) => {
      if (event.target !== card) return;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPreview();
      }
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
});
