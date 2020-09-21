class BugOnDeathMarch extends Phaser.Physics.Arcade.Sprite {
  color = '';
  scale = 1;
  vector = undefined;
  speed = 1;
  constructor(scene, bug) {
    super(scene, 0, 0, `bug_${bug.color}`);
    this.color = bug.color;
    scene.add.existing(this);
    scene.bugsOnDeathMarch = scene.bugsOnDeathMarch.concat(this);
    this.setPosition(bug.x, bug.y);
    const animationName = `bug_${bug.color}_animation`;
    this.play(animationName);
    this.scale = bug.scale;
    this.vector = bug.vector;
    this.speed = bug.speed;
    this.setScale(bug.scale);
  }

  update(time, delta) {
    // this.x += (this.vector.x / 1000) * (delta * this.speed);
    // this.y += (this.vector.y / 1000) * (delta * this.speed);
    // this.setAngle(this.vector.angle() * Phaser.Math.RAD_TO_DEG + 90.0);
  }
}
