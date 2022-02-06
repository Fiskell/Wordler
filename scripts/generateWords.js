const fs = require('fs');
const path = require('path');

const wordsLargePath = path.join(
  __dirname,
  '../',
  'datasets',
  'wordsLarge.txt',
);

fs.readFile(wordsLargePath, 'utf8', (err, data) => {
  if (err) {
    throw err;
  }

  const words = data.split('\n');
  const filteredWords = words
    .filter((word) => word.length === 5)
    .filter((word) => /^[a-zA-Z]+$/.test(word))
    .map((word) => word.toLowerCase());

  fs.writeFile(
    path.join(__dirname, 'wordsLarge.txt'),
    filteredWords.join('\n'),
    (e) => {
      // eslint-disable-next-line no-console
      console.log(e);
    },
  );
});
