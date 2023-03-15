// import SceneA from "./scenes/SceneA.mjs";
import TestScene from "./scenes/TestScene.mjs";

import RecentTest from "./scenes/RecentTest.mjs";

const config = {
  type: Phaser.CANVAS,
  parent: "gameContainer",
  //pixelArt: true,
  backgroundColor: '#320822',
  scale:
  {
      mode: Phaser.Scale.NONE,
      //autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 200,
      height: 200,
      zoom: 2
  },
  //loader: {
  //  baseURL: 'https://i.ibb.co/YhGPn4S',
  //  crossOrigin: 'anonymous'
  //},
  scene: RecentTest//[TestScene]
};

window.game = new Phaser.Game(config);


// SceneA (old)
// const config = {
//     type: Phaser.WEBGL,
//     pixelArt: true,
//     backgroundColor: '#232323', //'#320822',
//     //parent: "gameContainer",
//     disableContextMenu: true,
//     scale:
//     {
//       mode: Phaser.Scale.NONE,
//       //autoCenter: Phaser.Scale.CENTER_BOTH,
//       width: 300,
//       height: 200,
//       zoom: 2
//     },
//     //loader:
//     //{
//     //  baseURL: 'https://gist.githubusercontent.com/Trissolo/0135ed23866b2134016e566365718f60/raw/63e4e9132d75240701b2d54c8e07b1444805cce6',
//     //  crossOrigin: 'anonymous'
//     //},
//     scene: SceneA
//   };
  
  // window.game = new Phaser.Game(config);
