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
};

const Objects = {
  DOOR: 1,
  STAIRS_UP: 2,
  STAIRS_DOWN: 3,
};

const Feature = {
  ROOM: 0,
  CORRIDOR: 1,
};

export { Terrain, Objects, Direction, Feature };
