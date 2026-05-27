(function () {
  var players = Array.prototype.slice.call(
    document.querySelectorAll("[data-video-player]"),
  );
  if (!players.length) {
    return;
  }

  players.forEach(function (player) {
    var video = player.querySelector("video");
    var playButtons = Array.prototype.slice.call(
      player.querySelectorAll("[data-play], [data-play-small]"),
    );
    var muteButton = player.querySelector("[data-mute]");
    var fullscreenButton = player.querySelector("[data-fullscreen]");
    var state = player.querySelector("[data-player-state]");
    var address = player.getAttribute("data-video");
    var hls = null;

    var setState = function (text, ready) {
      if (!state) {
        return;
      }
      state.textContent = text;
      state.classList.toggle("ready", Boolean(ready));
    };

    var attach = function () {
      if (!video || !address) {
        setState("视频暂时无法加载", false);
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(address);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setState("", true);
        });
        hls.on(window.Hls.Events.ERROR, function (_, data) {
          if (data && data.fatal) {
            setState("视频暂时无法加载", false);
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = address;
        video.addEventListener("loadedmetadata", function () {
          setState("", true);
        });
      } else {
        setState("视频暂时无法加载", false);
      }
    };

    var togglePlay = function () {
      if (!video) {
        return;
      }
      if (video.paused) {
        video.play().catch(function () {
          setState("点击后开始播放", false);
        });
      } else {
        video.pause();
      }
    };

    playButtons.forEach(function (button) {
      button.addEventListener("click", togglePlay);
    });

    if (video) {
      video.addEventListener("click", togglePlay);
      video.addEventListener("play", function () {
        player.classList.add("playing");
      });
      video.addEventListener("pause", function () {
        player.classList.remove("playing");
      });
      video.addEventListener("canplay", function () {
        setState("", true);
      });
    }

    if (muteButton && video) {
      muteButton.addEventListener("click", function () {
        video.muted = !video.muted;
        muteButton.textContent = video.muted ? "取消静音" : "静音";
      });
    }

    if (fullscreenButton) {
      fullscreenButton.addEventListener("click", function () {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (player.requestFullscreen) {
          player.requestFullscreen();
        }
      });
    }

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });

    attach();
  });
})();
