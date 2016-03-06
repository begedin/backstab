import Randomizer from 'app/helpers/randomizer';
import Room from 'app/objects/dungeon/features/room';
import { Terrain, Direction } from 'app/enums';
import Tile from 'app/objects/tile';
import { flatten2DArray } from 'app/helpers/array';

const FEATURE_COUNT = 20;
const BASE_OFFSET = 10;

class Generator {
  constructor(game) {
    this.game = game;
    this.featureCount = FEATURE_COUNT;
    this.rng = new Randomizer();
    this.features = [];
    this.createDungeon();
    this._generateTiles();
  }

  get flattenedTiles() {
    return flatten2DArray(this.tiles);
  }

  get firstWalkableTile() {
    return this.flattenedTiles.find(function(tile) {
      return tile.isWalkable === true;
    });
  }

  _locationCanBeFeatureAnchor(point) {
    let terrain = this.getTile(point.x, point.y);
    let surroundings = this._getSurroundings(point);

    let terrainIsBuildable = (terrain === Terrain.DIRT_WALL);
    let surroundingsContainAWalkableTile = surroundings.some((s) => s.tile === Terrain.DIRT_FLOOR);
    let surroundingsContainADoor = surroundings.some((s) => s.tile === Terrain.DOOR);
    let surroundingsContainAnEmptyTile = surroundings.some((s) => !s.tile);

    return terrainIsBuildable && surroundingsContainAWalkableTile && !surroundingsContainADoor && surroundingsContainAnEmptyTile;
  }

  get _allFeaturePoints() {
    return this.features.reduce((prev, next) => {
      return prev.concat(next.points);
    }, []);
  }

  get featurableLocations() {
    return this._allFeaturePoints.filter((point) => this._locationCanBeFeatureAnchor(point));
  }

  initialize() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (y === 0 || y === this.height - 1 || x === 0 || x === this.width - 1) {
          this.setTile(x, y, Terrain.STONE_WALL);
        } else {
          this.setTile(x, y, Terrain.UNUSED);
        }
      }
    }
  }

  setTile(x, y, type) {
    if (!this.map) {
      this.map = [];
    }

    if (!this.map[x]) {
      this.map[x] = [];
    }

    this.map[x][y] = type;
  }

  getTile(x, y) {
    if (!this.map || !this.map[x]) {
      return undefined;
    } else {
      return this.map[x][y];
    }
  }

  tileAt(x, y) {
    return this.tiles[x][y];
  }

  makeRoom(x, y, direction) {
    let room = new Room(this, x, y, direction);

    if (this._canPlaceFeature(room)) {

      room.points.forEach((point) => {
        let isWall = room.isWall(point);
        this.setTile(point.x, point.y, isWall ? Terrain.DIRT_WALL : Terrain.DIRT_FLOOR);
      });

      this.features.push(room);
      return room;
    } else {
      return false;
    }
  }

  _pointIsInBounds(point) {
    let xIsInBounds = point.x  >= 0 && point.x < this.width;
    let yIsInBounds = point.y >= 0 && point.y < this.height;

    return xIsInBounds && yIsInBounds;
  }

  _canPlaceFeature(feature) {
    return feature.points.every((point) => {
      let tile = this.getTile(point.x, point.y);
      return !tile || (tile === Terrain.DIRT_WALL && feature.isWall(point));
    });
  }

  _randomDirection() {
    return this.rng.pick([Direction.NORTH, Direction.SOUTH, Direction.EAST, Direction.WEST]);
  }

  _generateTiles() {
    let game = this.game;
    let offset = this.mapOffset;
    let tiles = [];
    this.map.forEach((row, gridX) => {
      let x = gridX + offset.x;
      tiles[x] = [];
      return row.map((type, gridY) => {
        let y = gridY + offset.y;
        let tile = new Tile(game, type, x, y);
        tiles[x][y] = tile;
      });
    });

    this.tiles = tiles;
  }

  get mapOffset() {
    if (!this._mapOffset) {
      let minY;
      let minX;
      this.map.forEach((row, x) => {
        row.forEach((type, y) => {
          if (!minX || x < minX) {
            minX = x;
          }
          if (!minY || y < minY) {
            minY = y;
          }
        });
      });

      let offsetX = BASE_OFFSET + -minX;
      let offsetY = BASE_OFFSET + -minY;

      this._mapOffset = { x: offsetX, y: offsetY };
    }

    return this._mapOffset;
  }

  get startingLocation() {
    let mapOffset = this.mapOffset;
    return { x: 1000 + mapOffset.x, y: 1000 + mapOffset.y };
  }


  _getSurroundingPoints(point) {
    let x = point.x;
    let y = point.y;
    return [
      { x: x, y: y - 1, direction: Direction.NORTH },
      { x: x - 1 , y: y, direction: Direction.WEST },
      { x: x, y: y + 1, direction: Direction.SOUTH },
      { x: x + 1, y: y, direction: Direction.EAST }
    ];
  }

  _getSurroundings(point) {
    return this._getSurroundingPoints(point).map((point) => {
      return {
        x: point.x,
        y: point.y,
        direction: point.direction,
        tile: this.getTile(point.x, point.y)
      };
    });
  }

  createDungeon() {
    // setup initial terrain
    this.initialize();

    // make starting room
    this.makeRoom(1000, 1000);
    // initialize feature count

    let attempts = 0;
    while (this.features.length <= this.featureCount && attempts <= 1000) {
      this.tryAddFeature();
      attempts++;
    }
  }

  tryAddFeature() {
    let anchorLocation = this.rng.pick(this.featurableLocations);
    let surroundings = this._getSurroundings(anchorLocation);
    let featureSpot = surroundings.find((s) => !s.tile);

    if (!featureSpot) {
      return;
    }

    let room = this.makeRoom(featureSpot.x, featureSpot.y, featureSpot.direction);

    if (!room)  {
      return;
    }

    this.setTile(anchorLocation.x, anchorLocation.y, Terrain.DOOR);
    this.setTile(room.x, room.y, Terrain.DOOR);
  }
}

export default Generator;
