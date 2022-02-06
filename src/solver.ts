import readline from 'readline-sync';
import { Ranker } from './ranker';
import { MatcherPosition, Word } from './word';

export class Solver {
  private ranker: Ranker;

  private words: string[];

  private greenMatches: MatcherPosition[];

  private yellowMatches: MatcherPosition[];

  private guessedLettersMatching: string[];

  private guessedLettersNonMatching: string[];

  constructor(words: string[], ranker: Ranker) {
    this.words = words;
    this.ranker = ranker;
    this.greenMatches = [];
    this.yellowMatches = [];
    this.guessedLettersMatching = [];
    this.guessedLettersNonMatching = [];
  }

  run() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const word: string = readline.question('Wordle word? ');
      const info: string = readline.question('Wordle info (y/g/0): ');

      word.split('').forEach((letter: string, index: number) => {
        switch (info[index]) {
          case 'y':
            this.yellowMatches.push({ index, letter });
            this.guessedLettersMatching.push(letter);
            break;
          case 'g':
            this.greenMatches.push({ index, letter });
            this.guessedLettersMatching.push(letter);
            break;
          case '0':
            this.guessedLettersNonMatching.push(letter);
            break;
          default:
        }
      });

      const wordles = this.words.map((w) => new Word(w));

      const filteredWords = wordles
        .filter(this.doesNotContainNonMatchingGuessedLetters.bind(this))
        .filter(this.containsAllMatchingGuessedLetters.bind(this))
        .filter(this.containsPositionalGreenMatches.bind(this))
        .filter(this.doesNotContainPositionalYellowMatches.bind(this));

      const rankedWordles = this.ranker.rank(
        filteredWords.map((w) => w.word),
        this.guessedLettersNonMatching
      );

      // eslint-disable-next-line no-console
      console.log(rankedWordles.slice(0, 10));
    }
  }

  containsPositionalGreenMatches(word: Word): boolean {
    if (!this.greenMatches.length) {
      return true;
    }

    return word.hasPositionalMatch(this.greenMatches);
  }

  doesNotContainPositionalYellowMatches(word: Word): boolean {
    if (!this.yellowMatches.length) {
      return true;
    }

    return !word.hasPositionalMatch(this.yellowMatches);
  }

  containsAllMatchingGuessedLetters(word: Word): boolean {
    return this.guessedLettersMatching.every((letter: string) => word.hasLetter(letter));
  }

  doesNotContainNonMatchingGuessedLetters(word: Word): boolean {
    return !this.guessedLettersNonMatching.some((letter: string) => word.hasLetter(letter));
  }
}
