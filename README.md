# Dedicated to the best woman in the world (for Spanish Flower)

# 🎵 Yandex to Apple Music Sync Extension

This Chrome extension allows you to seamlessly transfer your favorite songs from **Yandex Music** to **Apple Music**, with support for both **manual** and **automatic** exporting.

## ✨ Features

- ✅ Automatically extract your liked songs from Yandex Music
- 📁 Import/Export songs from/to JSON file
- 🍏 Export songs to your Apple Music library:
  - Manual mode: lets you approve songs with keyboard arrows
  - Automatic mode: adds all matched songs directly to favorites
- 🧹 One-click option to clear your saved songs

---

## 🚀 Installation

1. Clone or download this repository.
2. Open **Chrome** and go to: `chrome://extensions`
3. Enable **Developer mode** (top right).
4. Click **"Load unpacked"** and select the project folder.

---

## 📂 Project Structure

```
your-extension/
├── popup.html              # UI with buttons
├── popup.js                # Handles popup button actions
├── content-scripts/
│   ├── yandex-content.js   # Extracts songs from Yandex
│   └── apple-content.js    # Automates interaction with Apple Music
├── manifest.json           # Extension configuration
├── icon.png                # Extension icon
└── README.md               # You're reading this
```

---

## 🧪 Usage

1. **Open Yandex Music liked tracks page**
   → Songs will automatically be saved to storage.

2. **(Optional)** Import or export from JSON using popup buttons.

3. **Open Apple Music website**
   → Use **"Export to Apple (Manual)"** or **"Export to Apple (Auto)"** from popup.

4. Use **"Clear Storage"** to reset saved Yandex songs.

---

## ⌨️ Keyboard Shortcuts (Manual Mode)

- `Arrow Up` → Add song to favorites
- `Arrow Down` → Skip song

---

## ⚠️ Limitations

- Only works when browsing Yandex Music or Apple Music in an active Chrome tab.
- Songs must be publicly searchable on Apple Music for matching to work.

---

## 📄 License

MIT License