/* global data */
var searchView = 6;
var animeList = [];
var animeId = null;
var animeDetails = {};
var firstCarouselItem = 0;
var recommendedList = [];
var $body = document.querySelector('body');
var $ul = document.querySelector('ul');
var $form = document.querySelector('form');
var $message = document.querySelector('.message');
var $welcome = document.querySelector('.welcome');
var $viewMore = document.querySelector('#view-more');
var $homeButton = document.querySelector('.fa-house-chimney');
var $ratingNumber = document.querySelector('#rating-number');
var $ranking = document.querySelector('#ranking');
var $popularity = document.querySelector('#popularity');
var $airDate = document.querySelector('#air-date');
var $episodes = document.querySelector('#episodes');
var $genre = document.querySelector('#genre');
var $synopsis = document.querySelector('.synopsis-text');
var $art = document.querySelector('#art');
var $detailTitle = document.querySelector('#detail-title');
var $details = document.querySelector('#details');
var $video = document.querySelector('#video');
var $chevron = document.querySelectorAll('.chevron');
var $carousel = document.querySelector('#carousel');
var $right = document.querySelector('#right');
var $recommendedList = document.querySelector('#recommended-list');
var $addButton = document.querySelector('.add-button');
var $favListButton = document.querySelector('.fa-list');
var $cancel = document.querySelector('#cancel-button');
var $modalBg = document.querySelector('.modal-shadow');
var $remove = document.querySelector('#remove-button');

$form.addEventListener('submit', function (event) {
  event.preventDefault();
  var search = $form.elements.search.value;
  if (search < 1) {
    return;
  }
  hideHome(search);
  clearLists();
  loadXML(search);
  hideDetails();
  searchView = 6;
  $form.reset();
});

$homeButton.addEventListener('click', function (event) {
  clearLists();
  hideList();
  $welcome.classList.remove('hidden');
  hideDetails();
});

$ul.addEventListener('click', function (event) {
  var idNum = event.target.closest('li').getAttribute('id');
  var anchorEdit = event.target.closest('a').getAttribute('class', 'edit-button');
  animeId = parseInt(idNum);
  if (anchorEdit === 'dark-blue absolute edit-button') {
    event.preventDefault();
    $modalBg.classList.remove('hidden');
    $body.classList.add('overflow');
  } else if (event.target.tagName === 'A' || event.target.tagName === 'IMG') {
    getDetailsById(animeId, loadDetails, animeDetails);
  }
});

$addButton.addEventListener('click', function (event) {
  event.preventDefault();
  var idNum = event.target.closest('.add-button').getAttribute('mal_id');
  $addButton.classList.add('hidden');
  getDetailsById(idNum, addToFavList, data.favoriteDetails);
});

$favListButton.addEventListener('click', function (event) {
  clearLists();
  hideHome();
  $viewMore.classList.add('hidden');
  hideDetails();
  $message.textContent = 'Favorite List';
  animeList = [];
  for (var i = 0; i < data.favorites.length; i++) {
    $ul.appendChild(createList(data.favorites[i]));
    var $editButton = document.querySelectorAll('.edit-button');
    $editButton[i].classList.remove('hidden');
  }
});

$carousel.addEventListener('click', function (event) {
  var id = event.target.getAttribute('mal_id');
  if (event.target.tagName === 'I') {
    event.preventDefault();
    clearLists();
    if (event.target.getAttribute('id') === 'prev') {
      firstCarouselItem -= 4;
      if (firstCarouselItem < 0) {
        firstCarouselItem = (recommendedList.length) + firstCarouselItem;
      }
      redisplayCarousel();
    } else if (event.target.getAttribute('id') === 'next') {
      firstCarouselItem += 4;
      if (firstCarouselItem > recommendedList.length - 1) {
        firstCarouselItem = firstCarouselItem - (recommendedList.length);
      }
      redisplayCarousel();
    }
  } else if (id) {
    animeId = id;
    clearLists();
    getDetailsById(id, loadDetails, animeDetails);
  }
});

$viewMore.addEventListener('click', function (event) {
  event.preventDefault();
  if (animeList.length < searchView + 6) {
    $viewMore.classList.add('hidden');
    for (var i = searchView; i < animeList.length; i++) {
      $ul.appendChild(createList(animeList[i]));
    }
  } else {
    for (var x = searchView; x < searchView + 6; x++) {
      $ul.appendChild(createList(animeList[x]));
    }
  }
  searchView += 6;
});

$cancel.addEventListener('click', function (event) {
  event.preventDefault();
  $modalBg.classList.add('hidden');
  $body.classList.remove('overflow');
});

