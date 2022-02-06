import path from 'path';
import { readFile } from 'fs/promises';
import { Solver } from './solver';
import { Ranker } from './ranker';

async function main() {
  const wordsLargePath = path.join(__dirname, '../', 'datasets', 'wordsLarge.txt');
  const wordString = await readFile(wordsLargePath);
  const words = wordString.toString().split('\n');

  const ranker = new Ranker();
  const solver = new Solver(words, ranker);

  solver.run();
}

(async () => {
  await main();
})();
