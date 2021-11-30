(function initialize() {
  let options = document.getElementsByClassName('option-container')[0];

  for (let i = 1; i <= 6; i++) {
    let button = document.createElement('button');
    button.classList.add('option-button');
    
    button.appendChild(makeImage(i));
    let index = i;
    button.addEventListener('pointerdown', () => addChatEntry(index));
    options.appendChild(button);
  }
})();

let addChatEntry = (function() {
  let chatbox = document.getElementById('chatbox');
  let MAX_LENGTH = 10;
  let entries = [];

   return function addChatEntry(stickerIndex) {
    let div = document.createElement('div');
    div.classList.add('chat-entry');

    let header = document.createElement('div');
    header.classList.add('namefield');
    header.innerHTML = '<div>You</div><div>Member</div>';
    div.appendChild(header);

    let image = makeImage(stickerIndex);
    div.appendChild(image);
    
    chatbox.appendChild(div);
    entries.push(div);

    if (entries.length > MAX_LENGTH) chatbox.removeChild(entries.shift());

    chatbox.scrollTop = chatbox.scrollHeight;

    animate(image, stickerIndex);
    // image.rotation = 200;
  }
})();

function makeImage(stickerIndex) {
  let imageName = `Sticker${stickerIndex}.png`;

  let image = document.createElement('img');
  image.classList.add('chat-image');
  image.src = imageName;

  return image;
}

function animate(sticker, index) {
  console.log('index', index);
  let obj = {height: 1, width: 1, rotation: 0, x: 0, y: 0};
  switch(index) {
    case 1:
      obj.y = 50;
      obj.height = 0;
      new JMTween({percent: 0},2000).onUpdate(() => applyTransform(sticker, obj)).onComplete(() => sticker.style.transform = '').start();
      new JMTween(obj, 300).to({height: 1, y: -20, rotation: 30}).easing(Easing.Back.Out).start()
        .chain(obj, 100).wait(200).to({rotation: 20}).yoyo(true, 3)
        .chain(obj, 300).wait(100).to({height: 1, rotation: 0, y: 0});

      // new JMTween(obj, 300).wait(400).to({rotation: -45}).start();  
      break;
    case 2:
      obj.rotation = 700;
      obj.height = 0.3;
      obj.width = 0.3;
      new JMTween(obj, 500).to({rotation: 0}).start().onUpdate(data => applyTransform(sticker, data))
      .onComplete(() => sticker.style.transform = '');
      new JMTween(obj, 300).to({height: 0.8, width: 0.8}).easing(Easing.Quadratic.InOut).start()
        .chain(obj, 200).to({height: 1, width: 1});
        ``
      break;
    case 3:
      obj.width = 0.1;
      obj.height = 0.1;
      new JMTween({percent: 0},2000).onUpdate(() => applyTransform(sticker, obj)).onComplete(() => sticker.style.transform = '').start();
      new JMTween(obj, 500).to({width: 1.3, height: 1.3, rotation: 15}).easing(Easing.Back.Out).start()
        .chain(obj, 1000).wait(500).to({width: 1, height: 1, rotation: 0})
      break;
    default:
      obj.height = 0;
      obj.width = 0;
      new JMTween(obj, 700).to({height: 1, width: 1}).easing(Easing.Back.Out).start()
      .onUpdate(data => applyTransform(sticker, data))
      .onComplete(() => sticker.style.transform = '');
      break;
  }
}

function applyTransform(sticker, data) {
  sticker.style.transform = `scaleX(${data.width}) scaleY(${data.height}) translateX(${data.x}px) translateY(${data.y}px) rotate(${data.rotation}deg)`;
}

// chatbox.appendChild(makeChatEntry(1));