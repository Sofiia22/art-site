import "../css/styles.css";

async function loadPartial(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

await loadPartial("header", "/src/partials/header.html");
await loadPartial("hero", "/src/partials/hero.html");
await loadPartial("services", "/src/partials/services.html");
await loadPartial("about", "/src/partials/about.html");
await loadPartial("gallery", "/src/partials/gallery.html");
await loadPartial("review", "/src/partials/review.html");
await loadPartial("footer", "/src/partials/footer.html");

// ===== GALLERY SWIPER =====
const gallerySwiperEl = document.querySelector(".gallery-swiper");

if (gallerySwiperEl && typeof Swiper !== "undefined") {
  new Swiper(".gallery-swiper", {
    loop: true,
    spaceBetween: 24,
    slidesPerView: 1,
    speed: 700,

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });
}

// ===== GALLERY SCROLL ANIMATION =====
const galleryAnimatedSlides = document.querySelectorAll(".gallery-animate");

const galleryAnimationObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, index * 120);

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  },
);

galleryAnimatedSlides.forEach((slide) => {
  galleryAnimationObserver.observe(slide);
});

// ===== LIGHTBOX =====
const galleryImages = document.querySelectorAll(".gallery-img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");

let currentImageIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

function showLightboxImage(index) {
  if (!galleryImages.length || !lightboxImg) return;

  currentImageIndex = (index + galleryImages.length) % galleryImages.length;

  lightboxImg.classList.add("is-switching");

  setTimeout(() => {
    lightboxImg.src = galleryImages[currentImageIndex].src;
    lightboxImg.alt =
      galleryImages[currentImageIndex].alt || "Expanded project image";
  }, 120);

  setTimeout(() => {
    lightboxImg.classList.remove("is-switching");
  }, 220);
}

function openLightbox(index) {
  if (!lightbox || !lightboxImg || !galleryImages.length) return;

  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";

  lightboxImg.src = galleryImages[index].src;
  lightboxImg.alt = galleryImages[index].alt || "Expanded project image";
  currentImageIndex = index;
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

function showNextImage() {
  showLightboxImage(currentImageIndex + 1);
}

function showPrevImage() {
  showLightboxImage(currentImageIndex - 1);
}

galleryImages.forEach((img, index) => {
  img.addEventListener("click", () => {
    openLightbox(index);
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightboxNext) {
  lightboxNext.addEventListener("click", showNextImage);
}

if (lightboxPrev) {
  lightboxPrev.addEventListener("click", showPrevImage);
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightbox.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  });

  lightbox.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].screenX;

    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance < 0) {
        showNextImage();
      } else {
        showPrevImage();
      }
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (!lightbox || !lightbox.classList.contains("active")) return;

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowRight") {
    showNextImage();
  }

  if (event.key === "ArrowLeft") {
    showPrevImage();
  }
});

// 🔥 LOTTIE
let lottieInstance = null;

// ===== MODAL ELEMENTS =====
const openModalBtn = document.querySelector("[data-modal-open]");
const closeModalBtn = document.querySelector("[data-modal-close]");
const backdrop = document.querySelector("[data-modal]");
const form = document.querySelector("[data-estimate-form]");
const formWrap = document.querySelector("[data-modal-form-wrap]");
const successMessage = document.querySelector("[data-modal-success]");

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// ===== OPEN =====
function openModal() {
  if (!backdrop) return;

  backdrop.classList.remove("is-hidden");
  document.body.style.overflow = "hidden";

  // повертаємо форму назад
  if (formWrap && successMessage) {
    formWrap.classList.remove("is-hidden");
    successMessage.classList.add("is-hidden");
  }
}

// ===== CLOSE =====
function closeModal() {
  if (!backdrop) return;

  backdrop.classList.add("is-hidden");
  document.body.style.overflow = "";
}

// ===== EVENTS =====
if (openModalBtn) {
  openModalBtn.addEventListener("click", openModal);
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeModal);
}

if (backdrop) {
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      closeModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    backdrop &&
    !backdrop.classList.contains("is-hidden")
  ) {
    closeModal();
  }
});

// ===== FORM SUBMIT =====
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // показати thank you
    if (formWrap && successMessage) {
      formWrap.classList.add("is-hidden");
      successMessage.classList.remove("is-hidden");
    }

    // 🔥 LOTTIE
    const container = document.getElementById("lottie-success");

    if (container) {
      if (!lottieInstance) {
        lottieInstance = lottie.loadAnimation({
          container: container,
          renderer: "svg",
          loop: false,
          autoplay: true,
          path: "https://assets10.lottiefiles.com/packages/lf20_jbrw3hcz.json",
        });
      } else {
        lottieInstance.goToAndPlay(0, true);
      }
    }

    form.reset();

    // 🔥 опціонально — автозакриття
    setTimeout(() => {
      closeModal();
    }, 3000);
  });
}

const serviceCards = document.querySelectorAll(".service-card");
const serviceToggleButtons = document.querySelectorAll("[data-service-toggle]");

serviceToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".service-card");
    if (!card) return;

    card.classList.toggle("is-open");

    button.textContent = card.classList.contains("is-open")
      ? "Show Less"
      : "Learn More";
  });
});

const servicesObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, index * 120);

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  },
);

serviceCards.forEach((card) => {
  servicesObserver.observe(card);
});

const aboutAnimatedItems = document.querySelectorAll(".about-animate");

const aboutObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  },
);

aboutAnimatedItems.forEach((item) => {
  aboutObserver.observe(item);
});

// SWIPER
const swiper = new Swiper(".gallery-swiper", {
  slidesPerView: 3,
  spaceBetween: 30,
  loop: true,

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

const reviewSwiperEl = document.querySelector(".review-swiper");

if (reviewSwiperEl && typeof Swiper !== "undefined") {
  new Swiper(".review-swiper", {
    loop: true,
    slidesPerView: 1,
    speed: 700,
    spaceBetween: 24,

    pagination: {
      el: ".review-pagination",
      clickable: true,
    },

    navigation: {
      nextEl: ".review-next",
      prevEl: ".review-prev",
    },
  });
}
