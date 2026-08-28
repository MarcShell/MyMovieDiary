// ===================== Navbar =====================

const popularContentNavbar = document.querySelector('#popular-content');
const topRatedContentNavbar = document.querySelector('#top-rated-content');
const upcomingContentNavbar = document.querySelector('#upcoming-content');
const watchlistContentNavbar = document.querySelector('#watchlist-content');

const navbarButtons = [
	popularContentNavbar,
	topRatedContentNavbar,
	upcomingContentNavbar,
	watchlistContentNavbar,
];

navbarButtons.forEach(function (button) {
	button.addEventListener('click', function () {
		// Button ID in localstorage speichern
		localStorage.setItem('activeNavId', button.id);

		if (button === watchlistContentNavbar) {
			if (window.location.pathname.includes('watchlist.html')) {
				window.location.reload();
			} else {
				window.location.href = '../watchlist.html';
			}
		} else {
			window.location.href = '../index.html';
		}
	});
});

// Beim Laden Seite aktiven Button wiederherstellen
function restoreActiveNav() {
	const savedId = localStorage.getItem('activeNavId');

	navbarButtons.forEach(function (btn) {
		btn.classList.remove('active');
	});

	if (savedId) {
		const activeButton = document.querySelector(`#${savedId}`);
		if (activeButton) {
			activeButton.classList.add('active');
		}
	}
}

restoreActiveNav();

// ===================== Modal =====================

const modal = document.querySelector('#modal');
const settings = document.querySelector('.navbar-actions');
const closeModalBtn = document.querySelector('#settings-x');
const lightThemeRadio = document.querySelector('#light-theme');
const darkThemeRadio = document.querySelector('#dark-theme');

settings.addEventListener('click', function () {
	modal.classList.add('open-modal');
});

closeModalBtn.addEventListener('click', function () {
	modal.classList.remove('open-modal');
});

// Klick außerhalb schließt das Modal
modal.addEventListener('click', function (event) {
	if (event.target === modal) {
		modal.classList.remove('open-modal');
	}
});

// Theme umschalten
lightThemeRadio.addEventListener('click', function () {
	document.documentElement.classList.remove('dark');
	localStorage.setItem('theme', 'light');
});

darkThemeRadio.addEventListener('click', function () {
	document.documentElement.classList.add('dark');
	localStorage.setItem('theme', 'dark');
});

document.addEventListener('DOMContentLoaded', function () {
	const savedTheme = localStorage.getItem('theme');

	if (savedTheme === 'dark') {
		darkThemeRadio.checked = true;
	} else {
		lightThemeRadio.checked = true;
	}
});

// ===================== Movie Grid =====================

let movieCardIds = localStorage.getItem('watchlist');

if (movieCardIds !== null && movieCardIds.length > 0) {
	movieCardIds = JSON.parse(movieCardIds);
} else {
	movieCardIds = [];
}

let favicon = 'fa-plus';

function renderCards(items) {
	const container = $('#movie-container');
	container.empty();

	items.forEach(function (item) {
		const isPerson = item.media_type === 'person';
		const image = isPerson ? item.profile_path : item.poster_path;

		if (!image) {
			return; // ohne Bild überspringen wir das Item komplett
		}

		const imageUrl = `https://image.tmdb.org/t/p/w500${image}`;
		const displayTitle = isPerson ? item.name : item.title || item.name;

		const year = item.release_date
			? item.release_date.split('-')[0]
			: item.first_air_date
				? item.first_air_date.split('-')[0]
				: null;

		const rating = item.vote_average ? item.vote_average.toFixed(2) : null;

		if (movieCardIds.some((entry) => entry.id === item.id)) {
			favicon = 'fa-check';
		} else {
			favicon = 'fa-plus';
		}

		let typeLabel;
		if (item.media_type === 'tv') {
			typeLabel = 'Serie';
		} else if (item.media_type === 'person') {
			typeLabel = 'Person';
		} else {
			typeLabel = 'Film';
		}

		const watchlistButton = isPerson
			? ''
			: `<button class="watchlist-button" title="Zur Watchlist hinzufügen">
					<i class="fa ${favicon}"></i>
				</button>`;

		const metaInfo = isPerson
			? `<span class="card-year">${item.known_for_department || ''}</span>`
			: `<span class="card-year">${year || 'Kein Veröffentlichungsjahr bekannt'}</span>
				<span class="card-rating"><i class="fa fa-star"></i> ${rating || 'Keine Bewertung bekannt'}</span>`;

		const card = `
			<div class="movie-card" data-id="${item.id}" data-media-type="${item.media_type}">
			<span class="card-type">${typeLabel}</span>
				<div class="card-image-wrap">
					<img src="${imageUrl}" alt="${displayTitle}">
					${watchlistButton}
				</div>

				<div class="card-info">
					<span class="card-title">${displayTitle}</span>
					<div class="card-meta">
						${metaInfo}
					</div>
				</div>
			</div>`;

		container.append(card);
	});
}

const movieContainer = document.querySelector('#movie-container');

movieContainer.addEventListener('click', function (card) {
	const movieCard = card.target.closest('.movie-card');
	const movieCardDataId = movieCard.dataset.id;
	const mediaType = movieCard.dataset.mediaType;
	const button = card.target.closest('.watchlist-button');

	if (button !== null) {
		const icon = button.querySelector('i');

		if (icon.classList.contains('fa-plus')) {
			icon.classList.replace('fa-plus', 'fa-check');
			movieCardIds.push({ id: Number(movieCardDataId), media_type: mediaType });
			localStorage.setItem('watchlist', JSON.stringify(movieCardIds));
		} else {
			icon.classList.replace('fa-check', 'fa-plus');
			movieCardIds = movieCardIds.filter(function (entry) {
				return entry.id !== Number(movieCardDataId);
			});
			localStorage.setItem('watchlist', JSON.stringify(movieCardIds));

			movieCard.remove();
		}
	}
});

function fetchWatchlistMovies() {
	if (movieCardIds.length === 0) {
		renderCards([]);
		return;
	}

	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${TMDB_TOKEN}`,
		},
	};

	const requests = movieCardIds.map(function (entry) {
		return fetch(
			`https://api.themoviedb.org/3/${entry.media_type}/${entry.id}?language=de-DE`,
			options,
		)
			.then((res) => res.json())
			.then((data) => ({ ...data, media_type: entry.media_type }));
	});

	Promise.all(requests)
		.then((movies) => {
			renderCards(movies);
		})
		.catch((err) => console.error(err));
}

fetchWatchlistMovies();
