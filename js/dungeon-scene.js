
import { FollowEnemy } from "./objects/enemies.js";
import { BouncingEnemy } from "./objects/enemies.js";
import { createPlayerAnims } from './animations/playerAnims.js'
import { createEnemyAnims } from './animations/enemyAnims.js'
import { createChestAnims } from './animations/chestAnims.js'
import Treasure from "./objects/chest.js";
import Player from "./objects/player.js";
import TILES from "./tile-mapping.js";
import TilemapVisibility from "./tilemap-visibility.js";

/**
 * Scene that generates a new dungeon
 */
export default class DungeonScene extends Phaser.Scene
{
    constructor() {
        super();
        this.level = 0;
        this.score = 0;
        this.gameOver = false;
    }
    preload() {
        this.load.image("tiles", "./assets/tilesets/buch-tileset-48px-extruded2.png");
        this.load.image("weapon", "./assets/weapon.png");
        this.load.image("pick", "./assets/pick.png");
        this.load.image("chest", "./assets/chest.png");
        this.load.spritesheet(
            "characters",
            "./assets/character_set_1.png", //"./assets/spritesheets/buch-characters-64px-extruded.png"
            {
            frameWidth: 32,
            frameHeight: 32,
            }
        );
        this.load.spritesheet(
            "minerals",
            "./assets/rocks.png",
            {
            frameWidth: 96,
            frameHeight: 96,
            }
        );
    }
    
