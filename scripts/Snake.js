export class Snake extends Phaser.GameObjects.Image {

    constructor (scene, x, y)
    {
        super(scene);
        
        //  Direction 
        this.UP = 0;
        this.DOWN = 1;
        this.LEFT = 2;
        this.RIGHT = 3;


        this.headPosition = new Phaser.Geom.Point(x, y);

        this.body = scene.add.group();

        this.head = this.body.create(x * 16, y * 16, 'body');
        this.head.setOrigin(0);

        this.alive = true;

        this.speed = 100;

        this.moveTime = 0;

        this.tail = new Phaser.Geom.Point(x, y);

        this.heading = this.RIGHT;
        this.direction = this.RIGHT;
    }

    update(time)
    {
        if (time >= this.moveTime)  
        {
            return this.move(time);
        }
    }

    faceLeft()
    {
        if (this.direction === this.UP || this.direction === this.DOWN)
        {
            this.heading = this.LEFT;
        }
    }

    faceRight()
    {
        if (this.direction === this.UP || this.direction === this.DOWN)
        {
            this.heading = this.RIGHT;
        }
    }

    faceUp()
    {
        if (this.direction === this.LEFT || this.direction === this.RIGHT)
        {
            this.heading = this.UP;
        }
    }

    faceDown()
    {
        if (this.direction === this.LEFT || this.direction === this.RIGHT)
        {
            this.heading = this.DOWN;
        }
    }

    move(time)
    {
        /**
         * Based on the heading property (which is the direction the pgroup pressed)
         * we update the headPosition value accordingly.
         * 
         * The Math.wrap call allow the snake to wrap around the screen, so when
         * it goes off any of the sides it re-appears on the other.
         */
        switch (this.heading)
        {
            case this.LEFT:
                this.headPosition.x--;
                if (this.headPosition.x < 0) {
                    this.alive = false;
                }
                break;

            case this.RIGHT:
                this.headPosition.x++;
                if (this.headPosition.x > 40) {
                    this.alive = false;
                }
                break;

            case this.UP:
                this.headPosition.y--;
                if (this.headPosition.y < 0) {
                    this.alive = false;
                }
                break;

            case this.DOWN:
                this.headPosition.y++;
                if (this.headPosition.y > 30) {
                    this.alive = false;
                }
                break;
        }
 
        this.direction = this.heading;

        //  Update the body segments and place the last coordinate into this.tail
        Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

        //  Check to see if any of the body pieces have the same x/y as the head
        //  If they do, the head ran into the body

        var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

        if (hitBody)
        {
            //Snake is Dead
            this.alive = false;
        }
        else
        {
            //  Update the timer ready for the next movement
            this.moveTime = time + this.speed;

            return true;
        }
    }

    grow()
    {
        var newPart = this.body.create(this.tail.x, this.tail.y, 'body');

        newPart.setOrigin(0);
    }

    collideWithFood(food)
    {
        if (this.head.x === food.x && this.head.y === food.y)
        {
            this.grow();

            food.eat();

            //  For every 5 items of food eaten we'll increase the snake speed a little
            if (this.speed > 20 && food.total % 5 === 0)
            {
                this.speed -= 5;
            }

            return true;
        }
        else
        {
            return false;
        }
    }

    updateGrid(grid)
    {
        //  Remove all body pieces from valid positions list
        this.body.children.each(function (segment) {

            var bx = segment.x / 16;
            var by = segment.y / 16;

            grid[by][bx] = false;

        });

        return grid;
    }

}