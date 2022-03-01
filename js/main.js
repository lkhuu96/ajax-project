var $ul = document.querySelector('ul');
var xmlObject = new XMLHttpRequest();
loadXML('attack on titan');

function loadXML(search) {
  xmlObject.open('GET', 'https://api.jikan.moe/v4/anime?q=' + search);
  xmlObject.responseType = 'json';
  xmlObject.addEventListener('load', function () {
    data.anime = xmlObject.response.data;
    $ul.appendChild(createList(data.anime[1]));
  });
  xmlObject.send();
}

function createList(anime) {
  var createLi = document.createElement('li');
  var createRow = document.createElement('div');
  var createImg = document.createElement('img');
  var createCol = document.createElement('div');
  var createTitle = document.createElement('h2');
  var createScore = document.createElement('p');
  var createDate = document.createElement('p');
  var createGenre = document.createElement('p');

  createTitle.textContent = anime.title;
  createScore.textContent = 'Score: ' + anime.score;
  createDate.textContent = 'Air Date: ' + anime.aired.string;
  createGenre.textContent = 'Genre: ' + 'Action, Drama, Fantasy, Mystery';

  createCol.appendChild(createTitle);
  createCol.appendChild(createScore);
  createCol.appendChild(createDate);
  createCol.appendChild(createGenre);
  createCol.className = 'column-full';

  createImg.setAttribute('src', anime.images.webp.image_url);
  createImg.setAttribute('alt', anime.title);
  createImg.className = 'list-art';

  createRow.appendChild(createImg);
  createRow.appendChild(createCol);
  createRow.className = 'row white-bg list-info';

  createLi.appendChild(createRow);
  createLi.setAttribute('id', '1');
  return createLi;
}
