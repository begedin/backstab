function initialize2DArray(width, height, defaultValue) {
  if (!defaultValue) {
    defaultValue = 0;
  }

  var matrix = [];
  for (var i = 0; i < width; i++) {
    var row = [];
    for (var j = 0; j < height; j++) {
      row.push(defaultValue);
    }
    matrix.push(row);
  }

  return matrix;
}

function lastElementInArray(array) {
  return array[array.length - 1];
}

function removeLastElementFromArray(array) {
  array.pop(lastElementInArray(array));
}

function printMatrixToConsole(matrix) {
  matrix.forEach(_printRow);
}

function _printRow(row) {
  var rowString = row.reduce(function (prev, curr) {
    return prev + curr;
  }, "");

  console.log(rowString);
}

export default {
  initialize2DArray: initialize2DArray,
  lastElementInArray: lastElementInArray,
  removeLastElementFromArray: removeLastElementFromArray,
  printMatrixToConsole: printMatrixToConsole
};
