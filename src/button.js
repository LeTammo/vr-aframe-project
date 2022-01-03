var scorm = pipwerks.SCORM;
var lmsConnected = false;
  window.onload = function() {
    scorm = pipwerks.SCORM;
    lmsConnected = false;

    initCourse();

}

function setComplete(){

    if(lmsConnected){

       if(scorm.set("cmi.completion_status", "completed") 
            && scorm.set("cmi.success_status", "passed")){
          scorm.quit();
       } else {
          console.log("Error: Course could not be set to complete!");
       }
    } else {
       console.log("Error: Course is not connected to the LMS");
    }
 }
 
 function initCourse(){
 
     lmsConnected = scorm.init();
 
     if(lmsConnected){

         start();
        var completionstatus = scorm.get("cmi.completion_status");

        if(completionstatus == "completed" || completionstatus == "passed"){
            console.log("You have already completed this course. You do not need to continue.");
    
        }
        var learnername = scorm.get("cmi.learner_name");

        if(learnername){
            //...let's display the username in a page element named "learnername"
            // document.getElementById("learnername").innerHTML = learnername; //use the name in the form
        }
     } else {
     console.log("Error: Course could not connect with the LMS");
     }
 }

AFRAME.registerComponent('start-button', {
    init: function () {
      var cube = document.querySelector('a-scene').sceneEl.querySelector("#boxId");
      cube.addEventListener("mousedown", function (evt) {
        cube.setAttribute('material', 'color', '#440000');
        setComplete();
      });
      cube.addEventListener("mouseup", function (evt) {
        cube.setAttribute('material', 'color', '#004400');
      });
      cube.addEventListener("mouseenter", function (evt) {
        cube.setAttribute('material', 'color', "#004400");
      });
      cube.addEventListener("mouseleave", function (evt) {
        cube.setAttribute('material', 'color', "#232323");
      });
    }
  });