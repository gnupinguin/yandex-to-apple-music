const songs = new Map();

function extractNewTracksFromNode(node) {
  if (!node.matches?.('[data-index] .HorizontalCardContainer_root__YoAAP')) return;

  const link = node.querySelector('a[href*="/track/"]');
  if (!link) return;

  const id = link.getAttribute('href')?.split('/track/')[1];
  if (!id || songs.has(id)) return;

  const title = node.querySelector('.Meta_title__GGBnH')?.textContent.trim() || 'Unknown';
  const artistNodes = node.querySelectorAll('.Meta_artists__VnR52 a');
  const artists = Array.from(artistNodes).map(a => a.textContent.trim());

  songs.set(id, { id, title, artists });
  chrome.storage.local.set({ yandexSongs: Array.from(songs.values()) });
  console.log(`🎵 Added: ${title} by ${artists.join(', ')} (Total: ${songs.size})`);
}

function observeTrackList() {
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.nodeType === 1) {
          extractNewTracksFromNode(addedNode);
          addedNode.querySelectorAll?.('[data-index] .HorizontalCardContainer_root__YoAAP')?.forEach(extractNewTracksFromNode);
        }
      }
    }
  });

  const container = document.querySelector('[class*="VirtualScroll_root"]') || document.body;
  observer.observe(container, { childList: true, subtree: true });

  console.log('👀 Auto-observing for new Yandex songs as you scroll...');
}

observeTrackList();