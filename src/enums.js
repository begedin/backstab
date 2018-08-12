const Direction = {
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3,
};

const Terrain = {
  UNUSED: 0,
  STONE_WALL: 1,
  DIRT_FLOOR: 2,
  DIRT_WALL: 3,
  DOOR: 4,
  CORRIDOR: 5,
};

const Feature = {
  ROOM: 0,
  CORRIDOR: 1,
};

export { Terrain, Direction, Feature };
