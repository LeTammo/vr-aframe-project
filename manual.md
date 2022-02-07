# How to use SCORM with Aframe

## Aframe Example

```html
<html>
  <head> 
    <!-- ... -->
  </head>
  <body>
    <a-scene>
      <!-- ... -->

      <a-box id="buttonPlane" position="0 2 -4" width="10" height="4" depth="0.4" color="#232323">
        
        <a-box id="pauseButton" position="-2 0 0.2" width="0.8" height="0.4" depth="0.1" color="#2F2F2F">
          <a-entity text="value: Pause Game; zOffset: 0.06; align: center; wrapCount: 20"></a-entity>
          <a-entity a-ttimer position="-12 0 -5" id="a-ttimer"></a-entity>
        </a-box>
        <a-box id="getName" position="0 0 0.2" width="0.8" height="0.4" depth="0.1" color="#2F2F2F">
          <a-entity text="value: GetName; zOffset: 0.06; align: center; wrapCount: 20"></a-entity>
        </a-box>
        <a-box id="exitButton" position="2 0 0.2" width="0.8" height="0.4" depth="0.1" color="#2F2F2F">
          <a-entity text="value: Stop Exercise; zOffset: 0.06; align: center; wrapCount: 20"></a-entity>
        </a-box>
      </a-box>

      <a-box id="boxId" position="4 0.5 -3" rotation="0 45 0" color="#232323"
              src="#wood"></a-box>
      
      <!--
        <a-camera look-controls-enabled wasd-controls-enabled position="0 0 3"></a-camera> 
      -->

      <a-camera position="0 1.6 3" look-controls="pointerLockEnabled: true;">
        <a-entity 
          cursor="fuse: false" 
          position="0 0 -1" 
          geometry="primitive:ring; radiusInner: 0.005; radiusOuter: 0.01"  
          material="color: grey; shader: flat"></a-ring>
      </a-camera>

      <a-scene button-plane position="1 1 1"></a-scene>
    </a-scene>
  </body>
</html>
```