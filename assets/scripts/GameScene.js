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

        this.load.audio('theme', 'assets/sounds/theme.mp3');
        this.load.audio('card', 'assets/sounds/card.mp3');
        this.load.audio('complete', 'assets/sounds/complete.mp3');
        this.load.audio('success', 'assets/sounds/success.mp3');
        this.load.audio('timeout', 'assets/sounds/timeout.mp3');

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
            this.timer.paused = true;
            this.sounds.timeout.play();
            this.restart();
        }else{
            --this.timeout;
        }
    };
    createSounds(){
        this.sounds = {
            card:this.sound.add('card'),
            theme:this.sound.add('theme'),
            complete:this.sound.add('complete'),
            success:this.sound.add('success'),
            timeout:this.sound.add('timeout'),
        };
        this.sounds.theme.play({volume:0.1});
    };
    create(){
        this.timeout = config.timeout;
        this.createSounds();
        this.createTimer();
        this.createBackground();
        this.createText();
        this.createCard();
        this.start();
    };
    createTimer(){
        this.timer = this.time.addEvent({
           delay: 1000,
           callback: this.onTimerTick,
            callbackScope: this,
            loop:true,
        });
    };
    restart(){
        let count = 0;
        let onCardMoveComplite = ()=>{
            ++count;
            if(count>= this.cards.length){
                this.start();
            }
        };
        this.cards.forEach(card => {
            card.move({
                x:this.sys.game.config.width + card.width,
                y:this.sys.game.config.height + card.height,
                delay: card.position.delay,
                callback: onCardMoveComplite
            });
        });
    }
    start(){
        this.initCardsPositions();
        this.timeout =  config.timeout;
        this.openedCard = null;
        this.openCardCount = 0;
        this.timer.paused = false;
        this.initCards();
        this.showCards();
    };
    initCards(){
        let positons = Phaser.Utils.Array.Shuffle(this.positions);
        this.cards.forEach(card =>{
            card.init(positons.pop());
        });
    };
    showCards(){
        this.cards.forEach(card => {
            card.depth = card.position.delay;
            card.move({
                x:card.position.x,
                y:card.position.y,
                delay: card.position.delay
            });
        });
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
            this.sounds.card.play();
            if(this.openedCard){
                if(this.openedCard.value === card.value){
                    this.sounds.success.play();
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
    card.open(() =>{
        if(this.openCardCount === this.cards.length/2){
            this.sounds.complete.play();
            this.restart();
        }
        });
    };
    initCardsPositions(){
        let positons =[];
        let cardTexture = this.textures.get('card').getSourceImage();

        let cardWidth  = cardTexture.width + 4;
        let cardHeigth  = cardTexture.height + 4;

        let offseX = (this.sys.game.config.width - cardWidth*config.cols)/2 + cardWidth/  2;
        let offseY = (this.sys.game.config.height - cardHeigth*config.rows)/2 + cardHeigth / 2;

        let id = 0;
        for(let row = 0; row<config.rows; row++){
            for(let col = 0; col<config.cols; col++){
                ++id;
                positons.push({
                    x:offseX + col * cardWidth,
                    y:offseY + row * cardHeigth,
                    delay: id *300,
                })
            };
        };
        this.positions = positons;
    };
};
