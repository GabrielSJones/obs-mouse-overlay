import {
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import SettingsProvider, { useSettingsContext } from "./SettingsContext";
import Canvas from "./Canvas";

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
  const [fps, setFps] = useState<number>(FRAMERATE);
  const [trailLength, setTrailLength] = useState<number>(TRAIL_LENGTH);
  const [trailFadeSpeed, setTrailFadeSpeed] =
    useState<number>(TRAIL_FADE_SPEED);
  const [displayMagnitude, setDisplayMagnitude] =
    useState<boolean>(DISPLAY_MAGNITUDE);
  //const [fps, setFps] = useState<number>(FRAMERATE);

  const [resetStates, setResetStates] = useState<boolean>(false);

  // const [trailLength, setTrailLength] = useState<number>(100);
  // const [fps, setFps] = useState<number>(120);

  function reset() {
    setResetStates(!resetStates);
    //clearTimeout(timeout);
    console.log("resetting?");
    //console.log(fps + ": Framerate");
  }

  function handleSetFps() {
    fps == 120 ? setFps(30) : setFps(120);
    console.log(fps + ": Framerate");
  }
  function handleSetTrailLength() {
    trailLength == 100 ? setTrailLength(10) : setTrailLength(100);
    console.log(trailLength + ": Trail Length");
  }
  function handleSetTrailFadeSpeed() {
    trailFadeSpeed == 1 ? setTrailFadeSpeed(4) : setTrailFadeSpeed(1);
    console.log(trailFadeSpeed + ": Trail Length");
  }
  function handleSetDisplayMagnitude() {
    setDisplayMagnitude(!displayMagnitude);
    console.log(displayMagnitude + ": Display Magnitude");
  }
  return (
    <SettingsProvider
      value={{
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
      {/* <button onClick={handleSetFps}>Set 120 FPS</button> */}
      <Canvas
        resetState={resetStates}
        //setResetState={setResetStates}
        //TRAIL_LENGTH={TRAIL_LENGTH}
        //TRAIL_FADE_SPEED={TRAIL_FADE_SPEED}
        BACKGROUND_COLOR={BACKGROUND_COLOR}
      />
    </SettingsProvider>
  );
}

export default App;
