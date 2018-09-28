const meleeAttack = (attacker, defender) => {
  if (attacker.didMeleeHit(defender)) {
    const damage = attacker.meleeDamage(defender);
    defender.takeDamage(damage);
    return damage;
  }

  return 'MISS';
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
    return {
      type: 'MELEE_ATTACK',
      outcome: {
        target: creature,
        value: meleeAttack(subject, creature),
      },
    };
  }

  if (canMoveTo(subject, location, dungeon)) {
    subject.setPosition(location.x, location.y);
    return { type: 'MOVE', outcome: { target: location } };
  }

  return { type: 'BUMP', outcome: { target: location } };
};

export default enterPosition;
export { enterPosition };
