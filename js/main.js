/* global data */
let searchView = 6;
let animeList = [];
let animeId = null;
const animeDetails = {};
let firstCarouselItem = 0;
let recommendedList = [];
const $body = document.querySelector('body');
const $ul = document.querySelector('ul');
const $form = document.querySelector('form');
const $message = document.querySelector('.message');
const $welcome = document.querySelector('.welcome');
const $viewMore = document.querySelector('#view-more');
const $homeButton = document.querySelector('.fa-house-chimney');
const $ratingNumber = document.querySelector('#rating-number');
const $ranking = document.querySelector('#ranking');
const $popularity = document.querySelector('#popularity');
const $airDate = document.querySelector('#air-date');
const $episodes = document.querySelector('#episodes');
const $genre = document.querySelector('#genre');
const $synopsis = document.querySelector('.synopsis-text');
const $art = document.querySelector('#detail-art');
const $detailTitle = document.querySelector('#detail-title');
const $detailTitleEnglish = document.querySelector('#detail-title-english');
const $details = document.querySelector('#details');
const $video = document.querySelector('#video');
const $chevron = document.querySelectorAll('.chevron');
const $carousel = document.querySelector('#carousel');
const $right = document.querySelector('#right');
const $recommendedList = document.querySelector('#recommended-list');
const $addButton = document.querySelector('.add-button');
const $favListButton = document.querySelector('.fa-list');
const $cancel = document.querySelector('#cancel-button');
const $modalBg = document.querySelector('.modal-shadow');
const $remove = document.querySelector('#remove-button');
const $ring = document.querySelector('.lds-ring');
let canSubmit = true;

$form.addEventListener('submit', event => {
  event.preventDefault();
  if (canSubmit === true) {
    canSubmit = false;
    data.view = 'list-view';
    $ring.classList.remove('hidden');
    const search = $form.elements.search.value;
    if (search < 1) {
      return;
    }
    hideHome(search);
    clearLists();
    loadXML(search);
    hideDetails();
    searchView = 6;
    $form.reset();
  }
});

$homeButton.addEventListener('click', event => {
  $ring.classList.add('hidden');
  data.view = 'home-page';
  clearLists();
  hideList();
  $welcome.classList.remove('hidden');
  hideDetails();
});

$ul.addEventListener('click', event => {
  const idNum = event.target.closest('li').getAttribute('id');
  const anchorEdit = event.target.closest('a').getAttribute('class', 'trash-button');
  data.view = 'detail-view';
  animeId = parseInt(idNum);
  if (anchorEdit === 'dark-blue absolute trash-button') {
    event.preventDefault();
    $modalBg.classList.remove('hidden');
    $body.classList.add('overflow');
  } else if (event.target.tagName === 'A' || event.target.tagName === 'IMG') {
    $ring.classList.remove('hidden');
    clearLists();
    $viewMore.classList.add('hidden');
    getDetailsById(animeId, loadDetails, animeDetails);
  }
});

$addButton.addEventListener('click', event => {
  event.preventDefault();
  const idNum = event.target.closest('.add-button').getAttribute('mal_id');
  $addButton.classList.add('hidden');
  getDetailsById(idNum, addToFavList, data.favoriteDetails);
});

$favListButton.addEventListener('click', event => {
  data.view = 'favorite-view';
  $ring.classList.add('hidden');
  clearLists();
  hideHome();
  $viewMore.classList.add('hidden');
  hideDetails();
  $message.textContent = 'Favorite List';
  animeList = [];
  for (let i = 0; i < data.favorites.length; i++) {
    $ul.appendChild(createList(data.favorites[i]));
    const $editButton = document.querySelectorAll('.trash-button');
    $editButton[i].classList.remove('hidden');
  }
});

