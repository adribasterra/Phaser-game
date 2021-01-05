import DungeonScene from "./dungeon-scene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#000",
  parent: "game-container",
  pixelArt: true,
  scene: DungeonScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  }
};

const game = new Phaser.Game(config);

//#region  Attributes

// import Phaser from "phaser";

// var config = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     scene: {
//         preload: preload,
//         create: create,
//         update: update
//     }
// };

// var game = new Phaser.Game(config);
// var controls;
// var shiftKey;

// //#endregion

// //#region Main methods

// function preload(){

// }

// function create(){
//     shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

//     const cursors = this.input.keyboard.createCursorKeys();
//     const controlConfig = {
//         camera: this.cameras.main,
//         left: cursors.left,
//         right: cursors.right,
//         up: cursors.up,
//         down: cursors.down,
//         speed: 0.5
//     };
    
//     controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
// }

// function update(){

// }

// //#endregion