/* Shiliang Shao — site JS
   Theme toggle  ·  email copy  ·  accent picker  ·  active-tab scroll spy */

(function () {
  'use strict';

  var root = document.documentElement;

  /* ─── Theme toggle ───────────────────────────────── */
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var isDark = root.classList.toggle('dark');
      try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
    });
  }

  /* ─── Accent color picker ────────────────────────── */
  var PALETTE = {
    '#7DB544': ['#5A9A2E', '#A0D060', '#F0FDF4'],
    '#3B82F6': ['#1D4ED8', '#93C5FD', '#EFF6FF'],
    '#8B5CF6': ['#7C3AED', '#C4B5FD', '#F5F3FF'],
    '#0891B2': ['#0E7490', '#67E8F9', '#ECFEFF'],
    '#F59E0B': ['#D97706', '#FCD34D', '#FFFBEB']
  };

  function applyAccent(hex) {
    if (!PALETTE[hex]) return;
    var s = PALETTE[hex];
    root.style.setProperty('--accent',       hex);
    root.style.setProperty('--accent-dark',  s[0]);
    root.style.setProperty('--accent-light', s[1]);
    root.style.setProperty('--accent-pale',  s[2]);
  }
  function markActiveDot(hex) {
    document.querySelectorAll('.accent-dot').forEach(function (dot) {
      dot.classList.toggle('active', dot.getAttribute('data-accent') === hex);
    });
  }
  var currentAccent = '#0891B2';
  try {
    var stored = localStorage.getItem('accent');
    if (stored && PALETTE[stored]) currentAccent = stored;
  } catch (e) {}
  markActiveDot(currentAccent);

  document.querySelectorAll('.accent-dot').forEach(function (dot) {
    dot.addEventListener('click', function () {
      var hex = dot.getAttribute('data-accent');
      applyAccent(hex);
      markActiveDot(hex);
      try { localStorage.setItem('accent', hex); } catch (e) {}
    });
  });

  /* ─── Email copy buttons ─────────────────────────── */
  document.querySelectorAll('.email-copy-btn').forEach(function (btn) {
    var original = btn.getAttribute('data-original-label') || btn.textContent.trim();
    // For <a> elements that are mailto: we still want to handle click via copy
    btn.addEventListener('click', function (ev) {
      var email = btn.getAttribute('data-email');
      if (!email) return;
      ev.preventDefault();
      var done = function () {
        btn.classList.add('copied');
        btn.textContent = 'Copied ✓';
        setTimeout(function () {
          btn.classList.remove('copied');
          btn.textContent = original;
        }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, function () {
          window.prompt('Copy this address:', email);
        });
      } else {
        window.prompt('Copy this address:', email);
      }
    });
  });

  /* ─── Active-tab scroll spy ──────────────────────── */
  var tabs = Array.from(document.querySelectorAll('.nav-tab[data-target]'));
  var sectionMap = {};
  tabs.forEach(function (t) {
    var id = t.getAttribute('data-target');
    var sec = document.getElementById(id);
    if (sec) sectionMap[id] = sec;
  });

  function setActive(id) {
    tabs.forEach(function (t) {
      t.classList.toggle('active', t.getAttribute('data-target') === id);
    });
  }

  if ('IntersectionObserver' in window && Object.keys(sectionMap).length) {
    var io = new IntersectionObserver(function (entries) {
      // Pick the entry closest to the top that is intersecting
      var visible = entries
        .filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
      if (visible.length) {
        setActive(visible[0].target.id);
      }
    }, {
      // Top of section must cross 30% from the top of viewport
      rootMargin: '-30% 0px -55% 0px',
      threshold: 0
    });
    Object.values(sectionMap).forEach(function (sec) { io.observe(sec); });
  }

  /* ─── Footer year ────────────────────────────────── */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

})();
