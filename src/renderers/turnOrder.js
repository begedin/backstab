const renderSlot = (scene, { actor, energy }, offset) => {
  const rectangle = scene.add.graphics();
  rectangle.lineStyle(3, 0xffffff);
  rectangle.strokeRect(0, 0, 50, 50);
  rectangle.fillStyle(0x000000);
  rectangle.fillRect(0, 0, 50, 50);

  const nameText = scene.add.text(0, 0);
  nameText.setText(actor.name.slice(0, 3));

  const energyText = scene.add.text(0, 15);
  energyText.setText(energy);

  return scene.add.container(offset * 50, 0, [rectangle, nameText, energyText]);
};

const renderSlots = (scene, turnQueue) => {
  const visibleQueue = turnQueue.slice(0, 10);
  const total = visibleQueue.length;
  return visibleQueue.map((slot, index) =>
    renderSlot(scene, slot, index - total / 2),
  );
};

const renderTurnOrder = (scene, turnQueue) => {
  const { width, height } = scene.cameras.main;
  const {
    turnOrderContainer = scene.add.container(width / 2, height - 75),
  } = scene;
  turnOrderContainer.removeAll();
  turnOrderContainer.add(renderSlots(scene, turnQueue));
  return turnOrderContainer;
};

export default renderTurnOrder;
