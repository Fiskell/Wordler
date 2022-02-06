export interface MatcherPosition {
  index: number;
  letter: string;
}

export class Word {
  public readonly word: string;

  constructor(word: string) {
    this.word = word;
  }

  getLetters(): string[] {
    return this.word.split('');
  }

  hasLetter(letter: string): boolean {
    return this.word.includes(letter);
  }

  hasPositionalMatch(posistionalMatchers: MatcherPosition[]): boolean {
    const letters = this.getLetters();

    return posistionalMatchers.every(
      (match: MatcherPosition) => letters[match.index] === match.letter
    );
  }
}