    create() {
    
        createPlayerAnims(this.anims);
        createEnemyAnims(this.anims);
        createChestAnims(this.anims);
        
        if(!this.gameOver)
        {
          this.level++; 
        }
        else
        {
            this.gameOver = false;
            this.score = 0;
        }


        this.hasPlayerReachedStairs = false;
    
        //#region Create map

        // Generate a random world with a few extra options:
        //  - Rooms should only have odd number dimensions so that they have a center tile.
        //  - Doors should be at least 2 tiles away from corners, so that we can place a corner tile on
        //    either side of the door location
        this.dungeon = new Dungeon({
            width: 50,
            height: 50,
            doorPadding: 2,
            rooms: {
                width: { min: 7, max: 15, onlyOdd: true },
                height: { min: 7, max: 15, onlyOdd: true }
            }
        });
    
        //this.dungeon.drawToConsole();
    
        // Creating a blank tilemap with dimensions matching the dungeon
        const map = this.make.tilemap({
            tileWidth: 48,
            tileHeight: 48,
            width: this.dungeon.width,
            height: this.dungeon.height
        });
        const tileset = map.addTilesetImage("tiles", null, 48, 48, 1, 2); // 1px margin, 2px spacing
        this.groundLayer = map.createBlankDynamicLayer("Ground", tileset).fill(TILES.BLANK);
        this.stuffLayer = map.createBlankDynamicLayer("Stuff", tileset);
        const shadowLayer = map.createBlankDynamicLayer("Shadow", tileset).fill(TILES.BLANK);
    
        this.tilemapVisibility = new TilemapVisibility(shadowLayer);
    
        // Use the array of rooms generated to place tiles in the map
        // Note: using an arrow function here so that "this" still refers to our scene
        this.dungeon.rooms.forEach(room => {
            const { x, y, width, height, left, right, top, bottom } = room;

            // Fill the floor with mostly clean tiles, but occasionally place a dirty tile
            // See "Weighted Randomize" example for more information on how to use weightedRandomize.
            this.groundLayer.weightedRandomize(x + 1, y + 1, width - 2, height - 2, TILES.FLOOR);

            // Place the room corners tiles
            this.groundLayer.putTileAt(TILES.WALL.TOP_LEFT, left, top);
            this.groundLayer.putTileAt(TILES.WALL.TOP_RIGHT, right, top);
            this.groundLayer.putTileAt(TILES.WALL.BOTTOM_RIGHT, right, bottom);
            this.groundLayer.putTileAt(TILES.WALL.BOTTOM_LEFT, left, bottom);

            // Fill the walls with mostly clean tiles, but occasionally place a dirty tile
            /*      
            this.groundLayer.fill(39, left + 1, top, width - 2, 1); // Top
            this.groundLayer.fill(1, left + 1, bottom, width - 2, 1); // Bottom
            this.groundLayer.fill(21, left, top + 1, 1, height - 2); // Left
            this.groundLayer.fill(19, right, top + 1, 1, height - 2); // Right
            */
            this.groundLayer.weightedRandomize(left + 1, top, width - 2, 1, TILES.WALL.TOP);
            this.groundLayer.weightedRandomize(left + 1, bottom, width - 2, 1, TILES.WALL.BOTTOM);
            this.groundLayer.weightedRandomize(left, top + 1, 1, height - 2, TILES.WALL.LEFT);
            this.groundLayer.weightedRandomize(right, top + 1, 1, height - 2, TILES.WALL.RIGHT);

            // Dungeons have rooms that are connected with doors. Each door has an x & y relative to the
            // room's location. Each direction has a different door to tile mapping.
            var doors = room.getDoorLocations(); // → Returns an array of {x, y} objects
            for (var i = 0; i < doors.length; i++) {
                if (doors[i].y === 0) {
                    this.groundLayer.putTilesAt(TILES.DOOR.TOP, x + doors[i].x - 1, y + doors[i].y);
                } else if (doors[i].y === room.height - 1) {
                    this.groundLayer.putTilesAt(TILES.DOOR.BOTTOM, x + doors[i].x - 1, y + doors[i].y);
                } else if (doors[i].x === 0) {
                    this.groundLayer.putTilesAt(TILES.DOOR.LEFT, x + doors[i].x, y + doors[i].y - 1);
                } else if (doors[i].x === room.width - 1) {
                    this.groundLayer.putTilesAt(TILES.DOOR.RIGHT, x + doors[i].x, y + doors[i].y - 1);
                }
            }
        });
        //#endregion

        //#region Rooms

        /*this.weapons = Phaser.Physics.Arcade.Group;
        this.weapons = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            enable: true,
            physics: Phaser.Physics.Arcade,
			maxSize: 100
        });
        console.log(this.weapons);
        this.weapons.children.iterate((child) => {
          child.setScale(2, 2);
        });*/
    
        // Separate out the rooms into:
        //  - The starting room (index = 0)
        //  - A random room to be designated as the end room (with stairs and nothing else)
        //  - An array of 90% of the remaining rooms, for placing random stuff (leaving 10% empty)
        const rooms = this.dungeon.rooms.slice();
        const startRoom = rooms.shift();
        const endRoom = Phaser.Utils.Array.RemoveRandomElement(rooms);
        const otherRooms = Phaser.Utils.Array.Shuffle(rooms).slice(0, rooms.length * 0.9);
    
        // Place the player in the first room
        const playerRoom = startRoom;
        const x = map.tileToWorldX(playerRoom.centerX);
        const y = map.tileToWorldY(playerRoom.centerY);
        this.player = new Player(this, x, y);
        
        //this.physics.add.overlap(this.player.pick.sprite, this.chest.sprite, this.HandlerPlayerTresureCollision, undefined, this);

        // Place the stairs
        this.stuffLayer.putTileAt(TILES.STAIRS, endRoom.centerX, endRoom.centerY);
        // Place stuff in the 90% "otherRooms"
        otherRooms.forEach(room => {
            room.trasures = [];
            var rand = Math.random();
            if (rand <= 0.25) {
                // 25% chance of chest
                //this.stuffLayer.putTileAt(TILES.CHEST, room.centerX, room.centerY);
                const x = map.tileToWorldX(room.centerX);
                const y = map.tileToWorldY(room.centerY);
                var chest = new Treasure(this, x, y,0);
                this.physics.add.collider(this.player.sprite, chest.sprite);
                this.physics.add.overlap(this.player.pick.sprite, chest.sprite, this.HandlerPlayerTresureCollision, undefined, this);
                room.trasures.push(chest);
            }
            else if (rand <= 0.3) {
                // 50% chance of a pot anywhere in the room... except don't block a door!
                const x = Phaser.Math.Between(room.left + 2, room.right - 2);
                const y = Phaser.Math.Between(room.top + 2, room.bottom - 2);
                this.stuffLayer.weightedRandomize(x, y, 1, 1, TILES.POT);
            }
            else if (rand <= 0.65) {
                // MINERALES
                var num = Phaser.Math.Between(1, 5);
                for(var i = 0; i< num; i++)
                {
                    const xPos = Phaser.Math.Between(room.left + 2, room.right - 2);
                    const yPos = Phaser.Math.Between(room.top + 2, room.bottom - 2);
                    const x = map.tileToWorldX(xPos);
                    const y = map.tileToWorldY(yPos);
                    var mineral = new Treasure(this, x, y,1);
                    this.physics.add.collider(this.player.sprite, mineral.sprite);
                    this.physics.add.overlap(this.player.pick.sprite, mineral.sprite, this.HandlerPlayerTresureCollision, undefined, this);
                    room.trasures.push(mineral);
                }
            }
            else {
                // 25% of either 2 or 4 towers, depending on the room size
                if (room.height >= 9) {
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY + 1);
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY + 1);
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 2);
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 2);
                } else {
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 1);
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 1);
                }
            }
            var rand = Math.random();
            if (rand <= 0.5) {
                const x = map.tileToWorldX(room.centerX);
                const y = map.tileToWorldY(room.centerY);
                room.enemies = [];
                var enemy = new FollowEnemy(this, x, y, 10);
                
                this.physics.add.collider(enemy.sprite, this.groundLayer);
                this.physics.add.collider(enemy.sprite, this.stuffLayer);
                this.physics.add.overlap(this.player.sprite, enemy.sprite, this.HandlePlayerEnemyCollision, undefined, this);
                //this.physics.add.collider(this.player.sword.sprite, enemy.sprite, this.HandleWeaponEnemyCollision, undefined, this);
				this.physics.add.overlap(this.player.sword.sprite, enemy.sprite, this.HandleWeaponEnemyCollision, null, this);
                room.enemies.push(enemy);
            }
            else
            {
                const x = map.tileToWorldX(room.centerX);
                const y = map.tileToWorldY(room.centerY);
                room.enemies = [];
                var enemy = new BouncingEnemy(this, x, y, 50);
        
                this.physics.add.collider(enemy.sprite, this.groundLayer);
                this.physics.add.collider(enemy.sprite, this.stuffLayer);
                this.physics.add.overlap(this.player.sprite, enemy.sprite, this.HandlePlayerEnemyCollision, undefined, this);
                //this.physics.add.collider(this.player.sword.sprite, enemy.sprite, this.HandleWeaponEnemyCollision, undefined, this);
                //this.physics.add.collider(enemy.sprite, this.player.sprite);
        		this.physics.add.overlap(this.player.sword.sprite, enemy.sprite, this.HandleWeaponEnemyCollision, null, this);
                room.enemies.push(enemy);
            }
        });
        
        otherRooms.forEach(room => {

            room.enemies.forEach(enemy => {
                room.trasures.forEach(tresure => {
                    this.physics.add.collider(enemy.sprite, tresure.sprite);
                });
            });

        });
        // Not exactly correct for the tileset since there are more possible floor tiles, but this will
        // do for the example.
        this.groundLayer.setCollisionByExclusion([-1, 6, 63, 64, 65, 66]);
        this.stuffLayer.setCollisionByExclusion([-1, 6, 63, 64, 65, 66]);
    
        this.stuffLayer.setTileIndexCallback(TILES.STAIRS, () => {
            this.stuffLayer.setTileIndexCallback(TILES.STAIRS, null);
            this.hasPlayerReachedStairs = true;
            this.player.freeze();
            const cam = this.cameras.main;
            cam.fade(250, 0, 0, 0);
            cam.once("camerafadeoutcomplete", () => {
                this.player.destroy();
                this.scene.restart();
            });
        });
        //#endregion

        // Watch the player and tilemap layers for collisions, for the duration of the scene:
        this.physics.add.collider(this.player.sprite, this.groundLayer);
        this.physics.add.collider(this.player.sprite, this.stuffLayer);
        
        //this.physics.add.collider(this.weapons, this.stuffLayer, this.HandleWeaponWallCollision, undefined, this);
        //this.physics.add.collider(this.weapons, this.groundLayer, this.HandleWeaponWallCollision, undefined, this);
        // Phaser supports multiple cameras, but you can access the default camera like this:
        const camera = this.cameras.main;
    
        // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.startFollow(this.player.sprite);
    
        // Help text that has a "fixed" position on the screen
        this.scoreText = this.add
            .text(16, 16, `Find the stairs. Go deeper.\nCurrent level: ${this.level}\nTresure: ${this.score}$`, {
                font: "18px monospace",
                fill: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff"
            })
            .setScrollFactor(0);
    
        this.hit = 0;
        //this.player.setWeapons(this.weapons);
    }
    
    update(time, delta) {
        if(this.hit > 0){
            ++this.hit;
            if(this.hit > 10){
                this.hit = 0;
                this.player.sprite.clearTint();
            }
            return;
        }
        if (this.hasPlayerReachedStairs) return;
    
        this.player.update();
        // Find the player's room using another helper method from the dungeon that converts from
        // dungeon XY (in grid units) to the corresponding room object
        const playerTileX = this.groundLayer.worldToTileX(this.player.sprite.x);
        const playerTileY = this.groundLayer.worldToTileY(this.player.sprite.y);
        if(this.playerRoom != this.dungeon.getRoomAt(playerTileX, playerTileY))
        {
            if(this.playerRoom != undefined && this.playerRoom.enemies != undefined)
            {
                this.playerRoom.enemies.forEach(enemy => {
                    // enemy.sprite.body.setVelocity(0);
                    // enemy.sprite.alpha = 0;
                    enemy.sprite.disableBody(true, true);
                });
            }
        }
    
        this.playerRoom = this.dungeon.getRoomAt(playerTileX, playerTileY);
    
        if(this.playerRoom.enemies != undefined)
        {
            this.playerRoom.enemies.forEach(enemy => {
                enemy.update();
            });
        }
    
        this.tilemapVisibility.setActiveRoom(this.playerRoom);
    }
    
    HandlePlayerEnemyCollision(player, enemy){
        //Calculate oposite direction of collision to make player go back
        const dx = this.player.x - enemy.x;
        const dy = this.player.y - enemy.y;
    
        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
        this.player.addDamage(dir);
        this.hit = 1;
    }

    HandleWeaponWallCollision(weapon, walls)
	{
		this.player.weapons.killAndHide(weapon);
	}

	HandleWeaponEnemyCollision(enemy, weapon)
	{
        //this.player.weapons.killAndHide(weapon);
        this.playerRoom.enemies[0].sprite.destroy();
        this.playerRoom.enemies = [];
	}
    HandlerPlayerTresureCollision(player, tresure)
    {
        //this.playerRoom.tresures[0].sprite.destroy();
        //this.playerRoom.tresures = [];
        this.score +=tresure.points;
        tresure.disableBody(true, true);
        this.scoreText.setText(`Find the stairs. Go deeper.\nCurrent level: ${this.level}\nTresure: ${this.score}$`);
    }
    HandlePlayerChestCollision(player, chest){
        //chest.open();
        this.player.update();
        // Find the player's room using another helper method from the dungeon that converts from
        // dungeon XY (in grid units) to the corresponding room object
        const playerTileX = this.groundLayer.worldToTileX(this.player.sprite.x);
        const playerTileY = this.groundLayer.worldToTileY(this.player.sprite.y);
        if(this.playerRoom != this.dungeon.getRoomAt(playerTileX, playerTileY))
        {
            if(this.playerRoom!=undefined && this.playerRoom.enemis != undefined)
            {
                this.playerRoom.enemis.forEach(enemy => {
                    //enemy.sprite.body.setVelocity(0);
                    //enemy.sprite.alpha = 0;
                    enemy.sprite.disableBody(false, true);
                });
            }
        }

        this.playerRoom = this.dungeon.getRoomAt(playerTileX, playerTileY);

        if(this.playerRoom.enemis != undefined)
        {
            this.playerRoom.enemis.forEach(enemy => {
                enemy.update();
            });
        }
    }
}
