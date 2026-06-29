/* Shiliang Shao — site JS
   Theme toggle  ·  email copy  ·  active-tab scroll spy */

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

  /* ─── Home tab: scroll to top, clean URL (no #hash) ─ */
  var homeTab = document.querySelector('.nav-tab[data-target="about"]');
  if (homeTab) {
    homeTab.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try { history.replaceState(null, '', location.pathname + location.search); } catch (err) {}
    });
  }

  /* ─── Lightbox: click a figure to view full-screen ─ */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('.lightbox-img');
    var closeLb = function () {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      lbImg.src = '';
      document.body.style.overflow = '';
    };
    document.querySelectorAll('.pub-figure img').forEach(function (img) {
      img.addEventListener('click', function () {
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt || '';
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });
    lb.addEventListener('click', closeLb);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('open')) closeLb();
    });
  }

  /* ─── Footer year ────────────────────────────────── */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

})();
