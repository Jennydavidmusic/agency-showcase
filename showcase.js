(() => {
  const videos = Array.from(document.querySelectorAll('.managed-video'));
  const buttons = Array.from(document.querySelectorAll('.video-play-button'));

  const pauseOthers = (activeVideo) => {
    videos.forEach((video) => {
      if (video !== activeVideo && !video.paused) video.pause();
    });
  };

  const buttonFor = (video) =>
    buttons.find((button) => button.dataset.videoTarget === video.id);

  buttons.forEach((button) => {
    const video = document.getElementById(button.dataset.videoTarget);
    if (!video) return;

    button.addEventListener('click', async () => {
      pauseOthers(video);

      if (video.paused) {
        try {
          await video.play();
        } catch (error) {
          console.warn('Video playback could not start.', error);
        }
      } else {
        video.pause();
      }
    });
  });

  videos.forEach((video) => {
    const button = buttonFor(video);

    video.addEventListener('play', () => {
      pauseOthers(video);
      if (button) button.classList.add('is-playing');
    });

    video.addEventListener('pause', () => {
      if (button) button.classList.remove('is-playing');
    });

    video.addEventListener('ended', () => {
      video.currentTime = 0;
      video.load();
      if (button) button.classList.remove('is-playing');
    });

    video.addEventListener('click', () => {
      if (video.paused) {
        pauseOthers(video);
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  });
})();


// Click anywhere on a video to toggle play/pause.
document.querySelectorAll("video").forEach((video) => {
  video.addEventListener("click", (event) => {
    // Ignore clicks on native controls area where the browser handles them.
    const rect = video.getBoundingClientRect();
    const y = event.clientY - rect.top;

    if (video.paused) {
      document.querySelectorAll("video").forEach((other) => {
        if (other !== video) other.pause();
      });
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
});
