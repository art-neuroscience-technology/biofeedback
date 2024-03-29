// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let bg;
var shift_x = 370;
var shift_y = 200; 

const part_names = ['nose', 
'leftEye','rightEye', 
'leftEar', 'rightEar', 
'leftShoulder', 'rightShoulder', 
'leftElbow', 'rightElbow', 
'leftWrist', 'rightWrist', 
'leftHip', 'rightHip', 
'leftKnee', 'rightKnee', 
'leftAnkle', 'rightAnkle']

var oscPort = new osc.WebSocketPort({
    url: "ws://localhost:8081", // URL to your Web Socket server.
    metadata: true
});
oscPort.open()

var sendOSC = true


function modelReady() {
  console.log('Model ready');
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  bg = loadImage('https://i.ibb.co/q5Cx2DR/image.jpg');
  video = createCapture(VIDEO);
  video.size(600, 600);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}


function draw() {
  background(bg);
  //image(video, shift_x, shift_y, 600, 600);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}


// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.9) {
        noStroke();
        fill(85, 6, 192);
        ellipse(keypoint.position.x + shift_x, keypoint.position.y + shift_y, 15, 15);
        if (sendOSC){
          for (let k = 0; k < part_names.length; k++) {
            sendkeypoint(keypoint, k)
          }
        }
      }
    }
  }
}


// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(221, 7, 187);
      line(partA.position.x + shift_x, partA.position.y + shift_y,
       partB.position.x + shift_x, partB.position.y + shift_y, 15,15);
    }
  }
}

function sendkeypoint(keypoint, partIndex) {
   console.log('send')
   oscPort.send({
                address: "/" + keypoint[partIndex] + '/x',
                args: [
                    {
                        type: "f",
                        value: keypoint.position.x
                    }
                  ]
              });
   oscPort.send({
                address: "/" + keypoint[partIndex] + '/y',
                args: [
                    {
                        type: "f",
                        value: keypoint.position.y
                    }
                  ]
              });
}
