/**
 * 李國維 (Li Guo-wei) 個人網站 - 核心互動邏輯
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
  const greetingBadge = document.getElementById('greetingBadge');
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
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  // ==========================================================================
  // 1. 即時時鐘與日期更新邏輯
  // ==========================================================================
  function updateClock() {
    const now = new Date();

    // 時間數值
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // 12/24 小時制判斷
    let ampmText = '';
    if (!is24HourFormat) {
      ampmText = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0點轉為 12
      ampmIndicator.style.display = 'inline-block';
      ampmIndicator.textContent = ampmText;
    } else {
      ampmIndicator.style.display = 'none';
    }

    // 數字補零格式化
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // 渲染時鐘數字
    if (hourDigit.textContent !== formattedHours) hourDigit.textContent = formattedHours;
    if (minuteDigit.textContent !== formattedMinutes) minuteDigit.textContent = formattedMinutes;
    secondDigit.textContent = formattedSeconds;

    // 日期顯示 (年、月、日)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    fullDateDisplay.textContent = `${year} 年 ${month} 月 ${date} 日`;
    if (currentYearSpan) currentYearSpan.textContent = year;

    // 星期顯示
    dayOfWeekDisplay.textContent = weekDays[now.getDay()];

    // 一年中的第幾天 (Day of the year)
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    dayOfYearDisplay.textContent = `第 ${dayOfYear} 天`;

    // 當日進度百分比 (Day Progress)
    const totalSecondsToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const percentToday = ((totalSecondsToday / 86400) * 100).toFixed(1);
    dayProgressPercent.textContent = `${percentToday}%`;
    dayProgressBar.style.width = `${percentToday}%`;

    // 動態問候語 (根據時段自動變換)
    updateGreeting(now.getHours());
  }

  // ==========================================================================
  // 2. 時段問候語系統
  // ==========================================================================
  function updateGreeting(hour) {
    let greeting = '';
    let iconClass = 'ph-fill ';

    if (hour >= 5 && hour < 11) {
      greeting = '早安，李國維！迎接美好充滿活力的一天';
      iconClass += 'ph-sun';
    } else if (hour >= 11 && hour < 14) {
      greeting = '午安，李國維！享受美味午餐與充實時光';
      iconClass += 'ph-sun-horizon';
    } else if (hour >= 14 && hour < 18) {
      greeting = '下午好，李國維！保持專注與探索的熱情';
      iconClass += 'ph-sun-dim';
    } else if (hour >= 18 && hour < 23) {
      greeting = '晚安，李國維！放鬆身心享受美好的夜晚';
      iconClass += 'ph-moon-stars';
    } else {
      greeting = '夜深了，李國維！記得適度休息保重身體';
      iconClass += 'ph-moon';
    }

    if (greetingText.textContent !== greeting) {
      greetingText.textContent = greeting;
      greetingIcon.className = iconClass;
    }
  }

  // ==========================================================================
  // 3. 12 / 24 小時制切換
  // ==========================================================================
  clockFormatBtn.addEventListener('click', () => {
    is24HourFormat = !is24HourFormat;
    formatModeDisplay.textContent = is24HourFormat ? '24H' : '12H';
    localStorage.setItem('kw_clock_format', is24HourFormat ? '24h' : '12h');
    updateClock();
    showToast(`已切換為 ${is24HourFormat ? '24' : '12'} 小時制`);
  });

  // 初始化按鈕文字
  formatModeDisplay.textContent = is24HourFormat ? '24H' : '12H';

  // ==========================================================================
  // 4. 深色 / 淺色主題切換
  // ==========================================================================
  const savedTheme = localStorage.getItem('kw_theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    applyThemeIcon(savedTheme);
  } else {
    // 偵測系統設定
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
    showToast(`已切換為${newTheme === 'dark' ? '深色' : '淺色'}模式`);
  });

  function applyThemeIcon(theme) {
    if (theme === 'light') {
      themeIcon.className = 'ph ph-sun';
    } else {
      themeIcon.className = 'ph ph-moon';
    }
  }

  // ==========================================================================
  // 5. 分享按鈕與 Toast 提示
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
        showToast('已複製李國維個人網站連結！');
      } else {
        showToast('網站連結：' + window.location.href);
      }
    } catch (err) {
      showToast('歡迎參觀李國維的個人網站！');
    }
  });

  // ==========================================================================
  // 6. 啟動計時器
  // ==========================================================================
  updateClock();
  setInterval(updateClock, 1000);
});
