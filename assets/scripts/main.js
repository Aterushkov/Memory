let scene = new Phaser.Scene("Game");

scene.preload = function() {
    // 1. загрузить бэкгранд
    this.load.image('bg','assets/sprites/background.png');
};

scene.create = function() {
    // 2. вывести бэкграунд
    this.add.sprite(0,0,'bg').setOrigin(0,0);
};

let config = {
    type: Phaser.AUTO, // webgl or canvas
    width: 1280,
    height: 720,
    scene: scene
};

let game = new Phaser.Game(config);