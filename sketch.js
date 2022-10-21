//data from https://github.com/andrewortman/colorbot/blob/master/data/scraped/train.csv
//tutorial from https://www.youtube.com/watch?v=RfMkdvN-23o&ab_channel=TheCodingTrain
//and from https://editor.p5js.org/ima_ml/sketches/8eskYqyhA
let displayTxt, confidenceTxt;
let currentRGB
let colorNN;

let r, g, b;
let rSlider, gSlider, bSlider, offsetSlider;
let rVal, gVal, bVal, amountOffset, offsetVal;
let rOffsetI, rOffsetJ, gOffsetI, gOffsetJ, bOffsetI, bOffsetJ
let rows, columns;

let training=false
let classified=false
let win=false
let winR =255
let winG=255
let winB=255
let winResult
let d=10

function setup() {
  createCanvas(600, 600);
  noCursor()

  displayTxt = createP('W A I T I N G . . .')
//colors.csv has 13658 lines

rSlider = createSlider(0, 255, random(255));
gSlider = createSlider(0, 255, random(255));
bSlider = createSlider(0, 255, random(255));
offsetSlider = createSlider(3, 6, 4);
rOffsetI = random(6)
rOffsetJ = random(6)
gOffsetI = random(6)
gOffsetJ = random(6)
bOffsetI = random(6)
bOffsetJ = random(6)



rows=50
columns=50


  let nnOptions = {
    dataUrl: 'test.csv',
    inputs: ['red', 'green', 'blue'],
    outputs: ['name'],
    task: 'classification',
    debug: false
  };
  colorNN = ml5.neuralNetwork(nnOptions, modelReady);
}

function modelReady(){
  colorNN.normalizeData()
  const trainingOptions = {
    epochs:700
  }
  colorNN.train(trainingOptions,whileTraining, modelTrained)
}
function whileTraining(epoch, logs) {
  console.log(`Epoch: ${epoch} - loss: ${logs.loss.toFixed(2)}`);
}

function modelTrained(){
  displayTxt.html('done training')
  training=true
}

function draw() {
  // background(rSlider.value(),gSlider.value(),bSlider.value());

  amountOffset = floor(offsetSlider.value());

  rVal = floor(rSlider.value());
  gVal = floor(gSlider.value());
  bVal = floor(bSlider.value());

  noStroke()
  for (i = 0; i < width; i += rows) {
    for (j = 0; j < height; j += columns) {
      r = map(
        rVal +
          ((rOffsetI * i) / 10) +
          ((rOffsetJ * j) / 10),
        0,
        255,
        0,
        255
      );
      g = map(
        gVal +
        ((gOffsetI * i) / 10) +
        ((gOffsetJ * j) / 10),
        0,
        255,
        0,
        255
      );
      b = map(
        bVal +
        ((bOffsetI * i) / 10) +
        ((bOffsetJ * j) / 10),
        0,
        255,
        0,
        255
      );
      fill(r, g, b);
      rect(i, j, rows, columns);
    }
  }
  stroke(0)
  fill(255)
  textSize(15)
  currentRGB = get(mouseX,mouseY)
  if(classified==false){
    text("R: "+currentRGB[0]+", "+"G: "+currentRGB[1]+", "+"B: "+currentRGB[2],mouseX+25,mouseY+10)
  }else if (classified==true){
    text("R: "+currentRGB[0]+", "+"G: "+currentRGB[1]+", "+"B: "+currentRGB[2]+"; about "+confidenceTxt+'% similar',mouseX+25,mouseY+10)

  }
  if (win==true){
    noStroke()
    fill(winR,winG,winB)
    circle(mouseX,mouseY,d)
    d+=10

    stroke(0)
  fill(255)
    textSize(50)
    textAlign(CENTER)
    text("CONGRATS!!\nYou found: "+winResult,width/2,height/2)


  }
noFill()
  stroke(winR,winG,winB) 
  strokeWeight(2)
  circle(mouseX,mouseY,45)
}

function mouseClicked(){
  
  if (training==true){
    if (mouseX<width&&mouseY<height){
      let inputs = get(mouseX,mouseY)

      colorNN.classify([inputs[0],inputs[1],inputs[2]],gotResults)
      winR=inputs[0]
      winG=inputs[1]
      winB=inputs[2]
    }
  }
}

function keyPressed(){
  rOffsetI = random(amountOffset)
  rOffsetJ = random(amountOffset)
  gOffsetI = random(amountOffset)
  gOffsetJ = random(amountOffset)
  bOffsetI = random(amountOffset)
  bOffsetJ = random(amountOffset)
}

function classify(){
  if (mouseX<width&&mouseY<height){
    let inputs = get(mouseX,mouseY)

    colorNN.classify([inputs[0],inputs[1],inputs[2]],gotResults)
    console.log('click')
  }
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
  } else {
    displayTxt.html(`Target: ${results[0].label}`);
    confidenceTxt=`${results[0].confidence.toFixed(2)*100}`
    classified=true
    console.log(results)
  }
  if(results[0].confidence.toFixed(2)*100>=40){
    winResult=`${results[0].label}`
    win=true
    training=false
  }
}