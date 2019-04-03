// Import Outside libraries
const Phaser = require('phaser');
const xs = require('xstream').default;
// Import Controls
const SerialProducer = require('./SerialProducer.js');
// Import Scenes
const StartScene = require('./Scene/StartScene');
const Lvl1Scene = require('./Scene/Lvl1Scene');

// create serial port and open connection
const serial = new SerialProducer();
const input$ = xs.create(serial).map(d => d.toString());

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
  scene: [StartScene, Lvl1Scene, Lvl2Scene, Lvl3Scene],


};

const game = new Phaser.Game(config);
  
// Exported Module so game can be initialized elseware
const gameManager = {
  init: () => {
    input$.subscribe({
      next: (command) => {
        // Parse Arduino commands
        if (command === 's') {
          player.setVelocityX(0);
          player.anims.play('turn');
        }
        else if (command === 'l') {
          player.setVelocityX(-90);
          player.anims.play('left', true);
        }
        else if (command === 'r') {
          player.setVelocityX(90);
          player.anims.play('right', true);
        }
      
        if (command === 'j' && player.body.touching.down) {
          player.setVelocityY(-250);
        }
        if (command === 't') {
          this.plat1.activate(); 
          this.plat2.deactivate();
        }
        else if (command === 'r') {
          this.plat1.deactivate();
          this.plat2.activate();
        }
      },
      error: console.log,
      complete: console.log,
    });


  },
};

module.exports = gameManager;
