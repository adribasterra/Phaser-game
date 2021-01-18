
export default class WeaponGroup extends Phaser.Physics.Arcade.Group
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