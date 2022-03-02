var $ul = document.querySelector('ul');
var $form = document.querySelector('form');
var $message = document.querySelector('.message');
var $welcome = document.querySelector('.welcome');
var $viewMore = document.querySelector('#view-more');
var $homeButton = document.querySelector('.fa-house-chimney');

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
  $message.classList.add('hidden');
  $viewMore.classList.add('hidden');
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
    createTitle.textContent = anime.title.slice(0, 40) + '...';
  } else {
    createTitle.textContent = anime.title;
  }
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

  createImgRow.appendChild(createImg);
  createImgRow.className = 'row art-container';

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
