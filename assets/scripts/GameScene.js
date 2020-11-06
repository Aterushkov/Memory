class GameScene extends Phaser.Scene{
    constructor() {
        super("Game");
    };
    preload(){
        // 1. загрузить бэкгранд
        this.load.image('bg','assets/sprites/background.png');
        this.load.image('card','assets/sprites/card.png');
        this.load.image('card1','assets/sprites/card1.png');
        this.load.image('card2','assets/sprites/card2.png');
        this.load.image('card3','assets/sprites/card3.png');
        this.load.image('card4','assets/sprites/card4.png');
        this.load.image('card5','assets/sprites/card5.png');

    };
    createText(){
        this.timeoutText = this.add.text(10,10,"", {
            font:'36px',
            fill:'#000',

        });
    };
    onTimerTick(){
        this.timeoutText.setText("Времени осталось: "+ this.timeout);
        if(this.timeout<=0){
            this.start();
        }else{
            --this.timeout;
        }

    };
    create(){
        this.timeout = config.timeout;
        this.createTimer();
        this.createBackground();
        this.createText();
        this.createCard();
        this.start();
    };
    createTimer(){
        this.time.addEvent({
           delay: 1000,
           callback: this.onTimerTick,
            callbackScope: this,
            loop:true,
        });
    };
    start(){
        this.timeout =  config.timeout;
        this.openedCard = null;
        this.openCardCount = 0;
        this.initCards();
    };
    initCards(){
        let positons = this.getCardsPositions();
        this.cards.forEach(card =>{
            let positon = positons.pop();
            card.close();
            card.setPosition(positon.x,positon.y);
        })
    };
    createBackground() {
        this.add.sprite(0,0,'bg').setOrigin(0,0);
    };

    createCard(){
        this.cards = [];

        for (let value of config.cards) {
            for(let i = 0; i < 2; i++){
                this.cards.push(new Card(this,value));
            };
        };
        this.input.on("gameobjectdown", this.onCardClick, this);
    };

    onCardClick(pointer, card){
        if(card.opened){
            return false;
        } else{
            if(this.openedCard){
                if(this.openedCard.value === card.value){
                    this.openedCard = null;
                    ++this.openCardCount;
                }else{
                    this.openedCard.close();
                    this.openedCard = card;
                }
            }else{
                this.openedCard = card;
            }
        }
        card.open();
        if(this.openCardCount === this.cards.length/2){
            this.start();
        }
    };
    getCardsPositions(){
        let positons =[];
        let cardTexture = this.textures.get('card').getSourceImage();

        let cardWidth  = cardTexture.width + 4;
        let cardHeigth  = cardTexture.height + 4;

        let offseX = (this.sys.game.config.width - cardWidth*config.cols)/2 + cardWidth/  2;
        let offseY = (this.sys.game.config.height - cardHeigth*config.rows)/2 + cardHeigth / 2;

        for(let row = 0; row<config.rows; row++){
            for(let col = 0; col<config.cols; col++){
                positons.push({
                    x:offseX + col * cardWidth,
                    y:offseY + row * cardHeigth,
                })
            };
        };
        return Phaser.Utils.Array.Shuffle(positons);
    };
};
