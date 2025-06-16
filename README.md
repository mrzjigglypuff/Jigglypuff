# 🎵 Jigglypuff: Web

![Python](https://img.shields.io/badge/Python-3.7%2B-blue?logo=python)
![Flask](https://img.shields.io/badge/Backend-Flask-lightgrey?logo=flask)
![yt_dlp](https://img.shields.io/badge/YouTube-yt__dlp-red?logo=youtube)
![License](https://img.shields.io/badge/License-MIT-green)

Jigglypuff: Web is a lightweight, browser-based YouTube audio player built with Flask, JavaScript, and `yt_dlp`.
Once running, it can be accessed from **any device on the same Wi-Fi/network**, making it a perfect personal streaming server.
It features a minimal UI, live search suggestions, audio queue management, theme switching (light/dark), and persistent playback using `localStorage`.

---

## 🚀 Features

- 🔍 Live YouTube search with suggestions
- 🎧 Audio streaming using `yt_dlp`
- 📜 Song queue with next/previous controls
- ♻️ Loop, seek, skip, and autoplay support
- 🌘 Dark/Light theme toggle with `localStorage`
- 💾 Queue and current song saved between sessions
- 🧠 Media Session API integration for system media controls
- 📡 Access your personal music server from any device on the same Wi-Fi network

---

## 📁 Project Structure

```
Jigglypuff-Web/
├── server.py          # Flask backend entry point
├── yt.py              # YouTube search & stream URL logic via yt_dlp
├── templates/
│   └── index.html     # Main HTML UI
├── static/
│   ├── script.js      # All frontend logic (player, queue, search, etc.)
│   └── style.css      # Custom responsive and themed styles
```

---

## 🛠️ Installation

### Requirements:
- Python 3.7+
- `yt_dlp`
- `Flask`

### 🔧 Install dependencies:

```bash
pip install flask yt_dlp
```

---

## 🧪 How to Run

1. Clone the repo:
```bash
git clone https://github.com/MrzCruz/Jigglypuff-Web.git
cd Jigglypuff-Web
```

2. Start the Flask server:
```bash
python server.py
```

3. Open your browser and visit:
```
http://localhost:5000/
```

---

## 📱 Termux Installation Guide (Android)

Want to run this on your Android phone using Termux? Follow these simple steps to set it up:

1. Install Termux (Safe APK)

Download the **latest working APK** of Termux:
- 👉 [Download Termux 118 APK](https://github.com/AndronixApp/termux-releases/blob/main/Releases/Termux_118/com.termux_118.apk?raw=true)

After installation, open the Termux app.

2. Update Termux and Install Packages

Run these commands inside Termux to update and install the required tools:

```bash
pkg update -y && pkg upgrade -y
pkg install -y python git
pkg clean
```

3. Install Python Dependencies

```bash
pip install flask yt_dlp
```

If `yt_dlp` fails, update it:
```bash
pip install -U yt-dlp
```

4. Clone and Run the Project

```bash
git clone https://github.com/MrzCruz/Jigglypuff-Web.git
cd Jigglypuff-Web
python server.py
```

Then open your phone browser or any other device on the same Wi-Fi and visit:

```
http://localhost:5000/
```

Or use your phone’s local IP:
```
http://192.168.0.x:5000/
```

---

## 💡 Usage

- Use the search bar to find a song (e.g., `Imagine Dragons`)
- Click the suggested result or press Enter to queue it
- Use the player controls at the bottom to play/pause/skip
- The queue is saved in `localStorage`, so your session is remembered
- Use the 🌓 toggle button to switch themes

---

## 📦 Tech Stack

- **Backend**: Flask, Python, `yt_dlp`
- **Frontend**: HTML5, Vanilla JS, CSS3
- **Other**: Media Session API, LocalStorage

---

## 📌 TODO / Roadmap

- [ ] Volume control slider
- [ ] Drag-and-drop queue reorder
- [ ] Mobile layout refinements
- [ ] Search suggestions from multiple sources (e.g. playlists, history)

---

## ⚖️ License

This project is open-source and available under the [MIT License](LICENSE).

---

## ✨ Author

Made with ❤️ by [MrzCruz](https://github.com/MrzCruz)
