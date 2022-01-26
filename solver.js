const fs = require("fs");
const readline = require("readline-sync");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;
const { WordleRanker } = require("./BestWordle");

class Wordle {
  constructor(word) {
    this.word = word;
  }

  getLetters() {
    return this.word.split("");
  }

  hasLetter(l) {
    return this.word.includes(l);
  }

  hasPositionalMatch(posistionalMatchers) {
    const letters = this.getLetters();

    return posistionalMatchers.every((match) => letters[match[0]] === match[1]);
  }
}

fs.readFile("./wordsLarge.txt", "utf8", (err, data) => {
  let words = data.split("\n");
  const greenMatches = [];
  const yellowMatches = [];
  const guessedLettersMatching = [];
  const guessedLettersNonMatching = [];
  while (true) {
    let word = readline.question("Wordle word? ");
    let info = readline.question("Wordle info (y/g/0): ");
    console.log(word, info);
    const wordles = words.map((w) => new Wordle(w));

    word.split("").forEach((l, i) => {
      switch (info[i]) {
        case "y":
          yellowMatches.push([i, l]);
          guessedLettersMatching.push(l);
          break;
        case "g":
          greenMatches.push([i, l]);
          guessedLettersMatching.push(l);
          break;
        case "0":
          guessedLettersNonMatching.push(l);
          break;
      }
    });

    filteredWordles = wordles
      .filter(
        (word) => !guessedLettersNonMatching.some((l) => word.hasLetter(l))
      )
      .filter((word) => guessedLettersMatching.every((l) => word.hasLetter(l)))
      .filter((word) => word.hasPositionalMatch(greenMatches))
      .filter((word) => !word.hasPositionalMatch(yellowMatches));
    let rankedWordles = WordleRanker(filteredWordles.map((w) => w.word));

    console.log(rankedWordles.slice(0, 10));
    // console.log("green=>", greenMatches);
    // console.log("yellow=>", yellowMatches);
    // console.log("matching=>", guessedLettersMatching);
    // console.log("not matching=>", guessedLettersNonMatching);
  }
});
