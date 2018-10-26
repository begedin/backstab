import computeSight from 'backstab/behavior/sight';

const move = (subject, location) => {
  subject.setPosition(location.x, location.y);
  subject.set('seenPoints', computeSight(subject));
  return { type: 'MOVE', outcome: { subject, target: location } };
};

export default move;
