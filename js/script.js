// Use this URL to fetch NASA APOD JSON data.
const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

// Did You Know facts will be loaded from data/facts.json (if available).
let DYK_FACTS = [];

async function loadFacts() {
	try {
		const res = await fetch('/data/facts.json', { cache: 'no-cache' });
		if (!res.ok) throw new Error(`Failed to load facts.json: ${res.status}`);
		const json = await res.json();
		if (!Array.isArray(json)) throw new Error('facts.json must contain a JSON array');
		DYK_FACTS = json.filter(Boolean);
		console.info(`Loaded ${DYK_FACTS.length} facts from /data/facts.json`);
	} catch (err) {
		console.warn('Could not load facts.json — falling back to built-in facts.', err);
		// fallback facts (small set)
		DYK_FACTS = [
			'Venus spins backwards — its day is longer than its year.',
			'A spoonful of a neutron star would weigh about a billion tons on Earth.',
			'Light from the Sun takes ~8 minutes 20 seconds to reach Earth.'
		];
	}
}

function showRandomFact() {
	const el = document.getElementById('dyk-text');
	if (!el) return;
	if (!DYK_FACTS || DYK_FACTS.length === 0) {
		el.textContent = 'No facts available.';
		return;
	}
	const idx = Math.floor(Math.random() * DYK_FACTS.length);
	el.textContent = DYK_FACTS[idx];
}

// NOTE: facts are not loaded on initial page load. They will be loaded
// and displayed only after the user requests the gallery. This avoids
// showing facts on the landing view and removes the need for a "New fact" button.

// Grab DOM elements
const gallery = document.getElementById('gallery');
const fetchBtn = document.getElementById('getImageBtn');
const container = document.querySelector('.container');

// When the button is clicked, fetch the APOD JSON and render a gallery
fetchBtn.addEventListener('click', async () => {
	// basic UI feedback
	fetchBtn.disabled = true;
	const originalText = fetchBtn.textContent;
	fetchBtn.textContent = 'Loading...';

	// show loading placeholder in the gallery while we fetch
	// remove centering so the gallery layout can take over
	if (container && container.classList.contains('centered')) {
		container.classList.remove('centered');
	}

	gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">🔄</div><p>Loading space photos…</p></div>';

	try {
		const res = await fetch(apodData);
		if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
		const data = await res.json();
			renderGallery(data);
			// After successfully rendering the gallery, load and show a random fact.
			// We await loadFacts so the DYK text is populated from the external JSON
			// (if available) immediately after the gallery is displayed.
			try {
				await loadFacts();
				showRandomFact();
			} catch (err) {
				// loadFacts already handles fallback; log just in case
				console.warn('Failed to load/show facts after gallery:', err);
			}
			// Hide the Fetch button now that the gallery is shown
			try {
				if (fetchBtn) fetchBtn.style.display = 'none';
			} catch (e) {
				console.warn('Could not hide fetch button:', e);
			}
	} catch (err) {
		showError(err.message || 'Unknown error');
	} finally {
		fetchBtn.disabled = false;
		fetchBtn.textContent = originalText;
	}
});

