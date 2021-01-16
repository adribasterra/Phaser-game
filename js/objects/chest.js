
export default class Chest extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture, frame)
	{
		super(scene, x, y, texture, frame);
        this.sprite = scene.physics.add.sprite(x, y, "characters", 4);
        this.play("chest-closed");
	}

	open()
	{
        if (this.anims.currentAnim.key != 'chest-closed') return;

		this.play('chest-open');
		return Phaser.Math.Between(50, 200);
	}
}