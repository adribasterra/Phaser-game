
class Enemy extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.scene = scene;
        
        this.sprite = scene.physics.add.sprite(x, y, "characters", 4);
        //this.sprite.alpha = 0;
        this.sprite.disableBody(true, true);

        this.play("enemy-walk-back");

        this.keys = scene.input.keyboard.createCursorKeys();
    }

    freeze() {
        this.sprite.body.moves = false;
    }

    update() {

    }
  
    destroy() {
        this.sprite.destroy();
    }
    
    enableEnemy()
    {
        if(!this.sprite.body.enable)
        {
            this.sprite.enableBody(false,0,0,true,true);
        }
    }
    disableEnemy()
    {
        this.sprite.disableBody(true, true);
    }
}

export class FollowEnemy extends Enemy
{
    constructor(scene,x,y,speed)
    {
        super(scene,x,y);
        this.speed = speed;
    }
    update()
    {
        // Stop any previous movement from the last frame
        //this.sprite.body.setVelocity(0);
        this.enableEnemy();
        // Horizontal movement
        if (this.scene.player.sprite.x < this.sprite.x) {
            this.sprite.body.setVelocityX(-1*this.speed);
            this.sprite.setFlipX(true);
        }
        else if (this.scene.player.sprite.x > this.sprite.x) {
            this.sprite.body.setVelocityX(1*this.speed);
            this.sprite.setFlipX(false);
        }
        else
        {
            this.sprite.body.setVelocityX(0);
        }

        // Vertical movement
        if (this.scene.player.sprite.y < this.sprite.y) {
            this.sprite.body.setVelocityY(-1*this.speed);
            this.sprite.setFlipX(true);
        }
        else if (this.scene.player.sprite.y > this.sprite.y) {
            this.sprite.body.setVelocityY(1*this.speed);
            this.sprite.setFlipX(false);
        }
        else
        {
            this.sprite.body.setVelocityY(0);
        }
    }
}


export class BouncingEnemy extends Enemy
{
    constructor(scene, x, y, speed)
    {
        super(scene, x, y);
        this.speed = speed;
        this.sprite.body.velocity.setTo(speed, speed);
        this.sprite.body.bounce.set(1);
    }
    update()
    {
        this.enableEnemy();
    }

    enableEnemy()
    {
        if(!this.sprite.body.enable)
        {
            this.sprite.enableBody(false,0,0,true,true);
            this.sprite.body.velocity.setTo( (Math.random()<=0.5) ? this.speed : -this.speed, (Math.random()<=0.5) ? this.speed : -this.speed);
        }
    }
}
