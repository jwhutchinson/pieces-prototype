import appConfig from "../config.js"

const waitingHolder = document.getElementById("waiting-holder");
const waitingVideo = document.getElementById("waiting-video");

const tapButton = document.getElementById("tap-button");
const tapBox = document.getElementById("tap-box");
const goTapPrompt = document.getElementById("go-tap-prompt");

const opinionForm = document.getElementById("opinion-form");
const likertHolder = document.getElementById("likert-holder");
const shakeHolder = document.getElementById("shake-holder");
const tapHolder = document.getElementById("tap-holder");
const micHolder = document.getElementById("mic-holder");

const responseField = document.getElementById("response-field");
const submitTextButton = document.getElementById("submit-text-button");
const currentCount = document.getElementById("current-count");

const elapsedMessage = document.getElementById("elapsed-message");
const pauseButton = document.getElementById("pause-button")
const pauseLabel = document.getElementById("pause-label");
const recordButton = document.getElementById("record-button");
const deleteButton = document.getElementById("delete-button");
const deleteLabel = document.getElementById("delete-label");
const submitRecordingButton = document.getElementById("submit-recording");

const shakeButton = document.getElementById("shake-button");
const shakePrompt = document.getElementById("go-shake-prompt");

const submitLikertButton = document.getElementById("submit-likert-button");

const answeredMessage = document.getElementById("answered-message");
  
const params = new URLSearchParams(document.location.search);
const token = params.get("token");

const ID = document.getElementById("snippet-id").value;
const responseType = document.getElementById("response-type").value;
const readTime = parseInt(document.getElementById("read-time").value);

const collapsibles = document.getElementsByClassName("collapsible");

const waitAddonTime = 10000;
const maxReadTime = 65;

let tapCount = 0;
let recordingSeconds = 0;
let timerInterval = null;
let likertValue = null;
let waitingTime = 34000;

waitingVideo.play();

scrollTo(0, document.getElementById("snippet-label").getBoundingClientRect().top + window.scrollY);

for (let i = 0; i < collapsibles.length; i++) {
  collapsibles[i].addEventListener("click", function() {
    let content = this.nextElementSibling;
    let arrow = this.querySelector(".arrow");

    if (arrow.classList.contains("down-arrow")) {
      arrow.classList.remove("down-arrow");
      arrow.classList.add("up-arrow");
    }
    else {
      arrow.classList.remove("up-arrow");
      arrow.classList.add("down-arrow");
    }

    this.classList.toggle("active");
    
    content.classList.toggle("open");

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    }
    else {
      content.style.maxHeight = content.scrollHeight + 20 + "px";
    } 
  });
}

window.addEventListener("resize", () => {
  for (let i = 0; i < collapsibles.length; i++) {
    if (collapsibles[i].classList.contains("active")) {
	    let content = collapsibles[i].nextElementSibling;
      content.style.maxHeight = content.scrollHeight + 20 + "px";
	  }
  }
});

document.addEventListener("DOMContentLoaded", function(event) {
   document.querySelectorAll('img').forEach(function(img){
  	img.onerror = function(){this.style.display='none';};
   })
});

if (token) {
  localStorage.setItem("auth", token);
  authWarn();
}

if (!isNaN(readTime)) {
  if (readTime > 0 && readTime <= maxReadTime) {
    waitingTime = 1000 * readTime + waitAddonTime;
  }
}

async function authWarn() {
  const userAuth = localStorage.getItem("auth");
  const endpoint = new URL("me", appConfig.serverURL);
  const res = await fetch(endpoint, {
    headers: {
      "authorization": `bearer ${userAuth}` 
    }
  })

  if (!res.ok) {
    alert("The login information is invalid. Please use your login link again or get in touch if you still can't log in.");
    window.location.replace("/");
  }
}

function countCharacters() {
  currentCount.innerHTML = responseField.value.length;

  if (responseField.value.length == 0 || responseField.value.length > 300) {
    submitTextButton.disabled = true;
  }
  else {
    submitTextButton.disabled = false;
  }
}

