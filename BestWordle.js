const fs = require("fs");
const { first } = require("lodash");
const _ = require("lodash");

// fs.readFile("./words.txt", "utf8", (err, data) => {
module.exports = {
  WordleRanker: function WordleRanker(words) {
    let scores = [];
    let excludeLetters = "arsblodfght".split("");
    let includeLetters = "ceni".split("");

    // let words = data.split("\n");
    const YELLOW_POINTS = 1;
    const GREEN_POINTS = 10;

    words.forEach((word, index) => {
      let letters = word.split("");
      let green = 0;
      let yellow = 0;
      let total = [];
      // console.log(word);

      words.forEach((otherWord, otherIndex) => {
        let score = [0, 0, 0, 0, 0];
        if (word === otherWord) {
          return;
        }
        let otherLetters = otherWord.split("");

        letters.forEach((l, i) => {
          if (
            otherWord.includes(l) &&
            !excludeLetters.includes(otherWord[i]) &&
            includeLetters.includes(otherWord[i])
          ) {
            score[i] = YELLOW_POINTS;
          }
        });

        //processing greens
        letters.forEach((l, i) => {
          if (
            l === otherLetters[i] &&
            !excludeLetters.includes(otherWord[i]) &&
            includeLetters.includes(otherWord[i])
          ) {
            score[i] = GREEN_POINTS;
          }
        });

        let sum = score.reduce((a, b) => a + b, 0);
        // console.log(word, otherWord, score, sum);
        let punish = _.uniq(letters).length < 5 ? -1 : 0;
        total.push(sum + punish);
      });

      let average = total.reduce((a, b) => a + b, 0) / total.length;
      scores.push({ word, average });
      //find yellow letters and green letters for all other words, yellow = 1, green = 2
    });
    let sortedScores = scores.sort((a, b) => b.average - a.average);

    // console.log(scores);
    return scores;
  },
};
// });
