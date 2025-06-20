document.getElementById('import-yandex').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['yandex-content.js'] });
});

document.getElementById('trigger-file-import').addEventListener('click', () => {
  document.getElementById('import-file').click();
});

document.getElementById('import-file').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const text = await file.text();
  try {
    const songs = JSON.parse(text);
    if (Array.isArray(songs)) {
      await chrome.storage.local.set({ yandexSongs: songs });
      alert('✅ Songs imported from file.');
    } else {
      alert('Invalid file format.');
    }
  } catch (e) {
    alert('❌ Failed to parse file.');
  }
});

document.getElementById('export-apple').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Ensure script is injected first
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['apple-content.js']
  });

  // Then call the export function
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.exportToApple?.()
  });
});
