var $ul = document.querySelector('ul');
var xmlObject = new XMLHttpRequest();
var $form = document.querySelector('form');
var $message = document.querySelector('.message');
var $welcome = document.querySelector('.welcome');
var $viewMore = document.querySelector('#view-more');

$form.addEventListener('submit', function (event) {
  event.preventDefault();
  var search = $form.elements.search.value;
  if (search < 1) {
    return;
  }
  data.prevResultLength = data.anime.length;
  $welcome.classList.add('hidden');
  $message.classList.remove('hidden');
  $message.textContent = `Search Results for "${search}"`;
  for (var i = 0; i < data.prevResultLength; i++) {
    $ul.removeChild(document.querySelector('li'));
  }
  loadXML(search);
  $form.reset();
});

$viewMore.addEventListener('click', viewMore);

function loadXML(search) {
  xmlObject.open('GET', 'https://api.jikan.moe/v4/anime?q=' + search + '&sfw');
  xmlObject.responseType = 'json';
  xmlObject.addEventListener('load', function () {
    data.anime = xmlObject.response.data;
    for (var i = 0; i < data.view; i++) {
      $ul.appendChild(createList(data.anime[i]));
    }
  });
  xmlObject.send();
}

function viewMore(event) {
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

function createList(anime) {
  var createLi = document.createElement('li');
  var createListRow = document.createElement('div');
  var createImgCol = document.createElement('div');
  var createImgRow = document.createElement('div');
  var createImg = document.createElement('img');
  var createInfoCol = document.createElement('div');
  var createTitle = document.createElement('h2');
  var createScore = document.createElement('p');
  var createDate = document.createElement('p');
  var createGenre = document.createElement('p');

  if (anime.title.length > 60) {
    createTitle.textContent = anime.title.slice(0, 60) + '...';
  } else {
    createTitle.textContent = anime.title;
  }
  createScore.textContent = 'Score: ' + anime.score;
  createDate.textContent = 'Air Date: ' + anime.aired.string;
  createGenre.textContent = 'Genre: ' + 'Action, Drama, Fantasy, Mystery';

  createInfoCol.appendChild(createTitle);
  createInfoCol.appendChild(createScore);
  createInfoCol.appendChild(createDate);
  createInfoCol.appendChild(createGenre);
  createInfoCol.className = 'column-sixty list-info';

  createImg.setAttribute('src', anime.images.webp.image_url);
  createImg.setAttribute('alt', anime.title);
  createImg.className = 'list-art';

  createImgRow.appendChild(createImg);
  createImgRow.className = 'row art-container';

  createImgCol.appendChild(createImgRow);
  createImgCol.className = 'column-twenty';

  createListRow.appendChild(createImgCol);
  createListRow.appendChild(createInfoCol);
  createListRow.className = 'row white-bg align-center';

  createLi.appendChild(createListRow);
  createLi.setAttribute('id', anime.mal_id);
  return createLi;
}
