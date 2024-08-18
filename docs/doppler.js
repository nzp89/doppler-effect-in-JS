let STOP_SPEED = 0;
let NORMAL_SPEED = 20;
let SOUND_SPEED = 30;
let SUPERSONIC_SPEED = 40;

let speed;

let interval = 500; // 円を描画する間隔（ミリ秒）

let X; // 円の描画を開始するときのX座標
let Y; // 円の描画を開始するときのY座標
let MAX_SIZE; // 円の最大サイズ（直径）

let centerX;
let centerY;
let center_speed = 1;

let lastCircleTime = 0; // 前回円を描画した時刻
let circles = []; // 円の配列

let isAnimating = true;

function decideSpeed(){
    const operation = document.querySelector('input[name="operation"]:checked').value;
    if (operation === "stop") {
        speed = STOP_SPEED;
    } else if (operation === "normal") {
        speed = NORMAL_SPEED;
    } else if (operation === "sonic") {
        speed = SOUND_SPEED;
    } else if (operation === "supersonic") {
        speed = SUPERSONIC_SPEED;
    }     // 描画間隔ごとに、円が右から左へ移動する量
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);//3Dの場合は引数にWEBGLを忘れずに！
    background(30);//再描画後に背景を再描画する
}

function setup(){
    canvas = createCanvas(windowWidth,windowHeight);//2Dの場合は引数にWEBGLは要らない
    canvas.position(0,0);//canvasをページの原点に固定
    canvas.style('z-index','-1');//canvasを後ろに移動する
    background(30);
    X = windowWidth; // HTMLウィンドウの右端に設定
    Y = windowHeight / 2; // ウィンドウの中央に設定
    centerX = X;
    centerY = Y;
    MAX_SIZE = windowHeight;
}

function draw() {
    background(0);

    // 現在の時間を取得
    let currentTime = millis();

    if (isAnimating) {
        decideSpeed();
        // 一定の間隔で新しい円を生成
        if (currentTime - lastCircleTime > interval) {
            // 円を描く位置のX座標を更新する
            if (X > speed) {
                X -= speed;
            } else {
                X = windowWidth;
            }
            let x = X;
            let y = Y;
            let radius = 10; // 初期直径
            let newCircle = new Circle(x, y, radius);
            circles.push(newCircle);
            lastCircleTime = currentTime;
        }

        // 円を表示し、成長させる
        for (let i = 0; i < circles.length; i++) {
            circles[i].display();
            circles[i].grow();
        }
        
    }
    
}

// 円の中心を描画する関数
function drawCenterCircle(x, y) {
    let centerRadius = 5; // 固定円の半径
    fill(255, 110, 0); 
    noStroke();
    ellipse(x, y, centerRadius * 2);
}

class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.growing = true;
        this.stroke = 0;
        this.color = color(255,255,255,30);
    }

    display() {
        stroke("gray");
        fill(this.color);
        ellipse(this.x, this.y, this.radius * 2);
    }

    grow() {
        if (this.growing) {
            this.radius += 1;
        }
        if (this.stroke >= 0 && this.stroke < 128) {
            this.stroke += 1;
        } else if (this.stroke >= 128 && this.stroke < 255) {
            this.stroke += 5;
        } else {
            this.stroke = 255;
        }

        // 一定のサイズ以上になったら円を削除
        if (this.radius > MAX_SIZE) {
            circles.splice(circles.indexOf(this), 1);
        }
    }
}
