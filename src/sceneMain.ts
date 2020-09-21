import { Bug } from './bug';
import { BugOnDeathMarch } from './bugOnDeathMarch';

export class SceneMain extends Phaser.Scene {
    colors = ['blue', 'green', 'magenta', 'purple', 'red'];
    bugCount = 30;
    healthyBugs: Bug[] = [];
    bugsOnDeathMarch: BugOnDeathMarch[] = [];
    timeSinceLastCheck = 0;
    bugBoardBoundary = new Phaser.Geom.Rectangle(380, 150, 400, 250);
  
    constructor() {
      super('game');
    }
  
    preload() {
      this.load.spritesheet(
        'baseball',
        'assets/spritesheets/baseball-spritesheet-640x470.png',
        {
          frameWidth: 640,
          frameHeight: 470,
        }
      );
  
      for (var color of this.colors) {
        Bug.loadSprite(this, color);
      }
  
      this.load.image('bugboard', 'assets/images/bugboard.png');
      this.load.image('backdrop', 'assets/images/backdrop.png');
      this.load.image('cloud1', 'assets/images/cloud1.png');
      this.load.image('cloud2', 'assets/images/cloud2.png');
      this.load.image('development', 'assets/images/development.png');
      this.load.image('qa', 'assets/images/qa.png');
      this.load.image('fixed', 'assets/images/fixed.png');
    }
  
    async create() {
      var backdrop = this.add.image(0, 0, 'backdrop');
      backdrop.setOrigin(0, 0);
      this.add.image(600, 280, 'bugboard');
  
      for (var color of this.colors) {
        Bug.createAnimation(this, color);
      }
  
      for (var bugIndex = 0; bugIndex < this.bugCount; bugIndex++) {
        new Bug(this, this.colors[bugIndex % 5], this.bugBoardBoundary);
      }
    }
  
    killBug() {
      if (this.bugCount > 0) {
        this.bugCount--;
        var bug = this.healthyBugs.pop();
        bug.beginDeathMarch();
      }
    }
  
    spawnBug() {
      this.bugCount++;
      new Bug(this, this.colors[this.bugCount % 5], this.bugBoardBoundary);
    }
  
    async update(time: number, delta: number): Promise<void> {
      this.timeSinceLastCheck += delta;
  
      if (this.timeSinceLastCheck > 6000) {
        this.timeSinceLastCheck = 0;
        const newNumberOfBugs = await this.getNumberOfBugs();
        if (newNumberOfBugs > this.bugCount) {
          this.spawnBug();
        } else {
          this.killBug();
        }
      }
  
      for (var bug of this.healthyBugs) {
        bug.update(time, delta);
      }
      for (var bugOnMarch of this.bugsOnDeathMarch) {
        bugOnMarch.update(time, delta);
      }
    }
    
    async getNumberOfBugs() {
      return new Promise((resolve) =>
        setTimeout(() => {
          const val = this.bugCount + Math.round(Math.random() * 4 - 2);
          resolve(val);
        }, 1000)
      );
    }
  }
  