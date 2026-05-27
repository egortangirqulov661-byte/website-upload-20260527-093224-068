(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");
  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("open");
    });
  }

  Array.prototype.forEach.call(
    document.querySelectorAll("[data-site-search]"),
    function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var query = input ? input.value.trim() : "";
        var target = "./search.html";
        if (query) {
          target += "?q=" + encodeURIComponent(query);
        }
        window.location.href = target;
      });
    },
  );

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(
      hero.querySelectorAll("[data-hero-slide]"),
    );
    var dots = Array.prototype.slice.call(
      hero.querySelectorAll("[data-hero-dot]"),
    );
    var index = 0;
    var timer = null;
    var show = function (next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    };
    var start = function () {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        window.clearInterval(timer);
        show(i);
        start();
      });
    });
    start();
  }

  var filterBar = document.querySelector("[data-filter-bar]");
  if (filterBar) {
    var input = filterBar.querySelector("[data-filter-input]");
    var region = filterBar.querySelector("[data-filter-region]");
    var type = filterBar.querySelector("[data-filter-type]");
    var year = filterBar.querySelector("[data-filter-year]");
    var items = Array.prototype.slice.call(
      document.querySelectorAll(".js-filter-item"),
    );
    var empty = document.querySelector("[data-empty-state]");
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    if (input && initial) {
      input.value = initial;
    }
    var match = function (item) {
      var q = input ? input.value.trim().toLowerCase() : "";
      var r = region ? region.value : "";
      var t = type ? type.value : "";
      var y = year ? year.value : "";
      var hay = (item.getAttribute("data-search") || "").toLowerCase();
      var ok = true;
      if (q) {
        ok = ok && hay.indexOf(q) !== -1;
      }
      if (r) {
        ok = ok && item.getAttribute("data-region") === r;
      }
      if (t) {
        ok = ok && item.getAttribute("data-type") === t;
      }
      if (y) {
        ok = ok && item.getAttribute("data-year") === y;
      }
      return ok;
    };
    var apply = function () {
      var visible = 0;
      items.forEach(function (item) {
        var ok = match(item);
        item.style.display = ok ? "" : "none";
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("show", visible === 0);
      }
    };
    [input, region, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });
    apply();
  }
})();
