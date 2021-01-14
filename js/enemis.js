class Enemy {
  constructor(scene, x, y) {
    this.scene = scene;

    const anims = scene.anims;
    anims.create({
      key: "player-walk",
      frames: anims.generateFrameNumbers("characters", { start: 46, end: 49 }),
      frameRate: 8,
      repeat: -1
    });
    anims.create({
      key: "player-walk-back",
      frames: anims.generateFrameNumbers("characters", { start: 65, end: 68 }),
      frameRate: 8,
      repeat: -1
    });

    this.sprite = scene.physics.add
      .sprite(x, y, "characters", 0)
      .setSize(22, 33)
      .setOffset(23, 27);


    this.sprite.anims.play("player-walk-back");

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
}

export default class FollowEnemy extends Enemy
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
