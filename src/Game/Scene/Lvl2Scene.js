// Import outside libraries
const Phaser = require('phaser');

// Import Actors
const SerialPortReader = require('../SerialPortReader.js')
const PlatformSet = require('../PlatformSet.js')

// Phaser setup
let player;
let cursors;

const plat1Config = [
  { x: 50, y: 510, asset: 'short1' },
  { x: 350, y: 410, asset: 'short1' },
  { x: 650, y: 300, asset: 'short1' },
  { x: 350, y: 190, asset: 'short1' },
  { x: 650, y: 150, asset: 'short1' }
]
const plat2Config = [
  { x: 200, y: 450, asset: 'short2' },
  { x: 500, y: 350, asset: 'short2' },
  { x: 500, y: 240, asset: 'short2' },
  { x: 500, y: 130, asset: 'short2' }
]

function isCircleCollision(c1, c2) {
    // Get the distance between the two circles
    const distSq = (c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y);
    const radiiSq = (c1.collisionRadius * c1.collisionRadius) + (c2.collisionRadius * c2.collisionRadius);
  
    // Returns true if the distance btw the circle's center points is less than the sum of the radii
    return (distSq < radiiSq);
}

class lvl2Scene extends Phaser.Scene {
    constructor() {
      super('Lvl2Scene');
    //   console.log('setup')
        SerialPortReader.addListener(this.onSerialMessage.bind(this));
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
            this.game.canvas.style.left = window.innerWidth / 2 - 400 + (Math.cos(shakeAmount) * this.shakeXScale * this.shakeIntensity) + "px";
            this.game.canvas.style.top = window.innerHeight / 2 - 300 + (Math.sin(shakeAmount) * this.shakeYScale * this.shakeIntensity) + "px";
        }

        if (this.shakeTime < 0)
        {
            this.isShaking = false;
            this.game.canvas.style.left = 'calc(50vw - 400px)';
            this.game.canvas.style.top = 'calc(50vh - 300px)';
        }

    }

    onSerialMessage(msg) {
        this.serialMsg = msg;
    }

    preload () {
        this.load.image('groundT', '../assets/tground.png');
        this.load.image('groundB', '../assets/bground.png');
        this.load.image('short1', '../assets/tground1.png');
        this.load.image('short2', '../assets/nplatt.png');
        this.load.image('wall1', '../assets/plat1-wall.png');
        this.load.image('wall2', '../assets/plat2-wall.png');
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

        // Play Background Sound
        // var music = this.sound.add('soundtrack');
        // music.play();
        this.sound.play('soundtrack', {volume: 0.5, loop: true});

        this.d = this.add.image(650,110,'door');
        this.d.collisionRadius = 20;
        
        // console.log(this.d);

        this.cursors = {
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        };

        this.graphics = this.add.graphics('')
        
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
        // console.log(this.player);
        this.updateScreenShake(deltaTime);
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
        //     // this.sound.play('jump', {start: 0, duration: 0.1});
        // }

        // // was space down (reference tank game)
        // // add debounce timer
        // if (this.serialMsg === 't' /*&& !this.isLastSpaceDown*/)
        // {

        //     if(this.plat2.isActive)
        //     {
        //         this.plat1.activate(); 
        //         this.plat2.deactivate();
        //         // for(var i = 1; i < 4; i++) {
        //         //     game.scene.scenes[i].plat2.activate();
        //         //     game.scene.scenes[i].plat1.deactivate();
        //         // }
                    // this.startScreenShake(3,100,50);
        //     }
        // }
        // else if (this.serialMsg === 'b' /*&& !this.isLastSpaceDown*/)
        // {
        //     if(this.plat1.isActive)
        //     {
        //          this.plat2.activate(); 
        //          this.plat1.deactivate();
        //          // for(var i = 1; i < 4; i++) {
        //          //     game.scene.scenes[i].plat2.activate();
        //          //     game.scene.scenes[i].plat1.deactivate();
        //          // }
                    // this.startScreenShake(3,100,50);
        //     }
        // }
        // // this.isLastSpaceDown = this.cursors.space.isDown;

        // if (this.cursors.down.isDown) {
        //     // Transition to gameplay
        //     this.scene.start('Lvl2Scene')
        // }
        this.plat1.update(deltaTime);
        this.plat2.update(deltaTime);
        // // Un-comment this block for keyboard controls
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
                this.sound.stopAll();
                this.scene.start('Lvl3Scene');
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

        // Dev switch between Levels
        // if (this.cursors.down.isDown) {
        //     // Transition to gameplay
        //     this.scene.start('Lvl2Scene')
        // }
    }
}

module.exports = lvl2Scene;