const queryInput = document.getElementById('queryInput');
const audioPlayer = document.getElementById('audioPlayer');
const dropDown = document.getElementById('dropDown');
const suggestionBox = document.getElementById('suggestionBox');
const queryForm = document.getElementById('queryForm');
const queueContainer = document.querySelector('.song-list');
const nowPlaying = document.getElementById('nowPlaying');
const bigPlayBtn = document.querySelector('.big-play-btn');
const playerTitle = document.querySelector('.player-title');
const progressBar = document.getElementById('progressBar');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const loopBtn = document.getElementById('loopBtn');
const audioContainer = document.getElementById('audioContainer');
const clearq = document.getElementById('clearq');
const removeBtn = document.getElementById('removeBtn');

let queueIndex = 0;
let queue = [];
let debounceTimer = null;
let isLooping = false;

audioPlayer.volume = 1;

// === Restore queue from localStorage ===
const savedQueue = localStorage.getItem('audioQueue');
const savedIndex = localStorage.getItem('queueIndex');

if (savedQueue) {
  try {
    queue = JSON.parse(savedQueue);
    queueIndex = parseInt(savedIndex) || 0;
    updateQueue();

    const current = queue[queueIndex];
    if (current) {
      audioPlayer.src = current.url;
      updateNowPlayingUI(current);
    }
  } catch (err) {
    console.warn("Failed to restore queue:", err);
    queue = [];
    queueIndex = 0;
  }
}

// === Toggle Loop ===
loopBtn.addEventListener('click', () => {
  isLooping = !isLooping;
  loopBtn.classList.toggle('active', isLooping);
  loopBtn.textContent = isLooping ? '\u21BB' : '\u21A6';
});

// === Format Duration ===
function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// === Is Audio Playing ===
function isAudioPlaying() {
  return !audioPlayer.paused && !audioPlayer.ended && audioPlayer.readyState > 2;
}

// === Handle Search Input with Debounce ===
queryInput.addEventListener('input', () => {
  const query = queryInput.value.trim();
  clearTimeout(debounceTimer);

  if (query.length < 2) {
    dropDown.innerHTML = '';
    suggestionBox.style.visibility = 'hidden';
    return;
  }

  debounceTimer = setTimeout(() => {
    fetch(`/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        dropDown.innerHTML = '';
        if (data.length > 0) {
          data.forEach(item => {
            const option = document.createElement('option');
            option.value = `https://www.youtube.com/watch?v=${item.id}`;
            option.textContent = item.title;
            dropDown.appendChild(option);
          });
          dropDown.selectedIndex = 0;
          suggestionBox.style.visibility = 'visible';
        } else {
          suggestionBox.style.visibility = 'hidden';
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        suggestionBox.style.visibility = 'hidden';
      });
  }, 500);
});

// === Form Submit ===
queryForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const query = queryInput.value.trim();
  queryInput.value = '';
  dropDown.innerHTML = '';
  dropDown.selectedIndex = -1;
  suggestionBox.style.visibility = 'hidden';

  const selectedOption = dropDown.selectedIndex >= 0 ? dropDown.options[dropDown.selectedIndex] : null;
  const response = selectedOption ? selectedOption.value : "ytsearch1:" + query;

  nowPlaying.textContent = "🔍 Searching...";

  fetch('/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: response })
  })
    .then(res => res.json())
    .then(data => {
      const results = Array.isArray(data) ? data : [data];
      results.forEach(item => {
        if (item.error) {
          nowPlaying.textContent = "❌ Error loading audio";
          alert("Error fetching stream: " + item.error);
          return;
        }

        if (item.url) {
          queue.push({
            title: item.title || 'Unknown Title',
            url: item.url,
            duration: formatDuration(item.duration),
            thumbnail: item.thumbnail || 'placeholder.jpg',
            artist: item.uploader || 'Unknown Artist'
          });

          updateQueue();
          if (!isAudioPlaying()) {
            playQueue();
          } else {
            nowPlaying.textContent = '';
          }
        }
      });
    })
    .catch(err => {
      nowPlaying.textContent = "❌ Error loading stream";
      console.error('Fetch error:', err);
    });
});

// === Update Queue Display ===
function updateQueue() {
  queueContainer.innerHTML = '';

  queue.forEach((item, index) => {
    const songItem = document.createElement('div');
    songItem.className = "song-item";

    const songDetails = document.createElement('div');
    songDetails.className = "song-details";

    const titleEl = document.createElement('h3');
    titleEl.textContent = `${index + 1}. ${item.title}`;

    const durationEl = document.createElement('p');
    durationEl.className = "duration";
    durationEl.textContent = item.duration;

    songDetails.appendChild(titleEl);
    songDetails.appendChild(durationEl);

    const img = document.createElement("img");
    img.src = item.thumbnail;
    img.alt = "cover";
    img.className = "cover-img";

    const playBtn = document.createElement("button");
    playBtn.className = "play-btn";
    playBtn.innerHTML = "&#9658;";
    playBtn.addEventListener('click', () => {
      playQueue(index);
    });

    songItem.appendChild(songDetails);
    songItem.appendChild(img);
    songItem.appendChild(playBtn);

    queueContainer.appendChild(songItem);
  });

  localStorage.setItem('audioQueue', JSON.stringify(queue));
  localStorage.setItem('queueIndex', queueIndex);

  document.querySelector('.subtitle').textContent = `${queue.length} songs`;
}

