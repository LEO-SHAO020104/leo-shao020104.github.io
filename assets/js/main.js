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

  /* ─── Publications: live search + filter chips ───── */
  (function () {
    var list = document.getElementById('pub-list');
    if (!list) return;
    var items = Array.prototype.slice.call(list.querySelectorAll('.pub-item'));
    var search = document.getElementById('pub-search');
    var catBtns = Array.prototype.slice.call(document.querySelectorAll('#cat-filters .filter-chip'));
    var yearBtns = Array.prototype.slice.call(document.querySelectorAll('#year-filters .filter-chip'));
    var shownEl = document.getElementById('pub-shown-count');
    var totalEl = document.getElementById('pub-total-count');
    var clearBtn = document.getElementById('pub-filter-clear');

    var activeCat = 'all';
    var activeYears = {};

    items.forEach(function (it) { it._text = it.textContent.toLowerCase(); });
    if (totalEl) totalEl.textContent = items.length;

    var empty = document.createElement('p');
    empty.className = 'pub-empty';
    empty.textContent = 'No publications match your filters.';
    empty.style.display = 'none';
    list.appendChild(empty);

    function anyActive(obj) {
      for (var k in obj) { if (obj[k]) return true; }
      return false;
    }

    function apply() {
      var q = ((search && search.value) || '').trim().toLowerCase();
      var yearOn = anyActive(activeYears);
      var shown = 0;
      items.forEach(function (it) {
        var okCat = (activeCat === 'all') || it.getAttribute('data-cat') === activeCat;
        var okYear = !yearOn || activeYears[it.getAttribute('data-year')];
        var okText = !q || it._text.indexOf(q) !== -1;
        var visible = okCat && okYear && okText;
        it.classList.toggle('is-hidden', !visible);
        if (visible) shown++;
      });
      if (shownEl) shownEl.textContent = shown;
      empty.style.display = shown ? 'none' : 'block';
    }

    // Category: single-select (radio), includes the "All" chip
    catBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        catBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeCat = btn.getAttribute('data-cat');
        apply();
      });
    });

    // Year: multi-select toggle
    yearBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var v = btn.getAttribute('data-year');
        if (activeYears[v]) { delete activeYears[v]; btn.classList.remove('active'); }
        else { activeYears[v] = true; btn.classList.add('active'); }
        apply();
      });
    });

    if (search) search.addEventListener('input', apply);
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        activeCat = 'all';
        catBtns.forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-cat') === 'all'); });
        Object.keys(activeYears).forEach(function (k) { delete activeYears[k]; });
        yearBtns.forEach(function (b) { b.classList.remove('active'); });
        if (search) search.value = '';
        apply();
      });
    }

    apply();
  })();

  /* ─── Home tab: scroll to top, clean URL (no #hash) ─ */
  var homeTab = document.querySelector('.nav-tab[data-target="about"]');
  if (homeTab) {
    homeTab.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try { history.replaceState(null, '', location.pathname + location.search); } catch (err) {}
    });
  }

  /* ─── Lightbox gallery: zoom + prev/next + caption ── */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('.lightbox-img');
    var lbCap = lb.querySelector('.lightbox-caption');
    var figs = Array.prototype.slice.call(document.querySelectorAll('.pub-figure'));
    var lbImgs = figs.map(function (f) { return f.querySelector('img'); });
    var cur = -1;

    function capOf(i) {
      var fc = figs[i] && figs[i].querySelector('figcaption');
      return fc ? fc.textContent.trim() : (lbImgs[i] ? lbImgs[i].alt : '');
    }
    function show(i) {
      if (!lbImgs.length) return;
      if (i < 0) i = lbImgs.length - 1;
      if (i >= lbImgs.length) i = 0;
      cur = i;
      var im = lbImgs[i];
      lbImg.src = im.currentSrc || im.src;
      lbImg.alt = im.alt || '';
      lbCap.textContent = capOf(i);
    }
    function openLb(i) {
      show(i);
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeLb() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      lbImg.src = '';
      lbCap.textContent = '';
      document.body.style.overflow = '';
    }

    lbImgs.forEach(function (im, i) {
      im.addEventListener('click', function () { openLb(i); });
    });

    var prevBtn = lb.querySelector('.lightbox-prev');
    var nextBtn = lb.querySelector('.lightbox-next');
    if (prevBtn) prevBtn.addEventListener('click', function (e) { e.stopPropagation(); show(cur - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function (e) { e.stopPropagation(); show(cur + 1); });

    // Click image: left half → previous, right half → next
    lbImg.addEventListener('click', function (e) {
      e.stopPropagation();
      var r = lbImg.getBoundingClientRect();
      show((e.clientX - r.left) > r.width / 2 ? cur + 1 : cur - 1);
    });

    // Click backdrop (not the figure/buttons) → close
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') show(cur + 1);
      else if (e.key === 'ArrowLeft') show(cur - 1);
    });
  }

  /* ─── Footer year ────────────────────────────────── */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

})();
