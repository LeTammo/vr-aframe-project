# How to use Scorm with AFrame

This project aims to simplify the usage of Scorm via a easy to use structure. It provides an API ready to use in AFrame (and other JavaScript libraries), as well as basic features for Unity projects (... soon™). 

## Table of contents

* [1. Example](example)
* [2. Using the API](using-the-api)
  * [2.1 SCO Completion](sco-completion)
  * [2.2 User information](user-information)
  * [2.3 Objectives](objectives)
  * [2.4 Custom Data](custom-data)
  * [2.5 Comments](comments)
  * [2.5 Timer](timer)

## Example

First we build a simple AFrame scene containing the following elements:
 - box with `id="box"` 
 - component `complete-course`
 - camera
```html
<!DOCTYPE html>
<html>
  <head> 
    <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
    <script src="src/SCORM_API_wrapper.js"></script>
    <script src="src/api.js"></script>
    <script src="src/box.js"></script>
  </head>
  <body>
    <a-scene>
      <a-box id="box" position="1 0.5 -3" color="#232323"></a-box>
      <a-scene complete-course></a-scene>
      <a-camera camera="" look-controls="pointerLockEnabled: true"></a-camera>
    </a-scene>
  </body>
</html>
```
The `complete-course` component has to be registered to the AFrame environment:
```js
// box.js
AFRAME.registerComponent('complete-course', {
  init: function () {
    var cube = document.querySelector("#box");
    
    cube.addEventListener("mousedown", () => {
      setComplete();
    });
  }
});
```
Now almost everything of the code above is basic AFrame, only `setComplete()` is unfamiliar. It is part of our Scorm-API and will be explained later. For now it tells us enough to know that it persists the current exercise as passed to our Scorm DB.

If you test this in a non-ILIAS environment, you should get an error message in the browser console like this:
```console
Error: Course could not connect with the LMS
```

But if you test it after importing to ILIAS you will see this console output: 
```console
connection.initialize called.
SCORM.API.find: API found. Version: 2004
// ...
```

Now use you camera controls to look directly at the black box and click it, to run the `setComplete()` command. If you see the follwing output, everything worked fine and the exercise is persisted as "completed" and "passed":
```console
SCORM.data.set('cmi.completion_status') value: completed
SCORM.data.set('cmi.success_status') value: passed
SCORM.data.set('cmi.exit') value: normal
```

## Using the API

#### SCO Completion
This sets the current SCO as passed and completed
```php 
setComplete() : void
```

#### User information
Returns the ilias learner name of the current user
```php 
getLearnerName() : string
```

#### Objectives
Objectives are subtasks that, similar to the SCO in general,
can be passed or failed as well as complete or incomplete.
```php 
addObjective(name : string) : void
setObjectivePassed(name : string) : void
setObjectiveFailed(name : string) : void
isObjectivePassed(name : string) : boolean
```

#### Custom Data
Custom data is used for everything that doesn't fit into any of the other data groups.  
Data gets persisted via a unique key and can later be pulled out by the same key.
```php 
addCustomData(key : string, data : string) : void
getCustomData(key : string) : string
```

#### Comments
Comments are a way for the user (or sustainer) to persist specific string if information for possible later use.
```php 
addComment(text : string) : void
```

#### Timer
```php 
setTime(time : int) : void 
getTime() : int
startTimer(maxTime : int) : void
pauseTimer(doPersist : boolean) : void
stopTimer(doPersist : boolean) : void