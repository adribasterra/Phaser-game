
const createEnemyAnims = (anims) => {
    anims.create({
        key: "enemy-walk",
        frames: anims.generateFrameNumbers("characters", { start: 15, end: 17 }),
        frameRate: 8,
        repeat: -1
    });
    anims.create({
        key: "enemy-walk-back",
        frames: anims.generateFrameNumbers("characters", { start: 39, end: 41 }),
        frameRate: 8,
        repeat: -1
    });
}
export {
	createEnemyAnims
}