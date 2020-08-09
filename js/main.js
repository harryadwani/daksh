'use strict';
//var app = require("express")(); 

// Set up media stream constant and parameters.

// In this codelab, you will be streaming video only: "video: true".
// Audio will not be streamed because it is set to "audio: false" by default.
const localVideo = document.getElementById('localVideo');

const remoteVideo = document.getElementById('remoteVideo');
document.getElementById('remoteVideo').hidden=true;

const video_el = document.getElementById('video_el');
 let chromaToggle=0;
function gsToggle() {
  if(chromaToggle==0) {
    chromaToggle=1;
    computeFrame();
    console.log(chromaToggle);

  }
  else { 
    chromaToggle=0;
    console.log(chromaToggle);
    computeRemoteVideo();
  }
}


 let video,video2,c1,ctx1,c_tmp,ctx_tmp; 

function computeRemoteVideo() {
  c1 = document.getElementById('output-canvas');
  ctx1 = c1.getContext('2d');

  c_tmp = document.createElement('canvas');
  c_tmp.setAttribute('width', 320);
  c_tmp.setAttribute('height',240);
  ctx_tmp = c_tmp.getContext('2d');

ctx_tmp.drawImage(remoteVideo, 0, 0, 320 , 240 );
let frame = ctx_tmp.getImageData(0, 0, 320 , 240 );
  
  ctx1.putImageData(frame, 0, 0 );
  setTimeout(computeRemoteVideo, 0);

}

function computeFrame() {

if(chromaToggle==0)
{
  return;
}
  
  // c1 = document.getElementById('output-canvas');
  //       ctx1 = c1.getContext('2d');

  //  c_tmp = document.createElement('canvas');
  //  c_tmp.setAttribute('width', 320);
  //  c_tmp.setAttribute('height',240);
  //  ctx_tmp = c_tmp.getContext('2d');

ctx_tmp.drawImage(remoteVideo, 0, 0, 320 , 240 );
let frame = ctx_tmp.getImageData(0, 0, 320 , 240 );



for (let i = 0; i < frame.data.length /4; i++) {
let r = frame.data[i * 4 + 0];
let g = frame.data[i * 4 + 1];
let b = frame.data[i * 4 + 2];
let a = frame.data[i * 4 + 3];

var selectedR = 110;
    var        selectedG = 154;
       var     selectedB = 90;
            if (r <= selectedR && g >= selectedG && b >= selectedB) {

// if (r > 70 && r < 160 && g > 95 && g < 220 && b > 25 && b < 150) 
// {  
    frame.data[i * 4 + 0] = 0;
    frame.data[i * 4 + 1] = 0;
    frame.data[i * 4 + 2] = 0;
    //frame.data[i * 4 + 3] = 0;
}
}


for (var y = 0; y < frame.height; y++) {
  for (var x = 0; x < frame.width; x++) {
      var r = frame.data[((frame.width * y) + x) * 4];
      var g = frame.data[((frame.width * y) + x) * 4 + 1];
      var b = frame.data[((frame.width * y) + x) * 4 + 2];
      var a = frame.data[((frame.width * y) + x) * 4 + 3];
      if (frame.data[((frame.width * y) + x) * 4 + 3] != 0) {
          var offsetYup = y - 1;
          var offsetYdown = y + 1;
          var offsetXleft = x - 1;
          var offsetxRight = x + 1;
          var change = false;
          if (offsetYup > 0) {
              if (frame.data[((frame.width * (y - 1)) + (x)) * 4 + 3] == 0) {
                  change = true;
              }
          }
          if (offsetYdown < frame.height) {
              if (frame.data[((frame.width * (y + 1)) + (x)) * 4 + 3] == 0) {
                  change = true;
              }
          }
          if (offsetXleft > -1) {
              if (frame.data[((frame.width * y) + (x - 1)) * 4 + 3] == 0) {
                  change = true;
              }
          }
          if (offsetxRight < frame.width) {
              if (frame.data[((frame.width * y) + (x + 1)) * 4 + 3] == 0) {
                  change = true;
              }
          }
          if (change) {
            var gray = (frame.data[((frame.width * y) + x) * 4 + 0] * .393) + (frame.data[((frame.width * y) + x) * 4 + 1] * .769) + (frame.data[((frame.width * y) + x) * 4 + 2] * .189);
            frame.data[((frame.width * y) + x) * 4] = (gray * 0.2) + (imgBackgroundData.data[((frame.width * y) + x) * 4] * 0.9);
            frame.data[((frame.width * y) + x) * 4 + 1] = (gray * 0.2) + (imgBackgroundData.data[((frame.width * y) + x) * 4 + 1] * 0.9);
            frame.data[((frame.width * y) + x) * 4 + 2] = (gray * 0.2) + (imgBackgroundData.data[((frame.width * y) + x) * 4 + 2] * 0.9);
            frame.data[((frame.width * y) + x) * 4 + 3] = 255;
        }
      }
  }
}

ctx1.putImageData(frame, 0, 0);
setTimeout(computeFrame, 0);
}



