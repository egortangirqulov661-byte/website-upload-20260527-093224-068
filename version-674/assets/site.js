document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();
  setupHeroSlider();
  setupFilters();
});

function setupMobileMenu() {
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-nav]");

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener("click", function () {
    menu.classList.toggle("is-open");
  });
}

function setupHeroSlider() {
  var slider = document.querySelector("[data-hero-slider]");

  if (!slider) {
    return;
  }

  var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
  var next = slider.querySelector("[data-hero-next]");
  var prev = slider.querySelector("[data-hero-prev]");
  var current = 0;
  var timer = null;

  function show(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  }

  function startTimer() {
    stopTimer();
    timer = window.setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  function stopTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  if (next) {
    next.addEventListener("click", function () {
      show(current + 1);
      startTimer();
    });
  }

  if (prev) {
    prev.addEventListener("click", function () {
      show(current - 1);
      startTimer();
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      show(index);
      startTimer();
    });
  });

  slider.addEventListener("mouseenter", stopTimer);
  slider.addEventListener("mouseleave", startTimer);
  startTimer();
}

function setupFilters() {
  var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));

  scopes.forEach(function (scope) {
    var input = scope.querySelector("[data-filter-input]");
    var category = scope.querySelector("[data-filter-category]");
    var year = scope.querySelector("[data-filter-year]");
    var count = scope.querySelector("[data-filter-count]");
    var items = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .rank-row"));

    if (!items.length) {
      return;
    }

    function matchesYear(item, value) {
      var itemYear = String(item.dataset.year || "");

      if (value === "all") {
        return true;
      }

      if (value === "2020s") {
        return /^202\d$/.test(itemYear);
      }

      if (value === "classic") {
        var numericYear = parseInt(itemYear, 10);
        return Number.isFinite(numericYear) && numericYear < 2020;
      }

      return itemYear === value;
    }

    function update() {
      var keyword = input ? input.value.trim().toLowerCase() : "";
      var categoryValue = category ? category.value : "all";
      var yearValue = year ? year.value : "all";
      var visible = 0;

      items.forEach(function (item) {
        var text = String(item.dataset.search || item.textContent || "").toLowerCase();
        var categoryMatch = categoryValue === "all" || item.dataset.category === categoryValue;
        var yearMatch = matchesYear(item, yearValue);
        var keywordMatch = !keyword || text.indexOf(keyword) !== -1;
        var shouldShow = categoryMatch && yearMatch && keywordMatch;

        item.classList.toggle("is-hidden", !shouldShow);

        if (shouldShow) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = "显示 " + visible + " / " + items.length + " 条";
      }
    }

    [input, category, year].forEach(function (control) {
      if (control) {
        control.addEventListener("input", update);
        control.addEventListener("change", update);
      }
    });

    update();
  });
}
