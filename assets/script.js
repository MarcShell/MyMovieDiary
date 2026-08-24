'use strict';

const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');

searchInput.addEventListener('keydown', function (event) {
	if (event.key === 'Enter') {
		searchMovies(searchInput.value);
	}
});

searchButton.addEventListener('click', function () {
	searchMovies(searchInput.value);
});

function renderMovies(movies) {
	const container = $('#movie-container');
	container.empty(); // alten Inhalt löschen

	movies.forEach(function (movie) {
		if (movie.poster_path) {
			const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
			const card = `
            <div class="movie-card">
                <img src="${posterUrl}" alt="${movie.title}">
				<a>${movie.title}</a>
				<a>${movie.release_date}</a>
				<a>${movie.vote_average}</a>
            </div>`;

			container.append(card);
		}
	});
}

function getTrendingMovies() {
	$.getJSON('trendingMovies.json', function (data) {
		console.log(data);
		renderMovies(data.results);
	});
}

function searchMovies(query) {
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${TMDB_TOKEN}`,
		},
	};

	fetch(
		`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=de-DE&page=1`,
		options,
	)
		.then((res) => res.json())
		.then((data) => {
			renderMovies(data.results);
		})
		.catch((err) => console.error(err));
}
