/* exported data */
var data = {
  favorites: [],
  favoriteDetails: {}
};

var previousDataJSON = localStorage.getItem('ajax-project-anime-favorites');
if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

window.addEventListener('beforeunload', function (events) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('ajax-project-anime-favorites', dataJSON);
});
