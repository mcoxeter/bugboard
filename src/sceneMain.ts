import { Bug } from './bug';
import { BugFalling } from './bugFalling';

export class SceneMain extends Phaser.Scene {
  colors = ['blue', 'green', 'magenta', 'purple', 'red'];
  healthyBugs: Bug[] = [];
  bugsFalling: BugFalling[] = [];
  bugBoardBoundary = new Phaser.Geom.Rectangle(340, 150, 580, 340);
  team = 'All Bugs';
  model: IModel = { bugs: [] };

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
    if (paramPair) {
      this.team = unescape(paramPair.split('=')[1]);
    }

    for (var color of this.colors) {
      Bug.loadSprite(this, color);
      BugFalling.loadSprite(this, color);
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
    const bugBoard = this.add.image(650, 325, 'bugboard');
    bugBoard.setScale(1.2);
    const apiResults = await this.getNumberOfBugs();

    const filteredResults: IAPIResult = {
      bugs: apiResults.bugs.filter(
        (b) => this.team === 'All Bugs' || this.team === b.team
      ),
    };


    const text = this.add.text(
      10,
      10,
      this.team +
        '\nPopulation: ' +
        filteredResults.bugs.length +
        '\nRecently closed: ' +
        filteredResults.bugs.filter( x => this.fixedFilter(x)).length
    );
    text.setColor('Black');
    text.setFont('Emmett');
    text.setFontSize(24);

    this.model = this.mapResultToModel(filteredResults);
    for (var color of this.colors) {
      Bug.createAnimation(this, color);
      BugFalling.createAnimation(this, color);
    }

    for (var bugIndex = 0; bugIndex < filteredResults.bugs.length; bugIndex++) {
      new Bug(
        this,
        this.colors[bugIndex % 5],
        this.bugBoardBoundary,
        this.model.bugs[bugIndex]
      );
    }
  }

  mapResultToModel(result: IAPIResult): IModel {
    const bugs = result.bugs.map((x) => {
      const assignee = x.assignee;
      let severity = 0;
      switch (x.priority) {
        case 'Blocker':
          severity = 1;
          break;
        case 'Critical':
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
        fixed: this.fixedFilter(x),
        severity,
        date: x.updated,
        team: x.team,
      };
    });
    return {
      bugs: bugs,
    };
  }

  fixedFilter(b : IAPIBug) : boolean {
    return b.status === 'Closed' || b.status === 'Released' || b.status === 'Ready for release' || b.status === 'QA in progress' || b.status === 'Ready for QA';
  } 


  async update(time: number, delta: number): Promise<void> {
    for (var bug of this.healthyBugs) {
      bug.update(time, delta);
    }
    for (var bugOnMarch of this.bugsFalling) {
      bugOnMarch.update(time, delta);
    }
  }

  async testGetNumberOfBugs(): Promise<IAPIResult> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          bugs: [
            {
              key: 'PURESUPPORT-68354',
              summary:
                'Implement automated search using ResearcherID with WoSlite.',
              assignee: 'Team Data Models',
              assigneeIconUrl:
                'https://support.pure.elsevier.com/secure/useravatar?ownerId=team_data_models&avatarId=15593',
              status: 'Open',
              team: 'Data models',
              priority: 'Critical',
              updated: '2020-09-21T10:30:32.000+00:00',
            },
            {
              key: 'PURESUPPORT-68353',
              summary: 'REF2021 - REF2 Output Label',
              assignee: 'Claus Poulsen',
              assigneeIconUrl:
                'https://support.pure.elsevier.com/secure/useravatar?ownerId=cpo&avatarId=16387',
              status: 'Open',
              team: 'Support',
              priority: 'Major',
              updated: '2020-09-21T10:33:53.000+00:00',
            },
          ],
        });
      }, 1000)
    );
  }
  async getNumberOfBugs(): Promise<IAPIResult> {
    const liveUrl = 'http://localhost:9090/api/bugboard';
    const testUrl = '/assets/testApiResponse.json';
    const result = await fetch(liveUrl).then((response) => response.json());
    return {
      bugs: result,
    };
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