const mediaStreamConstraints = {
  video: true,
  audio:true
}

// Set up to exchange only video.
const offerOptions = {
  offerToReceiveVideo: 1,
};

// Define initial start time of the call (defined as connection between peers).
let startTime = null;

// Define peer connections, streams and video elements.
                    
                    //  ctx_tmp = remoteVideo.getContext('2d');


let localStream;
let remoteStream;

let localPeerConnection;
let remotePeerConnection;



// Define MediaStreams callbacks.

// Sets the MediaStream as the video element src.
function gotLocalMediaStream(mediaStream) {
  localVideo.srcObject = mediaStream;
  localStream = mediaStream;
  trace('Received local stream.');
  callButton.disabled = false;  // Enable call button.
}

// Handles error by logging a message to the console.
function handleLocalMediaStreamError(error) {
  trace(`navigator.getUserMedia error: ${error.toString()}.`);
}

// Handles remote MediaStream success by adding it as the remoteVideo src.
function gotRemoteMediaStream(event) {
  const mediaStream = event.stream;
  remoteVideo.srcObject = mediaStream;
  remoteStream = mediaStream;
  trace('Remote peer connection received remote stream.');
}


// Add behavior for video streams.

// Logs a message with the id and size of a video element.
function logVideoLoaded(event) {
  const video = event.target;
  trace(`${video.id} videoWidth: ${video.videoWidth}px, ` +
        `videoHeight: ${video.videoHeight}px.`);
}

// Logs a message with the id and size of a video element.
// This event is fired when video begins streaming.
function logResizedVideo(event) {
  logVideoLoaded(event);

  if (startTime) {
    const elapsedTime = window.performance.now() - startTime;
    startTime = null;
    trace(`Setup time: ${elapsedTime.toFixed(3)}ms.`);
  }
}

localVideo.addEventListener('loadedmetadata', logVideoLoaded);
 remoteVideo.addEventListener('loadedmetadata', logVideoLoaded);
 remoteVideo.addEventListener('onresize', logResizedVideo);


// Define RTC peer connection behavior.

// Connects with new peer candidate.
function handleConnection(event) {
  const peerConnection = event.target;
  const iceCandidate = event.candidate;

  if (iceCandidate) {
    const newIceCandidate = new RTCIceCandidate(iceCandidate);
    const otherPeer = getOtherPeer(peerConnection);

    otherPeer.addIceCandidate(newIceCandidate)
      .then(() => {
        handleConnectionSuccess(peerConnection);
      }).catch((error) => {
        handleConnectionFailure(peerConnection, error);
      });

    trace(`${getPeerName(peerConnection)} ICE candidate:\n` +
          `${event.candidate.candidate}.`);
  }
}

// Logs that the connection succeeded.
function handleConnectionSuccess(peerConnection) {
  trace(`${getPeerName(peerConnection)} addIceCandidate success.`);
};

// Logs that the connection failed.
function handleConnectionFailure(peerConnection, error) {
  trace(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
        `${error.toString()}.`);
}

