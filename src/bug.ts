import "phaser";
import { BugFalling } from './bugFalling';
import { IModelBugInfo, SceneMain } from './sceneMain';

export class Bug extends Phaser.Physics.Arcade.Sprite {
    scale = 1;
    vector: Phaser.Math.Vector2 = undefined;
    speed = 1;
    bugBoardBounds: Phaser.Geom.Rectangle = undefined;
    elapsedTime = 0;
    timeToDie = 0;
    constructor(
        public sceneMain: SceneMain, 
        public color: string,
        bounds: Phaser.Geom.Rectangle,
        public bugInfo: IModelBugInfo
        ) {
      super(sceneMain, 0, 0, `bug_${color}`);
      sceneMain.add.existing(this);
      sceneMain.physics.add.existing(this);
      sceneMain.healthyBugs = sceneMain.healthyBugs.concat(this);
      this.bugBoardBounds = bounds;
      const pos = bounds.getRandomPoint();
      this.setPosition(pos.x, pos.y);
      const animationName = `bug_${color}_animation`;
      this.play(animationName);
      this.scale = .15 + (5 - bugInfo.severity) *.15;
      this.timeToDie = Math.random() * 10000;
      this.vector = new Phaser.Math.Vector2(
        Math.random() * 40 - 20,
        Math.random() * 40 - 20
      );
      this.speed = Math.random() + 1;
      this.setGravityY(0);
  
      this.setScale(this.scale);
    }
    create() {}
    update(time: number, delta: number) {
      this.elapsedTime += delta;

      if( this.bugInfo.fixed && this.elapsedTime > this.timeToDie ){
        new BugFalling(this.sceneMain, this);
        const myIndex = this.sceneMain.healthyBugs.indexOf(this);
        this.sceneMain.healthyBugs.splice(myIndex,1);
        this.destroy();
        return;
      }

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
      new BugFalling(this.sceneMain, this);
    }
  
    static createAnimation(sceneMain: SceneMain, color: string): void {
        sceneMain.anims.create({
        key: `bug_${color}_animation`,
        frames: sceneMain.anims.generateFrameNumbers(`bug_${color}`, {}),
        frameRate: 5, // frames per second
        repeat: -1, // -1 for infinite loops
      });
    }
    static loadSprite(sceneMain: SceneMain, color: string): void {
        sceneMain.load.spritesheet(
        `bug_${color}`,
        `assets/spritesheets/bugs-${color}-128x128.png`,
        {
          frameWidth: 128,
          frameHeight: 128,
        }
      );
    }
  }
  