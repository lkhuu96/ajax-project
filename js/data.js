/* exported data */
let data = {
  view: null,
  favorites: [],
  favoriteDetails: {}
};

const previousDataJSON = localStorage.getItem('anime-search-favorites');
if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

window.addEventListener('beforeunload', events => {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('anime-search-favorites', dataJSON);
});
