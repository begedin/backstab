const meleeAttack = (attacker, target) => {
  let value;

  if (attacker.didMeleeHit(target)) {
    const damage = attacker.meleeDamage(target);
    target.takeDamage(damage);
    value = damage;
  } else {
    value = 'MISS';
  }

  return {
    type: 'MELEE_ATTACK',
    outcome: { subject: attacker, target, value },
  };
};

const move = (subject, location) => {
  subject.setPosition(location.x, location.y);
  return { type: 'MOVE', outcome: { subject, target: location } };
};

const canMoveTo = (subject, location, dungeon) => {
  const tile = dungeon.tileAt(location.x, location.y);
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

const wait = subject => ({ type: 'WAIT', outcome: { subject } });

export { enterPosition, meleeAttack, wait };
