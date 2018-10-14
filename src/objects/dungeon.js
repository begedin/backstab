class Dungeon {
  constructor(startingLocation, features, width, height) {
    this.startingLocation = startingLocation;
    this.features = features;
    this.width = width;
    this.height = height;
  }

  tileAt(x, y) {
    const feature = this.features.find(f => f.contains({ x, y }));
    return feature ? feature.getPoint({ x, y }) : null;
  }
}

// used by easystar. Since the algorithm expects coordinates as a [y][x] grid
// we build a transposed grid
const getGrid = (dungeon, size = 500) => {
  const grid = [];
  for (let j = 0; j < size; j += 1) {
    grid[j] = [];
    for (let i = 0; i < size; i += 1) {
      const tile = dungeon.tileAt(i, j);
      if (tile) {
        grid[j][i] = tile.terrain;
      } else {
        grid[j][i] = -1;
      }
    }
  }
  return grid;
};

export { getGrid };
export default Dungeon;
