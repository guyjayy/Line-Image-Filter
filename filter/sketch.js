var img;
var redSlider;
var imageArray;

//preload will load before setup runs
function preload() {
  imageArray = ["sk8.jpg","legocas.jpg","miniGolf.jpg"]
  //all images owned by Daniel Santana, or are public domain
  img = loadImage(imageArray[Math.round(random(0,imageArray.length-1))])
}

class SliderClass {
  constructor(x,y,length,center){
    this.slider = createSlider(0, length, center);
    this.slider.position(x,y);
    this.slider.style('width', '200px');
  }
}

function updateBackground(r,g,b) {
  background(r,g,b)
  textSize(30)
  fill(0)
  text("blue",1.2*img.width/8+2, img.height+150+2)
  text("green",1.2*img.width/8+2, img.height+90+2)
  text("red",1.2*img.width/8+2, img.height+30+2)
  text("sensitivity",3.2*img.width/8+2, img.height+60+2)
  text("averaging reach",3.2*img.width/8+2, img.height+120+2)

  fill(255,0,0)
  text("red",1.2*img.width/8, img.height+30)
  fill(0,255,0)
  text("green",1.2*img.width/8, img.height+90)
  fill(0,0,255)
  text("blue",1.2*img.width/8, img.height+150)
  fill(255);
  text("sensitivity",3.2*img.width/8, img.height+60)
  text("averaging reach",3.2*img.width/8, img.height+120)


  fill(0)
  text("background blue",6.2*img.width/8+2, img.height+150+2)
  text("background green",6.2*img.width/8+2, img.height+90+2)
  text("background red",6.2*img.width/8+2, img.height+30+2)

  fill(255,0,0)
  text("background red",6.2*img.width/8, img.height+30)
  fill(0,255,0)
  text("background green",6.2*img.width/8, img.height+90)
  fill(0,0,255)
  text("background blue",6.2*img.width/8, img.height+150)
  //makes all of the lables that will acompany the sliders, and the text is multi-layered (with a black shadow) so it does not become invisible at boundry values.
}

function setup() {
  if (img.width > img.height) {
    img.resize(1500, (img.height/img.width)*1500);
  } else {
    img.resize((img.width/img.height)*1000, 1000);
  }
  //resizes images so that they fit on the canvas
  createCanvas(img.width, img.height+170);
  background(255,0,0);
  image(img, 0, 0); //draw the image to the canvas
  console.log("Image width: " + img.width + " height: " + img.height);

  redSlider = new SliderClass(0*img.width/8, img.height,255,random(255));
  blueSlider = new SliderClass(0*img.width/8, img.height+120,255,random(255));
  greenSlider = new SliderClass(0*img.width/8, img.height+60,255,random(255));
  threshSlider = new SliderClass(2*img.width/8, img.height+30,50,5);
  reachSlider = new SliderClass(2*img.width/8, img.height+90,25,3);
  //BACKGROUND
  redSliderB = new SliderClass(5*img.width/8, img.height,255,random(255));
  blueSliderB = new SliderClass(5*img.width/8, img.height+120,255,random(255));
  greenSliderB = new SliderClass(5*img.width/8, img.height+60,255,random(255));
  //creates different objects for the different sliders out of a class, and sets the default of the colors to random values
}

var lastPixels;

function updateMyImage(r,g,b,th,rea,br,bg,bb) {
  loadPixels();
  lastPixels = pixels
  for(var i=4*img.width*img.height*0;i<4*img.width*img.height;i+=4) {
    let color = [r,g,b]
    let threshhold = th
    let theReach = rea
    if (pixels[i]+threshhold < pixels[i+4] && pixels[i+1]+threshhold < pixels[i+5] && pixels[i+2]+threshhold < pixels[i+6]) {
      pixels[i] = color[0]; //red
      pixels[i+1] = color[1]; //green
      pixels[i+2] = color[2]; //blue
    } else if (pixels[i] > pixels[i+4]+threshhold && pixels[i+1] > pixels[i+5]+threshhold && pixels[i+2] > pixels[i+6]+threshhold) {
      pixels[i] = color[0]; //red
      pixels[i+1] = color[1]; //green
      pixels[i+2] = color[2]; //blue
    } else if (pixels[i]+threshhold < getAveragePixelValuebelow(i,theReach) && pixels[i+1]+threshhold < getAveragePixelValuebelow(i+1,theReach) && pixels[i+2]+threshhold < getAveragePixelValuebelow(i+2,theReach)) {
      pixels[i] = color[0]; //red
      pixels[i+1] = color[1]; //green
      pixels[i+2] = color[2]; //blue
    } else {
      pixels[i] = br; //red
      pixels[i+1] = bg; //green
      pixels[i+2] = bb; //blue
    }
    pixels[i+3] -= 0; //alpha
  }
  updatePixels();
}

function getAveragePixelValuebelow(pixelIndex,reachBelow) {
  let toBeDivided = 0
  for (var r = 1; r <= reachBelow; r ++) {
    toBeDivided+=pixels[pixelIndex+img.width*4*r]
  }
  return toBeDivided/reachBelow
}

var lastRedVal;
var lastGreenVal;
var lastBlueVal;
var lastReachVal;
var lastThreshVal;

var lastRedValB;
var lastGreenValB;
var lastBlueValB;

function draw() {
  //img = loadImage("sk8.jpg");
  var redVal = redSlider.slider.value();
  var greenVal = greenSlider.slider.value();
  var blueVal = blueSlider.slider.value();
  var threshVal = threshSlider.slider.value();
  var reachVal = reachSlider.slider.value();

  var redValB = redSliderB.slider.value();
  var greenValB = greenSliderB.slider.value();
  var blueValB = blueSliderB.slider.value();

  if (lastRedVal != redVal || lastGreenVal != greenVal || lastBlueVal != blueVal || lastThreshVal != threshVal || lastReachVal != reachVal || lastRedValB != redValB || lastGreenValB != greenValB || lastBlueValB != blueValB) {
    updateBackground(redVal,greenVal,blueVal);
    image(img, 0, 0)
    loadPixels();
    pixels = lastPixels;
    updatePixels();

    //not working
    updateMyImage(redVal,greenVal,blueVal,threshVal,reachVal,redValB,greenValB,blueValB);
  }
  lastRedVal = redVal;
  lastGreenVal = greenVal;
  lastBlueVal = blueVal;
  lastReachVal = reachVal;
  lastThreshVal = threshVal;
}
