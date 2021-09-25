ants = []; //initializing your empty array for ants


function setup() {
  createCanvas(500, 500);

  angleMode(DEGREES);

  blanket = new Blanket();
  ant = new Ant();

  // for loop to push ants into the array
  for (i = 0; i < 50; i++) {
    ants[i] = new Ant();

  }
}

function draw() {
  background('white');
  blanket.show();
  //for loop to move and show ants
  for (let i = 0; i < ants.length; i++) {
    ants[i].move();
    ants[i].show();
  }
}

class Ant {
  constructor(xPos, yPos, speed) {

    this.xPos = 0;
    this.yPos = random(height);
    this.w = 7;
    this.h = 5;
    this.speed = random(0, 2);
    this.rotationAngle = random(360);

  }

  show() {
    //where we draw the ants

    noStroke();
    fill('white');
    push();
    translate(width / 2, height / 2);
    rotate(this.rotationAngle);
    ellipse(this.xPos, this.yPos, this.w, this.h);
    ellipse(this.xPos + this.w, this.yPos, this.w, this.h);
    ellipse(this.xPos - this.w, this.yPos, this.w, this.h);
    pop();
  }

  move() {
    //this is where the ants move across and down
    this.xPos = this.xPos + this.speed;
    if (this.xPos > width) {
      this.xPos = 0;
      this.yPos = this.yPos + 25;
    }
    if (this.yPos > height) {
      this.yPos = 0;
    }
  }
}


class Blanket {
  constructor() {

  }

  show() {
    stroke(255, 255, 255, 90);
    strokeWeight(25);
    for (let i = 0; i < width; i += 49) {
      line(i, 0, i, height);
    }
    for (let y = 0; y < height; y += 49) {
      line(0, y, width, y);
    }
  }
}