$carousel.addEventListener('click', event => {
  const id = event.target.getAttribute('mal_id');
  if (event.target.tagName === 'I') {
    event.preventDefault();
    clearLists();
    if (event.target.getAttribute('id') === 'prev') {
      firstCarouselItem -= 4;
      if (firstCarouselItem < 0) {
        firstCarouselItem = (recommendedList.length) + firstCarouselItem;
      }
      loopCarousel();
    } else if (event.target.getAttribute('id') === 'next') {
      firstCarouselItem += 4;
      if (firstCarouselItem > recommendedList.length - 1) {
        firstCarouselItem = firstCarouselItem - (recommendedList.length);
      }
      loopCarousel();
    }
  } else if (id) {
    hideDetails();
    $ring.classList.remove('hidden');
    animeId = id;
    clearLists();
    getDetailsById(id, loadDetails, animeDetails);
  }
});

$viewMore.addEventListener('click', event => {
  event.preventDefault();
  $ring.classList.remove('hidden');
  if (animeList.length < searchView + 6) {
    $viewMore.classList.add('hidden');
    for (let i = searchView; i < animeList.length; i++) {
      $ul.appendChild(createList(animeList[i]));
    }
  } else {
    for (let x = searchView; x < searchView + 6; x++) {
      $ul.appendChild(createList(animeList[x]));
    }
  }
  searchView += 6;
  $ring.classList.add('hidden');
});

$cancel.addEventListener('click', event => {
  event.preventDefault();
  $modalBg.classList.add('hidden');
  $body.classList.remove('overflow');
});

$remove.addEventListener('click', event => {
  event.preventDefault();
  for (let i = 0; i < data.favorites.length; i++) {
    if (data.favorites[i].mal_id === animeId) {
      const $li = document.querySelectorAll('li');
      $ul.removeChild($li[i]);
      data.favorites.splice(i, 1);
      $modalBg.classList.add('hidden');
      $body.classList.remove('overflow');
    }
  }
});

const loadXML = search => {
  const xmlObject = new XMLHttpRequest();
  let stop = 6;
  $viewMore.classList.add('hidden');
  xmlObject.open('GET', `https://api.jikan.moe/v4/anime?q=${search}&sfw`);
  xmlObject.responseType = 'json';
  xmlObject.addEventListener('load', () => {
    animeList = xmlObject.response.data;
    canSubmit = true;
    if (xmlObject.status === 404) {
      $message.textContent = '404 Error.  This resource was not found.';
      return;
    } else if (xmlObject.status === 400) {
      $message.textContent = 'Error 400.  There was an invalid request from this website.';
      return;
    }
    if (animeList.length === 0) {
      $message.textContent = `No Results for "${search}"`;
    }
    if (animeList.length < stop) {
      stop = animeList.length;
    }
    if (data.view === 'list-view') {
      for (let i = 0; i < stop; i++) {
        $ul.appendChild(createList(animeList[i]));
      }
      if (animeList.length > 6) {
        $viewMore.classList.remove('hidden');
      }
    }
    $ring.classList.add('hidden');
  });
  xmlObject.send();
};

const getRecommendedList = id => {
  const xmlObject = new XMLHttpRequest();
  xmlObject.open('GET', `https://api.jikan.moe/v4/anime/${id}/recommendations`);
  xmlObject.responseType = 'json';
  xmlObject.addEventListener('load', () => {
    recommendedList = xmlObject.response.data;
    $recommendedList.textContent = 'Recommended';
    $carousel.classList.remove('hidden');
    if (recommendedList.length === 0) {
      $recommendedList.textContent = 'No Recommended Anime to Display';
      $carousel.classList.add('hidden');
    } else if (recommendedList.length < 6) {
      $chevron[0].classList.add('hidden');
      $chevron[1].classList.add('hidden');
      for (let y = 0; y < recommendedList.length; y++) {
        $carousel.insertBefore(createCarousel(recommendedList[y]), $right);
      }
    } else {
      $chevron[0].classList.remove('hidden');
      $chevron[1].classList.remove('hidden');
      for (let z = 0; z < 5; z++) {
        $carousel.insertBefore(createCarousel(recommendedList[z]), $right);
      }
    }
  });
  xmlObject.send();
};

