// Import outside libraries
const Phaser = require('phaser');

// Import Actors
const SerialPortReader = require('../SerialPortReader.js')
const PlatformSet = require('../PlatformSet.js')

// Phaser setup
let player;
let cursors;

const plat1Config = [
  { x: 150, y: 50, asset: 'Twall1' },
  { x: 250, y: 50, asset: 'Twall1' },
  { x: 350, y: 250, asset: 'Twall1' },
  { x: 450, y: 350, asset: 'Twall1' },
  { x: 700, y: 250, asset: 'Twall1' },
  { x: 200, y: 135, asset: 'tiny1' },
  { x: 50, y: 510, asset: 'tiny1' },
  { x: 350, y: 470, asset: 'tiny1' },
  { x: 650, y: 470, asset: 'tiny1' },
  { x: 750, y: 410, asset: 'tiny1' },
  { x: 750, y: 290, asset: 'tiny1' },
  { x: 750, y: 170, asset: 'tiny1' },

]
const plat2Config = [
  { x: 300, y: 200 , asset: 'Twall2' },
  { x: 400, y: 300 , asset: 'Twall2' },
  { x: 500, y: 400, asset: 'Twall2' }, 
  { x: 650, y: 270, asset: 'Twall2' },
  { x: 700, y: 400, asset: 'Twall2' },
  { x: 200, y: 470, asset: 'tiny2' },
  { x: 500, y: 470, asset: 'tiny2' },
  { x: 750, y: 350, asset: 'tiny2' },
  { x: 750, y: 230, asset: 'tiny2' },
  { x: 750, y: 230, asset: 'tiny2' },

]

function isCircleCollision(c1, c2) {
    // Get the distance between the two circles
    const distSq = (c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y);
    const radiiSq = (c1.collisionRadius * c1.collisionRadius) + (c2.collisionRadius * c2.collisionRadius);
  
    // Returns true if the distance btw the circle's center points is less than the sum of the radii
    return (distSq < radiiSq);
}

class lvl4Scene extends Phaser.Scene {
    constructor() {
      super('Lvl4Scene');
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
        this.load.image('tiny1', '../assets/tinyb.png');
        this.load.image('tiny2', '../assets/tinyt.png');
        this.load.image('Twall2', '../assets/Twallb.png');
        this.load.image('Twall1', '../assets/Twallt.png');
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
        
        this.d = this.add.image(200,100,'door');
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
        if (this.serialMsg === 'l') {
            this.player.setVelocityX(-90);
            this.player.anims.play('left', true);
        }
        else if (this.serialMsg === 'r') {
            this.player.setVelocityX(90);
            this.player.anims.play('right', true);
        }
        else if (this.serialMsg === 's'){
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.serialMsg === 'j') {
            if(isCircleCollision(this.d,this.player))
            {
                this.sound.stopAll();
                this.scene.start('EndScene');
            }
            this.player.setVelocityY(-250);
            this.sound.play('jump', {volume: 0.1, start: 1, duration: 0.01});
        }

        // was space down (reference tank game)
        // add debounce timer
        if (this.serialMsg === 't' /*&& !this.isLastSpaceDown*/)
        {

            if(this.plat2.isActive)
            {
                this.plat1.activate(); 
                this.plat2.deactivate();
    
                this.startScreenShake(7, 100, 10);
                this.sound.play('flip', {volume: 0.3, start: 0, duration: 0.05});
            }
        }
        else if (this.serialMsg === 'b' /*&& !this.isLastSpaceDown*/)
        {
            if(this.plat1.isActive)
            {
                this.plat2.activate(); 
                this.plat1.deactivate();
                 
                this.startScreenShake(7, 100, 10);
                this.sound.play('flip', {volume: 0.3, start: 0, duration: 0.05});
            }
        }
        // if(this.serialMsg === 'b' || this.serialMsg === 't')
        // {
        //     this.isLastSpaceDown = true;
        // }

        // Un-comment this block for keyboard controls
        // if (this.cursors.left.isDown) {
        //     this.player.setVelocityX(-90);
        //     this.player.anims.play('left', true);
        // }
        // else if (this.cursors.right.isDown) {
        //     this.player.setVelocityX(90);
        //     this.player.anims.play('right', true);
        // }
        // else {
        //     this.player.setVelocityX(0);
        //     this.player.anims.play('turn');
        // }

        // if (this.cursors.up.isDown && this.player.body.touching.down) {
        //     if(isCircleCollision(this.d,this.player))
        //     {
        //         this.scene.start('EndScene');
        //     }
        //     this.player.setVelocityY(-250);
        //     this.sound.play('jump', {volume: 0.3, start: 1, duration: 0.01});
        // }

        // // was space down (reference tank game)
        // if (this.cursors.space.isDown && !this.isLastSpaceDown)
        // {
        //     if(this.plat2.isActive)
        //     {
        //         this.plat1.activate(); 
        //         this.plat2.deactivate();
        //     }
        //     else
        //     {
        //         this.plat1.deactivate();
        //         this.plat2.activate();
        //     }
        //     this.startScreenShake(7, 100, 10);
        //     this.sound.play('flip', {volume: 0.3, start: 0, duration: 0.05});
        // }
        // this.isLastSpaceDown = this.cursors.space.isDown;

        // Dev switch between Levels
        // if (this.cursors.down.isDown) {
        //     // Transition to gameplay
        //     this.scene.start('EndScene');
        // }
    }
}

module.exports = lvl4Scene;