// === Play from Queue ===
function playQueue(newIndex = null) {
  if (newIndex !== null && newIndex >= 0 && newIndex < queue.length) {
    queueIndex = newIndex;
  } else if (!queue[queueIndex]) return;

  const current = queue[queueIndex];
  audioPlayer.src = current.url;
  audioPlayer.load();
  audioPlayer.play().then(() => {
    updateNowPlayingUI(current);
    bigPlayBtn.innerHTML = "&#10073;&#10073;";
    updateMediaSession(current);
  }).catch(err => {
    alert("Autoplay blocked: " + err.message);
  });
}

// === Update Now Playing ===
function updateNowPlayingUI(current) {
  if (current) {
    nowPlaying.textContent = `🎵 Now Playing: ${current.title}`;
    playerTitle.textContent = current.title;
    audioContainer.style.backgroundImage = `url(${current.thumbnail})`;
  } else {
    nowPlaying.textContent = "No song playing";
    playerTitle.textContent = "No song playing";
    audioContainer.style.backgroundImage = '';
  }
  document.querySelector('.subtitle').textContent = `${queue.length} songs`;
}

// === Toggle Play/Pause ===
bigPlayBtn.addEventListener('click', togglePP);
function togglePP() {
  const current = queue[queueIndex];
  if (!current || !current.url) return;

  const isSameSong = audioPlayer.src === current.url || audioPlayer.src.endsWith(current.url);

  if (isAudioPlaying()) {
    audioPlayer.pause();
    bigPlayBtn.innerHTML = "&#9658;";
  } else {
    if (!isSameSong || audioPlayer.ended || audioPlayer.currentTime === 0) {
      audioPlayer.src = current.url;
      audioPlayer.load();
    }
    audioPlayer.play().then(() => {
      updateNowPlayingUI(current);
      bigPlayBtn.innerHTML = "&#10073;&#10073;";
    }).catch(err => {
      alert("Autoplay blocked: " + err.message);
    });
  }
}

// === Media Session Setup ===
function updateMediaSession(current) {
  if (!('mediaSession' in navigator)) return;

  navigator.mediaSession.metadata = new MediaMetadata({
    title: current.title,
    artist: current.artist || 'Unknown',
    album: 'Jigglypuff🎶',
    artwork: [
      { src: current.thumbnail, sizes: '512x512', type: 'image/png' }
    ]
  });

  navigator.mediaSession.playbackState = isAudioPlaying() ? 'playing' : 'paused';

  navigator.mediaSession.setActionHandler('play', () => audioPlayer.play());
  navigator.mediaSession.setActionHandler('pause', () => audioPlayer.pause());
  navigator.mediaSession.setActionHandler('previoustrack', () => {
    if (queueIndex > 0) playQueue(queueIndex - 1);
  });
  navigator.mediaSession.setActionHandler('nexttrack', () => {
    if (queueIndex < queue.length - 1) playQueue(queueIndex + 1);
  });
  navigator.mediaSession.setActionHandler('seekbackward', () => {
    audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
  });
  navigator.mediaSession.setActionHandler('seekforward', () => {
    audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 10);
  });
  navigator.mediaSession.setActionHandler('seekto', (details) => {
    if (details.fastSeek && 'fastSeek' in audioPlayer) {
      audioPlayer.fastSeek(details.seekTime);
    } else {
      audioPlayer.currentTime = details.seekTime;
    }
  });
}

// === Progress + Seek ===
audioPlayer.addEventListener('timeupdate', () => {
  if (!isNaN(audioPlayer.duration)) {
    progressBar.max = audioPlayer.duration;
    progressBar.value = audioPlayer.currentTime;

    if ('mediaSession' in navigator && typeof navigator.mediaSession.setPositionState === 'function') {
      navigator.mediaSession.setPositionState({
        duration: audioPlayer.duration,
        playbackRate: audioPlayer.playbackRate || 1,
        position: audioPlayer.currentTime
      });
    }
  }
});

progressBar.addEventListener('input', () => {
  audioPlayer.currentTime = progressBar.value;
});

// === Auto Next or Loop ===
audioPlayer.addEventListener('ended', () => {
  if (queueIndex < queue.length - 1) {
    playQueue(queueIndex + 1);
  } else if (isLooping) {
    playQueue(0);
  } else {
    updateNowPlayingUI(null);
  }
});

// === Playback State ===
audioPlayer.addEventListener('play', () => {
  if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
});
audioPlayer.addEventListener('pause', () => {
  if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
});

// === Clear Queue ===
clearq.addEventListener('click', () => {
  localStorage.removeItem('audioQueue');
  localStorage.removeItem('queueIndex');
  queue = [];
  queueIndex = 0;
  updateQueue();
  updateNowPlayingUI(null);
  audioPlayer.pause();
  audioPlayer.src = '';
  progressBar.value = 0;
});

// === Remove Current Song ===
removeBtn.addEventListener('click', () => {
  if (queue.length === 0) return;

  queue.splice(queueIndex, 1);

  if (queue.length === 0) {
    queueIndex = 0;
    updateQueue();
    updateNowPlayingUI(null);
    audioPlayer.pause();
    audioPlayer.src = '';
  } else {
    if (queueIndex >= queue.length) {
      queueIndex = queue.length - 1;
    }
    updateQueue();
    playQueue(queueIndex);
  }
});

nextBtn.addEventListener('click', () => {
  if (queueIndex < queue.length - 1) {
    playQueue(queueIndex + 1);
  } else if (isLooping) {
    playQueue(0); // Loop back to first song
  }
});

prevBtn.addEventListener('click', () => {
  if (queueIndex > 0) {
    playQueue(queueIndex - 1);
  } else {
    audioPlayer.currentTime = 0; // Rewind if at first song
  }
});

const themeToggle = document.getElementById('themeToggle');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Toggle and update text
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// On page load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
});
