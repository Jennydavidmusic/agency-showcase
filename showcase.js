document.addEventListener("DOMContentLoaded", () => {
  const videos = Array.from(document.querySelectorAll(".managed-video"));
  const playButtons = Array.from(document.querySelectorAll("[data-video-target]"));

  const getContainer = (video) =>
    video.closest(".showreel-player, .short-frame");

  const getPlayButton = (video) =>
    document.querySelector(`[data-video-target="${video.id}"]`);

  const showPlayButton = (video) => {
    const button = getPlayButton(video);
    const container = getContainer(video);

    button?.classList.remove("is-hidden");
    container?.classList.remove("is-playing");

    // Les contrôles restent cachés avant lecture.
    video.removeAttribute("controls");
  };

  const hidePlayButton = (video) => {
    const button = getPlayButton(video);
    const container = getContainer(video);

    button?.classList.add("is-hidden");
    container?.classList.add("is-playing");

    // Les contrôles apparaissent dès que la vidéo démarre.
    video.setAttribute("controls", "");
  };

  const stopOtherVideos = (activeVideo) => {
    videos.forEach((video) => {
      if (video === activeVideo) return;

      if (!video.paused) {
        video.pause();
      }

      showPlayButton(video);
    });
  };

  const playVideo = async (video) => {
    stopOtherVideos(video);

    try {
      // playsInline évite le plein écran automatique sur iPhone.
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");

      await video.play();
      hidePlayButton(video);
    } catch (error) {
      console.warn("Video playback could not start.", error);
    }
  };

  const pauseVideo = (video) => {
    video.pause();
    showPlayButton(video);
  };

  playButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const video = document.getElementById(button.dataset.videoTarget);
      if (video) playVideo(video);
    });
  });

  videos.forEach((video) => {
    // Au chargement : vignette + bouton Play, sans contrôles.
    showPlayButton(video);

    video.addEventListener("play", () => {
      stopOtherVideos(video);
      hidePlayButton(video);
    });

    video.addEventListener("pause", () => {
      showPlayButton(video);
    });

    video.addEventListener("ended", () => {
      video.pause();
      video.currentTime = 0;
      video.load();
      showPlayButton(video);
    });

    // Clic ou toucher sur l'image : lecture/pause.
    video.addEventListener("click", (event) => {
      const rect = video.getBoundingClientRect();
      const y = event.clientY - rect.top;
      const controlsAreaHeight = 60;

      // Laisse les contrôles natifs fonctionner en bas de la vidéo.
      if (y > rect.height - controlsAreaHeight) return;

      event.preventDefault();

      if (video.paused) {
        playVideo(video);
      } else {
        pauseVideo(video);
      }
    });

    // Sécurité iPhone/iPad.
    video.addEventListener(
      "touchend",
      (event) => {
        const touch = event.changedTouches[0];
        if (!touch) return;

        const rect = video.getBoundingClientRect();
        const y = touch.clientY - rect.top;
        const controlsAreaHeight = 60;

        if (y > rect.height - controlsAreaHeight) return;

        event.preventDefault();

        if (video.paused) {
          playVideo(video);
        } else {
          pauseVideo(video);
        }
      },
      { passive: false }
    );
  });
});
