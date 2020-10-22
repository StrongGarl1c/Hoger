let playerName = prompt('Введите ник');
if (!playerName) {
  playerName = 'Player 1';
}
document.querySelector('h1').innerText = playerName + ', Найди Дробителя!';
let scoreDiv = document.getElementById('scoreList');
let innerGrid = document.getElementById('innerGrid');
//  випадкове число від 0 до size-1
function getRandomNumber(size) {
  return Math.floor(Math.random() * size);
}

// розрахунок відстані від кліка (event) до цілі (target)
function getDistance(event, target) {
  const diffX = event.offsetX - target.x;
  const diffY = event.offsetY - target.y;
  return Math.sqrt(diffX * diffX + diffY * diffY);
}

// строка підказки для відстані
function getDistanceHint(distance) {
  if (distance < 20) {
    return 'Логово Рагнароса';
  } else if (distance < 40) {
    return 'Пригорает';
  } else if (distance < 80) {
    return 'Тепло';
  } else if (distance < 160) {
    return 'Прохладно';
  } else if (distance < 320) {
    return 'Очень холодно';
  } else {
    return 'Холодно как в нордсколе';
  }
}

const width = 1002;
const height = 650;
let clicks = 0;
// випадкова позиція цілі
const target = {
  x: getRandomNumber(width),
  y: getRandomNumber(height),
};
// додаю addEventListener до img
document.getElementById('map').addEventListener('click', function go(event) {
  clicks++;
  // відстань від місця кліку до цілі
  const distance = getDistance(event, target);
  // перетворюєм відстань в піказку
  const distanceHint = getDistanceHint(distance);
  // записуєм в елемент #distance нову підказку
  document.getElementById('distance').innerText = distanceHint;
  // якщо клік був достатньо блиьким, поздоровляємо з перемогою
  if (distance < 25) {
    alert(
      'Дробитель найден! Сделано кликов: ' +
        clicks +
        '\nНу ты индеец, БОМ, БОМ.',
    );
    document.getElementById('map').removeEventListener('click', go);

    // fetch data
    const data = {
      name: playerName,
      score: clicks,
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    // submit result
    async function submitResult(response) {
      response = await fetch('/submitResult/api', options);
      const data = await response.json();
      data.forEach((elem) => {
        scoreDiv.remove();
        let paragraph = document.createElement('p');
        paragraph.innerText =
          elem.name + '   ' + elem.score + ' ' + numbers(elem.score);
        innerGrid.appendChild(paragraph);
      });
    }
    submitResult().catch((err, wrn) => {
      console.error(err);
      console.warn(wrn);
    });
  }
});

async function getData() {
  const res = await fetch('/top15');
  const data = await res.json();
  data.forEach((elem) => {
    let paragraph = document.createElement('p');
    paragraph.innerText =
      elem.name + '   ' + elem.score + ' ' + numbers(elem.score);
    scoreDiv.appendChild(paragraph);
  });
}
getData().catch((err, wrn) => {
  console.error(err);
  console.warn(wrn);
});

// назви кліків
function numbers(clicks) {
  switch (clicks) {
    case 1:
      return 'клик';
      break;
    case 2:
    case 3:
    case 4:
      return 'клика';
      break;
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
      return 'кликов';
      break;
    default:
      return 'много кликов :(';
  }
}
