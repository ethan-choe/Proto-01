// Import outside libraries
const Phaser = require('phaser');

// Import Actors
const PlatformSet = require('../PlatformSet.js')

// Phaser setup
let player;
let cursors;

const plat1Config = [
  { x: 200, y: 400, asset: 'ground' },
  { x: 200, y: 300, asset: 'ground' },
  { x: 200, y: 200, asset: 'ground' }
]
const plat2Config = [
  { x: 600, y: 350, asset: 'ground' },
  { x: 600, y: 250, asset: 'ground' },
  { x: 600, y: 150, asset: 'ground' }
]

class lvl1Scene extends Phaser.Scene {
    constructor() {
      super('Lvl1Scene');
      console.log('setup')
    }

    preload () {
        this.load.image('ground', '../assets/platform.png');
        this.load.spritesheet('dude', 
            '../assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }
    create () {
        this.overlay = document.querySelector('#Lvl3-scene');
        this.overlay.classList.remove('hidden');
        
        console.log('l1')
        this.cursors = {
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        };
        
        // Player
        this.player = this.physics.add.sprite(100, -450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(270);

        //Platforms
        this.plat1 = new PlatformSet(this, plat1Config, player);
        this.plat2 = new PlatformSet(this, plat2Config, player);

        this.plat1.activate();
        this.plat2.deactivate();
        //Animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
      
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
      
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

    }

    update(_,deltaTime) {
        // Un-comment this block for keyboard controls

        this.plat1.update(deltaTime);
        this.plat2.update(deltaTime);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-90);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(90);
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-250);
        }

        if (this.keys.down.isDown) {
            this.overlay.classList.add('hidden');
            // Transition to gameplay
            this.scene.start('EndScene')
          }

        // was space down (reference tank game)
        if (this.cursors.space.isDown && !this.isLastSpaceDown)
        {
            if(this.plat2.isActive)
            {
                this.plat1.activate(); 
                this.plat2.deactivate();
            }
            else
            {
                this.plat1.deactivate();
                this.plat2.activate();
            }
        }
        this.isLastSpaceDown = this.cursors.space.isDown;
    }
}

module.exports = lvl3Scene;