// Import outside libraries
const Phaser = require('phaser');

// Import Actors
const PlatformSet = require('../PlatformSet.js')

// Phaser setup
let player;
let cursors;

const plat1Config = [
  { x: 200, y: 400, asset: 'wall1' },
  { x: 200, y: 300, asset: 'ground' },
  { x: 200, y: 200, asset: 'ground' }
]
const plat2Config = [
  { x: 600, y: 350, asset: 'ground' },
  { x: 600, y: 250, asset: 'ground' },
  { x: 600, y: 150, asset: 'ground' }
]

class lvl3Scene extends Phaser.Scene {
    constructor() {
      super('Lvl3Scene');
    }

    preload () {
        this.load.image('ground', '../assets/platform.png');
        this.load.image('short1', '../assets/plat1-short.png');
        this.load.image('short2', '../assets/plat2-short.png');
        this.load.image('wall1', '../assets/plat1-wall.png');
        this.load.image('wall2', '../assets/plat2-wall.png');
        this.load.spritesheet('dude', 
            '../assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }
    create () {

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

        if (this.cursors.down.isDown) {
            // Transition to gameplay
            this.scene.start('EndScene')
          }
    }
}

module.exports = lvl3Scene;