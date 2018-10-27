import meleeAttack from 'backstab/actions/meleeAttack';
import move from 'backstab/actions/move';

const canMoveTo = (subject, location, dungeon) => {
  const tile = dungeon.currentLevel.tileAt(location.x, location.y);
  return tile && subject.walkableTerrains.indexOf(tile.terrain) > -1;
};

const enterPosition = (subject, location, dungeon, creatures) => {
  const creature = creatures.find(
    c => c.x === location.x && c.y === location.y && c.status !== 'DEAD',
  );

  if (creature) {
    return meleeAttack(subject, creature);
  }

  if (canMoveTo(subject, location, dungeon)) {
    return move(subject, location);
  }

  return { type: 'BUMP', outcome: { subject, target: location } };
};

export default enterPosition;
