(function () {
  var video = document.querySelector("[data-player]");
  var button = document.querySelector("[data-play-button]");
  var overlay = document.querySelector("[data-player-overlay]");
  if (!video || !button) {
    return;
  }
  var source = video.getAttribute("data-play-src");
  var loaded = false;
  var hlsInstance = null;
  var loadVideo = function () {
    if (!loaded) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
      loaded = true;
    }
    video.controls = true;
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
    var started = video.play();
    if (started && started.catch) {
      started.catch(function () {});
    }
  };
  button.addEventListener("click", loadVideo);
  if (overlay) {
    overlay.addEventListener("click", loadVideo);
  }
  video.addEventListener("click", function () {
    if (!loaded) {
      loadVideo();
    }
  });
  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
