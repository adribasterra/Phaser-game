
export default class Treasure extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, type, texture, frame)
	{
		super(scene, x, y, texture, frame);
		switch(type)
		{
			case 0:
				this.sprite = scene.physics.add.sprite(x, y, "chest").setScale(0.09);
				this.sprite.points = 1000;
				break;
			case 1:
				var num = Phaser.Math.Between(8, 15);
				this.sprite = scene.physics.add.sprite(x, y, "minerals",num).setScale(0.3);
				if(num>11)
				{
					this.sprite.points = 200;
				}
				else
				{
					this.sprite.points = 500;
				}
				break;
		}

            this.sprite.body.immovable = true;
	}

}