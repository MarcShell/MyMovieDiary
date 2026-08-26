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

categoryButtons.forEach(function (button) {
	button.addEventListener('click', function () {
		categoryButtons.forEach(function (btn) {
			btn.classList.remove('active');
		});

		button.classList.add('active');
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

		performSearch(searchInput.value);
	}
});

searchButton.addEventListener('click', function () {
	performSearch(searchInput.value);
});

// ===================== Movie Grid =====================

function renderCards(items) {
	const container = $('#movie-container');
	container.empty(); // alten Inhalt löschen

	items.forEach(function (item) {
		items.forEach(function (item) {
			if (item.poster_path) {
				const posterUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
				const year = item.release_date
					? item.release_date.split('-')[0]
					: 'Kein Veröffentlichungsjahr bekannt';
				const rating = item.vote_average
					? item.vote_average.toFixed(2)
					: 'Keine Bewertung bekannt';

				const card = `
					<div class="movie-card">
						<div class="card-image-wrap">
							<img src="${posterUrl}" alt="${item.title}">
						</div>
						<div class="card-info">
							<span class="card-title">${item.title}</span>
							<div class="card-meta">
								<span>${year}</span>
								<span><i class="fa fa-star"></i> ${rating}</span>
							</div>
						</div>
					</div>`;

				container.append(card);
			}
		});
	});
}

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
				console.log(data.results);
				renderCards(data.results);
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
		})
		.catch((err) => console.error(err));
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
		})
		.catch((err) => console.error(err));
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
		})
		.catch((err) => console.error(err));
}

// ===================== Sonstiges =====================
