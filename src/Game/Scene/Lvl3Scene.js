// Import outside libraries
const Phaser = require('phaser');

// Import Actors
const SerialPortReader = require('../SerialPortReader.js')
const PlatformSet = require('../PlatformSet.js')

// Phaser setup
let player;
let cursors;

const plat1Config = [
  { x: 450, y: 250, asset: 'wall1' },
  { x: 300, y: 250, asset: 'wall1' },
  { x: 450, y: 190, asset: 'wall1' },
  { x: 300, y: 190, asset: 'wall1' },
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
  { x: 300, y: 335, asset: 'wall2' },
  { x: 300, y: 400, asset: 'wall2' },
  { x: 375, y: 250, asset: 'short2' },
  { x: 375, y: 150, asset: 'short2' },

  { x: 700, y: 450, asset: 'short2' },
  { x: 750, y: 450, asset: 'short2' }

]

function isCircleCollision(c1, c2) {
    // Get the distance between the two circles
    const distSq = (c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y);
    const radiiSq = (c1.collisionRadius * c1.collisionRadius) + (c2.collisionRadius * c2.collisionRadius);
  
    // Returns true if the distance btw the circle's center points is less than the sum of the radii
    return (distSq < radiiSq);
}

class lvl3Scene extends Phaser.Scene {
    constructor() {
      super('Lvl3Scene');
      SerialPortReader.addListener(this.onSerialMessage.bind(this));
    }

    onSerialMessage(msg) {
        this.serialMsg = msg;
    }

    startScreenShake(intensity, duration, speed) {
        this.isShaking = true;
        this.shakeIntensity = intensity;
        this.shakeTime = duration;
        this.shakeSpeed = speed;

        this.shakeXScale = Math.random() > 0.5 ? 1 : -1;
        this.shakeYScale = Math.random() > 0.5 ? 1 : -1;
    }

    updateScreenShake(deltaTime)
    {
        if(this.isShaking)
        {
            this.shakeTime -= deltaTime;

            const shakeAmount = this.shakeTime / this.shakeSpeed;
            this.game.canvas.style.left = window.innerWeight / 2 - 400 + + (Math.cos(shakeAmount) * this.shakeXScale * this.shakeIntensity) + "px";
            this.game.canvas.style.top = window.innerHeight / 2 - 300 + + (Math.sin(shakeAmount) * this.shakeYScale * this.shakeIntensity) + "px";
        }

        if (this.shakeTime < 0)
        {
            this.isShaking = false;
            this.game.canvas.style.left = 'calc(50vw - 400px)';
            this.game.canvas.style.top = 'calc(50vh - 300px)';
        }

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

        //Sound
        this.load.audio('flip', '../assets/teleport-high.wav');
        this.load.audio('jump', '../assets/sand-jump.wav');
        this.load.audio('soundtrack', '../assets/393520__frankum__ambient-guitar-x1-loop-mode.mp3');
    }
    create () {

        this.sound.play('soundtrack', {volume: 0.5, loop: true});
        
        this.d = this.add.image(750,410,'door');
        this.d.collisionRadius = 20;
        

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
        this.player.collisionRadius = 20;

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

        this.isShaking = false;
        this.shakeTime = 0;
        this.shakeIntensity = 0;
        this.shakeXScale = 0;
        this.shakeYScale = 0;
        this.shakeSpeed = 0;

    }

    update(_,deltaTime) {

        this.updateScreenShake(deltaTime);
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
            if(isCircleCollision(this.d,this.player))
            {
                this.scene.start('EndScene');
            }
            this.player.setVelocityY(-250);
            this.sound.play('jump', {volume: 0.3, start: 1, duration: 0.01});
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
            this.startScreenShake(7, 100, 10);
            this.sound.play('flip', {volume: 0.3, start: 0, duration: 0.05});
        }
        this.isLastSpaceDown = this.cursors.space.isDown;

        // if (this.cursors.down.isDown) {
        //     // Transition to gameplay
        //     this.scene.start('EndScene');
        // }
    }
}

module.exports = lvl3Scene;