$remove.addEventListener('click', function (event) {
  event.preventDefault();
  for (var i = 0; i < data.favorites.length; i++) {
    if (data.favorites[i].mal_id === animeId) {
      var $li = document.querySelectorAll('li');
      $ul.removeChild($li[i]);
      data.favorites.splice(i, 1);
      $modalBg.classList.add('hidden');
      $body.classList.remove('overflow');
    }
  }
});

function loadXML(search) {
  var xmlObject = new XMLHttpRequest();
  var stop = 6;
  $viewMore.classList.add('hidden');
  xmlObject.open('GET', 'https://api.jikan.moe/v4/anime?q=' + search + '&sfw');
  xmlObject.responseType = 'json';
  xmlObject.addEventListener('load', function () {
    animeList = xmlObject.response.data;
    if (animeList.length === 0) {
      $message.textContent = `No Results for "${search}"`;
    }
    if (animeList.length < stop) {
      stop = animeList.length;
    }
    for (var i = 0; i < stop; i++) {
      $ul.appendChild(createList(animeList[i]));
    }
    if (animeList.length > 6) {
      $viewMore.classList.remove('hidden');
    }
  });
  xmlObject.send();
}

function getRecommendedList(id) {
  var xmlObject = new XMLHttpRequest();
  xmlObject.open('GET', 'https://api.jikan.moe/v4/anime/' + id + '/recommendations');
  xmlObject.responseType = 'json';
  xmlObject.addEventListener('load', function () {
    recommendedList = xmlObject.response.data;
    $recommendedList.textContent = 'Recommended';
    $carousel.classList.remove('hidden');
    if (recommendedList.length === 0) {
      $recommendedList.textContent = 'No Recommended Anime to Display';
      $carousel.classList.add('hidden');
    } else if (recommendedList.length < 6) {
      $chevron[0].classList.add('hidden');
      $chevron[1].classList.add('hidden');
      for (var y = 0; y < recommendedList.length; y++) {
        $carousel.insertBefore(createCarousel(recommendedList[y]), $right);
      }
    } else {
      $chevron[0].classList.remove('hidden');
      $chevron[1].classList.remove('hidden');
      for (var z = 0; z < 5; z++) {
        $carousel.insertBefore(createCarousel(recommendedList[z]), $right);
      }
    }
  });
  xmlObject.send();
}

function getDetailsById(id, callback, saveWhere) {
  var xmlObject = new XMLHttpRequest();
  xmlObject.open('GET', 'https://api.jikan.moe/v4/anime/' + id);
  xmlObject.responseType = 'json';
  xmlObject.addEventListener('load', function () {
    saveWhere = xmlObject.response.data;
    callback(id, saveWhere);
  });
  xmlObject.send();
}

function loadDetails(animeId, select) {
  var genres = [];
  for (var x = 0; x < select.genres.length; x++) {
    genres.push(select.genres[x].name);
  }
  if (select.score === null) {
    $ratingNumber.textContent = 'N/A';
  } else {
    $ratingNumber.textContent = select.score;
  }
  $detailTitle.textContent = select.title;
  $art.setAttribute('src', select.images.jpg.image_url);
  $art.setAttribute('alt', select.title);
  $ranking.textContent = 'Ranking: #' + select.rank;
  $popularity.textContent = 'Popularity: #' + select.popularity;
  $airDate.textContent = 'Air Date: ' + select.aired.string;
  $episodes.textContent = 'Episodes: ' + select.episodes;
  $genre.textContent = 'Genre: ' + genres.join(', ');
  $synopsis.textContent = select.synopsis;
  $video.setAttribute('src', 'https://www.youtube.com/embed/' + select.trailer.youtube_id + '?autoplay=0');
  $video.setAttribute('title', select.title);
  getRecommendedList(animeId);
  $addButton.setAttribute('mal_id', animeId);
  $addButton.classList.remove('hidden');
  for (var i = 0; i < data.favorites.length; i++) {
    if (data.favorites[i].mal_id === parseInt(animeId)) {
      $addButton.classList.add('hidden');
    }
  }
  hideList();
  $details.classList.remove('hidden');
}

function addToFavList(id, favList) {
  data.favorites.push(favList);
}

function hideHome(search) {
  $welcome.classList.add('hidden');
  $message.classList.remove('hidden');
  $message.textContent = `Search Results for "${search}"`;
  $ul.classList.remove('hidden');
}

function hideList() {
  $message.classList.add('hidden');
  $viewMore.classList.add('hidden');
  $ul.classList.add('hidden');
}

