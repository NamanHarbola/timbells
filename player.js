// ===== TIM BELLS — MUSIC PLAYER + WHATSAPP WIDGET =====
// Music keeps playing across page navigation using sessionStorage to
// remember "was playing" + "current time". Browsers block autoplay-with-
// sound, so we autoplay muted first, then unmute the instant the visitor
// interacts (click/tap/scroll) anywhere on the page — no extra click needed.

(function () {
  const MUSIC_SRC = 'music/lover-instrumental.mp3';
  const STORAGE_KEY = 'tb_music_state'; // { playing: bool, time: number, muted: bool }

  function getState() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || { playing: false, time: 0, muted: true };
    } catch (e) {
      return { playing: false, time: 0, muted: true };
    }
  }

  function saveState(state) {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function initPlayer() {
    const audio = document.getElementById('bgMusic');
    const disc = document.getElementById('disc');
    const label = document.getElementById('disc-label');
    if (!audio) return;

    audio.volume = 0.3;
    let state = getState();

    // Resume position from last page
    if (state.time) {
      audio.currentTime = state.time;
    }

    function setPlayingUI(isPlaying) {
      if (disc) disc.style.animationPlayState = isPlaying ? 'running' : 'paused';
      if (label) label.textContent = isPlaying ? '♪ playing' : 'tap to play';
    }

    function persist() {
      saveState({ playing: !audio.paused, time: audio.currentTime, muted: audio.muted });
    }

    // Try to autoplay muted on every page (allowed by all browsers)
    audio.muted = true;
    audio.play().then(() => {
      setPlayingUI(true);
      // If the visitor had already unmuted earlier in this session, unmute now
      if (state.playing && state.muted === false) {
        audio.muted = false;
      }
      persist();
    }).catch(() => {
      setPlayingUI(false);
    });

    // The very first real interaction anywhere on the page unmutes —
    // this satisfies the browser's "user gesture" requirement so sound
    // can keep playing on every page after that, without a second click.
    function unmuteOnFirstInteraction() {
      if (audio.muted) {
        audio.muted = false;
        audio.play().then(() => setPlayingUI(true)).catch(() => {});
        persist();
      }
      window.removeEventListener('click', unmuteOnFirstInteraction);
      window.removeEventListener('touchstart', unmuteOnFirstInteraction);
      window.removeEventListener('keydown', unmuteOnFirstInteraction);
    }
    window.addEventListener('click', unmuteOnFirstInteraction);
    window.addEventListener('touchstart', unmuteOnFirstInteraction);
    window.addEventListener('keydown', unmuteOnFirstInteraction);

    // Manual disc toggle (mute/pause control)
    if (disc) {
      disc.addEventListener('click', (e) => {
        e.stopPropagation();
        if (audio.paused) {
          audio.muted = false;
          audio.play().then(() => setPlayingUI(true)).catch(() => {});
        } else if (audio.muted) {
          audio.muted = false;
        } else {
          audio.pause();
          setPlayingUI(false);
        }
        persist();
      });
    }

    // Keep saving position as it plays, and right before navigating away
    audio.addEventListener('timeupdate', persist);
    window.addEventListener('beforeunload', persist);
  }

  // ===== WHATSAPP FLOATING BUTTON =====
  function initWhatsApp() {
    if (document.getElementById('wa-float-btn')) return;
    const phone = '919870556951';
    const message = "Hi Aastha! 🌸 I'm visiting your Tim Bells website and I'd love to know more / place an order.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    const btn = document.createElement('a');
    btn.id = 'wa-float-btn';
    btn.href = url;
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.title = 'Chat on WhatsApp';
    btn.innerHTML = `
      <svg viewBox="0 0 32 32" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.04 3C9.37 3 4 8.32 4 14.93c0 2.45.74 4.73 2.02 6.62L4.5 27.5l6.16-1.62a12.1 12.1 0 0 0 5.38 1.25h.01c6.66 0 12.04-5.32 12.04-11.93C28.09 8.32 22.71 3 16.04 3zm0 21.6h-.01a9.7 9.7 0 0 1-4.93-1.35l-.35-.21-3.66.96.98-3.55-.23-.36a9.6 9.6 0 0 1-1.5-5.16c0-5.32 4.36-9.65 9.71-9.65 2.6 0 5.04 1 6.88 2.83a9.55 9.55 0 0 1 2.85 6.82c0 5.32-4.37 9.66-9.74 9.66zm5.32-7.23c-.29-.15-1.71-.84-1.97-.93-.27-.1-.46-.15-.65.14-.2.29-.75.93-.92 1.13-.17.19-.34.21-.63.07-.29-.15-1.22-.45-2.33-1.43-.86-.76-1.44-1.7-1.61-1.99-.17-.29-.02-.45.13-.6.14-.14.31-.36.46-.55.15-.18.2-.31.3-.51.1-.2.05-.36-.03-.51-.08-.15-.6-1.44-.82-1.97-.22-.52-.44-.45-.6-.46h-.52c-.17 0-.46.07-.7.36-.25.29-.95.93-.95 2.27 0 1.34.97 2.63 1.11 2.82.14.18 1.85 2.83 4.49 3.85 2.64 1.02 2.64.68 3.11.64.48-.05 1.55-.63 1.77-1.24.22-.6.22-1.12.15-1.24-.07-.12-.26-.18-.55-.32z"/>
      </svg>`;
    document.body.appendChild(btn);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPlayer();
    initWhatsApp();
  });
})();
