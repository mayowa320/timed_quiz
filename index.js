var startButton = document.getElementById("start");
var initialTime = 60;
var timerEl = document.getElementById("timer");
let timer = null;
let highScore = document.querySelector("#highScore");

let respond;
let quizes;
let currentQuestion = 0;

function showTimer() {
  var timerDiv = document.createElement("div");
  timerDiv.textContent = initialTime;
  timerEl.appendChild(timerDiv);
}

function updateTimer() {
  timerEl.removeChild(timerEl.lastElementChild);
  showTimer();
}
startButton.addEventListener("click", async function () {
  // var timerDiv = document.getElementById("div");
  respond = await fetch(
    "https://the-trivia-api.com/api/questions?categories=food_and_drink&limit=10&difficulty=medium"
  );
  quizes = await respond.json();
  timerEl.innerHTML = "";
  initialTime = 60;
  currentQuestion = 0;
  highScore.style.display = "none";
  showTimer();
  console.log("Quiz has started");
  timer = setInterval(() => {
    updateTimer();
    if (initialTime < 0) {
      clearInterval(timer);
    } else {
      initialTime--;
    }
    console.log(initialTime);
  }, 1000);
  if (currentQuestion == quizes.length - 1) {
    renderQuestion(quizes[currentQuestion], true);
  } else {
    renderQuestion(quizes[currentQuestion], false);
  }
});

let results = 0;
let scores = {};

function renderQuestion(item, isLastQuestion) {
  let quiz = document.getElementById("quiz");
  quiz.innerHTML = "";
  //to check if there is any questions still
  if (item) {
    let question = document.createElement("h3");
    question.innerText = item.question;
    quiz.append(question);

    let list = document.createElement("div");
    list.className = "list";
    let answers = item.incorrectAnswers;
    let randomIndex = Math.round(Math.random() * 3);
    answers.splice(randomIndex, 0, item.correctAnswer);

    let intermidiateResult = document.getElementById("intermidiateResult");
    answers.forEach((answer, index) => {
      let button = document.createElement("button");
      button.innerText = index + 1 + ". " + answer;
      button.addEventListener("click", () => {
        if (answer === item.correctAnswer) {
          intermidiateResult.innerText = "Correct!";
          results++;
        } else {
          intermidiateResult.innerText = "Wrong!";
        }
        setTimeout(() => {
          intermidiateResult.innerText = "";
        }, 500);
        renderQuestion(quizes[++currentQuestion]);
      });
      list.append(button);
    });
    quiz.append(list);
  } else {
    clearInterval(timer);
    initialTime = 0;
    updateTimer();
    let finish = document.createElement("div");
    finish.innerText = `You answered ${
      (results / quizes.length) * 100
    }% correct`;

    let inputName = document.createElement("div");
    let input = document.createElement("input");
    let button = document.createElement("button");
    button.addEventListener("click", () => {
      scores[input.value] = results;
      renderHighScores(scores);
    });
    inputName.append(input, button);

    button.innerText = "submit";

    quiz.append(finish, inputName);
  }
}

function renderHighScores(scores) {
  highScore.style.display = "block";
  highScore.innerHTML = "";
  for (let name in scores) {
    let div = document.createElement("div");
    div.innerHTML = `${name} has score: ${scores[name]}`;
    highScore.append(div);
  }
}
