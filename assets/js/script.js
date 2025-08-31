// ===== EMOJI DICTIONARY MANAGEMENT =====
let emojiDictionary = {};
let loadedDictionaries = {};
let dictionaryConfig = null;
let isLoading = false;

// ===== EMBEDDED DICTIONARY (for file:// protocol) =====
const EMBEDDED_DICTIONARY = {
  emotions: {
    "yêu": "❤️", "love": "❤️", "tình yêu": "❤️",
    "vui": "😊", "happy": "😊", "hạnh phúc": "😊", "vui vẻ": "😊",
    "buồn": "😢", "sad": "😢", "khóc": "😭",
    "cười": "😂", "laugh": "😂", "haha": "😂",
    "tức": "😠", "angry": "😠", "giận": "😠", "tức giận": "😠",
    "ngạc nhiên": "😱", "surprise": "😱", "bất ngờ": "😱",
    "sợ": "😨", "fear": "😨", "sợ hãi": "😨",
    "mệt": "😴", "tired": "😴", "ngủ": "😴", "mệt mỏi": "😴",
    "tuyệt vời": "🤩", "awesome": "🤩", "tuyệt": "🤩",
    "ok": "👌", "được": "👌", "tốt": "👍", "good": "👍",
    "thích": "😍", "like": "😍",
    "ghét": "😤", "hate": "😤"
  },
  food: {
    "pizza": "🍕", "bánh pizza": "🍕",
    "cà phê": "☕", "coffee": "☕", "cafe": "☕",
    "trà": "🍵", "tea": "🍵",
    "bánh mì": "🥖", "bread": "🥖",
    "hamburger": "🍔", "burger": "🍔",
    "khoai tây": "🍟", "fries": "🍟",
    "kem": "🍦", "ice cream": "🍦",
    "bánh ngọt": "🍰", "cake": "🍰", "bánh": "🍰",
    "táo": "🍎", "apple": "🍎",
    "chuối": "🍌", "banana": "🍌",
    "cam": "🍊", "orange": "🍊",
    "nho": "🍇", "grape": "🍇",
    "dưa hấu": "🍉", "watermelon": "🍉",
    "cơm": "🍚", "rice": "🍚",
    "mì": "🍜", "noodle": "🍜", "phở": "🍜",
    "sushi": "🍣",
    "chocolate": "🍫", "socola": "🍫",
    "bia": "🍺", "beer": "🍺",
    "rượu": "🍷", "wine": "🍷",
    "nước": "💧", "water": "💧"
  },
  animals: {
    "mèo": "🐱", "cat": "🐱",
    "chó": "🐶", "dog": "🐶",
    "gấu": "🐻", "bear": "🐻",
    "hổ": "🐯", "tiger": "🐯",
    "sư tử": "🦁", "lion": "🦁",
    "voi": "🐘", "elephant": "🐘",
    "khỉ": "🐵", "monkey": "🐵",
    "gà": "🐔", "chicken": "🐔",
    "cá": "🐟", "fish": "🐟",
    "chim": "🐦", "bird": "🐦",
    "bướm": "🦋", "butterfly": "🦋",
    "ong": "🐝", "bee": "🐝",
    "rắn": "🐍", "snake": "🐍",
    "chuột": "🐭", "mouse": "🐭",
    "thỏ": "🐰", "rabbit": "🐰",
    "ngựa": "🐴", "horse": "🐴",
    "bò": "🐮", "cow": "🐮",
    "heo": "🐷", "pig": "🐷"
  },
  nature: {
    "mặt trời": "☀️", "sun": "☀️", "nắng": "☀️",
    "mưa": "🌧️", "rain": "🌧️",
    "tuyết": "❄️", "snow": "❄️",
    "mây": "☁️", "cloud": "☁️",
    "gió": "💨", "wind": "💨",
    "sấm sét": "⚡", "lightning": "⚡",
    "cầu vồng": "🌈", "rainbow": "🌈",
    "hoa": "🌸", "flower": "🌸",
    "cây": "🌳", "tree": "🌳",
    "lá": "🍃", "leaf": "🍃",
    "núi": "⛰️", "mountain": "⛰️",
    "biển": "🌊", "sea": "🌊", "ocean": "🌊",
    "sao": "⭐", "star": "⭐",
    "mặt trăng": "🌙", "moon": "🌙",
    "lửa": "🔥", "fire": "🔥"
  },
  transportation: {
    "xe ô tô": "🚗", "car": "🚗", "ô tô": "🚗",
    "xe máy": "🏍️", "motorcycle": "🏍️",
    "xe đạp": "🚲", "bicycle": "🚲", "bike": "🚲",
    "máy bay": "✈️", "airplane": "✈️", "plane": "✈️",
    "tàu hỏa": "🚆", "train": "🚆",
    "tàu thủy": "🚢", "ship": "🚢",
    "xe buýt": "🚌", "bus": "🚌",
    "taxi": "🚕"
  },
  technology: {
    "điện thoại": "📱", "phone": "📱", "mobile": "📱",
    "máy tính": "💻", "computer": "💻", "laptop": "💻",
    "camera": "📷", "máy ảnh": "📷",
    "ti vi": "📺", "tv": "📺", "television": "📺",
    "radio": "📻",
    "đồng hồ": "⌚", "watch": "⌚",
    "sách": "📚", "book": "📚",
    "bút": "✏️", "pen": "✏️", "pencil": "✏️",
    "email": "📧", "mail": "📧",
    "internet": "🌐", "web": "🌐",
    "game": "🎮", "games": "🎮",
    "âm nhạc": "🎵", "music": "🎵", "nhạc": "🎵"
  },
  symbols: {
    "tim": "❤️", "heart": "❤️",
    "ngôi sao": "⭐", "star": "⭐",
    "tick": "✅", "check": "✅", "đúng": "✅",
    "sai": "❌", "wrong": "❌", "no": "❌",
    "cảnh báo": "⚠️", "warning": "⚠️",
    "thông tin": "ℹ️", "info": "ℹ️",
    "câu hỏi": "❓", "question": "❓",
    "cảm thán": "❗", "exclamation": "❗",
    "tăng": "⬆️", "up": "⬆️", "lên": "⬆️",
    "giảm": "⬇️", "down": "⬇️", "xuống": "⬇️",
    "trái": "⬅️", "left": "⬅️",
    "phải": "➡️", "right": "➡️"
  }
};

