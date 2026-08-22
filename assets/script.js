'use strict';

function getTrendingMovies() {
	$.getJSON('trendingMovies.json', function (data) {
		console.log(data);
		renderMovies(data.results);
	});
}

function renderMovies(movies) {
	const container = $('#movie-container');
	container.empty(); // alten Inhalt löschen

	movies.forEach(function (movie) {
		const posterUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;

		const card = `
            <div class="movie-card">
                <img src="${posterUrl}" alt="${movie.title}">
            </div>
        `;
		container.append(card);
	});
}

function getMovieSearch() {
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization:
				'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOWEzOWI4YTAyZDcyZTA4MjYzN2JhZDczYWM2ZjRmYyIsIm5iZiI6MTc4NzI5NjIzNy4yMzUwMDAxLCJzdWIiOiI2YTg3ZjllZGExOGMwZjI5YjQ4NGQxOWEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.jltaKB7TkLEE54YJwr0nItM61z05AmefKPBTdIOJ9Wc',
		},
	};

	fetch(
		'https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1',
		options,
	)
		.then((res) => res.json())
		.then((res) => console.log(res))
		.catch((err) => console.error(err));
}

getTrendingMovies();
getMovieSearch();
