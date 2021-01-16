
const createChestAnims = (anims) => {
	anims.create({
		key: 'chest-open',
		frames: anims.generateFrameNames("characters", { start: 12, end: 14 }),
		frameRate: 5
	})

	anims.create({
		key: 'chest-closed',
		frames: anims.generateFrameNames("characters", { start: 12, end: 14 }),
	})
}
export {
	createChestAnims
}