/* exported data */
var data = {
  view: null,
  favorites: [],
  favoriteDetails: {}
};

var previousDataJSON = localStorage.getItem('anime-search-favorites');
if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

window.addEventListener('beforeunload', function (events) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('anime-search-favorites', dataJSON);
});
