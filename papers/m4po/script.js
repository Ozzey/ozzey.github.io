const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const researchMenu = document.querySelector(".research-menu");
document.addEventListener("click", (event) => {
  if (!researchMenu.contains(event.target)) researchMenu.open = false;
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && researchMenu.open) {
    researchMenu.open = false;
    researchMenu.querySelector("summary").focus();
  }
});
const videoToggle = document.querySelector("#video-toggle");
const videos = [...document.querySelectorAll(".demo-panel video")];
let playbackRequested = !motionPreference.matches;

function currentVideo() {
  return document.querySelector(".demo-panel:not([hidden]) video");
}

function updateVideoButton() {
  const video = currentVideo();
  if (!video) return;
  videoToggle.disabled = Boolean(video.error);
  if (video.error) {
    videoToggle.textContent = "Video unavailable";
    videoToggle.setAttribute("aria-label", "The selected simulation video is unavailable");
    return;
  }
  videoToggle.textContent = video.paused ? "Play demo ▷" : "Pause demo Ⅱ";
  videoToggle.setAttribute("aria-label", video.paused ? "Play the selected simulation demo" : "Pause the selected simulation demo");
}

function playVideo(video) {
  if (!video) return;
  video.play().catch(() => {
    // Autoplay may be blocked by browser or data-saving preferences.
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
    videos.forEach((video) => {
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
  // Without JavaScript, all benchmark tables stay visible and videos have controls.
  selectTab(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);
});

videos.forEach((video) => {
  video.addEventListener("play", () => {
    if (video === currentVideo()) playbackRequested = true;
    updateVideoButton();
  });
  video.addEventListener("pause", () => {
    if (video === currentVideo() && !document.hidden) playbackRequested = false;
    updateVideoButton();
  });
  video.addEventListener("error", updateVideoButton);
});

videoToggle.hidden = false;
videoToggle.addEventListener("click", () => {
  const video = currentVideo();
  playbackRequested = video.paused;
  if (playbackRequested) playVideo(video);
  else video.pause();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) videos.forEach((video) => video.pause());
  else if (playbackRequested) playVideo(currentVideo());
});

const architecture = document.querySelector("#architecture");
const architectureToggle = document.querySelector("#architecture-toggle");
let diagram;

function setArchitecturePaused(paused) {
  if (typeof diagram?.animationsPaused !== "function") return;
  if (diagram.animationsPaused() !== paused) {
    const control = diagram.querySelector("#pause-control");
    if (control) control.dispatchEvent(new Event("click"));
    else if (paused) diagram.pauseAnimations();
    else diagram.unpauseAnimations();
  }
  updateArchitectureButton();
}

function updateArchitectureButton() {
  architectureToggle.textContent = diagram.animationsPaused() ? "Play animation" : "Pause animation";
}

function connectArchitecture() {
  diagram = architecture.contentDocument?.documentElement;
  if (typeof diagram?.pauseAnimations !== "function") return;
  if (motionPreference.matches) {
    diagram.setCurrentTime(26);
    setArchitecturePaused(true);
  }
  architectureToggle.hidden = false;
  updateArchitectureButton();
  // The original SVG also contains its own playback controls.
  diagram.addEventListener("click", () => queueMicrotask(updateArchitectureButton));
  diagram.addEventListener("keydown", () => queueMicrotask(updateArchitectureButton));
}

architecture.addEventListener("load", connectArchitecture);
connectArchitecture();
architectureToggle.addEventListener("click", () => {
  if (!diagram) return;
  setArchitecturePaused(!diagram.animationsPaused());
});

motionPreference.addEventListener("change", () => {
  playbackRequested = !motionPreference.matches;
  if (motionPreference.matches) {
    videos.forEach((video) => video.pause());
    if (typeof diagram?.pauseAnimations === "function") {
      diagram.setCurrentTime(26);
      setArchitecturePaused(true);
    }
  } else {
    if (!document.hidden) playVideo(currentVideo());
    setArchitecturePaused(false);
  }
  if (typeof diagram?.animationsPaused === "function") updateArchitectureButton();
});
