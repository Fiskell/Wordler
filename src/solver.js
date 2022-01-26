const fs = require('fs');
const path = require('path');
const readline = require('readline-sync');
const { WordleRanker } = require('./BestWordle');

class Wordle {
  constructor(word) {
    this.word = word;
  }

  getLetters() {
    return this.word.split('');
  }

  hasLetter(l) {
    return this.word.includes(l);
  }

  hasPositionalMatch(posistionalMatchers) {
    const letters = this.getLetters();

    return posistionalMatchers.every((match) => letters[match[0]] === match[1]);
  }
}

const wordsLargePath = path.join(__dirname, '../', 'datasets', 'wordsLarge.txt');

fs.readFile(wordsLargePath, 'utf8', (err, data) => {
  if (err) {
    throw err;
  }

  const words = data.split('\n');
  const greenMatches = [];
  const yellowMatches = [];
  const guessedLettersMatching = [];
  const guessedLettersNonMatching = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const word = readline.question('Wordle word? ');
    const info = readline.question('Wordle info (y/g/0): ');

    // eslint-disable-next-line no-console
    console.log(word, info);
    const wordles = words.map((w) => new Wordle(w));

    word.split('').forEach((l, i) => {
      switch (info[i]) {
        case 'y':
          yellowMatches.push([i, l]);
          guessedLettersMatching.push(l);
          break;
        case 'g':
          greenMatches.push([i, l]);
          guessedLettersMatching.push(l);
          break;
        case '0':
          guessedLettersNonMatching.push(l);
          break;
        default:
      }
    });

    const filteredWordles = wordles
      .filter((wordle) => !guessedLettersNonMatching.some((l) => wordle.hasLetter(l)))
      .filter((wordle) => guessedLettersMatching.every((l) => wordle.hasLetter(l)))
      .filter((wordle) => wordle.hasPositionalMatch(greenMatches))
      .filter((wordle) => !wordle.hasPositionalMatch(yellowMatches));

    const rankedWordles = WordleRanker(filteredWordles.map((w) => w.word));

    // eslint-disable-next-line no-console
    console.log(rankedWordles.slice(0, 10));
  }
});
