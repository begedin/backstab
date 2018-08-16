const Direction = {
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3,
};

const Terrain = {
  CORRIDOR: 0,
  DIRT_FLOOR: 1,
  DIRT_WALL: 2,
  DOOR: 3,
  STONE_WALL: 4,
  UNUSED: 5,
};

const Feature = {
  ROOM: 0,
  CORRIDOR: 1,
};

export { Terrain, Direction, Feature };
