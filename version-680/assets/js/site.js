(function () {
  var button = document.querySelector('[data-menu-button]');
  var panel = document.querySelector('[data-mobile-panel]');
  if (button && panel) {
    button.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var show = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        show(current + 1);
      }, 5200);
    }
  }

  var searchPage = document.querySelector('[data-search-page]');
  if (searchPage) {
    var input = searchPage.querySelector('[data-search-input]');
    var yearFilter = searchPage.querySelector('[data-year-filter]');
    var typeFilter = searchPage.querySelector('[data-type-filter]');
    var cards = Array.prototype.slice.call(searchPage.querySelectorAll('.movie-card'));
    var apply = function () {
      var q = (input.value || '').trim().toLowerCase();
      var year = yearFilter.value;
      var type = typeFilter.value;
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-text')
        ].join(' ').toLowerCase();
        var ok = (!q || haystack.indexOf(q) !== -1) && (!year || card.getAttribute('data-year') === year) && (!type || card.getAttribute('data-type') === type);
        card.style.display = ok ? '' : 'none';
      });
    };
    input.addEventListener('input', apply);
    yearFilter.addEventListener('change', apply);
    typeFilter.addEventListener('change', apply);
  }
})();
