const CONFIG = {
  floorHeight: 100,
}

const Colors = {
  DBLUE: 0x4E6CC6,
  WHITE: 0xFDFDFD,
  SHADOW: 0,
  PANEL: 0xf199cc,
}

let overlay = new PIXI.Graphics();
let title = new PIXI.Text("Spin Sample",{fontsize: 40});
let style = -1;
let button;

function initGame() {
  // create background
  let back = new PIXI.Graphics();
  back.beginFill(0x002266).drawRect(0, 0, appRect.width, appRect.height);
  back.interactive = true;
  // back.addListener("pointermove", onMoveOut);

  // create grass
  let floor = new PIXI.Graphics();
  floor.beginFill(0x00ff00).lineStyle(1).drawRect(0, 0, appRect.width, CONFIG.floorHeight);
  floor.y = appRect.height - CONFIG.floorHeight;

  overlay.beginFill(0).drawRect(0, 0, appRect.width, appRect.height);
  overlay.alpha = 0;
  app.stage.addChild(back, floor, title, overlay);

  title.position.set((appRect.width - title.width) / 2, (CONFIG.floorHeight - title.height) / 2);

  startAnimation({x: 200, y: 300});
}

window.addEventListener('keydown', e => {
  switch(e.key){ 
    case ' ': this.startAnimation({x: 200, y: 300}); break;
    case '1': this.startAnimation({x: 100, y: 200}); break;
    case '2': this.startAnimation({x: 200, y: 200}); break;
    case '3': this.startAnimation({x: 300, y: 200}); break;
    case '4': this.startAnimation({x: 400, y: 200}); break;
  }
});

function startAnimation(center) {
  let triangles = [];
  let vector = {angle: 0, distance: 30, color: 0xffff00, alpha: 0};
  let bubble = new Bubble;
  app.stage.addChild(bubble);
  bubble.position.set(center.x, center.y);
  for (let i = 0; i < 4; i++) {
    let triangle = new TriangleArrow();
    app.stage.addChild(triangle);
    triangles.push(triangle);
  }

  let setPositions = () => {
    triangles.forEach((triangle, i) => {
      let angle = vector.angle + Math.PI * 2 * i / 4;
      triangle.rotation = angle - Math.PI / 2;
      triangle.position.set(center.x + vector.distance * Math.cos(angle), center.y + vector.distance * Math.sin(angle));
      triangle.tint = vector.color;
      triangle.alpha = vector.alpha;
    });
  }

  let dispose = () => {
    triangles.forEach(triangle => triangle.destroy());
    bubble.destroy();
  }

  setPositions();

  bubble.width = bubble.height = 0;
  bubble.alpha = 0;
  bubble.tint = 0;

  // TIMING VALUES
  let timeScale = 1;

  let intro = 800 * timeScale;
  let main = 3000 * timeScale;
  let outro = main * 0.25;
  // let outro = 800 * timeScale;


  // bubble scaling
  new JMTween(bubble, intro * 1.25).to({width: 100, height: 100}).easing(Easing.Back.Out).start()
    .chain(bubble, outro).wait(main * 0.9 - intro * 0.25).to({width: 0, height: 0}).easing(Easing.Back.In);

  // bubble alpha
  new JMTween(bubble, intro / 2).to({alpha: 1}).start();

  // bubble colour
  new JMTween(bubble, intro * 1.25 / 3).colorTo({tint: 0xff00cc}).start()
    .chain(bubble, intro * 1.25 / 3).wait(intro * 1.25 / 3).colorTo({tint: 0xcc00ff});

  // triangle alpha
  new JMTween(vector, 50).wait(intro).to({alpha: 1}).start();

  // triangle colour
  new JMTween(vector, main / 3).wait(intro).colorTo({color: 0x00ff00}).easing(Easing.Quadratic.In).start()
    .chain(vector, main / 3000 * 100).wait(main / 3000 * 1300).colorTo({color: 0xffffff}).easing(Easing.Quadratic.In).yoyo(true, 2);
  
  // triangle movement
  new JMTween(vector, main / 2).wait(intro).to({distance: 15, angle: Math.PI * 2}).start().onUpdate(setPositions)
    .chain(vector, main / 2).to({angle: Math.PI * 4}).onUpdate(setPositions).onComplete(() => {
      new JMTween(vector, outro / 2).to({alpha: 0}).start();
      // new JMTween(vector, 1500).to({distance: 30, angle: Math.PI * 10}).start();
    })
    .chain(vector, outro).to({distance: 90, angle: Math.PI * 6}).onUpdate(setPositions)
    .onComplete(dispose);

}

class TriangleArrow extends PIXI.Graphics {
  constructor() {
    super();
    this.beginFill(0xffffff).lineStyle(1);
    this.moveTo(0, 0).lineTo(10, 15).lineTo(-10, 15).lineTo(0, 0);
  }
}

class Bubble extends PIXI.Graphics {
  constructor() {
    super();
    let easing = Easing.Circular.In;
    let alphaRatio = 0.02;
    let length = 60;
    for (let i = 100; i > length; i--) {
      this.lineStyle(1, 0xffffff, easing((i - length) * alphaRatio)).drawCircle(0, 0, i);
    }
  }
}