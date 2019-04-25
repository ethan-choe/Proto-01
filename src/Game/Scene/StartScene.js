const Phaser = require('phaser');
const SerialPortReader = require('../SerialPortReader');

class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
    SerialPortReader.addListener(this.onSerialMessage.bind(this));
  }

  onSerialMessage(msg) {
    this.serialMsg = msg;
  }

  create() {
    this.overlay = document.querySelector('#start-scene');
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
      this.scene.start('Lvl4Scene')
    }

    // Process this.serialMsg here
    console.log(this.serialMsg);
  }
}

module.exports = StartScene;