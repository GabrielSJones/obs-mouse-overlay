import { useState } from "react";

import "./App.css";
import SettingsProvider from "./SettingsContext";
import Canvas from "./Canvas";

const IS_VERBOSE_MODE = false;
const FRAMERATE = 10; //set to desired framerate - 30 or 60 is typically fine for most cases
const TRAIL_LENGTH = 100; //leave below 50
const TRAIL_FADE_SPEED = 4;
const DISPLAY_MAGNITUDE = false;
const BACKGROUND_COLOR = "rgb(0,255,0,100)";

// import { currentMonitor } from "@tauri-apps/api/window";
// const monitor = await currentMonitor();

// var monitorWidthHalf = 1920 / 2;
// var monitorHeightHalf = 1080 / 2;

// if (monitor) {
//   monitorWidthHalf = monitor.size.width / 2;
//   monitorHeightHalf = monitor.size.height / 2;
// }

function App() {
  const [isVerboseMode, setIsVerboseMode] = useState<boolean>(IS_VERBOSE_MODE);
  const [fps, setFps] = useState<number>(FRAMERATE);
  const [trailLength, setTrailLength] = useState<number>(TRAIL_LENGTH);
  const [trailFadeSpeed, setTrailFadeSpeed] =
    useState<number>(TRAIL_FADE_SPEED);
  const [displayMagnitude, setDisplayMagnitude] =
    useState<boolean>(DISPLAY_MAGNITUDE);

  const [resetStates, setResetStates] = useState<boolean>(false);

  function reset() {
    setResetStates(!resetStates);
    console.log("resetting?");
  }

  function handleSetFps() {
    fps == 120 ? setFps(30) : setFps(120);
    if (isVerboseMode) console.log(fps + ": Framerate Set");
  }
  function handleSetTrailLength() {
    trailLength == 100 ? setTrailLength(10) : setTrailLength(100);
    if (isVerboseMode) console.log(trailLength + ": Trail Length Set");
  }
  function handleSetTrailFadeSpeed() {
    trailFadeSpeed == 1 ? setTrailFadeSpeed(4) : setTrailFadeSpeed(1);
    if (isVerboseMode) console.log(trailFadeSpeed + ": Trail Fade Speed Set");
  }
  function handleSetDisplayMagnitude() {
    setDisplayMagnitude(!displayMagnitude);
    if (isVerboseMode)
      console.log(displayMagnitude + ": Display Magnitude Set");
  }
  function handleSetIsVerboseMode() {
    setIsVerboseMode(!isVerboseMode);
    if (isVerboseMode) console.log(isVerboseMode + ": Verbose Mode Set");
  }
  return (
    <SettingsProvider
      value={{
        isVerboseMode: isVerboseMode,
        setIsVerboseMode: setIsVerboseMode,
        fps: fps,
        setFps: setFps,
        trailLength: trailLength,
        setTrailLength: setTrailLength,
        trailFadeSpeed: trailFadeSpeed,
        setTrailFadeSpeed: setTrailFadeSpeed,
        displayMagnitude: displayMagnitude,
        setDisplayMagnitude: setDisplayMagnitude,
      }}
    >
      <button onClick={reset}>Refresh</button>
      <button onClick={handleSetFps}>{fps} FPS</button>
      <button onClick={handleSetTrailLength}>{trailLength} Length</button>
      <button onClick={handleSetTrailFadeSpeed}>{trailFadeSpeed} Fade</button>
      <button onClick={handleSetDisplayMagnitude}>
        {displayMagnitude} Display Speed
      </button>
      <button
        style={{ background: isVerboseMode ? "green" : "red" }}
        onClick={handleSetIsVerboseMode}
      >
        Debug {isVerboseMode ? "ON" : "OFF"}
      </button>
      <Canvas />
    </SettingsProvider>
  );
}

export default App;
