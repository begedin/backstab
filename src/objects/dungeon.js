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

export default Dungeon;
