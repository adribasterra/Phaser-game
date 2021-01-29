/*
class WeaponGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene) {
		super(scene.physics.world, scene);
 
		// Initialize the group
		this.createMultiple({
			classType: Weapon,
			frameQuantity: 30,  // Create 30 instances in the pool
			active: false,
			visible: false,
			key: 'weapon'
		});

    }

    getReadyToFire(x, y) {
		// Get the first available sprite in the group
		const weapon = this.getFirstDead(false);
		if (weapon != null) {
			weapon.fire(x, y);
		}
    }
    fire(x, y) {
		this.body.reset(x, y);
 
		this.setActive(true);
		this.setVisible(true);
 
		this.setVelocityY(-900);
	}
}
 
class Weapon extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'weapon');
	}
}
*/
export class Sword extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y, texture, frame, player, mode) {

        super(scene, x, y, texture);
        this.scene = scene;

        if(mode!=1)
		  this.sprite = scene.physics.add.sprite(x, y, "weapon", 1).setScale(0.1);
        else
          this.sprite = scene.physics.add.sprite(x, y, "pick", 1).setScale(0.01);

        this.sprite.disableBody(true, true);
        this.sprite.setOrigin(0,1);
        this.player = player;
        this.angleDist = 0;
        this.distanceFromPlayer = 10;
	}
	update()
	{
		const keys = this.player.keys;
		const lastKey = this.player.lastKey;

		if(!this.sprite.body.enable)
        {
            this.originalAngle = this.sprite.angle;
            this.sprite.enableBody(false,0,0,true,true);
        }

        if(keys.right.isDown || lastKey == keys.right)
        {
            this.sprite.x = this.player.sprite.x+this.distanceFromPlayer;
            this.sprite.y = this.player.sprite.y;
            this.sprite.scaleX = 0.1;
            this.sprite.scaleY = 0.1;
            this.sprite.angle +=10;
        }
        else if(keys.left.isDown || lastKey == keys.left)
        {
            this.sprite.x = this.player.sprite.x-this.distanceFromPlayer;
            this.sprite.y = this.player.sprite.y;
            this.sprite.scaleX = -0.1;
            this.sprite.scaleY = 0.1;
            this.sprite.angle -=10;
        }
        else if(keys.up.isDown || lastKey == keys.up)
        {
            this.sprite.x = this.player.sprite.x;
            this.sprite.y = this.player.sprite.y-this.distanceFromPlayer;
            this.sprite.scaleX = -0.1;
            this.sprite.scaleY = 0.1;
            this.sprite.angle +=10;
        }
        else if(keys.down.isDown || lastKey == keys.down)
        {
            this.sprite.x = this.player.sprite.x;
            this.sprite.y = this.player.sprite.y+this.distanceFromPlayer;
            this.sprite.scaleX = 0.1;
            this.sprite.scaleY = -0.1;
            this.sprite.angle +=10;
        }

        this.angleDist+=10;

        if(this.angleDist>120)
        {
        	this.angleDist = 10;
            this.player.attack = false;
            this.sprite.angle = 0;
            this.sprite.disableBody(true, true);
        }
	}
}