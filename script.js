const loginOverlay = document.getElementById("loginOverlay");
const portfolioContent = document.getElementById("portfolioContent");
const loginStartButton = document.getElementById("loginStartButton");
const loginStatus = document.getElementById("loginStatus");
const loginProgressBar = document.getElementById("loginProgressBar");
const loginPanel = document.querySelector(".login-panel");
const loginSpacer = document.getElementById("loginSpacer");
const urlParams = new URLSearchParams(window.location.search);

const unlockPortfolio = () => {
    if (loginOverlay) {
        loginOverlay.classList.add("hidden");
        loginOverlay.setAttribute("aria-hidden", "true");
    }
    if (portfolioContent) {
        portfolioContent.classList.add("is-visible");
        portfolioContent.setAttribute("aria-hidden", "false");
    }
    if (loginSpacer) {
        loginSpacer.classList.add("collapse");
        window.setTimeout(() => {
            loginSpacer.remove();
        }, 540);
    }
    document.body.style.overflowY = "auto";
    sessionStorage.setItem("portfolioUnlocked", "1");
};

if (urlParams.get("skipLogin") === "1") {
    unlockPortfolio();
} else if (sessionStorage.getItem("portfolioUnlocked") === "1") {
    unlockPortfolio();
} else {
    document.body.style.overflowY = "hidden";
    if (loginStartButton) {
        loginStartButton.addEventListener("click", () => {
            if (loginPanel) {
                loginPanel.classList.add("is-loading");
            }
            if (loginStatus) {
                loginStatus.textContent = "Status: Memproses login...";
            }
            if (loginProgressBar) {
                loginProgressBar.style.width = "100%";
            }
            window.setTimeout(() => {
                if (loginStatus) {
                    loginStatus.textContent = "Status: Akses diterima";
                }
                document.body.style.overflowY = "auto";
                if (loginOverlay) {
                    loginOverlay.classList.add("exiting");
                }
                if (portfolioContent) {
                    window.scrollTo({
                        top: portfolioContent.offsetTop,
                        behavior: "smooth"
                    });
                }
                window.setTimeout(() => {
                    unlockPortfolio();
                }, 620);
            }, 1100);
        });
    }
}

function enableTilt(el, strength, moveX) {
    el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;
        const rotateX = (-dy * strength).toFixed(2);
        const rotateY = (dx * strength).toFixed(2);
        const move = (dx * moveX).toFixed(2);
        el.style.transform = `translateY(-2px) translateX(${move}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    el.addEventListener("mouseleave", () => {
        el.style.transform = "translateY(0) translateX(0) rotateX(0deg) rotateY(0deg)";
    });
}

const isTouch = window.matchMedia("(hover: none)").matches;

const frame = document.getElementById("profileFrame");
if (!isTouch && frame) {
    enableTilt(frame, 12, 0);
}

if (!isTouch) {
    document.querySelectorAll(".card").forEach((card) => {
        enableTilt(card, 10, 6);
    });

    document.querySelectorAll("#sertifikat .cert-card").forEach((certCard) => {
        enableTilt(certCard, 9, 4);
    });
}

if (document.body.classList.contains("page-home")) {
    const certItems = Array.from(document.querySelectorAll("#sertifikat [data-cert-item]"));
    const certMoreLink = document.getElementById("certMoreLink");
    const maxShown = 4;

    if (certItems.length > maxShown) {
        certItems.slice(maxShown).forEach((item) => {
            item.classList.add("d-none");
        });
        if (certMoreLink) {
            certMoreLink.classList.remove("d-none");
        }
    }
}

const ticker = document.querySelector(".ticker");
const tickerTrack = document.querySelector(".ticker-track");
if (ticker && tickerTrack) {
    let lastDirection = "normal";
    tickerTrack.style.animationDirection = lastDirection;

    ticker.addEventListener("mousemove", (e) => {
        const rect = ticker.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const direction = x < rect.width / 2 ? "reverse" : "normal";
        lastDirection = direction;
        tickerTrack.style.animationDirection = direction;

        const items = tickerTrack.querySelectorAll(".ticker-item");
        items.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            const dx = (e.clientX - itemCenter) / 120;
            const swing = Math.max(-1, Math.min(1, dx));
            const directionFlip = index % 2 === 0 ? 1 : -1;
            const rotate = swing * 12 * directionFlip;
            const lift = swing * -8 * directionFlip;
            item.style.transform = `translateY(${lift.toFixed(2)}px) rotate(${rotate.toFixed(2)}deg)`;

            const dist = Math.abs(e.clientX - itemCenter);
            if (dist < 80) {
                item.classList.add("pop");
            } else {
                item.classList.remove("pop");
            }
        });
    });

    ticker.addEventListener("mouseleave", () => {
        tickerTrack.style.animationDirection = lastDirection;
        tickerTrack.querySelectorAll(".ticker-item").forEach((item) => {
            item.style.transform = "translateY(0) rotate(0deg)";
            item.classList.remove("pop");
        });
    });
}

const modeToggle = document.getElementById("modeToggle");
if (modeToggle) {
    const syncModeLabel = () => {
        modeToggle.textContent = document.body.classList.contains("dark")
            ? "Light Mode"
            : "Dark Mode";
    };
    syncModeLabel();
    modeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        syncModeLabel();
    });
}

const heroName = document.getElementById("heroName");
const heroNameText = document.getElementById("heroNameText");
if (heroName && heroNameText) {
    const fullText = heroName.getAttribute("data-full") || heroNameText.textContent || "";
    let index = 0;
    let deleting = false;

    const typeLoop = () => {
        heroNameText.textContent = fullText.slice(0, index);
        if (!deleting && index < fullText.length) {
            index += 1;
        } else if (!deleting && index === fullText.length) {
            deleting = true;
        } else if (deleting && index > 0) {
            index -= 1;
        } else {
            deleting = false;
        }
        const delay = deleting ? 80 : 120;
        setTimeout(typeLoop, index === fullText.length ? 900 : delay);
    };

    typeLoop();

    if (!isTouch) {
        heroName.addEventListener("mousemove", (e) => {
            const rect = heroName.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const dx = (x - cx) / cx;
            const dy = (y - cy) / cy;
            const rotateX = (-dy * 8).toFixed(2);
            const rotateY = (dx * 8).toFixed(2);
            heroName.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            heroName.style.textShadow = "0 8px 18px rgba(17, 17, 17, 0.18)";
        });

        heroName.addEventListener("mouseleave", () => {
            heroName.style.transform = "rotateX(0deg) rotateY(0deg)";
            heroName.style.textShadow = "none";
        });
    }
}
const certModal = document.getElementById("certModal");
const certModalImg = document.getElementById("certModalImg");
if (certModal && certModalImg) {
    document.querySelectorAll(".cert-img").forEach((img) => {
        img.addEventListener("click", () => {
            certModalImg.src = img.src;
            certModal.classList.add("show");
            certModal.setAttribute("aria-hidden", "false");
        });
    });

    const closeModal = () => {
        certModal.classList.remove("show");
        certModal.setAttribute("aria-hidden", "true");
        certModalImg.src = "";
    };

    certModal.addEventListener("click", (e) => {
        if (e.target === certModal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    });
}

document.querySelectorAll(".quick-nav-links a").forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
        const targetId = anchor.getAttribute("href");
        if (!targetId || !targetId.startsWith("#")) {
            return;
        }
        const section = document.querySelector(targetId);
        if (!section) {
            return;
        }
        e.preventDefault();
        section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});
