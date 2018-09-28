let moveCounter = document.getElementById("moves")
let stars = document.querySelector("ul.stars").innerHTML
let scores;
let openCards = [];
let matches;
let moves;

function initializeValues() {
  matches = []
  scores = 3;
  moves = 0;
  moveCounter.textContent = moves
  document.getElementById("sec").innerHTML = 0;
  document.querySelector("ul.stars").innerHTML = stars;
}

function setGame() {
  let cardList = document.querySelectorAll("li.card");
  let shuffledCards = shuffle(Array.from(cardList));
  document.querySelector("ul.deck").innerHTML = ""
  for (let i = 0; i < shuffledCards.length; i++) {
    document.querySelector("ul.deck").appendChild(shuffledCards[i]);
    cardList[i].className = "card";
    cardList[i].addEventListener("click", clickHandler);
  }
  initializeValues()
}

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function openCard(card) {
  openCards.push(card)
  card.classList.add("open", "show");
  card.removeEventListener("click", clickHandler);
}

function removeCards() {
  openCards = []
}

function isMatch(card1, card2) {
  return card1.querySelector("i").className === card2.querySelector("i").className ? true : false
}

function handleMatch(card1, card2) {
  card1.classList.add("match")
  card2.classList.add("match")
  card1.removeEventListener("click", clickHandler)
  card2.removeEventListener("click", clickHandler)
  matches.push(card1, card2)
}

function handleMismatch(card1, card2) {
  setTimeout(function() {card1.classList.remove("open", "show")}, 1000)
  setTimeout(function() {card2.classList.remove("open", "show")}, 1000)
  card1.addEventListener("click", clickHandler)
  card2.addEventListener("click", clickHandler)
}

function displayStars() {
  let starList = document.querySelector("ul.stars")
  starList.removeChild(starList.children[0]);
  let node = document.createElement("li")
  node.className = "fa fa-star-o";
}

function updateScore() {
  if (scores === 3 && moves > 12) {
    scores -= 1
    displayStars()
  } else if (scores === 2 && moves > 16) {
    scores -= 1
    displayStars()
  }
}

function gameOver() {
  return matches.length === 16 ? true : false;
}

function clickHandler() {
  if (moves === 0) {
    start()
  }
  if (openCards.length === 0) {
    openCard(this);
  } else if (openCards.length === 1){
    openCard(this);

    let previousCard = openCards[0];
    if (isMatch(this, previousCard)) {
      handleMatch(this, previousCard)
    } else {
      handleMismatch(this, previousCard)
    }
    moves += 1;
    moveCounter.textContent = moves
    updateScore();
    setTimeout(removeCards, 650)
  }

  if (gameOver()) {
    stop()
    setTimeout(openModal, 1000)
  }
}

let modal = document.getElementById("simpleModal");
let againBtn = document.getElementById("repeat");
let closeBtn = document.getElementById("closeBtn");
let restartBtn = document.querySelector("div.restart");

againBtn.addEventListener('click', function(){
  setGame();
  closeModal();
});

restartBtn.addEventListener('click', function(){
  stop();
  setGame();
});

closeBtn.addEventListener('click', closeModal);

function openModal() {
  let summary = document.getElementById("summary");
  let seconds = document.getElementById("sec");
  let scores = document.querySelectorAll("ul.stars li i")
  summary.innerHTML = `Your score was ${scores.length} and you took ${seconds.textContent} seconds`;
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

function clickOutside(e) {
  if (e.target == modal) {
    modal.style.display = "none"
  }
}

window.addEventListener("click", clickOutside)

// game timer
let timerInterval = null;
let value;

function start() {
  value = 0;
  stop(); // stoping the previous counting (if any)
  timerInterval = setInterval(changeValue, 1000);
}

function changeValue() {
  value = parseFloat(value)
  document.getElementById("sec").innerHTML = ++value;
}

let stop = function() {
  clearInterval(timerInterval);
}
