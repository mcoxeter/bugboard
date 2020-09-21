class Bug extends Phaser.Physics.Arcade.Sprite {
  color = '';
  scale = 1;
  vector = undefined;
  speed = 1;
  bugBoardBounds = undefined;
  constructor(scene, color, bounds) {
    super(scene, 0, 0, `bug_${color}`);
    this.color = color;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.healthyBugs = scene.healthyBugs.concat(this);
    this.bugBoardBounds = bounds;
    const pos = bounds.getRandomPoint();
    this.setPosition(pos.x, pos.y);
    const animationName = `bug_${color}_animation`;
    this.play(animationName);
    this.scale = Math.random() * (0.55 - 0.25) + 0.25;
    this.vector = new Phaser.Math.Vector2(
      Math.random() * 40 - 20,
      Math.random() * 40 - 20
    );
    this.speed = Math.random() + 1;

    this.setScale(this.scale);
  }
  create() {}
  update(time, delta) {
    var v = new Phaser.Math.Vector2(this.vector.x, this.vector.y);
    if (this.x > this.bugBoardBounds.width + this.bugBoardBounds.x) {
      this.x = this.bugBoardBounds.width + this.bugBoardBounds.x;
      this.vector = v.rotate(0.5);
    } else if (this.y > this.bugBoardBounds.height + this.bugBoardBounds.y) {
      this.y = this.bugBoardBounds.height + this.bugBoardBounds.y;
      this.vector = v.rotate(0.5);
    } else if (this.x < this.bugBoardBounds.x) {
      this.x = this.bugBoardBounds.x;
      this.vector = v.rotate(0.5);
    } else if (this.y < this.bugBoardBounds.y) {
      this.y = this.bugBoardBounds.y;
      this.vector = v.rotate(0.5);
    }

    this.x += (this.vector.x / 1000) * (delta * this.speed);
    this.y += (this.vector.y / 1000) * (delta * this.speed);

    this.setAngle(this.vector.angle() * Phaser.Math.RAD_TO_DEG + 90.0);
  }

  beginDeathMarch() {
    new BugOnDeathMarch(this.scene, this);
  }

  static createAnimation(scene, color) {
    scene.anims.create({
      key: `bug_${color}_animation`,
      frames: scene.anims.generateFrameNumbers(`bug_${color}`),
      frameRate: 5, // frames per second
      repeat: -1, // -1 for infinite loops
    });
  }
  static loadSprite(scene, color) {
    scene.load.spritesheet(
      `bug_${color}`,
      `assets/spritesheets/bugs-${color}-128x128.png`,
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );
  }
}
