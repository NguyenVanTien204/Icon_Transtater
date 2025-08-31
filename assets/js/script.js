// ===== EMOJI DICTIONARY MANAGEMENT =====
let emojiDictionary = {};
let loadedDictionaries = {};
let dictionaryConfig = null;
let isLoading = false;

// ===== MAIN LOADING FUNCTION =====
async function loadEmojiDictionary() {
  if (isLoading) {
    return;
  }

  try {
    isLoading = true;
    showLoadingState('Đang tải từ điển...');

    // Load config first
    await loadDictionaryConfig();

    // Auto-discover or use config list
    const dictionaryFiles = await discoverDictionaryFiles();

    if (dictionaryFiles.length === 0) {
      throw new Error('Không tìm thấy file từ điển nào');
    }

    // Load all dictionary files
    await loadAllDictionaries(dictionaryFiles);

    // Merge all dictionaries
    mergeDictionaries();

    const totalWords = Object.keys(emojiDictionary).length;
    const totalDictionaries = Object.keys(loadedDictionaries).length;

    if (totalWords === 0) {
      throw new Error('Không có từ nào được tải');
    }

    showToast(`Đã tải ${totalDictionaries} từ điển với ${totalWords}+ từ thành công!`, 'success');

    // Update UI with dictionary info
    updateDictionaryInfo();

  } catch (error) {
    console.error('Lỗi khi tải từ điển emoji:', error);
    showToast('Không thể tải từ điển emoji!', 'error');
  } finally {
    isLoading = false;
    hideLoadingState();
  }
}

async function loadDictionaryConfig() {
  try {
    const response = await fetch('./assets/dictionary/config.json');
    if (response.ok) {
      dictionaryConfig = await response.json();
    } else {
      dictionaryConfig = { autoDiscovery: true, dictionaries: [] };
    }
  } catch (error) {
    dictionaryConfig = { autoDiscovery: true, dictionaries: [] };
  }
}

async function discoverDictionaryFiles() {
  // If config exists and auto-discovery is disabled, use config list
  if (dictionaryConfig && !dictionaryConfig.autoDiscovery && dictionaryConfig.dictionaries) {
    return dictionaryConfig.dictionaries
      .filter(dict => dict.enabled)
      .sort((a, b) => a.priority - b.priority)
      .map(dict => dict.filename);
  }

  // Auto-discovery: Try common dictionary files
  const commonFiles = [
    'emotions.json',
    'food.json',
    'animals.json',
    'nature.json',
    'technology.json',
    'sports.json',
    'transportation.json',
    'symbols.json',
    'colors.json',
    'numbers.json'
  ];

  const existingFiles = [];

  for (const filename of commonFiles) {
    try {
      const response = await fetch(`./assets/dictionary/${filename}`);
      if (response.ok) {
        existingFiles.push(filename);
      }
    } catch (error) {
      // File không tồn tại, bỏ qua
    }
  }

  return existingFiles;
}

async function loadAllDictionaries(filenames) {
  if (filenames.length === 0) {
    return;
  }

  const loadPromises = filenames.map(filename => loadSingleDictionary(filename));
  await Promise.allSettled(loadPromises);
}

