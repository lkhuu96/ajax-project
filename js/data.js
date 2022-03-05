/* exported data favorites */

var data = {
  view: 6,
  anime: [],
  id: null,
  viewDetails: {},
  firstCarouselItem: 0,
  recommended: []
};

var favorites = {
  favorites: [],
  list: []
};

var previousFavoritesJSON = localStorage.getItem('ajax-project-anime-favorites');
if (previousFavoritesJSON !== null) {
  favorites = JSON.parse(previousFavoritesJSON);
}

window.addEventListener('beforeunload', function (events) {
  var favoritesJSON = JSON.stringify(favorites);
  localStorage.setItem('ajax-project-anime-favorites', favoritesJSON);
});
