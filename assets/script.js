'use strict';

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

// ===================== Searchbaar =====================

const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');

searchInput.addEventListener('keydown', function (event) {
	if (event.key === 'Enter') {
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
		if (item.poster_path) {
			const posterUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
			const card = `
            <div class="movie-card">
                <img src="${posterUrl}" alt="${item.title}">
				<a>${item.title}</a>
				<a>${item.release_date}</a>
            </div>`;

			container.append(card);
		}
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
			renderCards(data.results);
			console.log(data.results);
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
