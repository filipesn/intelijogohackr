class Menu extends Phaser.Scene {
//setup
    constructor() {
        super({
            key: 'Menu',
            backgroundColor: '#000',
        });
    }
//carregar imagens
    preload() {
        this.load.image("lev1", "assets/bg.png");
        this.load.image("sky2", "assets/sky2.png");
    }
//cria o fundo e o texto
    create() {
        this.add.image(400, 300, 'sky2');

        var text = { height: 20, padding: 15, content: "HACKFIELD" }
        this.message = this.add.text(
            this.game.config.width / 2,
            this.game.config.height - 500,
            text.content, {
                color: "#FFFFFF",
                fontSize: 40,
                fontStyle: "bold"
            }
        ).setOrigin(0.5);
//botao, que te leva para a proxima cena.
        this.playBt = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'lev1')
            .setScale(5).setOrigin(0.5, 0.5).setInteractive();

        this.playBt.on('pointerdown', function () {
            this.scene.start('Level1');
        }, this);
    }
}