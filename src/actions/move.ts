import computeSight from '@/behavior/sight';
import Entity from '@/Entity';
import { ActionOutcome } from '@/actions/ActionOutcome';
import { DungeonPoint } from '@/objects/dungeon/feature';

const move = (subject: Entity, location: DungeonPoint): ActionOutcome => {
  subject.setPosition(location.x, location.y);
  subject.seenPoints = computeSight(subject);

  const outcome: ActionOutcome = { type: 'MOVE', outcome: { subject, target: location } };
  return outcome;
};

export default move;