// Logs changes to the connection state.
function handleConnectionChange(event) {
  const peerConnection = event.target;
  console.log('ICE state change event: ', event);
  trace(`${getPeerName(peerConnection)} ICE state: ` +
        `${peerConnection.iceConnectionState}.`);
}

// Logs error when setting session description fails.
function setSessionDescriptionError(error) {
  trace(`Failed to create session description: ${error.toString()}.`);
}

// Logs success when setting session description.
function setDescriptionSuccess(peerConnection, functionName) {
  const peerName = getPeerName(peerConnection);
  trace(`${peerName} ${functionName} complete.`);
}

// Logs success when localDescription is set.
function setLocalDescriptionSuccess(peerConnection) {
  setDescriptionSuccess(peerConnection, 'setLocalDescription');
}

// Logs success when remoteDescription is set.
function setRemoteDescriptionSuccess(peerConnection) {
  setDescriptionSuccess(peerConnection, 'setRemoteDescription');
}

// Logs offer creation and sets peer connection session descriptions.
function createdOffer(description) {
  trace(`Offer from localPeerConnection:\n${description.sdp}`);

  trace('localPeerConnection setLocalDescription start.');
  localPeerConnection.setLocalDescription(description)
    .then(() => {
      setLocalDescriptionSuccess(localPeerConnection);
    }).catch(setSessionDescriptionError);

  trace('remotePeerConnection setRemoteDescription start.');
  remotePeerConnection.setRemoteDescription(description)
    .then(() => {
      setRemoteDescriptionSuccess(remotePeerConnection);
    }).catch(setSessionDescriptionError);

  trace('remotePeerConnection createAnswer start.');
  remotePeerConnection.createAnswer()
    .then(createdAnswer)
    .catch(setSessionDescriptionError);
}

// Logs answer to offer creation and sets peer connection session descriptions.
function createdAnswer(description) {
  trace(`Answer from remotePeerConnection:\n${description.sdp}.`);

  trace('remotePeerConnection setLocalDescription start.');
  remotePeerConnection.setLocalDescription(description)
    .then(() => {
      setLocalDescriptionSuccess(remotePeerConnection);
    }).catch(setSessionDescriptionError);

  trace('localPeerConnection setRemoteDescription start.');
  localPeerConnection.setRemoteDescription(description)
    .then(() => {
      setRemoteDescriptionSuccess(localPeerConnection);
    }).catch(setSessionDescriptionError);
}


// Define and add behavior to buttons.

// Define action buttons.
                    const startButton = document.getElementById('startButton');
                    const callButton = document.getElementById('callButton');
                    const hangupButton = document.getElementById('hangupButton');
                    const unmuteC1 = document.getElementById('unmuteC1Button');
                    const muteC1 = document.getElementById('muteC1Button');
                     const unmuteC2 = document.getElementById('unmuteC2Button');
                     const muteC2 = document.getElementById('muteC2Button');
                    const gsButton = document.getElementById('gs');
                    const videoToggleButton1=document.getElementById('videoToggleButton1');
                    const videoToggleButton2=document.getElementById('videoToggleButton2');





// Set up initial action buttons status: disable call and hangup.
callButton.disabled = true;
hangupButton.disabled = true;


// Handles start button action: creates local MediaStream.
function startAction() {
  startButton.disabled = true;
  navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
    .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
  trace('Requesting local stream.');
}

