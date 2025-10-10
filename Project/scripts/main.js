/* scripts/main.js
   - Implements: multiple functions, DOM selection & modification, event listening,
     conditional branching, objects/arrays/array methods, template literals ONLY for outputs,
     localStorage, lazy loading fallback (IntersectionObserver).
*/

// ---- Utilities & Data ----

// Auto update year (DOM)
(function setYear(){
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = `${new Date().getFullYear()}`;
})();

// Data: array of temple objects (object + array use)
const temples = [
  { id: 'saltlake', name: 'Salt Lake Temple', year: 1893, location: 'Salt Lake City, USA', img: 'images/temples/salt-lake.jpg', description: 'Historic temple built over many years.' },
  { id: 'accra', name: 'Accra Ghana Temple', year: 2004, location: 'Accra, Ghana', img: 'images/temples/accra.jpg', description: 'Serving West Africa.' },
  { id: 'lagos', name: 'Lagos Nigeria Temple', year: 2022, location: 'Lagos, Nigeria', img: 'images/temples/lagos.jpg', description: 'A recent temple in Nigeria.' },
  { id: 'manila', name: 'Manila Philippines Temple', year: 1984, location: 'Manila, Philippines', img: 'images/temples/manila.jpg', description: 'Beautiful gardens and architecture.' },
  { id: 'london', name: 'London England Temple', year: 1958, location: 'London, UK', img: 'images/temples/london.jpg', description: 'A center for members in the UK.' }
];

// localStorage keys
const LS_KEYS = {
  favorites: 'templeAlbumFavorites',
  lastFilter: 'templeAlbumLastFilter'
};

// state
let favorites = new Set(JSON.parse(localStorage.getItem(LS_KEYS.favorites) || '[]'));

// ---- Rendering functions ----

// Render gallery (DOM manipulation + template literals)
function renderGallery(list = temples){
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  // Build cards using template literals (used exclusively for string output)
  const html = list.map(t => {
    const isFav = favorites.has(t.id);
    return `
      <article class="card" data-id="${t.id}">
        <figure>
          <img data-src="${t.img}" alt="${t.name} — ${t.location}" loading="lazy" />
        </figure>
        <div class="card-body">
          <h3>${t.name}</h3>
          <p>${t.location} • ${t.year}</p>
          <p>${t.description}</p>
          <div class="card-actions">
            <button class="btn" data-action="details" data-id="${t.id}">Details</button>
            <button class="btn-outline" data-action="fav" data-id="${t.id}">${isFav ? '★ Saved' : '☆ Save'}</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  gallery.innerHTML = html;
  updateFavCount();
  initLazyImages(); // start lazy loading behavior
}

// ---- Filtering & Sorting logic ----

function applyFilters(){
  const yearSelect = document.getElementById('yearSelect');
  const sortSelect = document.getElementById('sortSelect');
  const searchInput = document.getElementById('searchInput');
  if (!yearSelect || !sortSelect || !searchInput) return;

  const year = yearSelect.value;
  const sort = sortSelect.value;
  const q = (searchInput.value || '').trim().toLowerCase();

  // conditional branching for filter ranges
  let result = temples.filter(t => {
    if (year === 'before1900') return t.year < 1900;
    if (year === '1900to2000') return t.year >= 1900 && t.year < 2000;
    if (year === 'after2000') return t.year >= 2000;
    return true; // 'all'
  });

  // search by name (array method)
  if (q) {
    result = result.filter(t => t.name.toLowerCase().includes(q));
  }

  // sort (array methods)
  if (sort === 'nameAsc') result.sort((a,b) => a.name.localeCompare(b.name));
  if (sort === 'yearAsc') result.sort((a,b) => a.year - b.year);
  if (sort === 'yearDesc') result.sort((a,b) => b.year - a.year);

  // save filter choice
  localStorage.setItem(LS_KEYS.lastFilter, JSON.stringify({ year, sort, q }));

  renderGallery(result);
}

// ---- Favorites (object id usage + localStorage) ----

function toggleFavorite(id){
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  localStorage.setItem(LS_KEYS.favorites, JSON.stringify(Array.from(favorites)));
  // Re-render cards to update button text
  applyFilters();
}

function updateFavCount(){
  const el = document.getElementById('favCount');
  if (el) el.textContent = `${favorites.size}`;
}

// Show only favorites
function showFavorites(){
  const favArray = temples.filter(t => favorites.has(t.id));
  renderGallery(favArray);
}

// ---- Details (example of event delegation and DOM updates) ----

function showDetails(id){
  const temple = temples.find(t => t.id === id);
  if (!temple) return;
  // For demo we'll use alert — a modal could be built (keeps code short & accessible)
  alert(`${temple.name}\n${temple.location}\nDedicated: ${temple.year}\n\n${temple.description}`);
}

// ---- Contact form handling (validations + DOM feedback) ----

function handleContactForm(){
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const formData = new FormData(form);
    const name = (formData.get('name') || '').toString().trim();

    // simple validation (already many HTML validations present)
    if (!name) {
      status.textContent = 'Please provide your name.';
      return;
    }

    // mimic sending: store last message in localStorage (as a project requirement to use localStorage)
    const savedMessages = JSON.parse(localStorage.getItem('templeAlbumMessages') || '[]');
    savedMessages.push({ name, email: formData.get('email'), message: formData.get('message'), date: new Date().toISOString() });
    localStorage.setItem('templeAlbumMessages', JSON.stringify(savedMessages));

    // provide friendly UI feedback using template literal
    status.textContent = `Thanks, ${name}! Your message has been recorded.`;
    form.reset();
  });
}

// ---- Lazy load fallback: IntersectionObserver loads data-src into src ----

function initLazyImages(){
  const imgs = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    imgs.forEach(img => {
      // If browser supports native lazy, set src if it's in cache or small; otherwise rely on IO
      if (!img.loading || img.loading !== 'lazy') {
        io.observe(img);
      } else {
        // browser supports native lazy; set data-src to src so native lazy can use it
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    });
  } else {
    // fallback: load all immediately
    imgs.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// ---- Event delegation for gallery buttons ----

function attachGalleryListener(){
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  gallery.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (action === 'fav') toggleFavorite(id);
    else if (action === 'details') showDetails(id);
  });
}

// ---- Restore last state from localStorage ----

function restoreLastState(){
  const last = JSON.parse(localStorage.getItem(LS_KEYS.lastFilter) || 'null');
  if (last) {
    const yearSelect = document.getElementById('yearSelect');
    const sortSelect = document.getElementById('sortSelect');
    const searchInput = document.getElementById('searchInput');
    if (yearSelect) yearSelect.value = last.year || 'all';
    if (sortSelect) sortSelect.value = last.sort || 'nameAsc';
    if (searchInput) searchInput.value = last.q || '';
  }
}

// ---- Wiring up UI events ----

document.addEventListener('DOMContentLoaded', () => {
  // initial render
  restoreLastState();
  renderGallery(temples);
  attachGalleryListener();
  handleContactForm();

  // controls
  document.getElementById('filterBtn')?.addEventListener('click', applyFilters);
  document.getElementById('show-favorites')?.addEventListener('click', showFavorites);
  document.getElementById('favCount') && updateFavCount();

  // keyboard accessible filter: enter key on search applies filter
  document.getElementById('searchInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') applyFilters();
  });

  // restore favorites set from storage (already loaded above)
  updateFavCount();
});
