
export default class Chest extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y, texture, frame)
	{
		super(scene, x, y, texture, frame);
        this.sprite = scene.physics.add.sprite(x, y, "characters", 4);
        this.sprite.disableBody(true, true);
        //this.sprite.anims.play("chest-closed");
	}

	open()
	{
        if (this.anims.currentAnim.key != 'chest-closed') return;
        
        var config = {
            key: 'chest-open',
            frames: anims.generateFrameNumbers("characters", { start: 12, end: 14 }),
            frameRate: 5
        };
        
        const anims = scene.anims;
        anims.create(config);

		this.sprite.anims.play('chest-open');
		return Phaser.Math.Between(50, 200);
	}
}