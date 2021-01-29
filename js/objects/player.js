import { Sword } from "./weapon.js";
export default class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.health = 3;
        this.weapons = Phaser.Physics.Arcade.Group;
    
        this.sprite = scene.physics.add.sprite(x, y, "characters", 1).setScale(1.2);
    
        this.play("player-walk-back");
        //this.sprite.body.immovable = true;
        this.keys = scene.input.keyboard.createCursorKeys();
        this.spacebar = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.change = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.once = false;
        this.once2 = false;
        this.lastKey = this.keys.down;
        this.sword = new Sword(scene, x, y, texture, frame, this,0);
        this.pick = new Sword(scene, x, y, texture, frame, this,1);

        this.currentTool = this.sword;
    }
        
    freeze() {
        this.sprite.body.moves = false;
    }
    
    update() {
        const keys = this.keys;
        const sprite = this.sprite;
        const speed = 300;
        const prevVelocity = sprite.body.velocity.clone();
        // Stop any previous movement from the last frame
        sprite.body.setVelocity(0);

        // Horizontal movement
        if (keys.left.isDown) {
            this.lastKey = keys.left;
            sprite.body.setVelocityX(-speed);
             sprite.setFlipX(false);
            //sprite.scaleX = 1;
        }
        else if (keys.right.isDown) {
            this.lastKey = keys.right;
            sprite.body.setVelocityX(speed);
             sprite.setFlipX(true);
            //sprite.scaleX = -1;
        }

        // Vertical movement
        if (keys.up.isDown) {
            this.lastKey = keys.up;
            sprite.body.setVelocityY(-speed);
        }
        else if (keys.down.isDown) {
            this.lastKey = keys.down;
            sprite.body.setVelocityY(speed);
        }

        // Normalize and scale the velocity so that sprite can't move faster along a diagonal
        sprite.body.velocity.normalize().scale(speed);

        // Update the animation last and give left/right animations precedence over up/down animations
        if (keys.left.isDown || keys.right.isDown) {
            sprite.anims.play("player-walk", true);
            this.anims.currentAnim.key = "player-walk";
        }
        else if (keys.up.isDown) {
            sprite.anims.play("player-walk-back", true);
            this.anims.currentAnim.key = "player-walk-back";
        }
        else if(keys.down.isDown) {
            sprite.anims.play("player-walk-forward", true);
            this.anims.currentAnim.key = "player-walk-forward";
        }
        else {
            sprite.anims.stop();
            // If we were moving, pick and idle frame to use
            if (this.lastKey == keys.up) {
                sprite.setTexture("characters", 37);
            }
            else if(this.lastKey == keys.left || this.lastKey == keys.right) {
                sprite.setTexture("characters", 13);
            }
            else {
                sprite.setTexture("characters", 1);
            }
        }
        if(this.spacebar.isDown && this.once){
            //this.initWeapon();
            this.attack = true;
            this.once = false;
        }
        if(!this.spacebar.isDown){
            this.once = true;
        }
        if(this.change.isDown && this.once2){
            //this.initWeapon();
            this.changeTool();
            this.once2 = false;
        }
        if(!this.change.isDown){
            this.once2 = true;
        }
        if(this.attack)
        {
            this.currentTool.update();
        }
    }

    setWeapons(weapons)
	{
		this.weapons = weapons;
	}
    
    destroy() {
        this.sprite.disableBody(true, true);
        //this.sprite.destroy();
    }

    addDamage(dir){
        --this.health;
        this.sprite.setVelocity(dir.x, dir.y);
        this.sprite.tint = 0xff0000;

        if(this.health <= 0) 
            {
                this.scene.gameOver = true;
                this.scene.create();
            }

    }

    changeTool()
    {
        console.log("change");
        if(this.currentTool == this.sword)
            {
                this.currentTool = this.pick;
            }
            else
            {
                this.currentTool = this.sword;
            }
    }

    initWeapon(){
        if (!this.weapons) return;

		const weapon = this.weapons.get(this.sprite.x, this.sprite.y, 'weapon');
		if (!weapon) return;

		const vec = new Phaser.Math.Vector2(0, 0);
        const parts = this.anims.currentAnim.key.split('-');
        if(parts.length < 3) { //There is no back/forward in name
            if (this.sprite.scaleX < 0) {
                vec.x = 1;
            }
            else {
                vec.x = -1;
            }
        }
        else{
            const direction = parts[2];
            switch (direction)
            {
                case 'back':
                    vec.y = -1;
                    break;

                case 'forward':
                    vec.y = 1;
                    break;
            }
        }
		const angle = vec.angle();

		weapon.setActive(true);
		weapon.setVisible(true);
        weapon.setScale(0.1);
		weapon.setRotation(angle);

		weapon.x += vec.x * 16;
		weapon.y += vec.y * 16;

		weapon.setVelocity(vec.x * 600, vec.y * 600);
    }
}