// ===== PROTOCOL DETECTION =====
function isFileProtocol() {
  return window.location.protocol === 'file:';
}

function isLocalhost() {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '';
}

// ===== DICTIONARY AUTO-DISCOVERY & LOADING =====
async function loadEmojiDictionary() {
  if (isLoading) {
    debugLog('⏳ Dictionary loading đã đang chạy, bỏ qua...');
    return;
  }

  try {
    isLoading = true;
    debugLog('🚀 Bắt đầu tải hệ thống từ điển...');
    showDebugPanel(); // Show debug panel when loading starts
    showLoadingState('Đang khám phá và tải từ điển...');

    // Try to load a single test file first
    debugLog('🧪 Test: Thử tải file emotions.json...');
    const testResponse = await fetch('./assets/dictionary/emotions.json');
    debugLog(`🧪 Test response status: ${testResponse.status}`);

    if (!testResponse.ok) {
      throw new Error(`Cannot load test file: ${testResponse.status}`);
    }

    const testData = await testResponse.json();
    debugLog(`🧪 Test data loaded: ${testData.name} with ${Object.keys(testData.words).length} words`);

    // Load config first
    debugLog('📋 Bước 1: Tải config...');
    await loadDictionaryConfig();

    // Auto-discover or use config list
    debugLog('🔍 Bước 2: Khám phá file...');
    const dictionaryFiles = await discoverDictionaryFiles();

    if (dictionaryFiles.length === 0) {
      throw new Error('Không tìm thấy file từ điển nào');
    }

    // Load all dictionary files
    debugLog('📚 Bước 3: Tải file...');
    await loadAllDictionaries(dictionaryFiles);

    // Merge all dictionaries
    debugLog('🔄 Bước 4: Gộp từ điển...');
    mergeDictionaries();

    const totalWords = Object.keys(emojiDictionary).length;
    const totalDictionaries = Object.keys(loadedDictionaries).length;

    if (totalWords === 0) {
      throw new Error('Không có từ nào được tải');
    }

    debugLog(`✅ Hoàn thành! ${totalDictionaries} từ điển với ${totalWords} từ`);
    showToast(`Đã tải ${totalDictionaries} từ điển với ${totalWords}+ từ thành công!`, 'success');

    // Update UI with dictionary info
    updateDictionaryInfo();

  } catch (error) {
    debugLog('❌ Lỗi khi tải từ điển emoji: ' + error.message);
    console.error('❌ Lỗi chi tiết:', error);

    // Try simple method first
    debugLog('🔧 Thử phương pháp tải đơn giản...');
    try {
      const simpleDict = await loadSingleFileTest();
      if (simpleDict) {
        emojiDictionary = simpleDict;
        debugLog(`✅ Tải đơn giản thành công: ${Object.keys(emojiDictionary).length} từ`);
        showToast(`Đã tải từ điển với ${Object.keys(emojiDictionary).length} từ!`, 'success');
        updateDictionaryInfo();
        return;
      }
    } catch (simpleError) {
      debugLog('❌ Phương pháp đơn giản cũng thất bại: ' + simpleError.message);
    }

    showToast('Không thể tải từ điển emoji. Sử dụng từ điển dự phòng!', 'warning');

    // Final fallback to basic dictionary
    loadFallbackDictionary();
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
      debugLog('📋 Đã tải config từ điển');
    } else {
      debugLog(`⚠️ Config không tải được (${response.status}), sử dụng auto-discovery`);
      dictionaryConfig = { autoDiscovery: true, dictionaries: [] };
    }
  } catch (error) {
    debugLog('⚠️ Không thể tải config: ' + error.message);
    dictionaryConfig = { autoDiscovery: true, dictionaries: [] };
  }
}

