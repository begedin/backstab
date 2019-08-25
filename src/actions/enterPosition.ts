import meleeAttack from '@/actions/meleeAttack';
import move from '@/actions/move';
import { Location } from '@/actions/Location';
import Entity from '@/Entity';
import Dungeon from '@/Dungeon';
import { ActionOutcome } from './ActionOutcome';

const canMoveTo = (subject: Entity, location: Location, dungeon: Dungeon): boolean => {
  const tile = dungeon.currentLevel.tileAt(location.x, location.y);
  return tile && subject.walkableTerrains.indexOf(tile.terrain) > -1;
};

const enterPosition = (
  subject: Entity,
  location: Location,
  dungeon: Dungeon,
  creatures: Entity[],
): ActionOutcome => {
  const creature = creatures.find(
    c => c.x === location.x && c.y === location.y && c.status !== 'DEAD',
  );

  if (creature) {
    return meleeAttack(subject, creature);
  }

  if (canMoveTo(subject, location, dungeon)) {
    return move(subject, location);
  }

  const outcome: ActionOutcome = { type: 'BUMP', outcome: { subject, target: location } };

  return outcome;
};

export default enterPosition;
