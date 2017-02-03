(function() {
	"use strict";


	///////////////////////////////////////////
	// CONSTRUCT // GLOBALS
	///////////////////////////////////////////
	const HangmanMod = function() {
		// GLOBALS
		let currentWord = '';
		let choosenLetter = '';
		let choosenLetters = [];
		let entryArray = [];
		let compareArrays = [];
		let buttonSub = document.querySelector('.buttonPart'); // button class
		let playerInput = document.querySelector('#inputPart'); // input id
		let displayLettersPicked = document.querySelector('.display-letters');
		let letterSpots = document.querySelector('.guess-here'); // spots for letters in Guess section
		let turnCounter = document.querySelector('.turn-counter'); // display turn #
		let turnContainer = document.querySelector('.end-times p'); // footer to display game over
		let correctGuess = null;
		let turns = 0;
		let timer = null;
		let audio = new Audio('./audio/LTTP_Link_Fall.wav'); // will play audio on wrong guess
		let scaler = document.querySelector('.end-times');



		///////////////////////////////////////////
		// FUNCTION : CHECK INPUT LETTER VS WORD
		///////////////////////////////////////////
		function checkLetters(choosenLetter) {
			let checker = entryArray.indexOf(choosenLetter);
			if (checker < 0) { // uses IndxOf method to determine if in array // false only returns -1
				correctGuess = false;
				audio.play(); // will play audio on wrong guess - womp womp woooommmmpppp
				turns += 1;
			}
			if (checker >= 0) { // could be else i suppose // true is 0+, not just 0. need to look into
				correctGuess = true;
				turns += 0;
			}
			updateWord();
			turnTurnTurn();
			winning();
		}

		///////////////////////////////////////////
		// FUNCTION : CHOOSE WORD
		///////////////////////////////////////////
		function chooseWord(exWordCatcher) {
			let randomGen = Math.floor(Math.random() * 100);
			currentWord = exWordCatcher[randomGen].content.toLowerCase();
			// console.log('currentWord --> ' + currentWord);
			// console.log('Length of random word --> ' + Object.keys(currentWord).length);
			if (Object.keys(currentWord).length > 3) { // Carter mentioned you can do 'currentWord.lenght'. haven't tested that
			}
			displayWord(currentWord);
		}

		///////////////////////////////////////////
		// FUNCTION : DISPLAY WORD
		///////////////////////////////////////////
		function displayWord(currentWord) {

			entryArray = currentWord.split(''); // place currentword as an array of letters
			compareArrays = currentWord.split('');
			console.log(entryArray); // see actual word in console
			letterSpots.innerHTML = '';
			for (let i = 0; i < entryArray.length; i++) {
				let item = document.createElement('span');
				item.innerHTML = entryArray[i];
				item.classList.add('indie-letters-hidden');
				letterSpots.appendChild(item);
			}
		}

		///////////////////////////////////////////
		// FUNCTION : GET INPUT FROM PLAYER
		///////////////////////////////////////////

		function getInput() {
			buttonSub.addEventListener('click', () => {
				event.preventDefault();
				// console.log(playerInput.value);
				choosenLetter = playerInput.value.toLowerCase();
				// new checker to see if you pick the same letter twice.
				let checker = choosenLetters.indexOf(choosenLetter);
				console.log(choosenLetters);
				if (checker < 0) { //
					choosenLetters.push(choosenLetter);
				}
				if (checker >= 0) { //
					alert('You already choose that letter!');
				}
				// console.log(choosenLetters);
				playerInput.value = '';
				// display input --> into 'Letters Picked:' html -- using array works pretty good?
				displayLettersPicked.textContent = choosenLetters;
				checkLetters(choosenLetter);
			});
		} // end of function

		///////////////////////////////////////////
		// FUNCTION : TURNS & COUNTER & LOSING
		///////////////////////////////////////////
		function turnTurnTurn() {
			turnCounter.textContent = turns; // display turns
			if (turns === 6) {
				// update class to show letters on loss of game
				letterSpots.classList.add('guess-show');
				scaler.classList.add('scale-me');
				turnContainer.textContent = 'G A M E   O V E R';
				letterSpots.textContent = currentWord;
				setTimeout(function() { // 3 sec restart
					location.reload();
				}, 3000);
			}
		}

		///////////////////////////////////////////
		// FUNCTION : UPDATE WORD FROM GUESSES
		///////////////////////////////////////////
		function updateWord() {
			// if (correctGuess === true) {
			console.log('entryArray in update: ' + entryArray.length);
			for (let i = 0; i < entryArray.length; i++) {
				// console.log('i ' + i);
				if (entryArray[i] === choosenLetter) {
					let item = document.querySelectorAll('.indie-letters-hidden')[i];
					item.classList.add('show-letter');
				}
			}
		}

		///////////////////////////////////////////
		// FUNCTION : WINNING
		///////////////////////////////////////////
		function winning() {
			// this awesome filter method will compare my currentword split into (entryArray) to my array of user guesses(choosenLetters)
			// the filter will remove correct guesses from my entryArray - so if all were guessed, you win.
			// figuring out how to declare a win was tougher than i thought, so this option worked great!
			compareArrays = compareArrays.filter(val => !choosenLetters.includes(val));
			// console.log(compareArrays);
			if (compareArrays.length === 0) {
				// console.log('win');
				scaler.classList.add('scale-me');
				turnContainer.textContent = 'Y O U  W I N!';
				letterSpots.textContent = currentWord;
				setTimeout(function() {
					location.reload();
				}, 3000);
			}
		}

		///////////////////////////////////////////
		// AJAX REQUEST
		///////////////////////////////////////////
		function getWords() {
			let http = new XMLHttpRequest();

			http.onreadystatechange = function() {
				if (http.readyState === 4 && http.status === 200) {
					// console.log(http.response);
					let wordCatcher = JSON.parse(http.response);
					// console.log(wordCatcher);
					chooseWord(wordCatcher);
					getInput();
					// displayWord();
				}
			};
			http.open('GET', './data/words.json', true);
			http.send();
		}
		///////////////////////////////////////////
		// RETURN FOR CONSTRUCT
		///////////////////////////////////////////
		return {
			getWords: getWords
		};
	}; // HangmanMod CONSTRUCT END
	///////////////////////////////////////////
	// THE END & run functions
	///////////////////////////////////////////
	// rename and grab RETURN
	const hangmanApp = HangmanMod();
	hangmanApp.getWords();
})();
