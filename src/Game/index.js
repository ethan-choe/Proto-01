// Import Outside libraries
const Phaser = require('phaser');
const xs = require('xstream').default;
// Import Controls
// const SerialProducer = require('./SerialProducer.js');
const SerialPortReader = require('./SerialPortReader');
// Import Scenes
const StartScene = require('./Scene/StartScene');
const Lvl1Scene = require('./Scene/Lvl1Scene');
const Lvl2Scene = require('./Scene/Lvl2Scene');
const Lvl3Scene = require('./Scene/Lvl3Scene');
const EndScene = require('./Scene/EndScene');

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 200 }
      }
  },
  scene: [StartScene, Lvl1Scene, Lvl2Scene, Lvl3Scene, EndScene],


};

const game = new Phaser.Game(config);
  
// Exported Module so game can be initialized elseware
const gameManager = {
  init: () => {
    SerialPortReader.openPort(p => /Arduino/.test(p.manufacturer), '~');
      // (command) => {
      //   // Parse Arduino commands
      //   if (command === 's') {
      //     player.setVelocityX(0);
      //     player.anims.play('turn');
      //   }
      //   else if (command === 'l') {
      //     player.setVelocityX(-90);
      //     player.anims.play('left', true);
      //   }
      //   else if (command === 'r') {
      //     player.setVelocityX(90);
      //     player.anims.play('right', true);
      //   }
      
      //   if (command === 'j' && player.body.touching.down) {
      //     player.setVelocityY(-250);
      //   }
      //   if (command === 't' && !this.isLastSpaceDown) {
      //     // this.plat1.activate(); 
      //     // this.plat2.deactivate();
      //     for(var i = 1; i < 4; i++) {
      //       game.scene.scenes[i].plat1.activate();
      //       game.scene.scenes[i].plat2.deactivate();
      //     }
      //   }
      //   else if (command === 'r' && !this.isLastSpaceDown) {
      //     // this.plat1.deactivate();
      //     // this.plat2.activate();
      //     for(var i = 1; i < 4; i++) {
      //       game.scene.scenes[i].plat2.activate();
      //       game.scene.scenes[i].plat1.deactivate();
      //     }
      //   }

      //   this.isLastSpaceDown = this.cursors.space.isDown;
      // }
  },
};

module.exports = gameManager;
