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
$form.addEventListener('submit', function (event) {
  event.preventDefault();
  var search = $form.elements.search.value;
  if (search < 1) {
    return;
  }
  hideHome(search);
  var $allLi = document.querySelectorAll('li');
  clearList($allLi);
  loadXML(search);
  $form.reset();
});

$homeButton.addEventListener('click', function (event) {
  var $allLi = document.querySelectorAll('li');
  clearList($allLi);
  $welcome.classList.remove('hidden');
  hideList();
});

$ul.addEventListener('click', function (event) {
  var select = data.viewDetails;
  var animeId = event.target.closest('li').getAttribute('id');
  if (event.target.tagName === 'A' || event.target.tagName === 'IMG') {
    data.id = parseInt(animeId);
  }
  for (var i = 0; i < data.anime.length; i++) {
    if (data.id === data.anime[i].mal_id) {
      select = data.anime[i];
    }
  }
  var genres = [];
  for (var x = 0; x < select.genres.length; x++) {
    genres.push(select.genres[x].name);
  }
  $ratingNumber.textContent = select.score;
  $ranking.textContent = 'Ranking: #' + select.rank;
  $popularity.textContent = 'Popularity: #' + select.popularity;
  $airDate.textContent = 'Air Date: ' + select.aired.string;
  $episodes.textContent = 'Episodes: ' + select.episodes;
  $genre.textContent = 'Genre: ' + genres.join(', ');
  $synopsis.textContent = select.synopsis;
  $art.setAttribute('src', select.images.jpg.image_url);
  $art.setAttribute('alt', select.title);
  $detailTitle.textContent = select.title;
  hideList();
});
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

function clearList(nodeList) {
  if (nodeList.length > 0) {
    for (var i = 0; i < nodeList.length; i++) {
      $ul.removeChild(nodeList[i]);
    }
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
  createScore.textContent = 'Score: ' + anime.score;
  createDate.textContent = 'Air Date: ' + anime.aired.string;
  var genres = [];
  for (var i = 0; i < anime.genres.length; i++) {
    genres.push(anime.genres[i].name);
  }
  createGenre.textContent = 'Genre: ' + genres.join(', ');
  createSyn.textContent = anime.synopsis.slice(0, 250);
  if (anime.synopsis.length > 250) {
    createSyn.textContent += '...';
  }
  createSyn.setAttribute('id', 'list-description');
  createInfoCol1.appendChild(createTitle);
  createInfoCol1.appendChild(createSyn);
  createInfoCol1.className = 'column-seventy list-info margin-b-1rem';

  createInfoCol2.appendChild(createScore);
  createInfoCol2.appendChild(createDate);
  createInfoCol2.appendChild(createGenre);
  createInfoCol2.className = 'column-seventy list-info';

  createSynRow.appendChild(createInfoCol1);
  createSynRow.appendChild(createInfoCol2);
  createSynRow.className = 'row align-center space-between';

  createCol80.appendChild(createSynRow);
  createCol80.className = 'column-eighty';

  createImg.setAttribute('src', anime.images.webp.image_url);
  createImg.setAttribute('alt', anime.title);
  createImg.className = 'list-art';
  createImgAnchor.appendChild(createImg);

  createImgRow.appendChild(createImgAnchor);
  createImgRow.className = 'row';

  createImgCol.appendChild(createImgRow);
  createImgCol.className = 'column-twenty';

  createListRow.appendChild(createImgCol);
  createListRow.appendChild(createCol80);
  createListRow.className = 'row white-bg align-center';

  createLi.appendChild(createListRow);
  createLi.setAttribute('id', anime.mal_id);
  createLi.className = 'margin-b-1rem';
  return createLi;
}
