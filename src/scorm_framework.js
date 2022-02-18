let throttleTimer;
const throttledScormSave = (time) => {
    if (throttleTimer) return;
    throttleTimer = true;
    setTimeout(() => {
        scorm.save();
        throttleTimer = false;
    }, time);
}

let scorm;
let lmsConnected = false;

window.onload = function () {
    scorm = pipwerks.SCORM;

    lmsConnected = scorm.init();
    if (lmsConnected) {
        let completionStatus = scorm.get("cmi.completion_status");
        if (completionStatus === "completed" || completionStatus === "passed") {
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

    if (lmsConnected) {
        func();
        throttledScormSave(2000);
    } else {
        console.log("Error: Course is not connected to the LMS");
    }
}

/**
 * sets the exercise as completed
 */
function setComplete() {

    onLmsConnected(() => {
        if (scorm.set("cmi.completion_status", "completed") && scorm.set("cmi.success_status", "passed")) {
            scorm.quit();
        } else {
            console.log("Error: Course could not be set to complete!");
        }
    })
}

/**
 * returns the name of the user
 * @returns {string} 
 */
function getLearnerName() {

    return onLmsConnected(() => {
        return scorm.get("cmi.learner_name");
    })
}

/**
 * adds an objective
 * @param {string} name 
 */
function addObjective(name) {

    onLmsConnected(() => {
        let i = scorm.get("cmi.objectives._count");
        scorm.set("cmi.objectives." + i + ".id", name);
        scorm.set("cmi.objectives." + i + ".completion_status", 'incomplete');
        scorm.set("cmi.objectives._count", i + 1);
    })
}

/**
 * sets the objective as passed and checks if all objects are completed
 * @param {string} name 
 */
function setObjectivePassed(name) {
    setObjectiveStatus(name, 'passed')
}

/**
 * sets the objective as failed and checks if all objects are completed
 * @param {string} name 
 */
function setObjectiveFailed(name) {
    setObjectiveStatus(name, 'failed')
}

/**
 * helper function to set an objective status
 * @param {string} name 
 * @param {string} status 
 */
function setObjectiveStatus(name, status) {

    onLmsConnected(() => {
        let everythingCompleted = true;

        for (let i = 0; i < scorm.get("cmi.objectives._count"); i++) {
            if (scorm.get("cmi.objectives." + i + ".id") === name) {
                scorm.set("cmi.objectives." + i + ".success_status", status);
                scorm.set("cmi.objectives." + i + ".completion_status", 'completed');
            }

            if (scorm.get("cmi.objectives." + i + ".completion_status") !== 'completed') {
                everythingCompleted = false;
            }
        }

        if (everythingCompleted) {
            setComplete();
        }
    })
}

/**
 * returns the status of the objective
 * @param {string} name The unique name of the objective
 * @returns {boolean} True if the objective is passed, false else
 */
function isObjectivePassed(name) {

    onLmsConnected(() => {
        let currentId, isCompleted;

        for (let i = 0; i < scorm.get("cmi.objectives._count"); i++) {
            currentId = scorm.get("cmi.objectives." + i + ".id");
            if (currentId !== name) {
                continue;
            }
            
            isCompleted = scorm.get("cmi.objectives." + i + ".completion_status") === 'completed';
            if (!isCompleted) {
                throw new Error('Success is not tracked because the objective is not completed.');
            }
            
            return scorm.set("cmi.objectives." + i + ".success_status") === 'passed';
        }
    })
}

/**
 * adds a comment, usually used to store comments by the user
 * @param {string} text 
 */
function addComment(text) {

    onLmsConnected(() => {
        let i = scorm.get("cmi.comments_from_learner._count");
        scorm.set("cmi.comments_from_learner." + i + ".comment", text);
        scorm.set("cmi.comments_from_learner._count", i + 1);
    })
}

/**
 * persists data string to specific key 
 * @param {string} key 
 * @param {string} data 
 */
function addCustomData(key, data) {

    onLmsConnected(() => {
        let jsonData = JSON.parse(scorm.get("cmi.suspend_data"));
        jsonData[key] = data;
        scorm.set("cmi.suspend_data", JSON.stringify(jsonData))
    })
}

/**
 * returns the json data for a specific key
 * @param {string} key 
 * @returns {string}
 */
function getCustomData(key) {

    onLmsConnected(() => {
        let jsonData = JSON.parse(scorm.get("cmi.suspend_data"));
        return jsonData.key;
    })
}

/**
 * sets the passed time
 * @param {number} time 
 */
function setTime(time) {

    onLmsConnected(() => {
        scorm.set("cmi.total_time", time);
    })
}

/**
 * returns the passed time
 * @returns {number}
 */
function getTime() {

    onLmsConnected(() => {
        return scorm.get("cmi.total_time");
    })
}

/**
 * Timer
 */
function startTimer(maxDuration, elementId) {

    if (lmsConnected) {
        console.log(scorm.get("cmi.suspend_data"));
        let trackedTime = parseInt(scorm.get("cmi.suspend_data")) || 0;

        window.addEventListener('beforeunload', function (event) {
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

        scorm.set("cmi.session_time", centisecsToISODuration(trackedTime * 100));
        scorm.set("cmi.suspend_data", trackedTime);

        scorm.save();
    }

    function centisecsToISODuration(n) {
        n = Math.max(n, 0);
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
        var nMin = Math.floor(nCs / 6000);
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