'use strict';

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

// Aktuell aktiven Navbar-Button in localStorage speichern
navbarButtons.forEach(function (button) {
	button.addEventListener('click', function () {
		if (button === popularContentNavbar) {
			localStorage.setItem('activeNavId', 'popular-content');
		} else if (button === topRatedContentNavbar) {
			localStorage.setItem('activeNavId', 'top-rated-content');
		} else if (button === upcomingContentNavbar) {
			localStorage.setItem('activeNavId', 'upcoming-content');
		} else if (button === watchlistContentNavbar) {
			localStorage.setItem('activeNavId', 'watchlist-content');
			window.location.href = '../watchlist.html';
		}

		restoreActiveNav();
	});
});

// Beim Laden der Seite aktiven Button wiederherstellen und entsprechende Filme Laden
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

	if (savedId === 'popular-content') {
		fetchPopularMovies();
	} else if (savedId === 'top-rated-content') {
		fetchTopRatedMovies();
	} else if (savedId === 'upcoming-content') {
		fetchUpcomingMovies();
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

// ===================== Kategorien =====================

const multiCategoryButton = document.querySelector('#multi-category');
const movieCategoryButton = document.querySelector('#movie-category');
const seriesCategoryButton = document.querySelector('#series-category');
const personCategoryButton = document.querySelector('#person-category');

const categoryButtons = [
	multiCategoryButton,
	movieCategoryButton,
	seriesCategoryButton,
	personCategoryButton,
];

const categories = document.querySelector('#categories');

// Kategorien nur anzeigen, wenn benötigt, also bei Suche des Users
function updateCategories() {
	if (navbarButtons.some((btn) => btn.classList.contains('active'))) {
		console.log('0');
		categories.style.opacity = '0';
	} else {
		console.log('1');
		categories.style.opacity = '1';
	}
}

// Aktive Kategorie farblich markieren
categoryButtons.forEach(function (button) {
	button.addEventListener('click', function () {
		categoryButtons.forEach(function (btn) {
			btn.classList.remove('active');
		});

		button.classList.add('active');

		if (searchInput.value.trim() !== '') {
			performSearch(searchInput.value);
		}
	});
});

// ===================== Searchbar =====================

const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');

// Solange Text eingegeben wurde, Suche ausführen
function handleSearch() {
	const query = searchInput.value.trim();

	if (query !== '') {
		navbarButtons.forEach(function (btn) {
			btn.classList.remove('active');
		});

		updateCategories();
		performSearch(query);
	}
}

// Enter oder Klick auf die Lupe führt Suche aus
searchInput.addEventListener('keydown', function (event) {
	if (event.key === 'Enter') {
		handleSearch();
	}
});

searchButton.addEventListener('click', function () {
	handleSearch();
});

// ===================== Movie Grid =====================

let movieCardIds = localStorage.getItem('watchlist');

if (movieCardIds !== null && movieCardIds.length > 0) {
	movieCardIds = JSON.parse(movieCardIds);
} else {
	movieCardIds = [];
}

let favicon = 'fa-plus';

// Gibt die vollständige Bild-URL zurück, oder null falls kein Bild vorhanden ist
function getImageUrl(item) {
	const isPerson = item.media_type === 'person';
	const image = isPerson ? item.profile_path : item.poster_path;

	if (!image) {
		return null;
	}

	return `https://image.tmdb.org/t/p/w500${image}`;
}

// Titel von Film/Serie zurückgeben oder Name bei Personen
function getDisplayTitle(item) {
	if (item.media_type === 'person') {
		return item.name;
	}

	return item.title || item.name;
}

// Film oder Serie haben unterschiedliche Feldnamen
function getYear(item) {
	let year = null;

	if (item.release_date) {
		year = item.release_date.split('-')[0];
	} else if (item.first_air_date) {
		year = item.first_air_date.split('-')[0];
	}

	return year;
}

function getTypeLabel(item) {
	let typeLabel;

	if (item.media_type === 'tv') {
		typeLabel = 'Serie';
	} else if (item.media_type === 'person') {
		typeLabel = 'Person';
	} else {
		typeLabel = 'Film';
	}

	return typeLabel;
}

function isInWatchlist(item) {
	return movieCardIds.some(function (entry) {
		return entry.id === item.id;
	});
}

function renderCards(items) {
	const container = $('#movie-container');
	container.empty();

	items.forEach(function (item) {
		const isPerson = item.media_type === 'person';
		const imageUrl = getImageUrl(item);

		if (!imageUrl) {
			return; // Ohne Bild wird das Item übersprungen
		}

		const displayTitle = getDisplayTitle(item);
		const year = getYear(item);
		const rating = item.vote_average ? item.vote_average.toFixed(2) : null;
		const typeLabel = getTypeLabel(item);

		let favicon;
		if (isInWatchlist(item)) {
			favicon = 'fa-check';
		} else {
			favicon = 'fa-plus';
		}

		// Macht dass Personen keinen Button zum hinzufügen kriegen
		const watchlistButton = isPerson
			? ''
			: `<button class="watchlist-button" title="Zur Watchlist hinzufügen">
					<i class="fa ${favicon}"></i>
				</button>`;

		// Bei Personen Info ihrer Rolle, bei Filmen/Serien release-date etc.
		const metaInfo = isPerson
			? `<span class="card-year">${item.known_for_department || ''}</span>`
			: `<span class="card-year">${year || 'Kein Veröffentlichungsjahr bekannt'}</span>
				<span class="card-rating"><i class="fa fa-star"></i> ${rating || 'Keine Bewertung bekannt'}</span>`;

		// HTML-Card mit Poster & Zusatzinfos
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
	const mediaType = movieCard.dataset.mediaType; // "movie" oder "tv"
	const button = card.target.closest('.watchlist-button');

	if (button !== null) {
		const icon = button.querySelector('i');

		// Bei Plus-Symbol durch Check ersetzen und ID + media_type in Array schreiben
		if (icon.classList.contains('fa-plus')) {
			icon.classList.replace('fa-plus', 'fa-check');
			movieCardIds.push({ id: Number(movieCardDataId), media_type: mediaType });
		}
		// Bei Plus-Symbol durch Check ersetzen und ID + media_type in Array schreiben
		else {
			icon.classList.replace('fa-check', 'fa-plus');
			movieCardIds = movieCardIds.filter(function (entry) {
				return entry.id !== Number(movieCardDataId);
			});
		}

		localStorage.setItem('watchlist', JSON.stringify(movieCardIds));
	}
});

function fetchContent(category, query) {
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${TMDB_TOKEN}`,
		},
	};

	fetch(
		`https://api.themoviedb.org/3/search/${category}?query=${encodeURIComponent(query)}&include_adult=false&language=de-DE&page=1`,
		options,
	)
		.then((res) => res.json())
		.then((data) => {
			const results = data.results.map(function (item) {
				item.media_type = item.media_type || category;
				return item;
			});
			renderCards(results);
		})
		.catch((err) => console.error(err));
}

function performSearch(query) {
	if (multiCategoryButton.classList.contains('active')) {
		fetchContent('multi', query);
	} else if (movieCategoryButton.classList.contains('active')) {
		fetchContent('movie', query);
	} else if (seriesCategoryButton.classList.contains('active')) {
		fetchContent('tv', query);
	} else if (personCategoryButton.classList.contains('active')) {
		fetchContent('person', query);
	}
}

// Hilfsfunktion um media_type zu setzen, weil es nicht bei allen Queries war
function addMediaType(results, type) {
	return results.map(function (item) {
		return { ...item, media_type: type };
	});
}

function apiErrorMessage(err) {
	console.error(err);
	movieContainer.innerHTML += `
		<div class="error-box">
			<strong>Es gab ein Problem mit der TMDB-API.</strong>
			<p>Hast du den TMDB_TOKEN gesetzt?</p>
		</div>`;
}

function fetchPopularMovies() {
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${TMDB_TOKEN}`,
		},
	};

	fetch(
		'https://api.themoviedb.org/3/movie/popular?language=de-DE&page=1',
		options,
	)
		.then((res) => res.json())
		.then((data) => {
			renderCards(addMediaType(data.results, 'movie'));
			updateCategories();
		})
		.catch((err) => {
			apiErrorMessage(err);
		});
}

function fetchTopRatedMovies() {
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${TMDB_TOKEN}`,
		},
	};

	fetch(
		'https://api.themoviedb.org/3/movie/top_rated?language=de-DE&page=1',
		options,
	)
		.then((res) => res.json())
		.then((data) => {
			renderCards(addMediaType(data.results, 'movie'));
			updateCategories();
		})
		.catch((err) => {
			apiErrorMessage(err);
		});
}

function fetchUpcomingMovies() {
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${TMDB_TOKEN}`,
		},
	};
	const today = new Date().toISOString().split('T')[0]; // z.B. "2026-08-26"

	fetch(
		`https://api.themoviedb.org/3/movie/upcoming?language=de-DE&region=DE&page=1`,
		options,
	)
		.then((res) => res.json())
		.then((data) => {
			const trulyUpcoming = data.results.filter(
				(movie) => movie.release_date > today,
			);
			renderCards(addMediaType(trulyUpcoming, 'movie'));
			updateCategories();
		})
		.catch((err) => {
			apiErrorMessage(err);
		});
}

// ===================== Sonstiges =====================
