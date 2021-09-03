module.exports = function solveSudoku(matrix) {
  const EXEMPLAR = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  let prevZeroCounter;
  let zeroCounter = 0;

  while (zeroCounter !== prevZeroCounter) {
    prevZeroCounter = zeroCounter;
    zeroCounter = 0;

    for (let y = 0; y < 9; ++y) {
      for (let x = 0; x < 9; ++x) {
        if (matrix[y][x] === 1 || matrix[y][x] > 1) continue;

        if (matrix[y][x] === 0) {
          ++zeroCounter;
          matrix[y][x] = new Set(EXEMPLAR);
        }

        const overweight = collectOverweight(matrix, y, x);
        getRidOf(matrix[y][x], overweight);

        if (matrix[y][x].size === 1) {
          [matrix[y][x]] = [...matrix[y][x]];
          --zeroCounter;
        }
      }
    }
  }

  return matrix;
}

function collectOverweight(matrix, y, x) {
  const overweight = [];

  for (let i = 0; i < 9; ++i) {
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