const getDetailsById = (id, callback, saveWhere) => {
  const xmlObject = new XMLHttpRequest();
  xmlObject.open('GET', `https://api.jikan.moe/v4/anime/${id}`);
  xmlObject.responseType = 'json';
  xmlObject.addEventListener('load', () => {
    saveWhere = xmlObject.response.data;
    if (data.view === 'detail-view') {
      callback(id, saveWhere);
    }
    $ring.classList.add('hidden');
  });
  xmlObject.send();
};

const loadDetails = (animeId, saved) => {
  const genres = [];
  for (let x = 0; x < saved.genres.length; x++) {
    genres.push(saved.genres[x].name);
  }
  if (saved.score === null) {
    $ratingNumber.textContent = 'N/A';
  } else {
    $ratingNumber.textContent = saved.score;
  }
  $detailTitle.textContent = saved.title;
  $detailTitleEnglish.textContent = saved.title_english;
  $art.setAttribute('src', saved.images.jpg.image_url);
  $art.setAttribute('alt', saved.title);
  const rank = document.createTextNode(saved.rank);
  $ranking.removeChild($ranking.lastChild);
  $ranking.appendChild(rank);
  const popularity = document.createTextNode(saved.popularity);
  $popularity.removeChild($popularity.lastChild);
  $popularity.appendChild(popularity);
  const date = document.createTextNode(saved.aired.string);
  $airDate.removeChild($airDate.lastChild);
  $airDate.appendChild(date);
  const episodes = document.createTextNode(saved.episodes);
  $episodes.removeChild($episodes.lastChild);
  $episodes.appendChild(episodes);
  const genre = document.createTextNode(genres.join(', '));
  $genre.removeChild($genre.lastChild);
  $genre.appendChild(genre);
  $synopsis.textContent = saved.synopsis;
  $video.setAttribute('src', `https://www.youtube.com/embed/${saved.trailer.youtube_id}?autoplay=0`);
  $video.setAttribute('title', saved.title);
  getRecommendedList(animeId);
  $addButton.setAttribute('mal_id', animeId);
  $addButton.classList.remove('hidden');
  for (let i = 0; i < data.favorites.length; i++) {
    if (data.favorites[i].mal_id === parseInt(animeId)) {
      $addButton.classList.add('hidden');
    }
  }
  hideList();
  $details.classList.remove('hidden');
};

const addToFavList = (id, favList) => {
  data.favorites.push(favList);
};

const hideHome = search => {
  $welcome.classList.add('hidden');
  $message.classList.remove('hidden');
  $message.textContent = `Search Results for "${search}"`;
  $ul.classList.remove('hidden');
};

const hideList = () => {
  $message.classList.add('hidden');
  $viewMore.classList.add('hidden');
  $ul.classList.add('hidden');
};

const hideDetails = () => {
  $details.classList.add('hidden');
  $video.setAttribute('src', '');
};

const clearLists = () => {
  const $allLi = document.querySelectorAll('li');
  loopLists($allLi, $ul);
  const $columnCarousel = document.querySelectorAll('.column-carousel');
  loopLists($columnCarousel, $carousel);
};

const loopLists = (nodeList, target) => {
  if (nodeList.length > 0) {
    for (let i = 0; i < nodeList.length; i++) {
      target.removeChild(nodeList[i]);
    }
  }
};

const createCarousel = anime => {
  const createDiv = document.createElement('div');
  const createImg = document.createElement('img');
  const createTitle = document.createElement('h3');
  const createAnchor = document.createElement('a');
  createImg.setAttribute('src', anime.entry.images.jpg.image_url);
  createImg.setAttribute('alt', anime.entry.title);
  createImg.setAttribute('mal_id', anime.entry.mal_id);
  createImg.className = 'object-cover hw-100';
  if (anime.entry.title.length > 20) {
    createTitle.textContent = anime.entry.title.slice(0, 20) + '...';
  } else {
    createTitle.textContent = anime.entry.title;
  }
  createTitle.className = 'recommended-title';
  createTitle.setAttribute('mal_id', anime.entry.mal_id);
  createDiv.appendChild(createImg);
  createDiv.appendChild(createTitle);
  createAnchor.className = 'column-carousel relative ';
  createDiv.className = ' art-container';
  createAnchor.setAttribute('href', '#');
  createAnchor.appendChild(createDiv);
  return createAnchor;
};

