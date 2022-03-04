/* exported data favorites */

var data = {
  view: 6,
  anime: [],
  id: null,
  viewDetails: {},
  firstCarouselItem: 0,
  recommended: []
};

var favorites = [];

var previousFavoritesJSON = localStorage.getItem('ajax-project-anime-favorites');
if (previousFavoritesJSON !== null) {
  data = JSON.parse(previousFavoritesJSON);
}

window.addEventListener('beforeUnload', function (events) {
  var favoritesJSON = JSON.stringify(data);
  localStorage.setItem('ajax-project-anime-favorites', favoritesJSON);
});
