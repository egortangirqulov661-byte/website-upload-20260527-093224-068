function initVideoPlayer(videoId, coverId, source) {
  var video = document.getElementById(videoId);
  var cover = document.getElementById(coverId);
  if (!video || !source) {
    return;
  }
  var ready = false;
  var attach = function () {
    if (ready) {
      return;
    }
    ready = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
  };
  var start = function () {
    attach();
    if (cover) {
      cover.classList.add('hidden');
    }
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  };
  if (cover) {
    cover.addEventListener('click', start);
  }
  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });
  video.addEventListener('play', function () {
    if (cover) {
      cover.classList.add('hidden');
    }
  });
}
