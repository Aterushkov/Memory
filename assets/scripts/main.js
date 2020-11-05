let scene = new Phaser.Scene("Game");

scene.preload = function() {
    // 1. загрузить бэкгранд
    this.load.image('bg','assets/sprites/background.png');
    this.load.image('card','assets/sprites/card.png');
};

scene.create = function() {
    // 2. вывести бэкграунд
    this.add.sprite(0,0,'bg').setOrigin(0,0);
    let positons = this.getCardsPositions();
    for (let positon of positons){
        this.add.sprite(positon.x,positon.y,'card').setOrigin(0,0);
    }

};

scene.getCardsPositions = function (){
    let positons =[];
    let cardTexture = this.textures.get('card').getSourceImage();

    let cardWidth  = cardTexture.width + 4;
    let cardHeigth  = cardTexture.height + 4;

    let offseX = (this.sys.game.config.width - cardWidth*config.cols)/2;
    let offseY = (this.sys.game.config.height - cardHeigth*config.rows)/2;

    for(let row = 0; row<config.rows; row++){
        for(let col = 0; col<config.cols; col++){
            positons.push({
                x:offseX + col * cardWidth,
                y:offseY + row * cardHeigth,
            })
        }
    }
    return positons;
};

let config = {
    type: Phaser.AUTO, // webgl or canvas
    width: 1280,
    height: 720,
    rows: 2,
    cols: 5,
    scene: scene
};

let game = new Phaser.Game(config);