// Handles call button action: creates peer connection.
function callAction() {
  //computeFrame();
  //console.log('chroma key'+chromaToggle);
  // if(chromaToggle==1)
    computeRemoteVideo();
  // else
  //  computeFrame();
  callButton.disabled = true;
  hangupButton.disabled = false;

  trace('Starting call.');
  startTime = window.performance.now();

  // Get local media stream tracks.
  const videoTracks = localStream.getVideoTracks();
  const audioTracks = localStream.getAudioTracks();
  if (videoTracks.length > 0) {
    trace(`Using video device: ${videoTracks[0].label}.`);
  }
  if (audioTracks.length > 0) {
    trace(`Using audio device: ${audioTracks[0].label}.`);
  }

  const servers = null;  // Allows for RTC server configuration.

  // Create peer connections and add behavior.
  localPeerConnection = new RTCPeerConnection(servers);
  trace('Created local peer connection object localPeerConnection.');

  localPeerConnection.addEventListener('icecandidate', handleConnection);
  localPeerConnection.addEventListener(
    'iceconnectionstatechange', handleConnectionChange);

  remotePeerConnection = new RTCPeerConnection(servers);
  trace('Created remote peer connection object remotePeerConnection.');

  remotePeerConnection.addEventListener('icecandidate', handleConnection);
  remotePeerConnection.addEventListener(
    'iceconnectionstatechange', handleConnectionChange);
  remotePeerConnection.addEventListener('addstream', gotRemoteMediaStream);

  // Add local stream to connection and create offer to connect.
  localPeerConnection.addStream(localStream);
  trace('Added local stream to localPeerConnection.');

  trace('localPeerConnection createOffer start.');
  localPeerConnection.createOffer(offerOptions)
    .then(createdOffer).catch(setSessionDescriptionError);
}

// Handles hangup action: ends up call, closes connections and resets peers.
function hangupAction() {
remoteStream.getVideoTracks()[0].stop();
  localPeerConnection.close();
  remotePeerConnection.close();
  localPeerConnection = null;
  remotePeerConnection = null;
  hangupButton.disabled = true;
  callButton.disabled = false;
  trace('Ending call.');
}


function screenShareAction() {
  let displayMediaOptions = {video: true, audio: false};
  navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
  .then(function(stream){
    video_el.srcObject = stream;
  })
}

function unmuteC1Action() {
  localStream.getAudioTracks()[0].enabled = true;
}

function muteC1Action() {
  localStream.getAudioTracks()[0].enabled = false;
}

function unmuteC2Action() {
  remoteStream.getAudioTracks()[0].enabled = true;
}

function muteC2Action() {
  remoteStream.getAudioTracks()[0].enabled = false;
}
let vdoToggle1=0;
let vdoToggle2=0;

function videoToggle1() {
  if(vdoToggle1==0) {
  localStream.getVideoTracks()[0].enabled=false;
  vdoToggle1=1;
  }
  else {
    localStream.getVideoTracks()[0].enabled=true;
  vdoToggle1=0;
  }
}

function videoToggle2() {
  if(vdoToggle2==0) {
  remoteStream.getVideoTracks()[0].enabled=false;
  vdoToggle2=1;
  }
  else {
    remoteStream.getVideoTracks()[0].enabled=true;
  vdoToggle2=0;
  }
}


// Add click event handlers for buttons.
startButton.addEventListener('click', startAction);
callButton.addEventListener('click', callAction);
hangupButton.addEventListener('click', hangupAction);
screenShareButton.addEventListener('click',screenShareAction);
unmuteC1.addEventListener('click',unmuteC1Action);
muteC1.addEventListener('click',muteC1Action);
 unmuteC2.addEventListener('click',unmuteC2Action);
 muteC2.addEventListener('click',muteC2Action);
gsButton.addEventListener('click',gsToggle);
videoToggleButton1.addEventListener('click',videoToggle1);
videoToggleButton2.addEventListener('click',videoToggle2);

//ngsButton.addEventListener('click',callAction);






// Define helper functions.

// Gets the "other" peer connection.
function getOtherPeer(peerConnection) {
  return (peerConnection === localPeerConnection) ?
      remotePeerConnection : localPeerConnection;
}

// Gets the name of a certain peer connection.
function getPeerName(peerConnection) {
  return (peerConnection === localPeerConnection) ?
      'localPeerConnection' : 'remotePeerConnection';
}

// Logs an action (text) and the time when it happened on the console.
function trace(text) {
  text = text.trim();
  const now = (window.performance.now() / 1000).toFixed(3);

  console.log(now, text);
}


//app.listen(8080, () => { console.log("Server online on http://localhost:8080"); });
