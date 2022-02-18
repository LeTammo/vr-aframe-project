
AFRAME.registerComponent('complete-course', {
  init: function () {
    var cube = document.querySelector("#box");
    
    cube.addEventListener("mousedown", () => {
      setComplete();
    });
  }
});