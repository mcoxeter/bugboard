import { Bug } from './bug';
import { BugFalling } from './bugFalling';

export class SceneMain extends Phaser.Scene {
    colors = ['blue', 'green', 'magenta', 'purple', 'red'];
    healthyBugs: Bug[] = [];
    bugsFalling: BugFalling[] = [];
    timeSinceLastCheck = 0;
    bugBoardBoundary = new Phaser.Geom.Rectangle(380, 150, 400, 250);
    team = 'all';
    lastAPIResult: IAPIResult = { bugs: []}
  
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

      const paramPair = document.URL.split('?')[1];
      if( paramPair ){
          this.team = paramPair.split('=')[1];
      }
  
      for (var color of this.colors) {
        Bug.loadSprite(this, color);
        BugFalling.loadSprite(this,color);
      }
  
      this.load.image('bugboard', 'assets/images/bugboard.png');
      this.load.image('backdrop', 'assets/images/backdrop.png');
      this.load.image('cloud1', 'assets/images/cloud1.png');
      this.load.image('cloud2', 'assets/images/cloud2.png');
      this.load.image('development', 'assets/images/development.png');
      this.load.image('qa', 'assets/images/qa.png');
      this.load.image('fixed', 'assets/images/fixed.png');
    }
  
    async create(): Promise<void> {
      var backdrop = this.add.image(0, 0, 'backdrop');
      backdrop.setOrigin(0, 0);
      this.add.image(600, 280, 'bugboard');
      this.lastAPIResult = await this.getNumberOfBugs();
      for (var bugIndex = 0; bugIndex < this.lastAPIResult.bugs.length; bugIndex++) {
        if( this.team === 'all' || this.team === this.lastAPIResult.bugs[bugIndex].team ){
          new Bug(this, this.colors[bugIndex % 5], this.bugBoardBoundary, this.lastAPIResult.bugs[bugIndex]);
        }
      }
      const apiResult = await this.getNumberOfBugs();
  
      for (var color of this.colors) {
        Bug.createAnimation(this, color);
        BugFalling.createAnimation(this,color);
      }

    }
    
    async update(time: number, delta: number): Promise<void> {

      this.timeSinceLastCheck += delta;
  
      if (this.timeSinceLastCheck > 6000) {
        this.timeSinceLastCheck = 0;
      }
  
      for (var bug of this.healthyBugs) {
        bug.update(time, delta);
      }
      for (var bugOnMarch of this.bugsFalling) {
        bugOnMarch.update(time, delta);
      }
    }

    async getNumberOfBugs(): Promise<IAPIResult> {
        return new Promise((resolve) =>
          setTimeout(() => {
            resolve({
              bugs: [
                  {
                      assignee: 'mike',
                      fixed: false,
                      id: 'STYLEGUIDE: 1012213',
                      date: '01.09.2020',
                      severity: 1,
                      team: 'portal'
                  },
                  {
                      assignee: 'frida',
                      fixed: false,
                      id: 'STYLEGUIDE: 66565',
                      date: '11.08.2020',
                      severity: 2,
                      team: 'dataModels'
                  },
                  {
                      assignee: 'martin',
                      fixed: true,
                      id: 'PUREDEV: 323',
                      date: '21.09.2020',
                      severity:3,
                      team: 'dataModels'
                  },
                  {
                    assignee: 'freddy',
                    fixed: true,
                    id: 'PUREDEV: 7773',
                    date: '20.09.2020',
                    severity:4,
                    team: 'dataModels'
                }
            ]
          })
          }, 1000)
        );
      }
    
    
  }

export interface IAPIResult {
    bugs: IAPIBugInfo[];
}
export interface IAPIBugInfo {
    assignee: string;
    id: string;
    fixed: boolean;
    severity: number;
    date: string;      
    team: string;
}