// Render the gallery from the array of items returned by the API
function renderGallery(items) {
	// clear placeholder / previous content
	gallery.innerHTML = '';

	if (!Array.isArray(items) || items.length === 0) {
		gallery.innerHTML = '<div class="placeholder"><p>No images available.</p></div>';
		return;
	}

	const fragment = document.createDocumentFragment();

	// limit number of items to keep the page snappy
	const limit = Math.min(items.length, 30);

	for (let i = 0; i < limit; i++) {
		const item = items[i];

		const card = document.createElement('article');
		card.className = 'gallery-item';

		// Image handling
		if (item.media_type === 'image') {
			const img = document.createElement('img');
			// prefer the regular url, fallback to hdurl
			img.src = item.url || item.hdurl || '';
			img.alt = item.title || 'Space image';
			img.loading = 'lazy';
			card.appendChild(img);
		} else if (item.media_type === 'video') {
			// For videos: show thumbnail if available, add a play badge, and provide a clear link.
			if (item.thumbnail_url) {
				const thumb = document.createElement('img');
				thumb.src = item.thumbnail_url;
				thumb.alt = item.title || 'Video thumbnail';
				thumb.loading = 'lazy';
				card.appendChild(thumb);
				// play badge
				const badge = document.createElement('div');
				badge.className = 'video-badge';
				card.appendChild(badge);
				// clear link under the thumbnail
				const overlay = document.createElement('div');
				overlay.style.padding = '8px 0';
				const openText = document.createElement('a');
				openText.href = item.url || '#';
				openText.target = '_blank';
				openText.rel = 'noopener noreferrer';
				openText.textContent = 'Open video';
				overlay.appendChild(openText);
				card.appendChild(overlay);
			} else {
				const stub = document.createElement('div');
				stub.style.minHeight = '200px';
				stub.style.display = 'flex';
				stub.style.alignItems = 'center';
				stub.style.justifyContent = 'center';
				stub.style.background = '#111';
				stub.style.color = 'white';
				stub.style.borderRadius = '4px';
				stub.textContent = 'Video — click to open';
				card.appendChild(stub);
				const link = document.createElement('a');
				link.href = item.url || '#';
				link.target = '_blank';
				link.rel = 'noopener noreferrer';
				link.style.display = 'block';
				link.style.marginTop = '8px';
				link.textContent = 'Open video';
				card.appendChild(link);
			}
		} else {
			// unknown media: show url if present
			if (item.url) {
				const link = document.createElement('a');
				link.href = item.url || '#';
				link.target = '_blank';
				link.rel = 'noopener noreferrer';
				link.textContent = 'Open media';
				card.appendChild(link);
			}
		}

		// Title
		const title = document.createElement('h3');
		title.textContent = item.title || 'Untitled';
		title.style.fontSize = '16px';
		title.style.marginTop = '10px';
		card.appendChild(title);

		// Date
		const date = document.createElement('p');
		date.textContent = item.date ? formatDate(item.date) : '';
		date.style.color = '#666';
		date.style.fontSize = '13px';
		card.appendChild(date);

		// open modal on card click (ignore clicks on links inside the card)
		card.addEventListener('click', (e) => {
			if (e.target.closest('a')) return; // let links behave normally
			openModal(item);
		});

		fragment.appendChild(card);
	}

	gallery.appendChild(fragment);
}

function showError(message) {
	gallery.innerHTML = `<div class="placeholder"><p>Error: ${escapeHtml(message)}</p></div>`;
}

// small helper: format YYYY-MM-DD into a friendlier string
function formatDate(iso) {
	try {
		const d = new Date(iso);
		return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
	} catch (e) {
		return iso;
	}
}

