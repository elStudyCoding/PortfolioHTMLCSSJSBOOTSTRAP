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

const frame = document.getElementById("profileFrame");
if (frame) {
    enableTilt(frame, 12, 0);
}

document.querySelectorAll(".card").forEach((card) => {
    enableTilt(card, 10, 6);
});

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
