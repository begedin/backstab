import computeSight from '@/behavior/sight';
import { Location } from '@/actions/Location';
import Entity from '@/Entity';
import { ActionOutcome } from '@/actions/ActionOutcome';

const move = (subject: Entity, location: Location): ActionOutcome => {
  subject.setPosition(location.x, location.y);
  subject.seenPoints = computeSight(subject);

  const outcome: ActionOutcome = { type: 'MOVE', outcome: { subject, target: location } };
  return outcome;
};

export default move;
