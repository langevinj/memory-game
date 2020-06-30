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
const cardsInput = document.querySelector('form');


const IMGS = ['apple.png', 'banana.jpg', 'grapes.jpg', 'lime.jpg', 'orange.jpg', 'apple.png', 'banana.jpg', 'grapes.jpg', 'lime.jpg', 'orange.jpg'];

scoreDisplay.classList.add("score");
document.body.prepend(scoreDisplay);

lowScoreDisplay.innerHTML = `The lowest score is: ${lowScore}`;//wonder if this is actually being called right
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

start.addEventListener("click", function () {
    scoreDisplay.innerHTML = score;
    beginningShuffle();
    start.remove();
});

function beginningShuffle() {
    let shuffledImgs = shuffle(IMGS);
    function shuffle(array) {
        let counter = array.length;

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
    createDivsForImgs(shuffledImgs);
};

function createDivsForImgs(shuffledImgs) {
    for (let img of shuffledImgs) {
      
        const newDiv = document.createElement("div");

        let newImg = document.createElement("img");
        newImg.src = img;
        newDiv.append(newImg);
        newDiv.classList.add("hidden");
        
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

        foundMatches = [];
        score = 0;
        updateScore(score);
        beginningShuffle();
        restart.remove();
    });
}

function checkIfFinished() {
    if (foundMatches.length === IMGS.length) {
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
        event.target.classList.remove("hidden");

        event.target.classList.add('firstBox');
        event.target.removeEventListener("click", handleCardClick);//prevents clicking the element twice
    } else if (count === 1) {
        countAndScore();

        Array.from(children).forEach(function (element) {//removes listeners to avoid fast clicking
            element.removeEventListener("click", handleCardClick);
        });
        event.target.classList.remove("hidden");
        event.target.classList.add('secondBox');
        let first = document.querySelector('.firstBox');
        let second = document.querySelector('.secondBox');

        if (first.firstChild.src === second.firstChild.src) {//if matches found
            resetBoxComparison();

            foundMatches.push(first, second);

            checkIfFinished();
            addBackClickable();

        } else {
            setTimeout(function () {
                first.classList.add("hidden");
                second.classList.add("hidden");
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