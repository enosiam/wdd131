/* scripts/main.js
   - Multiple functions
   - DOM selection & modification
   - Event listening
   - Conditional branching
   - Objects, arrays, array methods
   - Template literals exclusively for output strings
   - localStorage for favorites & contact messages
   - Lazy loading with IntersectionObserver
*/

(() => {
  // ---- Data: temple objects (edit image filenames in /images/) ----
  const temples = [
    { id: 'saltlake', name: 'Salt Lake Temple', location: 'Salt Lake City, USA', year: 1893, sqft: 253000, img: 'images2/salt1.jpg', desc: 'Historic centerpiece of Salt Lake City.' },
    { id: 'lagos', name: 'Lagos Nigeria Temple', location: 'Lagos, Nigeria', year: 2019, sqft: 40000, img: 'images2/lagos.jpg', desc: 'First temple in Nigeria.' },
    { id: 'laie', name: 'Laie, Hawaii, Temple', location: 'Laie, Hawaii, USA', year: 1919, sqft: 42000, img: 'images2/Laie.jpg', desc: 'Modern temple in Hawaii.' },
    { id: 'manila', name: 'Manila Philippines Temple', location: 'Manila, Philippines', year: 1984, sqft: 19000, img: 'images2/manila.jpg', desc: 'Beautiful gardens and architecture.' },
    { id: 'papeete', name: 'Papeete, Tahiti Temple', location: 'Papeete, Tahiti', year: 1983, sqft: 12877, img: 'images2/papeete.jpeg', desc: 'Papeete, Tahiti' },
    { id: 'hongkong', name: 'Hong Kong China Temple', location: 'Hong Kong, China', year: 2016, sqft: 20000, img: 'images2/hong2.jpeg', desc: 'First temple in China.' }
  ];

  // ---- localStorage keys & state ----
  const LS_KEYS = { FAVS: 'tg_favs_v1', CONTACTS: 'tg_contacts_v1' };
  let favorites = new Set(JSON.parse(localStorage.getItem(LS_KEYS.FAVS) || '[]'));

  // ---- Helpers ----
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // ---- Year auto-update for footer (used in pages) ----
  function setYear() {
    const el = $('#year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ---- Render gallery (template literals ONLY for output) ----
  function renderGallery(list) {
    const grid = $('#galleryGrid');
    if (!grid) return;
    const html = list.map(t => `
      <article class="card" data-id="${t.id}">
        <div class="card-figure">
          <img data-src="${t.img}" alt="${t.name} photo" loading="lazy">
        </div>
        <div class="card-body">
          <h3 class="card-title">${t.name}</h3>
          <div class="card-meta">${t.location} • ${t.year}</div>
          <p>${t.desc}</p>
          <div class="card-actions">
            <button class="fav-btn ${favorites.has(t.id) ? 'saved' : ''}" data-id="${t.id}" aria-pressed="${favorites.has(t.id) ? 'true' : 'false'}">
              ${favorites.has(t.id) ? '★ Favorite' : '☆ Add Favorite'}
            </button>
            <div class="card-size">${t.sqft.toLocaleString()} sq ft</div>
          </div>
        </div>
      </article>
    `).join('');
    grid.innerHTML = html;
    initLazyLoad();        // lazy-load images
    attachCardListeners(); // attach fav listeners
    setResultCount(list.length);
  }

  // ---- Lazy loading: IntersectionObserver fallback ----
  function initLazyLoad() {
    const imgs = $$('img[data-src]');
    if (!imgs.length) return;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            obs.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });
      imgs.forEach(img => io.observe(img));
    } else {
      imgs.forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
    }
  }

  // ---- Attach card-level listeners (favorites + keyboard support) ----
  function attachCardListeners() {
    const grid = $('#galleryGrid');
    if (!grid) return;
    // favorite buttons
    $$('.fav-btn', grid).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(btn.dataset.id);
      });
    });
    // keyboard Enter to toggle favorite when card focused
    $$('.card', grid).forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const id = card.getAttribute('data-id');
          toggleFavorite(id);
        }
      });
    });
  }

  // ---- Toggle favorite (update state & localStorage) ----
  function toggleFavorite(id) {
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    localStorage.setItem(LS_KEYS.FAVS, JSON.stringify(Array.from(favorites)));
    // re-render using current filters
    applyCurrentFilter();
  }

  // ---- Filter logic (conditional branching) ----
  let currentFilter = { type: 'all', q: '' };
  function applyFilter(filter) {
    currentFilter.type = filter;
    currentFilter.q = currentFilter.q || '';
    applyCurrentFilter();
  }
  function applySearch(q) {
    currentFilter.q = q.trim().toLowerCase();
    applyCurrentFilter();
  }
  function applyCurrentFilter() {
    let out = temples.slice(); // copy
    // Filter by type
    if (currentFilter.type === 'before1900') out = out.filter(t => t.year < 1900);
    else if (currentFilter.type === 'before1950') out = out.filter(t => t.year < 1950);
    else if (currentFilter.type === 'after2000') out = out.filter(t => t.year >= 2000);
    else if (currentFilter.type === 'largest') out = out.slice().sort((a,b)=>b.sqft - a.sqft).slice(0,3);
    else if (currentFilter.type === 'favorites') out = out.filter(t => favorites.has(t.id));

    // Search by name
    if (currentFilter.q) out = out.filter(t => t.name.toLowerCase().includes(currentFilter.q));

    renderGallery(out);
  }

  // ---- Show result count ----
  function setResultCount(n) {
    const el = $('#resultCount');
    if (el) el.textContent = `${n} temple${n===1 ? '' : 's'} shown`;
  }

  // ---- Show favorites toggle ----
  function toggleShowFavorites() {
    const btn = $('#showFavs');
    if (!btn) return;
    if (currentFilter.type === 'favorites') {
      applyFilter('all');
      btn.textContent = 'Show Favorites';
    } else {
      applyFilter('favorites');
      btn.textContent = 'Show All';
    }
  }

  // ---- Navigation toggle (mobile) ----
  function initNavToggle() {
    const toggle = $('.nav-toggle');
    const menu = $('#navMenu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !open);
      menu.style.display = open ? '' : 'flex';
    });
  }

  // ---- Search handling ----
  function initSearch() {
    const input = $('#searchInput');
    const btn = $('#searchBtn');
    if (!input || !btn) return;
    btn.addEventListener('click', () => applySearch(input.value));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') applySearch(input.value); });
  }

  // ---- Favorite button (Show favorites) ----
  function initShowFavs() {
    const btn = $('#showFavs');
    if (!btn) return;
    btn.addEventListener('click', toggleShowFavorites);
  }

  // ---- Attach control buttons (filter group) ----
  function initFilterControls() {
    $$('.control-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // update UI pressed state
        $$('.control-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
        btn.classList.add('active'); btn.setAttribute('aria-pressed','true');

        const filter = btn.getAttribute('data-filter');
        applyFilter(filter || 'all');
      });
    });
  }

  // ---- Contact form handling (validation + localStorage store) ----
  function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;
    const feedback = $('#formFeedback');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (form.fullname.value || '').trim();
      const email = (form.email.value || '').trim();
      const message = (form.message.value || '').trim();

      if (!name || !email || !message) {
        feedback.textContent = 'Please complete all required fields.';
        feedback.style.color = 'crimson';
        return;
      }

      // Save message to localStorage array (demo)
      const arr = JSON.parse(localStorage.getItem(LS_KEYS.CONTACTS) || '[]');
      arr.push({ name, email, message, date: new Date().toISOString() });
      localStorage.setItem(LS_KEYS.CONTACTS, JSON.stringify(arr));
      feedback.textContent = `Thanks, ${name}! Your message is recorded.`;
      feedback.style.color = 'green';
      form.reset();
    });
  }

  // ---- Attach favorite toggle listeners after render (used above) ----
  // (function defined earlier: attachCardListeners)

  // ---- Initialization on DOMContentLoaded ----
  document.addEventListener('DOMContentLoaded', () => {
    setYear();
    initNavToggle();
    initFilterControls();
    initSearch();
    initShowFavs();
    initContactForm();

    // render initial gallery
    renderGallery(temples);

    // wire up special filter buttons (in case some buttons have custom data-filter)
    const before1900Btn = document.querySelector('.control-btn[data-filter="before1900"]');
    // (nothing else required; control buttons already wired)
  });

  // ---- Expose small helpers for debugging (optional) ----
  window.templeAlbum = {
    getFavorites: () => Array.from(favorites),
    getTemples: () => temples.slice(),
    applyFilter
  };
})();

