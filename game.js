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
  let vector = {
    angle: 0,
    distance: 30,
    color: 0xffff00,
    alpha: 0,
  };
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

  setPositions();

  bubble.width = bubble.height = 0;
  bubble.alpha = 0;
  bubble.tint = 0;

  // COLOR VALUES
  let colorBubble1 = 0xcc00ff;
  let colorBubble2 = 0xff00cc;

  let colorArrow1 = 0xffff00;
  let colorArrow2 = 0x00ff00;
  // let colorArrow3 = 0xffcc00;
  let colorArrowFlash = 0xffffff;

  // TIMING VALUES
  let timeScale = 1;

  let intro = 1000 * timeScale;
  let main = 3000 * timeScale;
  let outro = main * 0.25;

  // bubble scaling (main timing)
  new JMTween(bubble, intro * 1.25).to({width: 100, height: 100}).easing(Easing.Back.Out).start()
    .chain(bubble, outro).wait(main * 0.9 - intro * 0.25).to({width: 0, height: 0}).easing(Easing.Back.In)
    .onComplete(() => bubble.destroy());

  // bubble alpha
  new JMTween(bubble, intro / 2).to({alpha: 1}).start();

  // bubble colour
  new JMTween(bubble, intro / 3).colorTo({tint: colorBubble1}).start()
    .chain(bubble, intro / 3).wait(intro / 3).colorTo({tint: colorBubble2})
    .chain(bubble, outro / 3).wait(main * 0.9).colorTo({tint: colorBubble1})
    .chain(bubble, outro / 3).wait(outro / 3).colorTo({tint: 0});

  // triangle spin (main timing)
  new JMTween(vector, main).wait(intro).to({angle: Math.PI * 4}).start().onUpdate(setPositions)
    .chain(vector, outro).to({angle: Math.PI * 6}).onUpdate(setPositions)
    .onComplete(() => triangles.forEach(triangle => triangle.destroy()));

  // triangle distance
  new JMTween(vector, main / 2).wait(intro).to({distance: 15}).start()
    .chain(vector, outro).wait(main / 2 * 0.8).to({distance: 100}).easing(Easing.Back.In);

  // triangle alpha
  new JMTween(vector, 100).wait(intro).to({alpha: 1}).start()
  .chain(vector, outro / 2).wait(main).to({alpha: 0});

  // triangle colour
  vector.color = colorArrow1;
  new JMTween(vector, main * 0.3).wait(intro).colorTo({color: colorArrow2}).easing(Easing.Quadratic.In).start()
    .chain(vector, main * 0.04).wait(main * 0.4).colorTo({color: colorArrowFlash}).easing(Easing.Quadratic.In)
    .yoyo(true, 2);
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
