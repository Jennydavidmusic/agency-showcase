document.addEventListener("DOMContentLoaded", () => {
  const videos = Array.from(document.querySelectorAll(".managed-video"));
  const playButtons = Array.from(document.querySelectorAll("[data-video-target]"));

  const getContainer = (video) =>
    video.closest(".showreel-player, .short-frame");

  const getPlayButton = (video) =>
    document.querySelector(`[data-video-target="${video.id}"]`);

  const showPosterState = (video) => {
    const button = getPlayButton(video);
    const container = getContainer(video);

    video.pause();
    video.currentTime = 0;
    video.removeAttribute("controls");
    video.load();

    button?.classList.remove("is-hidden");
    container?.classList.remove("is-playing");
  };

  const showPlayingState = (video) => {
    const button = getPlayButton(video);
    const container = getContainer(video);

    video.setAttribute("controls", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    button?.classList.add("is-hidden");
    container?.classList.add("is-playing");
  };

  const stopOtherVideos = (activeVideo) => {
    videos.forEach((video) => {
      if (video !== activeVideo) {
        showPosterState(video);
      }
    });
  };

  const playVideo = async (video) => {
    stopOtherVideos(video);
    showPlayingState(video);

    try {
      await video.play();
    } catch (error) {
      console.warn("Video playback could not start.", error);
      showPosterState(video);
    }
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
    // État initial : vignette + bouton Play, sans contrôles.
    showPosterState(video);

    // Si la lecture démarre depuis les contrôles natifs,
    // les autres vidéos sont remises à leur vignette.
    video.addEventListener("play", () => {
      stopOtherVideos(video);
      showPlayingState(video);
    });

    // Pause manuelle : on laisse l'image arrêtée et les contrôles visibles.
    // Aucun clic personnalisé n'intercepte les boutons natifs.
    video.addEventListener("pause", () => {
      const container = getContainer(video);
      container?.classList.remove("is-playing");
    });

    // Fin : retour complet à la vignette et au bouton Play.
    video.addEventListener("ended", () => {
      showPosterState(video);
    });
  });
});
