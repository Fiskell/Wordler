const uniq = require('lodash/uniq');

module.exports = {
  WordleRanker: function WordleRanker(words) {
    const scores = [];
    const excludeLetters = 'arsblodfght'.split('');
    const includeLetters = 'ceni'.split('');

    // let words = data.split("\n");
    const YELLOW_POINTS = 1;
    const GREEN_POINTS = 10;

    words.forEach((word) => {
      const letters = word.split('');
      const total = [];

      words.forEach((otherWord) => {
        const score = [0, 0, 0, 0, 0];
        if (word === otherWord) {
          return;
        }

        const otherLetters = otherWord.split('');

        // processing greens
        letters.forEach((l, i) => {
          if (
            otherWord.includes(l)
            && !excludeLetters.includes(otherWord[i])
            && includeLetters.includes(otherWord[i])
          ) {
            score[i] = YELLOW_POINTS;
          }
        });

        // processing greens
        letters.forEach((l, i) => {
          if (
            l === otherLetters[i]
            && !excludeLetters.includes(otherWord[i])
            && includeLetters.includes(otherWord[i])
          ) {
            score[i] = GREEN_POINTS;
          }
        });

        const sum = score.reduce((a, b) => a + b, 0);
        const punish = uniq(letters).length < 5 ? -1 : 0;

        total.push(sum + punish);
      });

      const average = total.reduce((a, b) => a + b, 0) / total.length;
      scores.push({ word, average });
    });

    const sortedScores = scores.sort((a, b) => b.average - a.average);

    return sortedScores;
  },
};
