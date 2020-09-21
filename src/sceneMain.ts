import { Bug } from './bug';
import { BugFalling } from './bugFalling';

export class SceneMain extends Phaser.Scene {
    colors = ['blue', 'green', 'magenta', 'purple', 'red'];
    healthyBugs: Bug[] = [];
    bugsFalling: BugFalling[] = [];
    timeSinceLastCheck = 0;
    bugBoardBoundary = new Phaser.Geom.Rectangle(380, 150, 400, 250);
    team = 'All Bugs';
    model: IModel = { bugs: []}
  
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
        
          this.team = unescape(paramPair.split('=')[1]);
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
      const apiResults = await this.getNumberOfBugs();
      const text = this.add.text(460,80,
        `'${this.team}' Bug Board` +
        "\n" +
        "Population " + apiResults.bugs.length);
      text.setColor("Black");
      text.setFont("Emmett");
      text.setFontSize(30);
      text.setAngle(-5);

      this.model = this.mapResultToModel(apiResults);
      for (var bugIndex = 0; bugIndex < this.model.bugs.length; bugIndex++) {
        if( this.team === 'All Bugs' || this.team === this.model.bugs[bugIndex].team ){
          new Bug(this, this.colors[bugIndex % 5], this.bugBoardBoundary, this.model.bugs[bugIndex]);
        }
      }
  
      for (var color of this.colors) {
        Bug.createAnimation(this, color);
        BugFalling.createAnimation(this,color)
      }

    }

    mapResultToModel(result: IAPIResult): IModel {
      const bugs = result.bugs.map(x => {
        const assignee = x.assignee;
        let severity = 0;
        switch( x.priority){
          case 'Critical':
            severity = 1;
            break;
          case 'Blocker':
            severity = 2;
            break;
          case 'Major':
            severity = 3;
            break;
          case 'Minor':
            severity = 4;
            break;
          default:
            severity = 4;
        }
        const team = x.team;
        return {
          assignee: x.assignee,
          id: x.key,
          fixed: x.status === 'Closed' || x.status === 'Fixed',
          severity,
          date: x.updated, 
          team: x.team       
        }
      } );
      return {
        bugs: bugs
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
                    key: "PURESUPPORT-68354",
                    summary: "Implement automated search using ResearcherID with WoSlite.",
                    assignee: "Team Data Models",
                    assigneeIconUrl: "https://support.pure.elsevier.com/secure/useravatar?ownerId=team_data_models&avatarId=15593",
                    status: "Open",
                    team: "Data models",
                    priority: "Critical",
                    updated: "2020-09-21T10:30:32.000+00:00"                    
                  },
                  {
                    key: "PURESUPPORT-68353",
                    summary: "REF2021 - REF2 Output Label",
                    assignee: "Claus Poulsen",
                    assigneeIconUrl: "https://support.pure.elsevier.com/secure/useravatar?ownerId=cpo&avatarId=16387",
                    status: "Open",
                    team: "Support",
                    priority: "Major",
                    updated: "2020-09-21T10:33:53.000+00:00"
                  }
            ]
          })
          }, 1000)
        );
      }    
  }

export interface IModel {
    bugs: IModelBugInfo[];
}
export interface IModelBugInfo {
    assignee: string;
    id: string;
    fixed: boolean;
    severity: number;
    date: string;      
    team: string;
}

export interface IAPIResult {
  bugs: IAPIBug[];
}

export interface IAPIBug {
  key: string;
  summary: string;
  assignee: string;
  assigneeIconUrl: string;
  status: string;
  team: string;
  priority: string;
  updated: string;
}
