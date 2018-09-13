const bresenhamLine = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
  const points = [];

  // Define differences and error check
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  let x = x1;
  let y = y1;

  // Main loop
  while (!(x === x2 && y === y2)) {
    // eslint-disable-next-line no-bitwise
    const e2 = err << 1;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
    // Set coordinates
    points.push({ x, y });
  }
  // Return the result
  return points;
};

export default bresenhamLine;
