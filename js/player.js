export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.knives = Phaser.Physics.Arcade.Group;
    const anims = scene.anims;
    anims.create({
      key: "player-walk",
      frames: anims.generateFrameNumbers("characters", { start: 12, end: 14 }),
      frameRate: 8,
      repeat: -1
    });
    anims.create({
      key: "player-walk-back",
      frames: anims.generateFrameNumbers("characters", { start: 36, end: 38 }),
      frameRate: 8,
      repeat: -1
    });
    anims.create({
      key: "player-walk-forward",
      frames: anims.generateFrameNumbers("characters", { start: 0, end: 2 }),
      frameRate: 8,
      repeat: -1
    });

    this.sprite = scene.physics.add.sprite(x, y, "characters", 1).setScale(1.2);

    this.sprite.anims.play("player-walk-back");
    this.sprite.body.immovable = true;
    this.keys = scene.input.keyboard.createCursorKeys();
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
    } else if (keys.right.isDown) {
      this.lastKey = keys.right;
      sprite.body.setVelocityX(speed);
      sprite.setFlipX(true);
    }

    // Vertical movement
    if (keys.up.isDown) {
      this.lastKey = keys.up;
      sprite.body.setVelocityY(-speed);
    } else if (keys.down.isDown) {
      this.lastKey = keys.down;
      sprite.body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that sprite can't move faster along a diagonal
    sprite.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (keys.left.isDown || keys.right.isDown) {
      sprite.anims.play("player-walk", true);
    } else if (keys.up.isDown) {
      sprite.anims.play("player-walk-back", true);
    } else if(keys.down.isDown) {
      sprite.anims.play("player-walk-forward", true);
    } else {

      sprite.anims.stop();
      // If we were moving, pick and idle frame to use
      if (this.lastKey == keys.up) 
      {
        sprite.setTexture("characters", 37);
      }
      else if(this.lastKey == keys.left || this.lastKey == keys.right)
      {
        sprite.setTexture("characters", 13);
      }
      else 
      {
          sprite.setTexture("characters", 1);
      }
    }
  }

  destroy() {
    this.sprite.destroy();
  }

  setVelocity(x, y){
    this.sprite.body.setVelocity(x, y);
  }

  tint(color){
    this.sprite.tint = color;
  }

  throwKnife(){
    
  }
}
