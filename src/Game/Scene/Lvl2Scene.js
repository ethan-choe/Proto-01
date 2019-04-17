// Import outside libraries
const Phaser = require('phaser');

// Import Actors
const SerialPortReader = require('../SerialPortReader.js')
const PlatformSet = require('../PlatformSet.js')

// Phaser setup
let player;
let cursors;

const plat1Config = [
  { x: 450, y: 227, asset: 'wall1' },
  { x: 300, y: 227, asset: 'wall1' },
  { x: 50, y: 500, asset: 'short1' },
  { x: 235, y: 450, asset: 'short1' },
  { x: 50, y: 400, asset: 'short1' },
  { x: 235, y: 350, asset: 'short1' },
  { x: 50, y: 300, asset: 'short1' },
  { x: 235, y: 250, asset: 'short1' },
  { x: 50, y: 200, asset: 'short1' },
  { x: 235, y: 150, asset: 'short1' },
  { x: 375, y: 200, asset: 'short1' },
  { x: 375, y: 300, asset: 'short1' },
  { x: 375, y: 450, asset: 'short1' },
  { x: 525, y: 450, asset: 'short1' }

]
const plat2Config = [
  { x: 450, y: 150, asset: 'wall2' },
  { x: 300, y: 350, asset: 'wall2' },
  { x: 375, y: 250, asset: 'short2' },
  { x: 375, y: 150, asset: 'short2' },

  { x: 700, y: 450, asset: 'short2' },
  { x: 750, y: 450, asset: 'short2' }

]

class lvl2Scene extends Phaser.Scene {
    constructor() {
      super('Lvl2Scene');
      SerialPortReader.addListener(this.onSerialMessage.bind(this));
    }

    onSerialMessage(msg) {
        this.serialMsg = msg;
    }
    preload () {
        this.load.image('groundT', '../assets/tground.png');
        this.load.image('groundB', '../assets/bground.png');
        this.load.image('short1', '../assets/tground1.png');
        this.load.image('short2', '../assets/nplatt.png');
        this.load.image('wall1', '../assets/wallt.png');
        this.load.image('wall2', '../assets/wallb.png');
        this.load.image('door', '../assets/door.png');
        this.load.spritesheet('dude', 
            '../assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }
    create () {

        this.add.image(750,400,'door');

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
        this.plat1 = new PlatformSet(this, plat1Config, player, 'groundT');
        this.plat2 = new PlatformSet(this, plat2Config, player, 'groundB');

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

        this.plat1.update(deltaTime);
        this.plat2.update(deltaTime);

        // Process this.serialMsg here
        // if (this.serialMsg === 'l') {
        //     this.player.setVelocityX(-90);
        //     this.player.anims.play('left', true);
        // }
        // else if (this.serialMsg === 'r') {
        //     this.player.setVelocityX(90);
        //     this.player.anims.play('right', true);
        // }
        // else if (this.serialMsg === 's'){
        //     this.player.setVelocityX(0);
        //     this.player.anims.play('turn');
        // }

        // if (this.serialMsg === 'j') {
        //     this.player.setVelocityY(-250);
        // }

        // // was space down (reference tank game)
        // if (this.serialMsg === 't')
        // {
        //     if(this.plat2.isActive)
        //     {
        //         this.plat1.activate(); 
        //         this.plat2.deactivate();
        //     }
        // }
        // else if (this.serialMsg === 'b')
        // {
        //     if(this.plat1.isActive)
        //     {
        //         this.plat2.activate(); 
        //         this.plat1.deactivate();
        //     }
        // }

        // if (this.cursors.down.isDown) {
        //     // Transition to gameplay
        //     this.scene.start('EndScene')
        //   }

        // Un-comment this block for keyboard controls
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
            this.scene.start('Lvl2Scene')
        }
    }
}

module.exports = lvl2Scene;