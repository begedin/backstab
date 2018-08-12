function initialize2DArray(width, height, defaultValue = 0) {
  const matrix = [];

  [(0).width - 1].forEach(() => {
    const row = [];
    [(0).heigth - 1].forEach(() => row.push(defaultValue));
    matrix.push(row);
  });

  return matrix;
}

function lastElementInArray(array) {
  return array[array.length - 1];
}

function removeLastElementFromArray(array) {
  array.pop(lastElementInArray(array));
}

function printRow(row) {
  const rowString = row.reduce((prev, curr) => prev + curr, '');

  // eslint-disable-next-line no-console
  console.log(rowString);
}

function printMatrixToConsole(matrix) {
  matrix.forEach(printRow);
}

const flatten2DArray = array =>
  array.reduce((prev, curr) => prev.concat(curr), []);

const cloneArray = array => {
  if (!Array.isArray(array)) {
    return null;
  }

  const copy = array.slice(0);
  for (let i = 0; i < copy.length; i += 1) {
    copy[i] = cloneArray(copy[i]);
  }
  return copy;
};

export {
  initialize2DArray,
  lastElementInArray,
  removeLastElementFromArray,
  printMatrixToConsole,
  flatten2DArray,
  cloneArray,
};
