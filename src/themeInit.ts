// Theme initialization script to prevent FOUC
// This runs before React loads to apply the correct theme immediately

(function initializeTheme() {
  // Add loading class to body to hide content initially
  document.body.classList.add('theme-loading');
  
  try {
    // Get stored theme preference
    const stored = localStorage.getItem('theme-storage');
    let isDarkMode = true; // Default to dark mode
    
    if (stored) {
      const parsed = JSON.parse(stored);
      isDarkMode = parsed.state?.isDarkMode ?? true;
    }
    
    // Apply theme immediately
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
    
    // Remove loading class after a brief delay to ensure styles are applied
    setTimeout(() => {
      document.body.classList.remove('theme-loading');
      document.body.classList.add('theme-loaded');
    }, 10);
    
  } catch (error) {
    console.warn('Failed to initialize theme:', error);
    // Fallback to dark mode
    document.documentElement.classList.remove('light');
    document.body.classList.remove('theme-loading');
    document.body.classList.add('theme-loaded');
  }
})();