let playerName = prompt("Введите ник");
  if (!playerName) {
    playerName = "Player 1";
  }
document.querySelector("h1").innerText = playerName + ", Найди Дробителя!";
let scoreDiv = document.getElementById("scoreList");
let innerGrid = document.getElementById("innerGrid");
// Получить случайное число от 0 до size-1
function getRandomNumber(size) {
  return Math.floor(Math.random() * size);
};

// Вычислить расстояние от клика (event) до клада (target)
function getDistance(event, target) {
  const diffX = event.offsetX - target.x;
  const diffY = event.offsetY - target.y;
  return Math.sqrt(diffX * diffX + diffY * diffY);
};

// Получить для расстояния строку подсказки
function getDistanceHint(distance) {
  if (distance < 20) {
    return "Логово Рагнароса";
  } else if (distance < 40) {
    return "Пригорает";
  } else if (distance < 80) {
    return "Тепло";
  } else if (distance < 160) {
    return "Прохладно";
  } else if (distance < 320) {
    return "Очень холодно";
  } else {
    return "Холодно как в нордсколе";
  }
};

// Создаем переменные
const width = 1002;
const height = 650;
let clicks = 0;
// Случайная позиция клада
const target = {
  x: getRandomNumber(width),
  y: getRandomNumber(height),
};
// Добавляем элементу img обработчик клика
document.getElementById("map").addEventListener("click", function go(event) {
  clicks++;
  // Получаем расстояние от места клика до клада
  const distance = getDistance(event, target);
  // Преобразуем расстояние в подсказку
  const distanceHint = getDistanceHint(distance);
  // Записываем в элемент #distance новую подсказку
  document.getElementById("distance").innerText = distanceHint;
  // Если клик был достаточно близко, поздравляем с победой
  if (distance < 25) {
    alert(
      "Дробитель найден! Сделано кликов: " +
        clicks +
        "\nНу ты индеец, БОМ, БОМ."
    );
    // добавити гравця в таблицю
    // var paragraph = document.createElement("p");
    // var total = playerName + " " + clicks + " " + numbers(clicks);
    // scoreDiv.appendChild(paragraph).innerText = total;
    document.getElementById("map").removeEventListener("click", go);

    
    // fetch
    const data = {
      name: playerName,
      score: clicks
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    fetch('/api', options)
    .then( async res => {
      let data = await res.json();
      data.forEach( elem => {
        scoreDiv.remove();
        let paragraph = document.createElement("p");
        paragraph.innerText = elem.name + "   " + elem.score + " " + numbers(elem.score);
        innerGrid.appendChild(paragraph);
      })
    });    
  }
});

async function getData(){
  const res = await fetch("/get");
  const data = await res.json();
  data.forEach( elem => {
    let paragraph = document.createElement("p");
    paragraph.innerText = elem.name + "   " + elem.score + " " + numbers(elem.score);
    scoreDiv.appendChild(paragraph);
  })
}
getData().catch( (err, wrn) => {
   console.error(err);
   console.warn(wrn);
  });

// назви кліків
function numbers(clicks) {
  switch (clicks) {
    case 1:
      return "клик";
      break;
    case 2:
    case 3:
    case 4:
      return "клика";
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
      return "кликов";
      break;
    default:
      return "много кликов :(";
  }
}