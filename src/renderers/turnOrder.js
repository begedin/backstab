// precreation

const renderInitialSlot = (scene, offset) => {
  const rectangle = scene.add.graphics();
  rectangle.lineStyle(3, 0xffffff);
  rectangle.strokeRect(0, 0, 50, 50);
  rectangle.fillStyle(0x000000);
  rectangle.fillRect(0, 0, 50, 50);
  rectangle.name = 'border';

  const nameText = scene.add.text(0, 0);
  nameText.name = 'name';

  const energyText = scene.add.text(0, 15);
  energyText.name = 'energy';

  const highlight = scene.add.graphics();
  highlight.lineStyle(3, 0x00ff00);
  highlight.strokeRect(0, 0, 50, 50);
  highlight.name = 'highlight';
  highlight.setVisible(false);

  return scene.add
    .container(offset * 50, 0, [rectangle, nameText, energyText, highlight])
    .setData('id', null);
};

const renderInitialSlots = scene =>
  new Array(10)
    .fill()
    .map((item, index) => renderInitialSlot(scene, index - 10 / 2));

const renderInitialTurnOrder = scene => {
  const { width, height } = scene.cameras.main;
  const slots = scene.add.container(width / 2, height - 75);

  slots.add(renderInitialSlots(scene));
  return slots;
};

// updating

const getItemsToRender = queue => queue.slice(0, 10);

const updateSlot = (slot, { actor, energy }) => {
  slot.getByName('name').setText(actor.name.slice(0, 3));
  slot.getByName('energy').setText(energy);
  slot.setData('id', actor.id);
};

const updateTurnOrder = (slots, queue) =>
  getItemsToRender(queue).forEach((item, index) => {
    const slot = slots.getAt(index);
    updateSlot(slot, item);
  });

export { renderInitialTurnOrder, updateTurnOrder };
