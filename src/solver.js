const fs = require('fs');
const path = require('path');
const readline = require('readline-sync');
const { WordleRanker } = require('./BestWordle');

class Wordle {
  constructor(word) {
    this.word = word;
  }

  getWord() {
    return this.word;
  }

  getLetters() {
    return this.word.split('');
  }

  hasLetter(l) {
    return this.word.includes(l);
  }

  hasPositionalMatch(positionalMatchers) {
    const letters = this.getLetters();

    return positionalMatchers.every(({ index, letter }) => letters[index] === letter);
  }
}

const wordsLargePath = path.join(__dirname, '../', 'datasets', 'wordsLarge.txt');

fs.readFile(wordsLargePath, 'utf8', (err, data) => {
  if (err) {
    throw err;
  }

  const words = data.split('\n');
  const greenMatches = [];
  const guessedLettersMatching = [];
  const guessedLettersNonMatching = [];
  const guesses = [];

  for (;;) {
    const yellowMatches = [];

    const word = readline.question('Wordle word? ');
    const info = readline.question('Wordle info (y/g/0): ');

    // eslint-disable-next-line no-console
    console.log(word, info);
    const wordles = words.map((w) => new Wordle(w));

    word.split('').forEach((letter, index) => {
      switch (info[index]) {
        case 'y':
          yellowMatches.push({
            letter,
            index,
          });
          guessedLettersMatching.push({
            letter,
            index,
          });
          break;
        case 'g':
          greenMatches.push({
            letter,
            index,
          });
          guessedLettersMatching.push({
            letter,
            index,
          });
          break;
        case '0':
          guessedLettersNonMatching.push({
            letter,
            index,
          });
          break;
        default:
      }
    });

    const filteredWordles = wordles
      .filter((wordle) => !guessedLettersNonMatching.some(({ letter }) => wordle.hasLetter(letter))
      && guessedLettersMatching.every(({ letter }) => wordle.hasLetter(letter))
      && wordle.hasPositionalMatch(greenMatches)
      && !wordle.hasPositionalMatch(yellowMatches)
      && !guesses.includes(wordle.getWord()));

    const rankedWordles = WordleRanker(
      filteredWordles.map(({ word: filteredWord }) => filteredWord),
    );

    // eslint-disable-next-line no-console
    console.log(rankedWordles.slice(0, 10));

    guesses.push(word);
  }
});
