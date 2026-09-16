/**
 * Guowei Li (李國維) - Personal Website Core Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Clock & Date
  const hourDigit = document.getElementById('hourDigit');
  const minuteDigit = document.getElementById('minuteDigit');
  const secondDigit = document.getElementById('secondDigit');
  const ampmIndicator = document.getElementById('ampmIndicator');
  const clockFormatBtn = document.getElementById('clockFormatBtn');
  const formatModeDisplay = document.getElementById('formatModeDisplay');
  const fullDateDisplay = document.getElementById('fullDateDisplay');
  const dayOfWeekDisplay = document.getElementById('dayOfWeekDisplay');
  const dayOfYearDisplay = document.getElementById('dayOfYearDisplay');
  const dayProgressBar = document.getElementById('dayProgressBar');
  const dayProgressPercent = document.getElementById('dayProgressPercent');
  const greetingText = document.getElementById('greetingText');
  const greetingIcon = document.getElementById('greetingIcon');
  const currentYearSpan = document.getElementById('currentYear');

  // DOM Elements - Theme & Actions
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const copyShareBtn = document.getElementById('copyShareBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  // State
  let is24HourFormat = localStorage.getItem('kw_clock_format') !== '12h'; // default 24h
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // ==========================================================================
  // 1. Live Clock & Date Update Logic
  // ==========================================================================
  function updateClock() {
    const now = new Date();

    // Time values
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // 12 / 24 hour mode handling
    let ampmText = '';
    if (!is24HourFormat) {
      ampmText = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 becomes 12
      ampmIndicator.style.display = 'inline-block';
      ampmIndicator.textContent = ampmText;
    } else {
      ampmIndicator.style.display = 'none';
    }

    // Number zero padding
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // Render digits
    if (hourDigit.textContent !== formattedHours) hourDigit.textContent = formattedHours;
    if (minuteDigit.textContent !== formattedMinutes) minuteDigit.textContent = formattedMinutes;
    secondDigit.textContent = formattedSeconds;

    // Date display (Month Day, Year)
    const year = now.getFullYear();
    const month = monthNames[now.getMonth()];
    const date = now.getDate();
    fullDateDisplay.textContent = `${month} ${date}, ${year}`;
    if (currentYearSpan) currentYearSpan.textContent = year;

    // Day of the week
    dayOfWeekDisplay.textContent = weekDays[now.getDay()];

    // Day of the year
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    dayOfYearDisplay.textContent = `Day ${dayOfYear}`;

    // Day Progress (%)
    const totalSecondsToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const percentToday = ((totalSecondsToday / 86400) * 100).toFixed(1);
    dayProgressPercent.textContent = `${percentToday}%`;
    dayProgressBar.style.width = `${percentToday}%`;

    // Dynamic greeting based on time of day
    updateGreeting(now.getHours());
  }

  // ==========================================================================
  // 2. Smart Time-Aware Greeting
  // ==========================================================================
  function updateGreeting(hour) {
    let greeting = '';
    let iconClass = 'ph-fill ';

    if (hour >= 5 && hour < 11) {
      greeting = 'Good morning, Guowei Li! Wishing you a productive and energetic day.';
      iconClass += 'ph-sun';
    } else if (hour >= 11 && hour < 14) {
      greeting = 'Good day, Guowei Li! Hope you are having a wonderful afternoon.';
      iconClass += 'ph-sun-horizon';
    } else if (hour >= 14 && hour < 18) {
      greeting = 'Good afternoon, Guowei Li! Keep up the momentum and focus.';
      iconClass += 'ph-sun-dim';
    } else if (hour >= 18 && hour < 23) {
      greeting = 'Good evening, Guowei Li! Relax and unwind after a great day.';
      iconClass += 'ph-moon-stars';
    } else {
      greeting = 'Working late, Guowei Li? Remember to take care and rest well.';
      iconClass += 'ph-moon';
    }

    if (greetingText.textContent !== greeting) {
      greetingText.textContent = greeting;
      greetingIcon.className = iconClass;
    }
  }

  // ==========================================================================
  // 3. 12 / 24 Hour Format Toggle
  // ==========================================================================
  clockFormatBtn.addEventListener('click', () => {
    is24HourFormat = !is24HourFormat;
    formatModeDisplay.textContent = is24HourFormat ? '24H' : '12H';
    localStorage.setItem('kw_clock_format', is24HourFormat ? '24h' : '12h');
    updateClock();
    showToast(`Switched to ${is24HourFormat ? '24' : '12'}-Hour format`);
  });

  // Initialize button text
  formatModeDisplay.textContent = is24HourFormat ? '24H' : '12H';

  // ==========================================================================
  // 4. Dark / Light Theme Toggle
  // ==========================================================================
  const savedTheme = localStorage.getItem('kw_theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    applyThemeIcon(savedTheme);
  } else {
    // Detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', initialTheme);
    applyThemeIcon(initialTheme);
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('kw_theme', newTheme);
    applyThemeIcon(newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} mode`);
  });

  function applyThemeIcon(theme) {
    if (theme === 'light') {
      themeIcon.className = 'ph ph-sun';
    } else {
      themeIcon.className = 'ph ph-moon';
    }
  }

  // ==========================================================================
  // 5. Share Button & Toast Notification
  // ==========================================================================
  let toastTimer = null;
  function showToast(message) {
    toastMessage.textContent = message;
    toastNotification.classList.add('show');
    
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2500);
  }

  copyShareBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.location.href) {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Website link copied to clipboard!');
      } else {
        showToast('Website: ' + window.location.href);
      }
    } catch (err) {
      showToast('Welcome to Guowei Li\'s personal website!');
    }
  });

  // ==========================================================================
  // 6. Start Live Clock
  // ==========================================================================
  updateClock();
  setInterval(updateClock, 1000);
});