async function loadSingleDictionary(filename) {
  try {
    const response = await fetch(`./assets/dictionary/${filename}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const dictionary = await response.json();

    // Validate dictionary structure
    if (!dictionary.id || !dictionary.words) {
      throw new Error('Invalid dictionary structure');
    }

    loadedDictionaries[dictionary.id] = dictionary;
    return dictionary;
  } catch (error) {
    throw error;
  }
}

function mergeDictionaries() {
  if (Object.keys(loadedDictionaries).length === 0) {
    return;
  }

  emojiDictionary = {};

  // Sort dictionaries by priority if available
  const sortedDictionaries = Object.values(loadedDictionaries)
    .sort((a, b) => (a.priority || 999) - (b.priority || 999));

  // Merge all dictionaries (later ones override earlier ones for same keys)
  sortedDictionaries.forEach(dictionary => {
    Object.assign(emojiDictionary, dictionary.words);
  });
}

// ===== UI FUNCTIONS =====
// ===== DOM ELEMENTS =====
const elements = {
  textInput: document.getElementById('textInput'),
  outputContent: document.getElementById('outputContent'),
  translateBtn: document.getElementById('translateBtn'),
  copyBtn: document.getElementById('copyBtn'),
  clearBtn: document.getElementById('clearBtn'),
  charCount: document.getElementById('charCount'),
  themeToggle: document.getElementById('themeToggle'),
  toast: document.getElementById('toast')
};

// ===== STATE MANAGEMENT =====
let currentTheme = localStorage.getItem('theme') || 'light';
let translateTimeout = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
  initializeTheme();
  await loadEmojiDictionary();
  initializeEventListeners();
  updateCharCount();
});

// ===== THEME MANAGEMENT =====
function initializeTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const themeIcon = elements.themeToggle.querySelector('.theme-icon');
  themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
  // Theme toggle
  elements.themeToggle.addEventListener('click', toggleTheme);

  // Text input events
  elements.textInput.addEventListener('input', handleTextInput);
  elements.textInput.addEventListener('keydown', handleKeyDown);

  // Button events
  elements.translateBtn.addEventListener('click', handleTranslate);
  elements.copyBtn.addEventListener('click', handleCopy);
  elements.clearBtn.addEventListener('click', handleClear);

  // Auto-resize textarea
  elements.textInput.addEventListener('input', autoResizeTextarea);
}

function handleTextInput() {
  updateCharCount();

  // Clear previous timeout
  if (translateTimeout) {
    clearTimeout(translateTimeout);
  }

  // Auto-translate after 1 second of no typing (optional feature)
  // translateTimeout = setTimeout(() => {
  //   if (elements.textInput.value.trim()) {
  //     handleTranslate();
  //   }
  // }, 1000);
}

function handleKeyDown(event) {
  // Translate on Ctrl/Cmd + Enter
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    handleTranslate();
  }
}

function autoResizeTextarea() {
  const textarea = elements.textInput;
  textarea.style.height = 'auto';
  textarea.style.height = Math.max(120, textarea.scrollHeight) + 'px';
}

// ===== TEXT PROCESSING =====
function translateText(text) {
  if (!text.trim()) return '';

  let result = text;

  // Get all dictionary keys sorted by length (longest first)
  // This ensures longer phrases like "con mèo" are matched before "mèo"
  const sortedKeys = Object.keys(emojiDictionary)
    .sort((a, b) => b.length - a.length);

  // Replace each key with its emoji, case-insensitive
  sortedKeys.forEach(key => {
    const emoji = emojiDictionary[key];

    // Create a regex that matches the key as a whole word or phrase
    // Use word boundaries for single words, but allow phrase matching
    const regex = key.includes(' ')
      ? new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      : new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');

    result = result.replace(regex, emoji);
  });

  return result;
}

function handleTranslate() {
  const inputText = elements.textInput.value.trim();

  if (!inputText) {
    showToast('Vui lòng nhập văn bản để dịch!', 'warning');
    elements.textInput.focus();
    return;
  }

  if (Object.keys(emojiDictionary).length === 0) {
    showToast('Từ điển emoji chưa được tải. Vui lòng đợi...', 'warning');
    return;
  }

  // Show loading state
  setLoadingState(true);

  // Simulate processing time for better UX
  setTimeout(() => {
    const translatedText = translateText(inputText);
    displayResult(translatedText);
    setLoadingState(false);
  }, 500);
}

function displayResult(text) {
  elements.outputContent.innerHTML = '';

  if (text.trim()) {
    const resultText = document.createElement('p');
    resultText.textContent = text;
    resultText.style.fontSize = '1.2em';
    resultText.style.lineHeight = '1.6';
    elements.outputContent.appendChild(resultText);

    elements.outputContent.classList.add('has-result');
    elements.copyBtn.disabled = false;
  } else {
    elements.outputContent.innerHTML = '<p class="placeholder-text">Không tìm thấy emoji tương ứng cho văn bản này.</p>';
    elements.outputContent.classList.remove('has-result');
    elements.copyBtn.disabled = true;
  }
}

function setLoadingState(isLoading) {
  elements.translateBtn.disabled = isLoading;
  elements.translateBtn.classList.toggle('loading', isLoading);

  if (isLoading) {
    elements.translateBtn.querySelector('.btn-text').textContent = 'Đang dịch...';
  } else {
    elements.translateBtn.querySelector('.btn-text').textContent = 'Dịch sang Emoji';
  }
}

// ===== UTILITY FUNCTIONS =====
function showLoadingState(message = 'Đang tải...') {
  const translateBtn = elements.translateBtn;
  translateBtn.disabled = true;
  translateBtn.classList.add('loading');
  translateBtn.querySelector('.btn-text').textContent = message;
}

function hideLoadingState() {
  const translateBtn = elements.translateBtn;
  translateBtn.disabled = false;
  translateBtn.classList.remove('loading');
  translateBtn.querySelector('.btn-text').textContent = 'Dịch sang Emoji';
}

function updateDictionaryInfo() {
  if (!loadedDictionaries || Object.keys(loadedDictionaries).length === 0) return;

  const totalWords = Object.keys(emojiDictionary).length;
  const totalDictionaries = Object.keys(loadedDictionaries).length;

  console.log(`📊 Thông tin từ điển:
    - Số từ điển đã tải: ${totalDictionaries}
    - Tổng số từ: ${totalWords}
    - Danh sách từ điển: ${Object.keys(loadedDictionaries).join(', ')}
  `);

  // Update footer with dictionary info
  const footerContent = document.querySelector('.footer-content p');
  if (footerContent) {
    footerContent.innerHTML = `© 2025 Emoji Translator. Made with ❤️ by
      <a href="https://github.com/NguyenVanTien204" target="_blank" rel="noopener noreferrer">NguyenVanTien204</a>
      • ${totalDictionaries} từ điển (${totalWords}+ từ)`;
  }
}

function getDictionaryStats() {
  if (!loadedDictionaries) return null;

  const categories = Object.entries(loadedDictionaries).map(([key, dictionary]) => ({
    id: key,
    name: dictionary.name,
    icon: dictionary.icon,
    count: Object.keys(dictionary.words).length,
    priority: dictionary.priority || 999,
    version: dictionary.version
  })).sort((a, b) => a.priority - b.priority);

  return {
    totalDictionaries: Object.keys(loadedDictionaries).length,
    totalWords: Object.keys(emojiDictionary).length,
    categories,
    config: dictionaryConfig
  };
}

// Function to search emojis by category (for future features)
function searchByCategory(categoryId) {
  if (!loadedDictionaries || !loadedDictionaries[categoryId]) return {};
  return loadedDictionaries[categoryId].words;
}

// Function to get random emoji (for future features)
function getRandomEmoji() {
  const emojis = Object.values(emojiDictionary);
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Function to reload dictionaries (for development)
async function reloadDictionaries() {
  console.log('🔄 Reloading dictionaries...');
  loadedDictionaries = {};
  emojiDictionary = {};
  await loadEmojiDictionary();
}

// Function to add new dictionary dynamically
async function addDictionary(filename) {
  try {
    await loadSingleDictionary(filename);
    mergeDictionaries();
    updateDictionaryInfo();
    showToast(`Đã thêm từ điển ${filename} thành công!`, 'success');
  } catch (error) {
    console.error(`❌ Lỗi thêm từ điển ${filename}:`, error);
    showToast(`Không thể thêm từ điển ${filename}!`, 'error');
  }
}

function handleCopy() {
  const resultText = elements.outputContent.textContent;

  if (!resultText || resultText.includes('placeholder-text')) {
    showToast('Không có nội dung để sao chép!', 'warning');
    return;
  }

  navigator.clipboard.writeText(resultText).then(() => {
    showToast('Đã sao chép vào clipboard!', 'success');

    // Visual feedback
    elements.copyBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      elements.copyBtn.style.transform = '';
    }, 150);
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = resultText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    showToast('Đã sao chép vào clipboard!', 'success');
  });
}

function handleClear() {
  elements.textInput.value = '';
  elements.outputContent.innerHTML = '<p class="placeholder-text">Kết quả sẽ hiển thị ở đây...</p>';
  elements.outputContent.classList.remove('has-result');
  elements.copyBtn.disabled = true;
  updateCharCount();
  elements.textInput.focus();

  // Reset textarea height
  elements.textInput.style.height = '120px';
}

function updateCharCount() {
  const currentLength = elements.textInput.value.length;
  const maxLength = elements.textInput.maxLength;
  elements.charCount.textContent = `${currentLength}/${maxLength}`;

  // Change color based on usage
  if (currentLength > maxLength * 0.9) {
    elements.charCount.style.color = 'var(--danger-color)';
  } else if (currentLength > maxLength * 0.7) {
    elements.charCount.style.color = 'var(--warning-color)';
  } else {
    elements.charCount.style.color = 'var(--text-muted)';
  }
}

function showToast(message, type = 'success') {
  const toast = elements.toast;
  const toastMessage = toast.querySelector('.toast-message');
  const toastIcon = toast.querySelector('.toast-icon');

  // Update content
  toastMessage.textContent = message;

  // Update icon and style based on type
  switch (type) {
    case 'success':
      toastIcon.textContent = '✅';
      toast.style.background = 'var(--success-color)';
      break;
    case 'warning':
      toastIcon.textContent = '⚠️';
      toast.style.background = 'var(--warning-color)';
      break;
    case 'error':
      toastIcon.textContent = '❌';
      toast.style.background = 'var(--danger-color)';
      break;
    default:
      toastIcon.textContent = 'ℹ️';
      toast.style.background = 'var(--accent-primary)';
  }

  // Show toast
  toast.classList.add('show');

  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (event) => {
  // Ctrl/Cmd + K to focus input
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault();
    elements.textInput.focus();
  }

  // Ctrl/Cmd + L to clear
  if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
    event.preventDefault();
    handleClear();
  }

  // Ctrl/Cmd + D to toggle theme
  if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
    event.preventDefault();
    toggleTheme();
  }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== ANALYTICS (Optional) =====
function trackEvent(eventName, eventData = {}) {
  // Add analytics tracking here if needed
  console.log(`Event: ${eventName}`, eventData);
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
  console.error('Application error:', event.error);
  showToast('Đã xảy ra lỗi. Vui lòng thử lại!', 'error');
});

// ===== EXPORT FOR TESTING (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    translateText,
    emojiDictionary,
    loadedDictionaries,
    loadEmojiDictionary,
    getDictionaryStats,
    searchByCategory,
    addDictionary,
    reloadDictionaries
  };
}
