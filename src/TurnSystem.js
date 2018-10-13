import { turnEnergy } from 'backstab/behavior/attributes';

const pairWithEnergy = actor => ({ actor, energy: 0 });
const regenerateEnergy = ({ actor, energy }) => ({
  actor,
  energy: energy + turnEnergy(actor),
});
const compareByEnergy = ({ energy: a }, { energy: b }) => b - a;

const createTurnQueue = actors =>
  actors
    .map(pairWithEnergy)
    .map(regenerateEnergy)
    .sort(compareByEnergy);

const updateTurnQueue = (queue, previousAction = {}) => {
  const { cost = 500 } = previousAction;
  const { actor, energy } = queue[0];
  const newEnergy = energy - cost;
  const unsortedQueue = queue
    .slice(1, queue.length)
    .concat({ actor, energy: energy - cost });

  return newEnergy > 0
    ? unsortedQueue.sort(compareByEnergy)
    : unsortedQueue.map(regenerateEnergy).sort(compareByEnergy);
};

export { createTurnQueue, updateTurnQueue };
