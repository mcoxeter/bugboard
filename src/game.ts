import { SceneMain } from './sceneMain';
import "phaser";

// 720p
var config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { y: 0 },
      },
    },
    scene: [SceneMain],
  };
    
  const game = new Phaser.Game(config);