const header = document.getElementById("header");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section, footer");

const testimonials = [
    {
        name: "Ethan Carter",
        role: "Independent Filmmaker",
        image: "images/ben-tofan-liy0P6AmGPM-unsplash.jpg",
        alt: "Portrait of Ethan Carter",
        quote:
            '"Lens Studio made it easy to showcase my work in a clean and professional way. The launch felt seamless, and the experience feels modern and intuitive."'
    },
    {
        name: "Maya Brooks",
        role: "Creative Producer",
        image: "images/good-faces-Fq3HyxbZV1E-unsplash.jpg",
        alt: "Portrait of Maya Brooks",
        quote:
            '"The layout feels elevated and clear. It gives our visuals room to breathe while still making the whole experience feel polished and intentional."'
    },
    {
        name: "Noah Bennett",
        role: "Video Director",
        image: "images/ana-nichita-BI91NrppE38-unsplash.jpg",
        alt: "Portrait of Noah Bennett",
        quote:
            '"From the first scroll, the presentation felt cinematic. Lens Studio helped our projects feel organized, memorable, and ready to share with clients."'
    }
];

const quoteElement = document.getElementById("testimonial-quote");
const authorAvatarElement = document.getElementById("author-avatar");
const authorNameElement = document.getElementById("author-name");
const authorRoleElement = document.getElementById("author-role");
const prevButton = document.getElementById("prev-testimonial");
const nextButton = document.getElementById("next-testimonial");
const projectForm = document.getElementById("project-form");
const projectMediaInput = document.getElementById("project-media-input");
const uploadStatusText = document.getElementById("upload-status-text");
const uploadProgressFill = document.getElementById("upload-progress-fill");
const cancelProjectButton = document.getElementById("cancel-project");
const contactForm = document.getElementById("contact-form");
const contactFormStatus = document.getElementById("contact-form-status");
const isStaticHeader = header.classList.contains("site-header-static");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let currentTestimonial = 0;

function updateHeaderState() {
    if (isStaticHeader) {
        return;
    }

    header.classList.toggle("scrolled", window.scrollY > 24);
}

function setActiveLink() {
    if (!sections.length) {
        return;
    }

    const scrollPosition = window.scrollY + 180;

    sections.forEach((section) => {
        if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
            const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);

            navLinks.forEach((link) => link.classList.remove("active"));

            if (activeLink) {
                activeLink.classList.add("active");
            }
        }
    });
}

function renderTestimonial(index) {
    if (!quoteElement || !authorAvatarElement || !authorNameElement || !authorRoleElement) {
        return;
    }

    const testimonial = testimonials[index];
    quoteElement.textContent = testimonial.quote;
    quoteElement.dataset.splitReady = "false";
    quoteElement.classList.remove("split-text", "is-visible");
    prepareSplitText(quoteElement);
    requestAnimationFrame(() => {
        quoteElement.classList.add("is-visible");
    });
    authorAvatarElement.src = testimonial.image;
    authorAvatarElement.alt = testimonial.alt;
    authorNameElement.textContent = testimonial.name;
    authorRoleElement.textContent = testimonial.role;
}

function stepTestimonial(direction) {
    currentTestimonial = (currentTestimonial + direction + testimonials.length) % testimonials.length;
    renderTestimonial(currentTestimonial);
}

function updateUploadStatus(file) {
    if (!uploadStatusText || !uploadProgressFill) {
        return;
    }

    if (!file) {
        uploadStatusText.textContent = "No file selected...";
        uploadProgressFill.style.width = "0%";
        return;
    }

    uploadStatusText.textContent = `${file.name} ready to publish`;
    uploadProgressFill.style.width = "100%";
}

function prepareSplitText(element) {
    if (!element || reduceMotion || element.dataset.splitReady === "true") {
        return;
    }

    const text = element.textContent.trim();
    element.textContent = "";
    element.classList.add("split-text", "motion-reveal");

    let charIndex = 0;

    text.split(" ").forEach((word, wordIndex, words) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "split-word";

        [...word].forEach((char) => {
            const charSpan = document.createElement("span");
            charSpan.className = "split-char";
            charSpan.style.setProperty("--char-index", charIndex);
            charSpan.textContent = char;
            wordSpan.appendChild(charSpan);
            charIndex += 1;
        });

        element.appendChild(wordSpan);

        if (wordIndex < words.length - 1) {
            element.appendChild(document.createTextNode(" "));
        }
    });

    element.dataset.splitReady = "true";
}

function setupMotionSystem() {
    const splitTargets = document.querySelectorAll(
        ".hero-main h1, .section-title, .add-project-title, .contact-page-title, .selected-project-title, .next-project-title, .testimonial-quote"
    );

    splitTargets.forEach((element) => prepareSplitText(element));

    const revealTargets = [
        ...document.querySelectorAll(
            ".hero-copy, .hero-meta, .about-copy, .about-media-block, .project-showcase, .testimonial-card, .footer-intro, .footer-links, .footer-bottom, .add-project-grid, .contact-page-grid, .selected-project-topbar, .selected-project-media, .selected-project-info-grid, .next-project-block"
        )
    ];

    revealTargets.forEach((element, index) => {
        element.classList.add("motion-reveal");
        element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
    });

    if (reduceMotion) {
        document.querySelectorAll(".motion-reveal").forEach((element) => {
            element.classList.add("is-visible");
        });
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    document.querySelectorAll(".motion-reveal").forEach((element) => observer.observe(element));
}

function initializePageMotion() {
    requestAnimationFrame(() => {
        document.body.classList.add("is-loaded");
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        if (!targetId || !targetId.startsWith("#")) {
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

if (prevButton && nextButton) {
    prevButton.addEventListener("click", () => stepTestimonial(-1));
    nextButton.addEventListener("click", () => stepTestimonial(1));
}

if (projectMediaInput) {
    projectMediaInput.addEventListener("change", () => {
        const [file] = projectMediaInput.files;
        updateUploadStatus(file);
    });
}

if (cancelProjectButton && projectForm) {
    cancelProjectButton.addEventListener("click", () => {
        projectForm.reset();
        updateUploadStatus(null);
    });
}

if (projectForm) {
    projectForm.addEventListener("submit", (event) => {
        event.preventDefault();
        uploadStatusText.textContent = "Project published successfully.";
        uploadProgressFill.style.width = "100%";
    });
}

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        contactFormStatus.textContent = "Message sent successfully.";
        contactForm.reset();
    });
}

let ticking = false;

window.addEventListener("scroll", () => {
    if (ticking) {
        return;
    }

    ticking = true;

    requestAnimationFrame(() => {
        updateHeaderState();
        setActiveLink();
        ticking = false;
    });
});

if (quoteElement) {
    renderTestimonial(currentTestimonial);
}

if (projectForm) {
    updateUploadStatus(null);
}

setupMotionSystem();
initializePageMotion();
updateHeaderState();
setActiveLink();
