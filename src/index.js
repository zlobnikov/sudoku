module.exports = function solveSudoku(sudoku, validation = false) {
  const matrix = cloneSudoku(sudoku, validation);
  if (!matrix) return null;

  const EXEMPLAR = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  let knownNumberCounter = 0;
  let prevCycleCounter;

  while (knownNumberCounter < 81) {
    knownNumberCounter = 0;

    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < matrix[y].length; ++x) {
        if (matrix[y][x] === 1 || matrix[y][x] > 1) {
          ++knownNumberCounter;
          continue;
        }

        if (matrix[y][x] === 0) {
          matrix[y][x] = new Set(EXEMPLAR);
        }

        if (matrix[y][x].size === 0) return null;
        else if (matrix[y][x].size === 1) {
          [matrix[y][x]] = [...matrix[y][x]];
          ++knownNumberCounter;
          continue;
        }

        dropExtraNumbers(matrix, y, x);
      }
    }

    if (knownNumberCounter === prevCycleCounter) {
      const [y, x] = getCandidateCoords(matrix);
      const storage = matrix[y][x];

      matrix[y][x] = [...storage].pop();
      const draft = solveSudoku(matrix, true);

      if (!check(draft)) {
        storage.delete(matrix[y][x]);
        if (storage.size === 0) return null;
        matrix[y][x] = storage;
      }

    } else prevCycleCounter = knownNumberCounter;
  }

  return matrix;
}


function cloneSudoku(sudoku, validation) {
  if (validation && !check(sudoku)) return null;

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


function dropExtraNumbers(matrix, y, x) {
  for (let i = 0; i < matrix.length; ++i) {
    matrix[y][x].delete(matrix[y][i]);
    matrix[y][x].delete(matrix[i][x]);

    const sectorY = Math.floor(y / 3) * 3 + Math.floor(i / 3);
    const sectorX = Math.floor(x / 3) * 3 + i % 3;
    matrix[y][x].delete(matrix[sectorY][sectorX]);
  }
}


function getCandidateCoords(matrix) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < matrix[y].length; ++x) {
      if (typeof matrix[y][x] === 'object') {
        return [y, x];
      }
    }
  }
}


function check(draft) {
  if (!draft) return false;

  for (let i = 0; i < draft.length; ++i) {
    if (( new Set(draft[i]) ).size !== 9) return false;
    if (( new Set(draft.map(row => row[i])) ).size !== 9) return false;

    const y = Math.floor(i / 3) * 3;
    const x = i % 3 * 3;

    if ((new Set(draft.slice(y, y + 3).reduce(
      (all, row) => all.concat(row.slice(x, x + 3)), []
    ))).size !== 9 ) return false;
  }

  return true;
}
