let gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;

let points = document.querySelector(".score");
points.textContent = score;

fetch("./data/cards.json")
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    cards = data.concat(data);
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length;
  while (currentIndex > 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    let temp = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temp;
  }
}

function generateCards() {
  for (let i = 0; i < cards.length; i++) {
    let card = cards[i];
    let cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);

    cardElement.innerHTML = `<div class="front">
                                <img class="front-image" src="${card.image}" />
                              </div>
                              <div class="back"></div>`;

    gridContainer.appendChild(cardElement);

    cardElement.addEventListener("click", function () {
      flipCard(cardElement);
    });
  }
}

function flipCard(cardElement) {
  if (lockBoard) {
    return;
  }
  if (firstCard === cardElement) {
    return;
  }

  cardElement.classList.add("flipped");

  if (firstCard === null) {
    firstCard = cardElement;
  } 
  else {
    secondCard = cardElement;
    score++;
    document.querySelector(".score").textContent = score;
    lockBoard = true;

    checkForMatch();
  }
}

function checkForMatch() {
  let firstCardName = firstCard.getAttribute("data-name");
  let secondCardName = secondCard.getAttribute("data-name");

  if (firstCardName === secondCardName) {
    disableCards();
  } else {
    unflipCards();
  }

  checkGameCompletion();
}

function disableCards() {
  firstCard.removeEventListener("click", function () {
    flipCard(firstCard);
  });
  secondCard.removeEventListener("click", function () {
    flipCard(secondCard);
  });

  resetBoard();
}

function unflipCards() {
  setTimeout(function () {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function checkGameCompletion() {
  const flippedCards = document.querySelectorAll(".card.flipped");
  if (flippedCards.length === cards.length) {
    showPopup();
  }
}

function showPopup() {
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "0";
  popup.style.left = "0";
  popup.style.width = "100%";
  popup.style.height = "100%";
  popup.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  popup.style.display = "flex";
  popup.style.justifyContent = "center";
  popup.style.alignItems = "center";
  popup.style.color = "white";
  popup.style.fontSize = "24px";
  popup.style.textAlign = "center";
  popup.innerHTML = `
    <div>
      <p>Congratulations! You completed the game!</p>
      <button id="restart-btn" style="padding: 10px 20px; font-size: 18px; cursor: pointer;">Restart</button>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById("restart-btn").addEventListener("click", function () {
    document.body.removeChild(popup);
    restart();
  });
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
}