async function discoverDictionaryFiles() {
  // If config exists and auto-discovery is disabled, use config list
  if (dictionaryConfig && !dictionaryConfig.autoDiscovery && dictionaryConfig.dictionaries) {
    debugLog('📋 Sử dụng danh sách từ config');
    return dictionaryConfig.dictionaries
      .filter(dict => dict.enabled)
      .sort((a, b) => a.priority - b.priority)
      .map(dict => dict.filename);
  }

  // Auto-discovery: Try common dictionary files
  debugLog('🔍 Bắt đầu auto-discovery...');
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
      debugLog(`🔍 Đang kiểm tra: ${filename}`);
      const response = await fetch(`./assets/dictionary/${filename}`);
      if (response.ok) {
        existingFiles.push(filename);
        debugLog(`✅ Tìm thấy: ${filename}`);
      } else {
        debugLog(`❌ Không tìm thấy: ${filename} (${response.status})`);
      }
    } catch (error) {
      debugLog(`❌ Lỗi khi tải ${filename}: ${error.message}`);
    }
  }

  debugLog(`📁 Tổng cộng tìm thấy ${existingFiles.length} file: ${existingFiles.join(', ')}`);
  return existingFiles;
}

async function loadAllDictionaries(filenames) {
  console.log(`📚 Bắt đầu tải ${filenames.length} từ điển:`, filenames);

  if (filenames.length === 0) {
    console.warn('⚠️ Không có file từ điển nào để tải');
    return;
  }

  const loadPromises = filenames.map(filename => loadSingleDictionary(filename));
  const results = await Promise.allSettled(loadPromises);

  let successCount = 0;
  let errorCount = 0;

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successCount++;
      console.log(`✅ Thành công: ${filenames[index]}`);
    } else {
      errorCount++;
      console.error(`❌ Lỗi tải ${filenames[index]}:`, result.reason);
    }
  });

  console.log(`📊 Kết quả tải: ${successCount} thành công, ${errorCount} lỗi`);
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
    console.log(`📚 Đã tải ${dictionary.name}: ${Object.keys(dictionary.words).length} từ`);

    return dictionary;
  } catch (error) {
    console.error(`❌ Lỗi tải ${filename}:`, error);
    throw error;
  }
}

