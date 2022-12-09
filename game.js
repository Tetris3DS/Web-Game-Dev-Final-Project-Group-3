import { Snake } from "./scripts/Snake.js";
import { Food } from "./scripts/Food.js";
import { TweenHelper } from "./scripts/TweenHelper.js";


var snake;
var food;
var cursors;
var ScoreText;



class titleScene extends Phaser.Scene {
    preload () {}
    create () {}
}

class mainScene extends Phaser.Scene {
    
    preload() {
        this.load.image('food', 'assets/food.png');
        this.load.image('body', 'assets/body.png');
        // This method is called once at the beginning
        // It will load all the assets, like sprites and sounds  
    }

    create() {
        // This method is called once, just after preload()
        // It will initialize our scene, like the positions of the sprites

        food = new Food(this, 3, 4);

        snake = new Snake(this, 8, 8);

        ScoreText = this.add.text(540, 10, '', { font: '16px Courier', fill: '#000000' });

        ScoreText.setText('Score: ' + food.total);

        //  Create our keyboard controls
        cursors = this.input.keyboard.createCursorKeys();
    }

    update(time, delta) {
        // This method is called 60 times per second after create() 
        // It will handle all the game's logic, like movements
        if (!snake.alive) {
            this.resetSnake();
        }

        /**
        * Check which key is pressed, and then change the direction the snake
        * is heading based on that. The checks ensure you don't double-back
        * on yourself, for example if you're moving to the right and you press
        * the LEFT cursor, it ignores it, because the only valid directions you
        * can move in at that time is up and down.
        */
        if (cursors.left.isDown) {
            snake.faceLeft();
        }
        else if (cursors.right.isDown) {
            snake.faceRight();
        }
        else if (cursors.up.isDown) {
            snake.faceUp();
        }
        else if (cursors.down.isDown) {
            snake.faceDown();
        }

        if (snake.update(time)) {
            //  If the snake updated, we need to check for collision against food

            if (snake.collideWithFood(food))
            {
                this.repositionFood()
                ScoreText.setText('Score: ' + food.total);
            }
        }
    }

    /** 
        * @method repositionFood
        * @return {boolean} true if the food was placed, otherwise false
        */
    repositionFood () {
            //  First create an array that assumes all positions
            //  are valid for the new piece of food

            //  A Grid we'll use to reposition the food each time it's eaten
            var testGrid = [];

            for (var y = 0; y < 30; y++)
            {
                testGrid[y] = [];

                for (var x = 0; x < 40; x++)
                {
                    testGrid[y][x] = true;
                }
            }

            snake.updateGrid(testGrid);

            //  Purge out false positions
            var validLocations = [];

            for (var y = 0; y < 30; y++)
            {
                for (var x = 0; x < 40; x++)
                {
                    if (testGrid[y][x] === true)
                    {
                        //  Is this position valid for food? If so, add it here ...
                        validLocations.push({ x: x, y: y });
                    }
                }
            }

            if (validLocations.length > 0)
            {
                //  Use the RNG to pick a random food position
                var pos = Phaser.Math.RND.pick(validLocations);

                //  And place it
                food.setPosition(pos.x * 16, pos.y * 16);

                return true;
            }
            else
            {
                return false;
            }
    }

    /**
     * When Snake dies, reset score and snake length to zero.
     * Snake stays still and flashes before resuming
     */
    resetSnake () {
        snake.body.clear(true, true);
        snake = new Snake(this, 8, 8);
        food.total = 0;
        ScoreText.setText('Score: ' + food.total);
        snake.speed = 100000;

        setTimeout(function () {
            snake.speed = 100
        }, 1000)
        
        // this.tweens.add({
        //     targets: snake,
        //     alpha: 0,
        //     ease: Phaser.Math.Easing.Sine.InOut,
        //     duration: 100,
        //     onComplete: function() {
        //       snake.speed = 100;
        //     },
        //     callbackScope:this
        // });
        
    }
}

var config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    physics: { default: 'arcade' },
    backgroundColor: 'CCFFFF',
    scene: mainScene,
  };
  //width: 700, // Width of the game in pixels
  //height: 400, // Height of the game in pixels
  // backgroundColor: '#3498db', // The background color (blue)
  //scene: mainScene, // The name of the scene we created
  //physics: { default: 'arcade' }, // The physics engine to use (PLEASE UNCOMMENT WHEN YOU WANT TO ADD A PHYSICS SYSTEM)
  //parent: 'game', // Create the game inside the <div id="game"> 
  

var game = new Phaser.Game(config);