async function doOnSubmit(event) {
  if (event) {
    event.preventDefault();
  }

  const topicName = document.getElementById("topic-name").value;
  const snippetName = document.getElementById("snippet-name").value;

  let responseContent = responseField.value;

  switch(responseType) {
    case "likert":
      responseContent = likertValue;
      break;
    case "shake":
      responseContent = "Shake";
      break;
    case "tap":
      responseContent = tapCount;
      break;
    case "mic":
      responseContent = recordingSeconds;
      break;
    default: // Text
      responseContent = responseField.value;
  }

  const submission = { "id": ID, "topic": topicName, "snippet": snippetName, "response": responseContent.toString() };
  const endpoint = new URL("responses", appConfig.serverURL);

  const res = await fetch(endpoint, {
    method:"POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth")}`
    },
    body: JSON.stringify(submission)
  });

  if (!res.ok) {
    alert("Unable to send your response right now. Please try again and contact me if the problem continues at j.hutchinson4@newcastle.ac.uk");
  }

  window.location.replace("/");
}

function boxTapped() {
  tapCount++;
}

function startTapping() {
  tapButton.style.display = "none";
  goTapPrompt.style.display = "block";

  tapBox.addEventListener("touchstart", boxTapped);
  setTimeout(stopTapping, 10000);
}

function stopTapping() {
  const stopTapPrompt = document.getElementById("stop-tap-prompt");
  tapBox.style.display = "none";
  stopTapPrompt.style.display = "block";

  setTimeout(doOnSubmit, 4000);
}

function doRecording() {
  if (timerInterval == null) {
    timerInterval = setInterval(() => {
      if (recordingSeconds < 60) {
        recordingSeconds += 1;
        elapsedMessage.innerHTML = recordingSeconds;

        if (recordingSeconds == 0) {
          submitRecordingButton.disabled = true;
          deleteButton.disabled = true;
          deleteLabel.style.color = "var(--disabled-button-color)";
        }
        else {
          submitRecordingButton.disabled = false;
          deleteButton.disabled = false;
          deleteLabel.style.color = "black";
        }
      }
      else {
        clearInterval(timerInterval); 
        pauseButton.disabled = true;
        pauseLabel.style.color = "var(--disabled-button-color)";
        recordButton.disabled = true;
        
        doPause();
      }
    }, 1000);

    recordButton.classList.remove("white-button");
    recordButton.classList.add("coloured-button");
    pauseButton.classList.remove("coloured-button");
    pauseButton.classList.add("white-button");
  }
}

function doPause() {
  if (timerInterval != null) {
    clearInterval(timerInterval);
    timerInterval = null;

    pauseButton.classList.remove("white-button");
    pauseButton.classList.add("coloured-button");
    recordButton.classList.remove("coloured-button");
    recordButton.classList.add("white-button");
  }
  else {
    doRecording();
  }
}

function doDelete() {
  pauseButton.classList.remove("white-button");
  pauseButton.classList.add("coloured-button");
  recordButton.classList.remove("coloured-button");
  recordButton.classList.add("white-button");

  clearInterval(timerInterval);
  timerInterval = null;

  recordingSeconds = 0;
  elapsedMessage.innerHTML = recordingSeconds;

  pauseButton.disabled = false;
  pauseLabel.style.color = "black";

  recordButton.disabled = false;
  submitRecordingButton.disabled = true;

  deleteButton.disabled = true;
  deleteLabel.style.color = "var(--disabled-button-color)";
}

function activateLikert() {
  likertHolder.style.display = "block";

  let likertButtons = document.querySelectorAll("input[name=\"likert\"]");

  likertButtons.forEach(function(likertButton) {
    likertButton.addEventListener("change", function() {
      likertValue = document.querySelector('input[name="likert"]:checked').value;

      submitLikertButton.addEventListener("click", doOnSubmit);
      submitLikertButton.disabled = false;
    })
  });
}

function startShaking() {
  shakePrompt.style.display = "inline";
  shakeButton.style.display = "none";

  setTimeout(doOnSubmit, 10000);
}

function activateShake() {
  shakeHolder.style.display = "flex";

  shakeButton.addEventListener("click", startShaking);
}

function activateTap() {
  tapHolder.style.display = "block";
  tapButton.addEventListener("click", startTapping); 
}

function getLocalAudioStream() {
  navigator.mediaDevices
    .getUserMedia({ video: false, audio: true })
    .then((stream) => {
      window.localStream = stream;
      window.localAudio.srcObject = stream;
      window.localAudio.autoplay = true;
    })
    .catch((err) => {
    });
}

function activateMic() {
  pauseButton.addEventListener("click", doPause);
  recordButton.addEventListener("click", doRecording);
  deleteButton.addEventListener("click", doDelete);

  waitingHolder.style.display = "none";
  waitingVideo.pause();

  micHolder.style.display = "flex";
  getLocalAudioStream();
  submitRecordingButton.addEventListener("click", doOnSubmit);
}

function activateText() {
  responseField.disabled = false;
  responseField.addEventListener("keyup", countCharacters);
  opinionForm.style.display = "inline";
  opinionForm.addEventListener("submit", doOnSubmit);
}

function activateInput() {
  switch(responseType) {
    case "likert":
      activateLikert();
      break;
    case "shake":
      activateShake();
      break;
    case "tap":
      activateTap();
      break;
    case "mic":
      activateMic();
      break;
    default: // Text
      activateText();
  }

  waitingHolder.style.display = "none";
  waitingVideo.pause();
}

async function checkAnswered() {
  let answered = false;
  let answer = "";

  const userAuth = localStorage.getItem("auth");
  const endpoint = new URL("responses", appConfig.serverURL);
  const responses = await fetch(endpoint, {
    method:"GET",
    headers: {
      Authorization: `Bearer ${userAuth}`
    }
  });

  const value = await responses.json();

  for (var i = 0; i < value.length; i++) {
    if (value[i].token === userAuth) {
      if (value[i].data.id === ID) {
        answered = true;
        answer = value[i].data.response;
        break;
      }
    }
  }

  if (answered === true) {
    const goHomeLink = document.getElementById("go-home-link");

    goHomeLink.style.display = "flex";
    waitingHolder.style.display = "none";
    answeredMessage.style.display = "block";
 
    switch(responseType) {
      case "likert":
        let likertButtons = document.querySelectorAll("input[name=\"likert\"]");

        likertButtons.forEach(function(likertButton) {
          if (likertButton.value === answer) {
            likertButton.checked = true;
            likertButton.nextElementSibling.style.fontWeight = "bold";
          }
          likertButton.disabled = true;
        });
        
        likertHolder.style.display = "block";
        submitLikertButton.style.display = "none";
        break;
      case "shake":
        break;
      case "tap":
        break;
      case "mic":
        const micAnsweredMessage = document.getElementById("mic-answered-message");
        const answeredSeconds = document.getElementById("answered-seconds");

        micAnsweredMessage.style.display = "block";
        answeredSeconds.innerHTML = answer;
        break;
      default: // Text
        responseField.innerHTML = answer;
        currentCount.innerHTML = responseField.value.length;
        submitTextButton.style.display = "none";
        opinionForm.style.display = "inline";
    }
  }
  else {
    waitingHolder.style.display = "block";

    setTimeout(activateInput, waitingTime);
  }
}

checkAnswered();