module.exports = function solveSudoku(sudoku) {
  const matrix = cloneSudoku(sudoku);
  const EXEMPLAR = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  let knownNumberCounter = 0;
  let prevCycleCounter;
  let guessCandidateCoords;

  while (knownNumberCounter < 81) {
    knownNumberCounter = 0;

    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < matrix[y].length; ++x) {
        if (matrix[y][x] === 1 || matrix[y][x] > 1) {
          ++knownNumberCounter;
          continue;
        }

        // further only unknown numbers are welcome

        if (matrix[y][x] === 0) {
          matrix[y][x] = new Set(EXEMPLAR);
        }

        if (matrix[y][x].size === 0) return null;
        else if (matrix[y][x].size === 1) {

          [matrix[y][x]] = [...matrix[y][x]];
          ++knownNumberCounter;
          break;
        }

        const overweight = collectOverweight(matrix, y, x);
        getRidOf(matrix[y][x], overweight);

        guessCandidateCoords = [y, x];
      }
    }

    if (knownNumberCounter === prevCycleCounter) {
      const [y, x] = guessCandidateCoords;
      const storage = matrix[y][x];
      matrix[y][x] = [...storage].pop();

      if (!solveSudoku(matrix)) {
        storage.delete(matrix[y][x]);
        matrix[y][x] = storage;
      }

    } else prevCycleCounter = knownNumberCounter;
  }

  return matrix;
}


function cloneSudoku(sudoku) {
  const matrix = [];

  for (let y = 0; y < sudoku.length; ++y) {
    matrix[y] = []

    for (let x = 0; x < sudoku[y].length; ++x) {
      if (typeof sudoku[y][x] === 'object') {
        matrix[y][x] = new Set([...sudoku[y][x]]);
      } else matrix[y][x] = sudoku[y][x];
    }
  }

  return matrix;
}


function collectOverweight(matrix, y, x) {
  const overweight = [];

  for (let i = 0; i < matrix.length; ++i) {
    overweight.push(matrix[y][i]);
    overweight.push(matrix[i][x]);

    const sectorY = Math.floor(y / 3) * 3 + Math.floor(i / 3);
    const sectorX = Math.floor(x / 3) * 3 + i % 3;
    overweight.push(matrix[sectorY][sectorX]);
  }

  return overweight;
}


function getRidOf(sequence, overweight) {
  overweight.forEach(value => sequence.delete(value));
}