function mergeDictionaries() {
  console.log(`🔄 Bắt đầu gộp ${Object.keys(loadedDictionaries).length} từ điển...`);

  if (Object.keys(loadedDictionaries).length === 0) {
    console.warn('⚠️ Không có từ điển nào để gộp');
    return;
  }

  emojiDictionary = {};

  // Sort dictionaries by priority if available
  const sortedDictionaries = Object.values(loadedDictionaries)
    .sort((a, b) => (a.priority || 999) - (b.priority || 999));

  console.log('📋 Thứ tự ưu tiên:', sortedDictionaries.map(d => `${d.name} (${d.priority || 'no priority'})`));

  // Merge all dictionaries (later ones override earlier ones for same keys)
  sortedDictionaries.forEach(dictionary => {
    const wordCount = Object.keys(dictionary.words).length;
    Object.assign(emojiDictionary, dictionary.words);
    console.log(`➕ Đã thêm ${wordCount} từ từ "${dictionary.name}"`);
  });

  const totalWords = Object.keys(emojiDictionary).length;
  console.log(`✅ Hoàn thành gộp: ${totalWords} từ tổng cộng`);
}function loadFallbackDictionary() {
  debugLog('🔄 Sử dụng từ điển dự phòng...');

  // Use fallback from config if available
  if (dictionaryConfig?.fallback?.basicWords) {
    emojiDictionary = { ...dictionaryConfig.fallback.basicWords };
    debugLog(`📚 Dùng fallback từ config: ${Object.keys(emojiDictionary).length} từ`);
  } else {
    // Hard-coded fallback
    emojiDictionary = {
      'yêu': '❤️', 'love': '❤️',
      'vui': '😊', 'happy': '😊',
      'buồn': '😢', 'sad': '😢',
      'pizza': '🍕', 'cà phê': '☕', 'coffee': '☕',
      'mèo': '🐱', 'cat': '🐱',
      'chó': '🐶', 'dog': '🐶',
      'mặt trời': '☀️', 'sun': '☀️',
      'mưa': '🌧️', 'rain': '🌧️'
    };
    debugLog(`📚 Dùng fallback hard-coded: ${Object.keys(emojiDictionary).length} từ`);
  }

  // Update UI
  updateDictionaryInfo();
  showToast(`Đã tải từ điển dự phòng với ${Object.keys(emojiDictionary).length} từ cơ bản!`, 'success');
}// ===== DEBUG FUNCTIONS =====
function debugLog(message) {
  console.log(message);
  const debugContent = document.getElementById('debugContent');
  if (debugContent) {
    debugContent.textContent += new Date().toLocaleTimeString() + ': ' + message + '\n';
    debugContent.scrollTop = debugContent.scrollHeight;
  }
}

function toggleDebug() {
  const debugPanel = document.getElementById('debugPanel');
  if (debugPanel) {
    debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
  }
}

function showDebugPanel() {
  const debugPanel = document.getElementById('debugPanel');
  if (debugPanel) {
    debugPanel.style.display = 'block';
  }
}

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

  // Split text into words while preserving punctuation and spacing
  const words = text.split(/(\s+|[.,!?;:])/);

  return words.map(word => {
    const cleanWord = word.toLowerCase().trim();

    // Skip empty strings and pure whitespace/punctuation
    if (!cleanWord || /^[\s.,!?;:]+$/.test(word)) {
      return word;
    }

    // Check for exact matches first
    if (emojiDictionary[cleanWord]) {
      return emojiDictionary[cleanWord];
    }

    // Check for partial matches (useful for compound words)
    for (const [key, emoji] of Object.entries(emojiDictionary)) {
      if (cleanWord.includes(key) && key.length > 2) {
        return word.replace(new RegExp(key, 'gi'), emoji);
      }
    }

    return word;
  }).join('');
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

// ===== SIMPLE FALLBACK LOADER =====
async function loadSingleFileTest() {
  const filesToTry = [
    'emotions.json',
    'food.json',
    'animals.json'
  ];

  for (const filename of filesToTry) {
    try {
      debugLog(`🧪 Thử tải: ${filename}`);
      const response = await fetch(`./assets/dictionary/${filename}`);

      if (response.ok) {
        const data = await response.json();
        debugLog(`✅ Thành công tải ${filename}: ${Object.keys(data.words).length} từ`);
        return data.words;
      } else {
        debugLog(`❌ Lỗi ${filename}: ${response.status}`);
      }
    } catch (error) {
      debugLog(`❌ Exception ${filename}: ${error.message}`);
    }
  }

  debugLog('❌ Không tải được file nào, dùng từ điển cứng');
  return null;
}function handleCopy() {
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
