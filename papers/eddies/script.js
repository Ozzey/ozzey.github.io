// Eddies project page. Shares its behaviours with the M4PO page: research menu,
// tab groups, the architecture animation toggle, and reduced-motion handling.
// Added here: play overlays on the demo cards and pausing of CSS animations
// (the Eddies architecture SVG animates with keyframes, not SMIL).
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const researchMenu = document.querySelector(".research-menu");
if (researchMenu) {
  document.addEventListener("click", (event) => {
    if (!researchMenu.contains(event.target)) researchMenu.open = false;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && researchMenu.open) {
      researchMenu.open = false;
      researchMenu.querySelector("summary").focus();
    }
  });
}

// Demo stage under the hero: one tab at a time, muted autoplay unless the
// visitor prefers reduced motion, with a Play / Pause button (as on M4PO).
const videoToggle = document.querySelector("#video-toggle");
const stageVideos = [...document.querySelectorAll(".demo-panel video")];
let playbackRequested = !motionPreference.matches;

function currentVideo() {
  return document.querySelector(".demo-panel:not([hidden]) video");
}

function videoUnavailable(video) {
  return Boolean(video.error) || video.dataset.unavailable === "true";
}

function updateVideoButton() {
  const video = currentVideo();
  if (!video || !videoToggle) return;
  videoToggle.disabled = videoUnavailable(video);
  if (videoUnavailable(video)) {
    videoToggle.textContent = "Video unavailable";
    videoToggle.setAttribute("aria-label", "The selected demonstration video is unavailable");
    return;
  }
  videoToggle.textContent = video.paused ? "Play demo ▷" : "Pause demo Ⅱ";
  videoToggle.setAttribute("aria-label", video.paused ? "Play the selected demonstration" : "Pause the selected demonstration");
}

function playVideo(video) {
  if (!video || videoUnavailable(video)) return;
  video.play().catch(() => {
    // Autoplay may be blocked, or the clip may not be available yet.
    updateVideoButton();
  });
}

function selectTab(tab, moveFocus = false) {
  const group = tab.closest("[data-tab-group]");
  group.querySelectorAll('[role="tab"]').forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute("aria-controls")).hidden = !selected;
  });
  if (moveFocus) tab.focus();

  if (group.dataset.tabGroup === "demos") {
    const selectedVideo = currentVideo();
    stageVideos.forEach((video) => {
      if (video !== selectedVideo) video.pause();
    });
    if (playbackRequested && !document.hidden) playVideo(selectedVideo);
    updateVideoButton();
  }
}

document.querySelectorAll("[data-tab-group]").forEach((group) => {
  const tabs = [...group.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(tabs[nextIndex], true);
    });
  });
  // Without JavaScript, all result panels stay visible.
  selectTab(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);
});

stageVideos.forEach((video) => {
  video.addEventListener("play", () => {
    if (video === currentVideo()) playbackRequested = true;
    updateVideoButton();
  });
  video.addEventListener("pause", () => {
    if (video === currentVideo() && !document.hidden) playbackRequested = false;
    updateVideoButton();
  });
  const markUnavailable = () => {
    video.dataset.unavailable = "true";
    updateVideoButton();
  };
  video.addEventListener("error", markUnavailable);
  const source = video.querySelector("source");
  if (source) source.addEventListener("error", markUnavailable);
});

if (videoToggle) {
  videoToggle.hidden = false;
  updateVideoButton();
  videoToggle.addEventListener("click", () => {
    const video = currentVideo();
    if (!video) return;
    playbackRequested = video.paused;
    if (playbackRequested) playVideo(video);
    else video.pause();
  });
}

// Demo cards: a poster with a play overlay; the overlay starts the clip and
// hands over to the native controls. A missing clip leaves the poster in place.
const demoVideos = [...document.querySelectorAll(".demo-media video")];
demoVideos.forEach((video) => {
  const media = video.closest(".demo-media");
  const overlay = media.querySelector(".play-overlay");
  if (!overlay) return;
  overlay.hidden = false;
  video.controls = false;
  const showOverlay = () => {
    overlay.hidden = false;
    video.controls = false;
  };
  const markPending = () => {
    overlay.dataset.state = "pending";
    overlay.querySelector("span").textContent = "Clip coming soon";
    overlay.setAttribute("aria-label", "This clip is not available yet");
    overlay.disabled = true;
  };
  overlay.addEventListener("click", () => {
    demoVideos.forEach((other) => {
      if (other !== video) other.pause();
    });
    video.controls = true;
    overlay.hidden = true;
    video.play().catch(() => showOverlay());
  });
  video.addEventListener("pause", () => {
    if (!video.ended) showOverlay();
  });
  video.addEventListener("ended", showOverlay);
  video.addEventListener("error", markPending);
  const source = video.querySelector("source");
  if (source) source.addEventListener("error", markPending);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    demoVideos.forEach((video) => video.pause());
    stageVideos.forEach((video) => video.pause());
  } else if (playbackRequested) {
    playVideo(currentVideo());
  }
});

// Architecture figure. The SVG animates with CSS keyframes; SMIL is also
// handled in case the diagram is replaced with a SMIL version later.
const architecture = document.querySelector("#architecture");
const architectureToggle = document.querySelector("#architecture-toggle");
const DIAGRAM_END = 13000; // ms: every stage of the 14 s loop is visible here
let diagram;
let diagramDocument;
let diagramPaused = false;

function diagramAnimations() {
  return typeof diagramDocument?.getAnimations === "function" ? diagramDocument.getAnimations() : [];
}

function diagramSupportsPause() {
  return typeof diagram?.pauseAnimations === "function" || diagramAnimations().length > 0;
}

function setArchitecturePaused(paused, seekToEnd = false) {
  if (!diagram) return;
  if (typeof diagram.pauseAnimations === "function" && diagram.animationsPaused() !== paused) {
    if (paused) diagram.pauseAnimations();
    else diagram.unpauseAnimations();
    if (seekToEnd) diagram.setCurrentTime(DIAGRAM_END / 1000);
  }
  diagramAnimations().forEach((animation) => {
    if (paused) {
      animation.pause();
      if (seekToEnd) animation.currentTime = DIAGRAM_END;
    } else {
      animation.play();
    }
  });
  diagramPaused = paused;
  updateArchitectureButton();
}

function updateArchitectureButton() {
  if (!architectureToggle) return;
  architectureToggle.textContent = diagramPaused ? "Play animation" : "Pause animation";
}

function connectArchitecture() {
  if (!architecture) return;
  diagramDocument = architecture.contentDocument;
  diagram = diagramDocument?.documentElement;
  if (!diagramSupportsPause()) return;
  if (motionPreference.matches) setArchitecturePaused(true, true);
  architectureToggle.hidden = false;
  updateArchitectureButton();
}

if (architecture) {
  architecture.addEventListener("load", connectArchitecture);
  connectArchitecture();
}
if (architectureToggle) {
  architectureToggle.addEventListener("click", () => {
    if (!diagram) return;
    setArchitecturePaused(!diagramPaused);
  });
}

motionPreference.addEventListener("change", () => {
  playbackRequested = !motionPreference.matches;
  if (motionPreference.matches) {
    demoVideos.forEach((video) => video.pause());
    stageVideos.forEach((video) => video.pause());
    setArchitecturePaused(true, true);
  } else {
    if (!document.hidden) playVideo(currentVideo());
    setArchitecturePaused(false);
  }
});
