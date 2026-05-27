(function () {
    const toggle = document.querySelector("[data-menu-toggle]");
    const mobileNav = document.querySelector("[data-mobile-nav]");
    if (toggle && mobileNav) {
        toggle.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    const hero = document.querySelector("[data-hero]");
    if (hero) {
        const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
        let index = 0;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
            });
        });
        if (slides.length > 1) {
            setInterval(function () {
                show(index + 1);
            }, 5200);
        }
    }

    const filterForms = Array.from(document.querySelectorAll("[data-filter-form]"));
    filterForms.forEach(function (form) {
        const input = form.querySelector("[data-filter-input]");
        const yearSelect = form.querySelector("[data-filter-year]");
        const categorySelect = form.querySelector("[data-filter-category]");
        const list = document.querySelector("[data-card-list]");
        const status = document.querySelector("[data-filter-status]");
        if (!list) {
            return;
        }
        const cards = Array.from(list.querySelectorAll(".movie-card"));
        const params = new URLSearchParams(window.location.search);
        const query = params.get("q");
        if (query && input) {
            input.value = query;
        }
        function applyFilter() {
            const keyword = input ? input.value.trim().toLowerCase() : "";
            const year = yearSelect ? yearSelect.value : "";
            const category = categorySelect ? categorySelect.value : "";
            let count = 0;
            cards.forEach(function (card) {
                const haystack = [
                    card.dataset.title || "",
                    card.dataset.year || "",
                    card.dataset.category || "",
                    card.dataset.genre || "",
                    card.dataset.region || "",
                    card.textContent || ""
                ].join(" ").toLowerCase();
                const matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                const matchedYear = !year || card.dataset.year === year;
                const matchedCategory = !category || card.dataset.category === category;
                const visible = matchedKeyword && matchedYear && matchedCategory;
                card.classList.toggle("is-filter-hidden", !visible);
                if (visible) {
                    count += 1;
                }
            });
            if (status) {
                status.textContent = "当前显示 " + count + " 部影片";
            }
        }
        [input, yearSelect, categorySelect].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilter);
                control.addEventListener("change", applyFilter);
            }
        });
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            applyFilter();
        });
        applyFilter();
    });
})();
