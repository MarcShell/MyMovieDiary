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

navbarButtons.forEach(function (button) {
	button.addEventListener('click', function () {
		if (button === popularContentNavbar) {
			fetchPopularMovies();
			localStorage.setItem('activeNavId', 'popular-content');
		} else if (button === topRatedContentNavbar) {
			fetchTopRatedMovies();
			localStorage.setItem('activeNavId', 'top-rated-content');
		} else if (button === upcomingContentNavbar) {
			fetchUpcomingMovies();
			localStorage.setItem('activeNavId', 'upcoming-content');
		} else if (button === watchlistContentNavbar) {
			localStorage.setItem('activeNavId', 'watchlist-content');
			window.location.href = '../watchlist.html';
		}
		restoreActiveNav();
	});
});

// Beim Laden jeder Seite aktiven Button wiederherstellen
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

settings.addEventListener('click', () => {
	modal.classList.add('open-modal');
});

closeModalBtn.addEventListener('click', () => {
	modal.classList.remove('open-modal');
});

// Klick außerhalb schließt das Modal
modal.addEventListener('click', function (event) {
	if (event.target === modal) {
		modal.classList.remove('open-modal');
	}
});

// Theme umschalten
lightThemeRadio.addEventListener('change', function () {
	document.documentElement.classList.remove('dark');
	localStorage.setItem('theme', 'light');
});

darkThemeRadio.addEventListener('change', function () {
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

const toolbar = document.querySelector('#toolbar');

function updateToolbar() {
	if (navbarButtons.some((btn) => btn.classList.contains('active'))) {
		console.log('0');
		toolbar.style.opacity = '0';
	} else {
		console.log('1');
		toolbar.style.opacity = '1';
	}
}

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

searchInput.addEventListener('keydown', function (event) {
	if (event.key === 'Enter') {
		const query = searchInput.value.trim();

		if (query !== '') {
			navbarButtons.forEach(function (btn) {
				btn.classList.remove('active');
			});
		}

		updateToolbar();
		performSearch(searchInput.value);
	}
});

searchButton.addEventListener('click', function () {
	const query = searchInput.value.trim();

	if (query !== '') {
		navbarButtons.forEach(function (btn) {
			btn.classList.remove('active');
		});

		updateToolbar();
		performSearch(query);
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

		if (movieCardIds.includes(item.id)) {
			favicon = 'fa-check';
		} else {
			favicon = 'fa-plus';
		}

		const typeLabel =
			item.media_type === 'tv'
				? 'Serie'
				: item.media_type === 'person'
					? 'Person'
					: 'Film';

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
		<div class="movie-card" data-id="${item.id}">
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
	const movieCardDataId = card.target.closest('.movie-card').dataset.id;
	const button = card.target.closest('.watchlist-button');

	if (button !== null) {
		const icon = button.querySelector('i');

		if (icon.classList.contains('fa-plus')) {
			icon.classList.replace('fa-plus', 'fa-check');
			movieCardIds.push(Number(movieCardDataId));
			localStorage.setItem('watchlist', JSON.stringify(movieCardIds));
		} else {
			icon.classList.replace('fa-check', 'fa-plus');
			movieCardIds = movieCardIds.filter(function (id) {
				return id !== Number(movieCardDataId);
			});
			localStorage.setItem('watchlist', JSON.stringify(movieCardIds));
		}
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
			if (window.sessionStorage) {
				const results = data.results.map(function (item) {
					item.media_type = item.media_type || category;
					return item;
				});
				renderCards(results);
			}
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

function apiErrorMessage() {
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
			renderCards(data.results);
			updateToolbar();
		})
		.catch((err) => {
			apiErrorMessage();
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
			renderCards(data.results);
			updateToolbar();
		})
		.catch((err) => {
			apiErrorMessage();
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
			renderCards(trulyUpcoming);
			updateToolbar();
		})
		.catch((err) => {
			apiErrorMessage();
		});
}

// ===================== Sonstiges =====================
