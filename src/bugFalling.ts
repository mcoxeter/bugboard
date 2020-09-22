import "phaser";
import { Bug } from './bug';
import { SceneMain } from './sceneMain';

export class BugFalling extends Phaser.Physics.Arcade.Sprite {
    color = '';
    scale = 1;
    vector: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,1);
    fallSpeed = 0;
    angle = 0;
    hasSquashed = false;
    elapsed = 0;
    constructor(public sceneMain: SceneMain, bug: Bug) {
      super(sceneMain, 0, 0, `bug_${bug.color}`);
      this.color = bug.color;
      sceneMain.add.existing(this);
      sceneMain.bugsFalling = sceneMain.bugsFalling.concat(this);
      this.setPosition(bug.x, bug.y);
      const animationName = `bug_${bug.color}_animation`;
      this.play(animationName);
      this.scale = bug.scale;
      this.setScale(bug.scale);
    }
  
    update(time: number, delta: number) {
      this.elapsed += delta;
      if( this.hasSquashed === false ){
        this.setAngle(this.angle += 30);

        this.fallSpeed += 10;
  
        this.y += (this.vector.y / 1000) * (delta * this.fallSpeed);
        const splatHeight = Number(this.sceneMain.game.config.height) - 60.0;
  
        if( this.y > splatHeight){
          this.splat();
        }  
      }else {
        if( this.elapsed > 7000 ){
          this.destroy();
        }

      }
    }

    splat(): void {
      this.hasSquashed = true;
      this.setTexture(`splat_${this.color}`);
      this.play(`splat_${this.color}_animation`);
      this.setAngle(0);
    }

    static createAnimation(sceneMain: SceneMain, color: string): void {
      sceneMain.anims.create({
      key: `splat_${color}_animation`,
      frames: sceneMain.anims.generateFrameNumbers(`splat_${color}`, {}),
      frameRate: 5, // frames per second
      repeat: -1, // -1 for infinite loops
    });
    }
    static loadSprite(sceneMain: SceneMain, color: string): void {
      sceneMain.load.spritesheet(
      `splat_${color}`,
      `assets/spritesheets/splat-${color}-640x320.png`,
      {
        frameWidth: 640,
        frameHeight: 320,
      }
    );
  }

}
