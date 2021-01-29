
export default class Treasure extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, type, texture, frame)
	{
		super(scene, x, y, texture, frame);
		switch(type)
		{
			case 0:
				this.sprite = scene.physics.add.sprite(x, y, "chest").setScale(0.09);
				break;
		}
            this.sprite.body.immovable = true;
	}

}