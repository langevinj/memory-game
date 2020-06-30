const gameContainer = document.getElementById("game");
let count = 0;
let children = document.getElementById("game").children;
let foundMatches = [];
let start = document.createElement("button");
let score = 0;
const h1 = document.querySelector("h1");
let scoreDisplay = document.createElement("h2");
let lowScoreDisplay = document.createElement("h2");
let lowScore = (localStorage.getItem('lowScore'));
let COLORS = [];
const cardsInput = document.querySelector('form');

let textInput = document.createElement("input");
textInput.type = "text";
textInput.setAttribute("id", "cards");
textInput.setAttribute("placeholder", "How many cards?");
let submission = document.createElement("input");//creates input field for # of cards
submission.type = "submit";

cardsInput.append(textInput, submission);

scoreDisplay.classList.add("score");
document.body.prepend(scoreDisplay);

lowScoreDisplay.innerHTML = `The lowest score is: ${lowScore}`;//wonder if this is actually begin called right
lowScoreDisplay.classList.add("low");
document.body.prepend(lowScoreDisplay);

function updateScore(score) {
    scoreDisplay.innerHTML = score;
}

function startButton() {
    start.innerHTML = "Start Game";
    start.classList.add("startBtn");
    document.body.prepend(start);
    console.log("the start button went off");
}

function createCardChoice() {
    cardsInput.reset();
    h1.appendChild(cardsInput);
}

function addCardListener() {
    cardsInput.addEventListener("submit", function (e) {//gets user input # of cards
        e.preventDefault();
        let numCards = document.getElementById("cards").value;
        console.log(numCards);
        if (number_test(numCards)) {//checks if number entered is whole and even
            cardsInput.remove();
            shuffleAndCreate(numCards);
        } else {
            cardsInput.reset();
        }
    });
}

start.addEventListener("click", function () {
    createCardChoice();
    scoreDisplay.innerHTML = score;
    addCardListener();
    start.remove();
});

function number_test(num) {
    let result = (num - Math.floor(num)) === 0;
    let even = (num % 2 === 0);

    if (num == 0 || num === "") {
        return false;
    }

    if (result && even) {
        return true;
    } else {
        return false;
    }
}

function generateRandomColor() {
    let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
}

function shuffleAndCreate(numCards) {
    console.log(numCards);
    let numColors = (numCards / 2);
    console.log(`number of colors is ${numColors}`);
    COLORS = [];

    for (let i = 0; i < numColors; i++) {//gets us the amount of colors needed into the array
        let tempColor = generateRandomColor();


        if (COLORS.includes(tempColor)) {
            i--;
        } else {
            COLORS.push(tempColor, tempColor);
        }
    }
    i = 0;
    console.log(COLORS);
    let shuffledColors = shuffle(COLORS);
    console.log(`the shuffled colors array is ${shuffledColors}`);

    function shuffle(array) {
        let counter = array.length;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }
    createDivsForColors(shuffledColors);
}

function createDivsForColors(colorArray) {
    for (let color of colorArray) {

        const newDiv = document.createElement("div");

        newDiv.classList.add(color);

        newDiv.addEventListener("click", handleCardClick);

        gameContainer.append(newDiv);
    }
}

function createRestartBtn() {
    let restart = document.createElement("button");
    restart.innerHTML = "Start a New Game";
    document.body.prepend(restart);

    restart.addEventListener("click", function () {
        while (gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.firstChild);
        }

        createCardChoice();
        foundMatches = [];
        score = 0;
        updateScore(score);
        restart.remove();
    });
}

function checkIfFinished() {
    if (foundMatches.length === COLORS.length) {
        if (score < lowScore || lowScore === null) {
            lowScore = score;
            localStorage.setItem('lowScore', score);
            lowScoreDisplay.innerHTML = `The lowest score is: ${lowScore}`;
        }
        return createRestartBtn();
    };
}

function addBackClickable() {
    Array.from(children).forEach(function (element) {
        if (!foundMatches.includes(element)) {
            element.addEventListener("click", handleCardClick);
        }
    });
}

function countAndScore() {
    count++;
    score++;
    updateScore(score);
}

function handleCardClick(event) {

    if (count === 0) {
        countAndScore();
        event.target.style.backgroundColor = event.target.className;
        event.target.classList.add('firstBox');
        event.target.removeEventListener("click", handleCardClick);//prevents clicking the element twice

    } else if (count === 1) {
        countAndScore();

        Array.from(children).forEach(function (element) {//removes listeners to avoid fast clicking
            element.removeEventListener("click", handleCardClick);
        });

        event.target.style.backgroundColor = event.target.className;
        event.target.classList.add('secondBox');
        let first = document.querySelector('.firstBox');
        let second = document.querySelector('.secondBox');

        if (first.classList[0] === second.classList[0]) {//if matches found
            resetBoxComparison();

            foundMatches.push(first, second);

            checkIfFinished();
            addBackClickable();

        } else {
            setTimeout(function () {
                first.style.backgroundColor = '';
                second.style.backgroundColor = '';
            }, 1000);
            addBackClickable();
            resetBoxComparison();
        }

        function resetBoxComparison() {
            first.classList.remove('firstBox');
            second.classList.remove('secondBox');
        }
    }

    setTimeout(function () {//should prevent multiple clicks by tying up the count
        if (count > 1) {
            count = 0;
        }
    }, 1300);
}

startButton();