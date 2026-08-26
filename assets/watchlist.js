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
		restoreActiveNav();
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
}
