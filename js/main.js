var $ul = document.querySelector('ul');

function createList(anime) {
  var createLi = document.createElement('li');
  var createRow = document.createElement('div');
  var createImg = document.createElement('img');
  var createCol = document.createElement('div');
  var createTitle = document.createElement('h2');
  var createScore = document.createElement('p');
  var createDate = document.createElement('p');
  var createGenre = document.createElement('p');

  createTitle.textContent = 'Shingeki no Kyojin';
  createScore.textContent = 'Score: ' + '8.52';
  createDate.textContent = 'Air Date: ' + 'Apr 7, 2013 to Sep 29, 2013';
  createGenre.textContent = 'Genre: ' + 'Action, Drama, Fantasy, Mystery';

  createCol.appendChild(createTitle);
  createCol.appendChild(createScore);
  createCol.appendChild(createDate);
  createCol.appendChild(createGenre);
  createCol.className = 'column-full';

  createImg.setAttribute('src', 'https://cdn.myanimelist.net/images/anime/10/47347.jpg');
  createImg.setAttribute('alt', 'Shingeki no Kyojin');
  createImg.className = 'list-art';

  createRow.appendChild(createImg);
  createRow.appendChild(createCol);
  createRow.className = 'row white-bg list-info';

  createLi.appendChild(createRow);

  return createLi;
}

$ul.appendChild(createList());
