document.addEventListener("DOMContentLoaded", function () {
  var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

  players.forEach(function (shell) {
    var video = shell.querySelector("video[data-src]");
    var button = shell.querySelector("[data-player-start]");
    var hasStarted = false;

    if (!video || !button) {
      return;
    }

    function markPlaying() {
      button.classList.add("is-hidden");
      button.classList.remove("is-loading");
    }

    function markError() {
      button.classList.remove("is-hidden");
      button.classList.remove("is-loading");
      button.querySelector("strong").textContent = "播放源加载失败，点击重试";
    }

    function playVideo() {
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          button.classList.remove("is-hidden");
        });
      }
    }

    function start() {
      var source = video.dataset.src;

      if (!source) {
        return;
      }

      button.classList.add("is-loading");

      if (hasStarted) {
        markPlaying();
        playVideo();
        return;
      }

      hasStarted = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.addEventListener("loadedmetadata", function () {
          markPlaying();
          playVideo();
        }, { once: true });
        video.addEventListener("error", markError, { once: true });
        video.load();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });

        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          markPlaying();
          playVideo();
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            hls.destroy();
            markError();
          }
        });
        return;
      }

      video.src = source;
      video.addEventListener("loadedmetadata", function () {
        markPlaying();
        playVideo();
      }, { once: true });
      video.addEventListener("error", markError, { once: true });
      video.load();
    }

    button.addEventListener("click", start);
    video.addEventListener("play", markPlaying);
  });

  var scrollButtons = Array.prototype.slice.call(document.querySelectorAll("[data-scroll-player]"));

  scrollButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      var player = document.querySelector("[data-player]");

      if (player) {
        event.preventDefault();
        player.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });
});
