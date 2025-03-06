class Level1 extends Phaser.Scene {
//setup
    constructor() {
        super({
            key: 'Level1',
            physics: {
               arcade: {
                debug: false,
                gravity: { y: 350 }
               } 
            } 
        });
//variaveis
        this.player;
        this.bombs;
        this.platforms;
        this.cursors;
        this.score = 0;
        this.gameOver = false;
        this.scoreText;
//plataformas como array
        this.platformPositions = [ 
            { x: 400, y: 568, scale: 2 },
            { x: -100, y: 400, scale: 1 },
            { x: 900, y: 400, scale: 1 }
        ];
    }

    preload() {
//carregar imagens
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('cara', 'assets/cara.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
//cria o fundo e o jogador, invoca as plataformas
        this.add.image(400, 300, 'sky');
        this.platforms = this.physics.add.staticGroup();
        this.createPlatforms();
        this.player = this.physics.add.sprite(100, 450, 'cara');
        this.player.setCollideWorldBounds(true);
//animacoes do player
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('cara', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'cara', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('cara', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
//escuta as teclas de cursor o grupo das bomba, e a colisao entre o player e as bombas, e a pontuacao
        this.cursors = this.input.keyboard.createCursorKeys();
        this.bombs = this.physics.add.group();
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        this.time.addEvent({
            delay: 2000,
            callback: this.spawnBomb,
            callbackScope: this,
            loop: true
        });
    }

    update() {
//para o jogo se tu perede
        if (this.gameOver) {
            return;
        }
//faz o score ficar subindo
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
//movimentacao
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-400);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(400);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-400);
        }
    }
//detecta colisao
    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.gameOver = true;
    }
//spawna bombas depois de um tempo
    spawnBomb() {
        if (this.gameOver === false) {
            var x = Phaser.Math.Between(0, 800);
            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 300), 20);
            bomb.allowGravity = false;
        }
    }
//plataformas
    createPlatforms() {
        this.platformPositions.forEach(pos => {
            this.platforms.create(pos.x, pos.y, 'ground').setScale(pos.scale).refreshBody();
        });
    }
}