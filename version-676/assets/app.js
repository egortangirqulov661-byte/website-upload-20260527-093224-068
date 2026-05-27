(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));

  searchInputs.forEach(function (input) {
    var scope = input.closest("main") || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
    var empty = scope.querySelector("[data-search-empty]");

    input.addEventListener("input", function () {
      var value = input.value.trim().toLowerCase();
      var visible = 0;

      cards.forEach(function (card) {
        var data = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
        var matched = !value || data.indexOf(value) !== -1;
        card.classList.toggle("is-hidden", !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    });
  });

  var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

  players.forEach(function (player) {
    var video = player.querySelector("video");
    var overlay = player.querySelector("[data-player-overlay]");
    var button = player.querySelector("[data-play-button]");
    var source = player.getAttribute("data-source");
    var ready = false;

    function prepareVideo() {
      if (ready || !video || !source) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        player.hlsInstance = hls;
      } else {
        video.src = source;
      }

      ready = true;
    }

    function startVideo() {
      prepareVideo();

      if (overlay) {
        overlay.classList.add("is-hidden");
      }

      if (video) {
        var playTask = video.play();

        if (playTask && typeof playTask.catch === "function") {
          playTask.catch(function () {});
        }
      }
    }

    if (overlay) {
      overlay.addEventListener("click", startVideo);
    }

    if (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        startVideo();
      });
    }

    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          startVideo();
        }
      });
    }
  });
})();
