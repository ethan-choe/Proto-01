const Phaser = require('phaser');
const SerialPortReader = require('../SerialPortReader.js')

class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene');
    SerialPortReader.addListener(this.onSerialMessage.bind(this));
  }

  onSerialMessage(msg) {
    this.serialMsg = msg;
  }

  create() {
    this.overlay = document.querySelector('#end-scene');
    this.overlay.classList.remove('hidden');

    this.cursors = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
    };
  }

  update() {
    if (this.serialMsg === 'j') {
      this.overlay.classList.add('hidden');
      // Transition to gameplay
      this.scene.start('Lvl1Scene')
    }

    if (this.cursors.up.isDown) {
      this.overlay.classList.add('hidden');
      // Transition to gameplay
      this.scene.start('Lvl1Scene')
    }
  }
}

module.exports = EndScene;