// escape HTML used in error messages
function escapeHtml(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

/* Modal: create once and populate on demand */
const modal = createModal();

function createModal() {
 	// overlay
 	const overlay = document.createElement('div');
 	overlay.className = 'modal-overlay';

 	const dialog = document.createElement('div');
 	dialog.className = 'modal';

 	// header: title area + close
 	const header = document.createElement('div');
 	header.className = 'modal-header';

 	const titleWrap = document.createElement('div');
 	const titleEl = document.createElement('h2');
 	titleEl.id = 'modal-title';
 	titleWrap.appendChild(titleEl);

 	const closeBtn = document.createElement('button');
 	closeBtn.className = 'modal-close';
 	closeBtn.setAttribute('aria-label', 'Close');
 	closeBtn.innerHTML = '✕';

 	header.appendChild(titleWrap);
 	header.appendChild(closeBtn);

 	// body
 	const body = document.createElement('div');
 	body.className = 'modal-body';

 	const mediaWrap = document.createElement('div');
 	mediaWrap.id = 'modal-media';

 	const meta = document.createElement('div');
 	meta.className = 'meta';
 	meta.id = 'modal-meta';

 	const explanation = document.createElement('div');
 	explanation.className = 'explanation';
 	explanation.id = 'modal-explanation';

 	body.appendChild(mediaWrap);
 	body.appendChild(meta);
 	body.appendChild(explanation);

 	dialog.appendChild(header);
 	dialog.appendChild(body);
 	overlay.appendChild(dialog);

 	document.body.appendChild(overlay);

 	// events
 	closeBtn.addEventListener('click', closeModal);
 	overlay.addEventListener('click', (e) => {
 		if (e.target === overlay) closeModal();
 	});

 	// close on ESC
 	document.addEventListener('keydown', (e) => {
 		if (e.key === 'Escape' && overlay.classList.contains('show')) {
 			closeModal();
 		}
 	});

 	return {
 		overlay,
 		dialog,
 		titleEl,
 		mediaWrap,
 		meta,
 		explanation,
 	};
}

function openModal(item) {
 	// populate title + meta
 	modal.titleEl.textContent = item.title || 'Untitled';
 	modal.meta.textContent = item.date ? formatDate(item.date) : '';

 	// explanation
 	modal.explanation.textContent = item.explanation || '';

 	// media
 	modal.mediaWrap.innerHTML = '';
 	if (item.media_type === 'image') {
 		const img = document.createElement('img');
 		img.src = item.hdurl || item.url || '';
 		img.alt = item.title || 'Space image';
 		modal.mediaWrap.appendChild(img);
 	} else if (item.media_type === 'video' && item.url) {
 		// If YouTube/Vimeo, embed; otherwise show link + optional thumbnail
 		if (item.url.includes('youtube') || item.url.includes('youtu.be') || item.url.includes('vimeo')) {
 			const iframe = document.createElement('iframe');
 			iframe.src = item.url.replace('watch?v=', 'embed/');
 			iframe.width = '100%';
 			iframe.height = '420';
 			iframe.frameBorder = '0';
 			iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
 			iframe.allowFullscreen = true;
 			modal.mediaWrap.appendChild(iframe);
 		} else if (item.thumbnail_url) {
 			const thumb = document.createElement('img');
 			thumb.src = item.thumbnail_url;
 			thumb.alt = item.title || 'Video thumbnail';
 			modal.mediaWrap.appendChild(thumb);
 			const link = document.createElement('p');
 			link.innerHTML = `<a class="modal-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Open video in new tab</a>`;
 			modal.mediaWrap.appendChild(link);
 		} else {
 			const link = document.createElement('p');
 			link.innerHTML = `<a class="modal-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Open media</a>`;
 			modal.mediaWrap.appendChild(link);
 		}
 	} else {
 		// unknown media: show url if present
 		if (item.url) {
 			const link = document.createElement('p');
 			link.innerHTML = `<a class="modal-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Open media</a>`;
 			modal.mediaWrap.appendChild(link);
 		}
 	}

 	// show overlay
 	modal.overlay.classList.add('show');

 	// focus close for accessibility
 	const closeButton = modal.overlay.querySelector('.modal-close');
 	if (closeButton) closeButton.focus();
}

function closeModal() {
 	modal.overlay.classList.remove('show');
}

/* ---------- Starfield background (canvas) ---------- */
;(function initStarfield() {
	const canvas = document.getElementById('starfield');
	if (!canvas) return;

	const ctx = canvas.getContext('2d');
	let stars = [];
	let width = 0;
	let height = 0;

	function resize() {
		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
		createStars();
	}

	function createStars() {
		stars = [];
		// Number of stars scales with viewport area
		const area = width * height;
		const count = Math.max(80, Math.floor(area / 9000));
		for (let i = 0; i < count; i++) {
			stars.push({
				x: Math.random() * width,
				y: Math.random() * height,
				r: Math.random() * 1.6 + 0.3,
				base: Math.random() * 0.8 + 0.2,
				phase: Math.random() * Math.PI * 2,
				speed: Math.random() * 0.02 + 0.002,
			});
		}
	}

	let last = performance.now();
	function frame(now) {
		const dt = now - last;
		last = now;
		// clear with a very soft alpha so stars leave a faint trail (subtle)
		ctx.clearRect(0, 0, width, height);

		for (let i = 0; i < stars.length; i++) {
			const s = stars[i];
			s.phase += s.speed * (dt * 0.06);
			const a = s.base + Math.sin(s.phase) * 0.4 * s.base;
			ctx.beginPath();
			ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, a))})`;
			ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
			ctx.fill();
		}

		// occasional larger glow / shooting star
		requestAnimationFrame(frame);
	}

	// init
	window.addEventListener('resize', resize);
	resize();
	requestAnimationFrame(frame);
})();