const loopCarousel = () => {
  let start = firstCarouselItem;
  for (let y = 0; y < 5; y++) {
    if (start === recommendedList.length) {
      start = 0;
    }
    $carousel.insertBefore(createCarousel(recommendedList[start++]), $right);
  }
};

const createList = anime => {
  const createLi = document.createElement('li');
  const createImgAnchor = document.createElement('a');
  const createTitleAnchor = document.createElement('a');
  const createScoreSpan = document.createElement('span');
  const createDateSpan = document.createElement('span');
  const createGenreSpan = document.createElement('span');
  const createListRow = document.createElement('div');
  const createImgRow = document.createElement('div');
  const createImg = document.createElement('img');
  const createInfoCol1 = document.createElement('div');
  const createInfoCol2 = document.createElement('div');
  const createCol80 = document.createElement('div');
  const createSynRow = document.createElement('div');
  const createTitle = document.createElement('h2');
  const createScore = document.createElement('p');
  const createDate = document.createElement('p');
  const createGenre = document.createElement('p');
  const createSyn = document.createElement('p');
  const createEditAnchor = document.createElement('a');
  const createTrashIcon = document.createElement('i');
  if (anime.title.length > 40) {
    createTitleAnchor.textContent = `${anime.title.slice(0, 40)} ...`;
  } else {
    createTitleAnchor.textContent = anime.title;
  }
  createTitleAnchor.setAttribute('href', '#');
  createTitleAnchor.className = 'dark-blue';
  createTitle.appendChild(createTitleAnchor);
  createScoreSpan.textContent = 'Score: ';
  createDateSpan.textContent = 'Air Date: ';
  createGenreSpan.textContent = 'Genre: ';
  if (anime.score === null) {
    createScore.textContent = 'N/A';
  } else {
    createScore.textContent = anime.score;
  }
  createScore.prepend(createScoreSpan);
  createDate.textContent = anime.aired.string;
  createDate.prepend(createDateSpan);
  const genres = [];
  for (let i = 0; i < anime.genres.length; i++) {
    genres.push(anime.genres[i].name);
  }
  createGenre.textContent = genres.join(', ');
  createGenre.prepend(createGenreSpan);
  createSyn.textContent = anime.synopsis.slice(0, 280);
  if (anime.synopsis.length > 280) {
    createSyn.textContent += '...';
  }
  createSyn.setAttribute('id', 'list-description');
  createInfoCol1.appendChild(createTitle);
  createInfoCol1.appendChild(createSyn);
  createInfoCol1.className = 'column-list-description list-info ';
  createInfoCol2.appendChild(createScore);
  createInfoCol2.appendChild(createDate);
  createInfoCol2.appendChild(createGenre);
  createInfoCol2.className = 'column-sub-info list-info';
  createSynRow.appendChild(createInfoCol1);
  createSynRow.appendChild(createInfoCol2);
  createSynRow.className = 'row';
  createCol80.appendChild(createSynRow);
  createCol80.className = 'column-eighty';
  createImg.setAttribute('src', anime.images.webp.image_url);
  createImg.setAttribute('alt', anime.title);
  createImg.className = 'object-cover hw-100';
  createImgRow.appendChild(createImg);
  createImgRow.className = 'row art-container';
  createImgAnchor.appendChild(createImgRow);
  createImgAnchor.setAttribute('href', '#');
  createImgAnchor.className = 'column-twenty';
  createListRow.appendChild(createImgAnchor);
  createListRow.appendChild(createCol80);
  createListRow.className = 'row white-bg align-center';
  createTrashIcon.className = 'fa-solid fa-trash-can';
  createEditAnchor.appendChild(createTrashIcon);
  createEditAnchor.className = 'dark-blue absolute hidden trash-button';
  createLi.appendChild(createEditAnchor);
  createLi.appendChild(createListRow);
  createLi.setAttribute('id', anime.mal_id);
  createLi.setAttribute('class', 'relative');
  return createLi;
};
