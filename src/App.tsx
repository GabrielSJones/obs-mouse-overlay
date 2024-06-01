import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";


const FRAMERATE = 120 ; //set to desired framerate - 30 or 60 is typically fine for most cases
const FRAMETIME_IN_MS = 1000 / FRAMERATE; //why
const TRAIL_LENGTH = 10; //leave below 50
const TRAIL_FADE_SPEED = 2; //leave below
const BACKGROUND_COLOR = "rgb(0,255,0,100)";

// import { currentMonitor } from "@tauri-apps/api/window";
// const monitor = await currentMonitor();

// var monitorWidthHalf = 1920 / 2;
// var monitorHeightHalf = 1080 / 2;

// if (monitor) {
//   monitorWidthHalf = monitor.size.width / 2;
//   monitorHeightHalf = monitor.size.height / 2;
// }

type MouseInputType = [number, number];

function App() {
  const [resetState, setResetState] = useState<boolean>(false);
  const ref = useRef<HTMLCanvasElement>(null);
  const mouseInput = useRef<Array<MouseInputType>>([]);

  function reset() {
    setResetState(!resetState);
  }
  useEffect(() => {
    let timeout: number;
    //console.log("reset state");
    function createTRimeout() {
      return setTimeout(() => {
        GetMousePosition().then(() => {
          DrawMouseOnCanvas();
          timeout = createTRimeout();
        });
      }, FRAMETIME_IN_MS);
    }
    timeout = createTRimeout();
    () => {
      clearTimeout(timeout);
    };
  }, [ref, resetState]);
  function DrawMouseOnCanvas() {
    const pointer = ref.current?.getContext("2d");
    const len = mouseInput.current.length;
    if (!pointer || ref.current == null || ref.current == undefined) {
      return;
    }
    pointer.clearRect(0, 0, ref.current.width, ref.current.height);
    pointer.beginPath();
    let canvasW = ref.current!.width;
    let canvasH = ref.current!.height;
    let scalar = 50;
    for (var i = len - 1; i >= 0; i--) {
      const x = mouseInput.current[i][0];
      const y = mouseInput.current[i][1];

      //console.log(i + "index");
      const opacity = (100 * ((i + 1) / len)) / TRAIL_FADE_SPEED;
      //console.log(opacity + "opacity\n");
      //console.log(len + "len\n");
      pointer.moveTo(canvasW / 2, canvasH / 2);
      pointer.lineTo(canvasW / 2 + x * scalar, canvasH / 2 + y * scalar);
      pointer.strokeStyle = "rgb(255,0,255," + `${opacity})`;
      //console.log(pointer.strokeStyle)
      pointer.stroke();
    }
  }

  async function GetMousePosition() {
    const mousePos = await invoke<MouseInputType>("send_mouse_position");
    mouseInput.current.push(mousePos);
    //console.log(mousePos);
    if (mouseInput.current.length > TRAIL_LENGTH) mouseInput.current.shift();
  }

  return (
    <div className="askdjfghasdf">
      <canvas
        height={"fit-content"}
        width={"fit-content"}
        style={{ background: BACKGROUND_COLOR }}
        ref={ref}
      ></canvas>
      <button onClick={reset}>Refresh</button>
    </div>
  );
}

export default App;
