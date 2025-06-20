document.getElementById('importYandex').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => console.log('✅ Yandex import is handled automatically on page load.')
  });
});

document.getElementById('importFile').addEventListener('click', () => {
  document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const text = await file.text();
  try {
    const songs = JSON.parse(text);
    if (Array.isArray(songs)) {
      await chrome.storage.local.set({ yandexSongs: songs });
      alert(`✅ Imported ${songs.length} songs from file.`);
    } else {
      alert("❌ Invalid file format.");
    }
  } catch (err) {
    alert("❌ Failed to read file.");
  }
});

document.getElementById('exportFile').addEventListener('click', async () => {
  const { yandexSongs = [] } = await chrome.storage.local.get(['yandexSongs']);
  if (!Array.isArray(yandexSongs) || yandexSongs.length === 0) {
    alert("❌ No Yandex songs to export.");
    return;
  }

  const blob = new Blob([JSON.stringify(yandexSongs, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'yandex-songs.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

document.getElementById('exportApple').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      if (typeof window.exportToApple === 'function') {
        window.exportToApple();
      } else {
        console.warn('❌ exportToApple is not defined.');
      }
    }
  });
});

document.getElementById('clearStorage').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      if (typeof window.clearYandexSongs === 'function') {
        window.clearYandexSongs();
      } else {
        console.warn('❌ clearYandexSongs is not defined.');
      }
    }
  });
});
