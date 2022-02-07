
AFRAME.registerComponent('button-plane', {

  init: function () {
    
    var pauseButton = document.querySelector("#pauseButton");
    var addPointButton = document.querySelector("#getName");
    var exitButton = document.querySelector("#exitButton");
    let buttons = [pauseButton, addPointButton, exitButton];
    
    pauseButton.addEventListener("mousedown", function (event) {
      pauseButton.setAttribute('material', 'color', '#440000');
      getTime();
      console.log("Spiel pausiert")
    });
    addPointButton.addEventListener("mousedown", function (event) {
      addPointButton.setAttribute('material', 'color', '#440000');
      getUsername();
    });
    exitButton.addEventListener("mousedown", function (event) {
      exitButton.setAttribute('material', 'color', '#440000');
      setComplete();
    });

    buttons.forEach(button => {
      button.addEventListener("mouseup", function (event) {
        button.setAttribute('material', 'color', '#004400');
      });
      button.addEventListener("mouseenter", function (event) {
        button.setAttribute('material', 'color', "#004400");
      });
      button.addEventListener("mouseleave", function (event) {
        button.setAttribute('material', 'color', "#2F2F2F");
      });
    });

  }
});

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


AFRAME.registerComponent('cone', {
  init: function() {

    this.geometry = new THREE.ConeGeometry(1, 1, 3)
    this.material = new THREE.MeshStandardMaterial({color: '#572323'});
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.el.setObject3D('mesh', this.mesh);
  }
});


AFRAME.registerComponent('player-monitor', { // If you haven't read about how make your own components/attributes in A-Frame, take a look at the documentation. (Note: Here I'm back to talking about "components" as ATTRIBUTES. It's a bit confusing!)

  tick: function(){ // A tick is a single redraw of the entire scene.  Tick functions are called 90 times every second. (In other words: the rate at which A-Frame redraws everything.)  If you need a variable to be constantly updated, then you need to add at least one tick function to your scene's script.
     rotationOfPlayerOnYAxisInRadians = this.el.object3D.rotation.y; //This is how we access the rotation of an object along an axis.  Since I attached this component/attribute to the player, I can use "this.el...".

     firstComponentOfPlayerRotation = Math.sin(rotationOfPlayerOnYAxisInRadians); //x-Richtung
     secondComponentOfPlayerRotation = Math.cos(rotationOfPlayerOnYAxisInRadians); //z-Richtung
     thirdComponentOfPlayerRotation = Math.sin(this.el.object3D.rotation.x); //y-Richtung

     playerXposition = this.el.object3D.position.x;
     playerYposition = this.el.object3D.position.y; // We use these variables to access the player's position;
     playerZposition = this.el.object3D.position.z;
  }
});

AFRAME.registerComponent("ball", {
  init: function() {
      // wait until the physics engine is ready
      this.el.addEventListener("body-loaded", e => {
        // cache the ammo-body component
        this.ammoComponent = this.el.components["ammo-body"];
        this.zeroSpeed = new Ammo.btVector3(0, 0, 0);
      });

      this.el.addEventListener("mousedown",function(evt){
          holding = this;
      });
      this.el.addEventListener("mouseup",function(evt){
          const FACTOR = 15;
          var Xpush = firstComponentOfPlayerRotation * -FACTOR;
          var Zpush = secondComponentOfPlayerRotation * -FACTOR;
          var Ypush = thirdComponentOfPlayerRotation * FACTOR;

          if (Ammo.asm.$) { 
              const velocity = new Ammo.btVector3(Xpush, Ypush, Zpush);
              document.getElementById(this.id).body.setLinearVelocity(velocity);
              Ammo.destroy(velocity);
              throwing = true;
          }
          holding = null;
      });
    }

    ,
  tick: function() {
    // wait for the physics 
    if (!this.ammoComponent) return;
    
    // restore stuff if the "teleport magic" has been done in the last renderloop.
    // this should probably be done in steps instead of tick
    if (this.collisionFlag === 2) {
      // this just tells us that we reverted to normal
      this.collisionFlag = 0;
      // restore the original collision flags
      this.ammoComponent.updateCollisionFlags();
      // reset the speed, or the body will bounce away
      if(!throwing){
          this.ammoComponent.body.setLinearVelocity(this.zeroSpeed);
      }
    }
 
    if (holding === this.el) {
      throwing = false;
      this.el.object3D.position.x = playerXposition - firstComponentOfPlayerRotation
      this.el.object3D.position.y = playerYposition + thirdComponentOfPlayerRotation
      this.el.object3D.position.z = playerZposition - secondComponentOfPlayerRotation

      // set the THREEJS position.y
      //this.el.object3D.position.y = 2;
      // change the collision flag to the KINEMATIC_BODY
      this.collisionFlag = 2;
      // apply the flag
      this.ammoComponent.body.setCollisionFlags(this.collisionFlag);
      // sync the physisc transforms to the THREEJS transform
      this.ammoComponent.syncToPhysics();

    }
  }
});