
var scorm = pipwerks.SCORM;
var lmsConnected = false;

window.onload = function() {
  scorm = pipwerks.SCORM;
  
  lmsConnected = scorm.init();

  if(lmsConnected){
    var completionstatus = scorm.get("cmi.completion_status");

    if(completionstatus == "completed" || completionstatus == "passed"){
        console.log("You have already completed this course. You do not need to continue.");
    }
  } else {
    console.log("Error: Course could not connect with the LMS");
  }
}

/**
 * Basic function to check if the lms is connected;
 * Should be called everytime when interacting with the scorm object
 */
function onLmsConnected(func) {
  if(lmsConnected){
    func();
  } else {
    console.log("Error: Course is not connected to the LMS");

  }
}

/**
 * sets the exercise as completed
 */
function setComplete() {

  onLmsConnected(() => {
    if(scorm.set("cmi.completion_status", "completed") 
        && scorm.set("cmi.success_status", "passed")){
      scorm.quit();
    } else {
      console.log("Error: Course could not be set to complete!");
    }
  })
}

/**
 * returns the name of the user
 */
function getUsername() {

  onLmsConnected(() => {
    var learnername = scorm.get("cmi.learner_name");
    console.log(learnername)
  })
}

/**
 * returns the passed time
 */
function getTime() {

  onLmsConnected(() => {
    scorm.get("cmi.total_time");
  })
}

/**
 * sets the passed time
 */
function setTime() {

  onLmsConnected(() => {
    scorm.set("cmi.total_time", 0);
  })
}

/**
 * saves json data to db
 */
function saveData() {

  onLmsConnected(() => {
    scorm.get("");
  })
}

/**
 * returns json data
 */
function getSaveData() {

  onLmsConnected(() => {
    scorm.get("");
  })
}

/**
 * Timer
 */
function startTimer(maxDuration, elementId) {

    if(lmsConnected){
        console.log(scorm.get("cmi.suspend_data"));
        var trackedTime = parseInt(scorm.get("cmi.suspend_data")) || 0;
        
        window.addEventListener('beforeunload', function(event) {
            track();
        });

        let timerInterval = window.setInterval(function () {
            track();
        }, 1000);

        let saveInterval = window.setInterval(function () {
            console.log("saving data")
            save();
        }, 3000);

        function track() {
            trackedTime = parseInt(trackedTime) + 1;

            timer = document.querySelector('a-scene').sceneEl.querySelector("#" + elementId);
            timer.setAttribute('text', 'value', trackedTime);

            if (trackedTime > maxDuration) {
                window.clearInterval(timerInterval);
                window.clearInterval(saveInterval);
                save();
            }
        }
    } else {
        console.log("Error: Course is not connected to the LMS");
    }

    function save() {

        scorm.set("cmi.session_time", centisecsToISODuration(trackedTime*100));
        scorm.set("cmi.suspend_data", trackedTime);

        scorm.save();
    }

    function centisecsToISODuration(n) {
        n = Math.max(n,0);
        var str = "P";
        var nCs = n;
        var nY = Math.floor(nCs / 3155760000);
        nCs -= nY * 3155760000;
        var nM = Math.floor(nCs / 262980000);
        nCs -= nM * 262980000;
        var nD = Math.floor(nCs / 8640000);
        nCs -= nD * 8640000;
        var nH = Math.floor(nCs / 360000);
        nCs -= nH * 360000;
        var nMin = Math.floor(nCs /6000);
        nCs -= nMin * 6000
        if (nY > 0) str += nY + "Y";
        if (nM > 0) str += nM + "M";
        if (nD > 0) str += nD + "D";
        if ((nH > 0) || (nMin > 0) || (nCs > 0)) {
            str += "T";
            if (nH > 0) str += nH + "H";
            if (nMin > 0) str += nMin + "M";
            if (nCs > 0) str += (nCs / 100) + "S";
        }
        if (str == "P") str = "PT0H0M0S";
            return str;
    }
}

startTimer(60, 'timer');