const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const { filter } = require("lodash");

fs.readFile("./wordsLarge.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let words = data.split("\n");
  let filteredWords = words
    .filter((word) => word.length === 5)
    .filter((word) => /^[a-zA-Z]+$/.test(word))
    .map((word) => word.toLowerCase());
  console.log(filteredWords);
  fs.writeFile(
    path.join(__dirname, "wordsLarge.txt"),
    filteredWords.join("\n"),
    (err) => {
      console.log(err);
    }
  );
});
