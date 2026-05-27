(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobileNav = document.querySelector("[data-mobile-nav]");
  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
      menuButton.textContent = mobileNav.classList.contains("is-open") ? "×" : "☰";
    });
  }

  var carousel = document.querySelector("[data-hero-carousel]");
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
    var index = 0;
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
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });
    setInterval(function () {
      show(index + 1);
    }, 5600);
  }

  var searchInput = document.querySelector("[data-search-input]");
  var typeFilter = document.querySelector("[data-type-filter]");
  var yearFilter = document.querySelector("[data-year-filter]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
  var runFilter = function () {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var type = typeFilter ? typeFilter.value : "";
    var year = yearFilter ? yearFilter.value : "";
    cards.forEach(function (card) {
      var text = (card.getAttribute("data-title") || "").toLowerCase();
      var cardType = card.getAttribute("data-type") || "";
      var cardYear = card.getAttribute("data-year") || "";
      var ok = true;
      if (query && text.indexOf(query) === -1) {
        ok = false;
      }
      if (type && cardType !== type) {
        ok = false;
      }
      if (year && cardYear !== year) {
        ok = false;
      }
      card.classList.toggle("is-hidden", !ok);
    });
  };
  [searchInput, typeFilter, yearFilter].forEach(function (el) {
    if (el) {
      el.addEventListener("input", runFilter);
      el.addEventListener("change", runFilter);
    }
  });
})();
