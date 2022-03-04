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
var $chevron = document.querySelector('#carousel');
var $carousel = document.querySelector('#carousel');
var $right = document.querySelector('#right');

$form.addEventListener('submit', function (event) {
  event.preventDefault();
  var search = $form.elements.search.value;
  if (search < 1) {
    return;
  }
  hideHome(search);
  $video.setAttribute('src', '');
  $details.classList.add('hidden');
  clearLists();
  data.view = 6;
  loadXML(search);
  $form.reset();
});

$homeButton.addEventListener('click', function (event) {
  clearLists();
  $welcome.classList.remove('hidden');
  hideList();
  $video.setAttribute('src', '');
  $details.classList.add('hidden');
});

$ul.addEventListener('click', function (event) {
  var animeId = event.target.closest('li').getAttribute('id');
  if (event.target.tagName === 'A' || event.target.tagName === 'IMG') {
    var select = data.viewDetails;
    data.id = parseInt(animeId);
    for (var i = 0; i < data.anime.length; i++) {
      if (data.id === data.anime[i].mal_id) {
        select = data.anime[i];
      }
    }
    loadDetails(animeId, select);
  }
});

$chevron.addEventListener('click', carousel);

$viewMore.addEventListener('click', viewMore);

function loadXML(search) {
  var xmlObject = new XMLHttpRequest();
  xmlObject.open('GET', 'https://api.jikan.moe/v4/anime?q=' + search + '&sfw');
  xmlObject.responseType = 'json';
  xmlObject.addEventListener('load', function () {
    data.anime = xmlObject.response.data;
    for (var i = 0; i < 6; i++) {
      $ul.appendChild(createList(data.anime[i]));
    }
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
  getRecommendedList(data.id);
  hideList();
  $details.classList.remove('hidden');
}

function getRecommendedList(id) {
  var xmlObject = new XMLHttpRequest();
  xmlObject.open('GET', 'https://api.jikan.moe/v4/anime/' + id + '/recommendations');
  xmlObject.responseType = 'json';
  xmlObject.addEventListener('load', function () {
    data.recommended = xmlObject.response.data;
    for (var y = 0; y < 5; y++) {
      $carousel.insertBefore(createCarousel(data.recommended[y]), $right);
    }
  });
  xmlObject.send();
}

function getRecommendedDetails(id) {
  var xmlObject = new XMLHttpRequest();
  xmlObject.open('GET', 'https://api.jikan.moe/v4/anime/' + id);
  xmlObject.responseType = 'json';
  xmlObject.addEventListener('load', function () {
    data.viewDetails = xmlObject.response.data;
    loadDetails(id, data.viewDetails);
  });
  xmlObject.send();
}

function hideHome(search) {
  $welcome.classList.add('hidden');
  $message.classList.remove('hidden');
  $message.textContent = `Search Results for "${search}"`;
  $viewMore.classList.remove('hidden');
  $ul.classList.remove('hidden');
}

function hideList() {
  $message.classList.add('hidden');
  $viewMore.classList.add('hidden');
  $ul.classList.add('hidden');
}

function viewMore(event) {
  event.preventDefault();
  if (data.anime.length < data.view + 6) {
    $viewMore.classList.add('hidden');
    for (var i = data.view; i < data.anime.length; i++) {
      $ul.appendChild(createList(data.anime[i]));
    }
  } else {
    for (var x = data.view; x < data.view + 6; x++) {
      $ul.appendChild(createList(data.anime[x]));
    }
  }
  data.view += 6;
}

function carousel(event) {
  event.preventDefault();
  var id = event.target.getAttribute('mal_id');
  if (event.target.tagName === 'I') {
    clearLists();
    if (event.target.getAttribute('id') === 'prev') {
      data.carStart -= 4;
      if (data.carStart < 0) {
        data.carStart = (data.recommended.length) + data.carStart;
      }
      redisplayCarousel();
    } else if (event.target.getAttribute('id') === 'next') {
      data.carStart += 4;
      if (data.carStart > data.recommended.length - 1) {
        data.carStart = data.carStart - (data.recommended.length);
      }
      redisplayCarousel();
    }
  } else if (id) {
    data.id = id;
    clearLists();
    getRecommendedDetails(id);
  }
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
  createImg.className = 'list-art';
  if (anime.entry.title.length > 20) {
    createTitle.textContent = anime.entry.title.slice(0, 20) + '...';
  } else {
    createTitle.textContent = anime.entry.title;
  }
  createTitle.className = 'recommended-title';
  createTitle.setAttribute('mal_id', anime.entry.mal_id);
  createEmptyDiv.className = 'shadow';
  createEmptyDiv.setAttribute('mal_id', anime.entry.mal_id);
  createAnchor.appendChild(createEmptyDiv);
  createAnchor.appendChild(createImg);
  createDiv.appendChild(createAnchor);
  createDiv.appendChild(createTitle);
  createDiv.setAttribute('mal_id', anime.entry.mal_id);
  createDiv.className = 'column-carousel art-container relative';
  return createDiv;
}

function redisplayCarousel() {
  var start = data.carStart;
  for (var y = 0; y < 5; y++) {
    if (start === data.recommended.length) {
      start = 0;
    }
    $carousel.insertBefore(createCarousel(data.recommended[start++]), $right);
  }
}

function createList(anime) {
  var createLi = document.createElement('li');
  var createImgAnchor = document.createElement('a');
  var createTitleAnchor = document.createElement('a');
  var createListRow = document.createElement('div');
  var createImgCol = document.createElement('div');
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
  if (anime.title.length > 40) {
    createTitleAnchor.textContent = anime.title.slice(0, 40) + '...';
  } else {
    createTitleAnchor.textContent = anime.title;
  }
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
  createImg.className = 'list-art';
  createImgAnchor.appendChild(createImg);
  createImgRow.appendChild(createImgAnchor);
  createImgRow.className = 'row art-container';
  createImgCol.appendChild(createImgRow);
  createImgCol.className = 'column-twenty';
  createListRow.appendChild(createImgCol);
  createListRow.appendChild(createCol80);
  createListRow.className = 'row white-bg align-center';
  createLi.appendChild(createListRow);
  createLi.setAttribute('id', anime.mal_id);
  return createLi;
}
