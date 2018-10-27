const goUpStairs = (entity, dungeon) => ({
  type: 'UP_STAIRS',
  outcome: { subject: entity, dungeon },
});

export default goUpStairs;
