document.addEventListener("DOMContentLoaded", () => {
  const videos = Array.from(
    document.querySelectorAll(".managed-video")
  );

  const playButtons = Array.from(
    document.querySelectorAll("[data-video-target]")
  );


  function getContainer(video) {
    return video.closest(".showreel-player, .short-frame");
  }


  function getPlayButton(video) {
    return document.querySelector(
      `[data-video-target="${video.id}"]`
    );
  }


  function showPlayButton(video) {
    const button = getPlayButton(video);

    if (button) {
      button.classList.remove("is-hidden");
    }

    const container = getContainer(video);

    if (container) {
      container.classList.remove("is-playing");
    }
  }


  function hidePlayButton(video) {
    const button = getPlayButton(video);

    if (button) {
      button.classList.add("is-hidden");
    }

    const container = getContainer(video);

    if (container) {
      container.classList.add("is-playing");
    }
  }


  function stopOtherVideos(activeVideo) {
    videos.forEach((video) => {
      if (video === activeVideo) {
        return;
      }

      if (!video.paused) {
        video.pause();
      }

      showPlayButton(video);
    });
  }


  async function playVideo(video) {
    stopOtherVideos(video);

    try {
      await video.play();
      hidePlayButton(video);
    } catch (error) {
      console.warn("Video playback could not start.", error);
    }
  }


  function pauseVideo(video) {
    video.pause();
    showPlayButton(video);
  }


  playButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const videoId = button.dataset.videoTarget;
      const video = document.getElementById(videoId);

      if (!video) {
        return;
      }

      playVideo(video);
    });
  });


  videos.forEach((video) => {
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


    /*
      Sur mobile et ordinateur :
      toucher ou cliquer sur l’image de la vidéo
      met en pause ou reprend la lecture.
    */
    video.addEventListener("click", (event) => {
      /*
        On évite de bloquer les contrôles natifs
        situés dans la partie basse de la vidéo.
      */
      const rectangle = video.getBoundingClientRect();
      const clickPositionY = event.clientY - rectangle.top;
      const controlsAreaHeight = 55;

      const clickedOnControls =
        clickPositionY > rectangle.height - controlsAreaHeight;

      if (clickedOnControls) {
        return;
      }

      event.preventDefault();

      if (video.paused) {
        playVideo(video);
      } else {
        pauseVideo(video);
      }
    });


    /*
      Sécurité supplémentaire pour iPhone/iPad.
    */
    video.addEventListener(
      "touchend",
      (event) => {
        const rectangle = video.getBoundingClientRect();
        const touch = event.changedTouches[0];

        if (!touch) {
          return;
        }

        const touchPositionY =
          touch.clientY - rectangle.top;

        const controlsAreaHeight = 55;

        const touchedControls =
          touchPositionY >
          rectangle.height - controlsAreaHeight;

        if (touchedControls) {
          return;
        }

        event.preventDefault();

        if (video.paused) {
          playVideo(video);
        } else {
          pauseVideo(video);
        }
      },
      {
        passive: false
      }
    );
  });
});
