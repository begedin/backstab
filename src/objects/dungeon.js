class Dungeon {
  constructor(startingLocation, features, width, height) {
    this.startingLocation = startingLocation;
    this.features = features;
    this.width = width;
    this.height = height;
  }

  tileAt(x, y) {
    return this.features
      .find(feature => feature.contains({ x, y }))
      .getPoint({ x, y });
  }
}

export default Dungeon;
