// apple-content.js

async function triggerNativeEnter(input) {
  input.focus();
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  nativeInputValueSetter.call(input, input.value);
  input.dispatchEvent(new Event('input', { bubbles: true }));

  const form = input.closest('form');
  if (form) {
    console.log('✅ Form found. Dispatching submit.');
    form.dispatchEvent(new Event('submit', { bubbles: true }));
  } else {
    console.log('⚠️ No form found. Dispatching Enter key events manually.');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', which: 13, keyCode: 13, bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', code: 'Enter', which: 13, keyCode: 13, bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', which: 13, keyCode: 13, bubbles: true }));
  }
}

async function searchAndPlay(song) {
  const query = `${song.title} ${song.artists[0]}`;
  console.log(`🔍 Searching for: ${query}`);

  const input = document.querySelector('input[type="search"], input[placeholder*="Search"]');
  if (!input) {
    console.warn('⚠️ Search input not found.');
    return false;
  }
  console.log('✅ Search input found.');

  input.focus();
  input.value = '';
  input.dispatchEvent(new InputEvent('input', { bubbles: true }));

  await new Promise(resolve => setTimeout(resolve, 200));
  input.value = query;

  await triggerNativeEnter(input);
  console.log('⏳ Waiting for search results...');

  await new Promise(resolve => setTimeout(resolve, 3000));

  const topResults = document.querySelectorAll('.top-search-lockup');
  console.log(`🔎 Found ${topResults.length} top-search-lockup elements.`);

  const songDiv = Array.from(topResults).find(el => {
    const label = el.getAttribute('aria-label');
    return label && label.toLowerCase().includes('song');
  });

  if (!songDiv) {
    console.warn('⚠️ No song result found for:', query);
    return false;
  }
  console.log('✅ Song match found.');

  songDiv.focus();
  const link = songDiv.querySelector('a');
  if (link) {
    console.log('✅ Link inside song result found. Focusing...');
    link.focus();
  } else {
    console.warn('⚠️ No link found inside song result.');
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  const playBtn = document.querySelector('button[aria-label="Play"].play-button');
  if (playBtn) {
    console.log('▶️ Play button found. Clicking...');
    playBtn.click();
    await new Promise(resolve => setTimeout(resolve, 5000));
  } else {
    console.warn('⚠️ Play button not found.');
    return false;
  }

  return true;
}

async function setupInteractionLoop(songs) {
  let index = 0;
  const notFoundSongs = [];

  async function processSong(song) {
    const success = await searchAndPlay(song);
    if (!success) {
      notFoundSongs.push(song);
    }
  }

  async function handleKeyDown(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      window.removeEventListener('keydown', handleKeyDown);

      if (e.key === 'ArrowUp') {
        const favBtn = document.querySelector('button.favorite-button[aria-label="Favorite"]');
        if (favBtn && !favBtn.classList.contains('favorited')) {
          favBtn.click();
          console.log('⭐ Song added to favorites.');
        } else {
          console.log('⚠️ Favorite button not found or already favorited.');
        }
      } else {
        console.log('⏩ Skipped by ArrowDown.');
      }

      index++;
      if (index < songs.length) {
        await processSong(songs[index]);
        window.addEventListener('keydown', handleKeyDown);
      } else {
        console.log('✅ All songs processed. Not found:', notFoundSongs);
      }
    }
  }

  await processSong(songs[index]);
  window.addEventListener('keydown', handleKeyDown);
}

// Manually triggered by export button in popup (if on Apple Music page)
window.exportToApple = async function () {
  const { yandexSongs = [] } = await chrome.storage.local.get(['yandexSongs']);

  if (!Array.isArray(yandexSongs) || yandexSongs.length === 0) {
    console.log("❌ No Yandex songs to export.");
    return;
  }

  await setupInteractionLoop(yandexSongs);
};
