// ===== SIMPLE DICTIONARY LOADER (BACKUP) =====
// Fallback strategy nếu auto-discovery không hoạt động

async function loadSimpleDictionary() {
  debugLog('🔧 Thử phương pháp đơn giản...');

  const simpleDictionary = {
    'yêu': '❤️', 'love': '❤️', 'tình yêu': '❤️',
    'vui': '😊', 'happy': '😊', 'hạnh phúc': '😊',
    'buồn': '😢', 'sad': '😢', 'khóc': '😭',
    'cười': '😂', 'laugh': '😂', 'haha': '😂',
    'pizza': '🍕', 'bánh pizza': '🍕',
    'cà phê': '☕', 'coffee': '☕', 'cafe': '☕',
    'mèo': '🐱', 'cat': '🐱',
    'chó': '🐶', 'dog': '🐶',
    'mặt trời': '☀️', 'sun': '☀️', 'nắng': '☀️',
    'mưa': '🌧️', 'rain': '🌧️',
    'xe ô tô': '🚗', 'car': '🚗', 'ô tô': '🚗',
    'điện thoại': '📱', 'phone': '📱',
    'tim': '❤️', 'heart': '❤️',
    'sao': '⭐', 'star': '⭐'
  };

  return simpleDictionary;
}

// Try to load one file at a time
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

  return null;
}