function hideDetails() {
  $details.classList.add('hidden');
  $video.setAttribute('src', '');
}

function clearLists() {
  var $allLi = document.querySelectorAll('li');
  loopLists($allLi, $ul);
  var $columnCarousel = document.querySelectorAll('.column-carousel');
  loopLists($columnCarousel, $carousel);
}

function loopLists(nodeList, target) {
  if (nodeList.length > 0) {
    for (var i = 0; i < nodeList.length; i++) {
      target.removeChild(nodeList[i]);
    }
  }
}

function createCarousel(anime) {
  var createDiv = document.createElement('div');
  var createEmptyDiv = document.createElement('div');
  var createImg = document.createElement('img');
  var createTitle = document.createElement('h3');
  var createAnchor = document.createElement('a');
  createImg.setAttribute('src', anime.entry.images.jpg.image_url);
  createImg.setAttribute('alt', anime.entry.title);
  createImg.className = 'object-cover hw-100';
  if (anime.entry.title.length > 20) {
    createTitle.textContent = anime.entry.title.slice(0, 20) + '...';
  } else {
    createTitle.textContent = anime.entry.title;
  }
  createTitle.className = 'recommended-title';
  createTitle.setAttribute('mal_id', anime.entry.mal_id);
  createEmptyDiv.className = 'shadow hw-100';
  createEmptyDiv.setAttribute('mal_id', anime.entry.mal_id);
  createDiv.appendChild(createEmptyDiv);
  createDiv.appendChild(createImg);
  createAnchor.setAttribute('mal_id', anime.entry.mal_id);
  createAnchor.className = 'column-carousel relative';
  createDiv.className = ' art-container';
  createAnchor.setAttribute('href', '#');
  createAnchor.appendChild(createDiv);
  createAnchor.appendChild(createTitle);

  return createAnchor;
}

function redisplayCarousel() {
  var start = firstCarouselItem;
  for (var y = 0; y < 5; y++) {
    if (start === recommendedList.length) {
      start = 0;
    }
    $carousel.insertBefore(createCarousel(recommendedList[start++]), $right);
  }
}

function createList(anime) {
  var createLi = document.createElement('li');
  var createImgAnchor = document.createElement('a');
  var createTitleAnchor = document.createElement('a');
  var createListRow = document.createElement('div');
  var createImgRow = document.createElement('div');
  var createImg = document.createElement('img');
  var createInfoCol1 = document.createElement('div');
  var createInfoCol2 = document.createElement('div');
  var createCol80 = document.createElement('div');
  var createSynRow = document.createElement('div');
  var createTitle = document.createElement('h2');
  var createScore = document.createElement('p');
  var createDate = document.createElement('p');
  var createGenre = document.createElement('p');
  var createSyn = document.createElement('p');
  var createEditAnchor = document.createElement('a');
  var createTrashIcon = document.createElement('i');
  if (anime.title.length > 40) {
    createTitleAnchor.textContent = anime.title.slice(0, 40) + '...';
  } else {
    createTitleAnchor.textContent = anime.title;
  }
  createTitleAnchor.setAttribute('href', '#');
  createTitleAnchor.className = 'dark-blue';
  createTitle.appendChild(createTitleAnchor);
  if (anime.score === null) {
    createScore.textContent = 'Score: N/A';
  } else {
    createScore.textContent = 'Score: ' + anime.score;
  }
  createDate.textContent = 'Air Date: ' + anime.aired.string;
  var genres = [];
  for (var i = 0; i < anime.genres.length; i++) {
    genres.push(anime.genres[i].name);
  }
  createGenre.textContent = 'Genre: ' + genres.join(', ');
  createSyn.textContent = anime.synopsis.slice(0, 240);
  if (anime.synopsis.length > 240) {
    createSyn.textContent += '...';
  }
  createSyn.setAttribute('id', 'list-description');
  createInfoCol1.appendChild(createTitle);
  createInfoCol1.appendChild(createSyn);
  createInfoCol1.className = 'column-seventy list-info ';
  createInfoCol2.appendChild(createScore);
  createInfoCol2.appendChild(createDate);
  createInfoCol2.appendChild(createGenre);
  createInfoCol2.className = 'column-seventy list-info';
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
  createEditAnchor.className = 'dark-blue absolute hidden edit-button';
  createLi.appendChild(createEditAnchor);
  createLi.appendChild(createListRow);
  createLi.setAttribute('id', anime.mal_id);
  createLi.setAttribute('class', 'relative');
  return createLi;
}
