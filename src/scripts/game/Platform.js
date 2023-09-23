import * as Matter from "matter-js";
import * as PIXI from "pixi.js";
import { App } from "../system/App";
// [10]
import { Star } from "./Star";
// [/10]

export class Platform {
  constructor(rows, cols, x) {
    // [10]
    this.stars = [];
    // [/10]

    this.rows = rows;
    this.cols = cols;

    this.tileSize = PIXI.Texture.from("tile").width;
    this.width = this.tileSize * this.cols;
    this.height = this.tileSize * this.rows;

    this.createContainer(x);
    this.createTiles();

    this.dx = App.config.platforms.moveSpeed;
    this.createBody();
    this.createStars();
  }

  // [10]
  createStars() {
    const y =
      App.config.stars.offset.min +
      Math.random() *
        (App.config.stars.offset.max - App.config.stars.offset.min);

    for (let i = 0; i < this.cols; i++) {
      if (Math.random() < App.config.stars.chance) {
        this.createStar(this.tileSize * i, -y);
      }
    }
  }

  createStar(x, y) {
    const star = new Star(x, y);
    this.container.addChild(star.sprite);
    star.createBody();
    this.stars.push(star);
  }
  // [/10]

  createBody() {
    this.body = Matter.Bodies.rectangle(
      this.width / 2 + this.container.x,
      this.height / 2 + this.container.y,
      this.width,
      this.height,
      { friction: 0, isStatic: true }
    );
    Matter.World.add(App.physics.world, this.body);
    this.body.gamePlatform = this;
  }

  createContainer(x) {
    this.container = new PIXI.Container();
    this.container.x = x;
    this.container.y = window.innerHeight - this.height;
  }

  createTiles() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.createTile(row, col);
      }
    }
  }

  createTile(row, col) {
    const texture = row === 0 ? "platform" : "tile";
    const tile = App.sprite(texture);
    this.container.addChild(tile);
    tile.x = col * tile.width;
    tile.y = row * tile.height;
  }

  // 06
  move() {
    if (this.body) {
      Matter.Body.setPosition(this.body, {
        x: this.body.position.x + this.dx,
        y: this.body.position.y,
      });
      this.container.x = this.body.position.x - this.width / 2;
      this.container.y = this.body.position.y - this.height / 2;
    }
  }

  destroy() {
    Matter.World.remove(App.physics.world, this.body);
    this.stars.forEach((star) => star.destroy());
    this.container.destroy();
  }
}