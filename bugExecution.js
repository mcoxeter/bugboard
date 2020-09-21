class BugExecution extends Phaser.Physics.Arcade.Sprite {
  color = '';
  scale = 1;
  vector = undefined;
  speed = 1;
  constructor(scene, bugOnDeathMarch) {
    super(scene, 0, 0, `bug_${bugOnDeathMarch.color}`);
    this.color = bugOnDeathMarch.color;
    scene.add.existing(this);
    scene.bugs = scene.bugs.concat(this);
    this.setPosition(bugOnDeathMarch.x, bugOnDeathMarch.y);
    const animationName = `bug_${bugOnDeathMarch.color}_animation`;
    this.play(animationName);
    this.scale = bugOnDeathMarch.scale;
    this.vector = bugOnDeathMarch.vector;
    this.speed = bugOnDeathMarch.speed;
    this.setScale(bugOnDeathMarch.scale);
  }

  update(time, delta) {}
}
