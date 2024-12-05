const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const keyboardDiv = document.querySelector(".keyboard");
const guessesText = document.querySelector(".guesses-text b");
const gameModel = document.querySelector(".game-model")
const playAgainBtn = document.querySelector(".play-again")


let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;  
    hangmanImage.src = `/hangman-${wrongGuessCount}.svg`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord.split("").map(() => '<li class="letter"></li>').join("");
    gameModel.classList.remove("show");
}


const getRandomWord = () => {
    const {word, hint} = wordList[Math.floor(Math.random() * wordList.length)];
    console.log(word);
    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
  
}

const gameOver = (isVictory) => {
    setTimeout(() => {
        const modelText = isVictory ? 'You got the word: ' : 'The correct word was:';
        gameModel.querySelector("img").src = `${isVictory ? 'victory' : 'lost'}.gif`;
        gameModel.querySelector("h4").innerText = `${isVictory ? 'Congrats!' : 'Game Over'}`;
        gameModel.querySelector("p").innerHTML = `${modelText ? `<b>${currentWord}</b>` : ''}`;
        gameModel.classList.add("show");
    }, 300);
}

const initGame = (button, clickedLetter) => {
    if(currentWord.includes(clickedLetter)) {
        console.log(clickedLetter, "does exist on the word");
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        })
    } else {
        wrongGuessCount++;
        hangmanImage.src = `hangman-${wrongGuessCount}.svg`;

    }
    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    if(wrongGuessCount === maxGuesses) return gameOver(false)
    if(correctLetters.length === currentWord.length) return gameOver(true)

}

for (let i = 97; i<= 122; i++){
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
