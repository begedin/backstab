const goDownStairs = (entity, dungeon) => ({
  type: 'DOWN_STAIRS',
  outcome: { subject: entity, dungeon },
});

export default goDownStairs;
