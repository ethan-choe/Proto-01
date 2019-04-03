const Phaser = require('phaser');

class StartScene extends Phaser.Scene {
  constructor() {
    super('EndScene');
  }

  create() {
    this.overlay = document.querySelector('#end-scene');
    this.overlay.classList.remove('hidden');

    this.cursors = {
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };
  }

  update() {
    if (this.cursors.space.isDown) {
      this.overlay.classList.add('hidden');
      // Transition to gameplay
      this.scene.start('Lvl1Scene')
    }
  }
}

module.exports = StartScene;