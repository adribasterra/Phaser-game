
const createPlayerAnims = (anims) => {
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
}
export {
	createPlayerAnims
}